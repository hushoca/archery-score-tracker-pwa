import { DateTime } from "luxon"

import { derived, get, writable } from "svelte/store";
import { allDays, allMonths, allPoints, type Days, type Months, type Session } from "../types";
import { persist } from "@util/persist";

interface SessionStore {
    sessions : Session[];
}

export const sessionsStore = persist(writable<SessionStore>({ sessions: [] }), "sessions", 1);

export const activeSession = persist(writable<Session | null>(null), "activeSession", 1);

export function completeSession() {
    const activeSess = get(activeSession);
    if(activeSess == null) return;
    activeSess.finishedAt = DateTime.now().toMillis();
    let score = 0;
    activeSess.sets.forEach(set => {
        set.forEach(point => score += allPoints[point].point);
    });
    activeSess.score = score;
    sessionsStore.update(store => ({ sessions: [...store.sessions, activeSess]}));
    activeSession.set(null);
}

export function deleteSession(sessionId: string) {
    sessionsStore.update(store => ({
        sessions: store.sessions.filter(session => session.id != sessionId)
    }))
}

function forEachCompletedSessionThisWeek(sessions : Session[], lambda: (s : Session, weekday : Days) => void) {
    const now = DateTime.now();
    const weekStart = now.startOf("week");
    for(let i = sessions.length - 1; i >= 0; i--) {
        const session = sessions[i];
        if(session.finishedAt === undefined) continue;
        const sessionDate = DateTime.fromMillis(session.finishedAt);
        if(weekStart > DateTime.fromMillis(session.finishedAt)) break;
        lambda(session, allDays[sessionDate.weekday - 1]);
    }
}

function forEachCompletedSessionThisYear(sessions : Session[], lambda: (s : Session, month : Months) => void) {
    const now = DateTime.now();
    const yearStart = now.startOf("year");
    for(let i = sessions.length - 1; i >= 0; i--) {
        const session = sessions[i];
        if(session.finishedAt === undefined) continue;
        const sessionDate = DateTime.fromMillis(session.finishedAt);
        if(yearStart > DateTime.fromMillis(session.finishedAt)) break;
        lambda(session, allMonths[sessionDate.month - 1]);
    }
}

export const arrowsShotThisWeek = derived(sessionsStore, ({ sessions }) => {
    const result = new Map<Days, number>(allDays.map(d => ([d, 0])));
    forEachCompletedSessionThisWeek(sessions, (session, sessionWeekday) => {
        const existingScore = result.get(sessionWeekday) ?? 0;
        result.set(sessionWeekday, existingScore + session.arrowsPerSet * session.setCount);
    })
    return result;
});


export const sessionsAttendedThisWeek = derived(sessionsStore, ({ sessions }) => {
    const result = new Map<Days, number>(allDays.map(d => ([d, 0])));
    forEachCompletedSessionThisWeek(sessions, (session, sessionWeekday) => {
        result.set(sessionWeekday, result.get(sessionWeekday) ?? 0 + 1);
    })
    return result;
});

export const maxScoresThisWeek = derived(sessionsStore, ({ sessions }) => {
    const result = new Map<Days, number>(allDays.map(d => ([d, 0])));
    forEachCompletedSessionThisWeek(sessions, (session, sessionWeekday) => {
        const existingScore = result.get(sessionWeekday) ?? 0;
        result.set(sessionWeekday, Math.max(existingScore, session.score));
    })
    return result;
});

export const sessionsThisWeek = derived(sessionsStore, ({ sessions }) => {
    const result = new Map<Days, number>(allDays.map(d => ([d, 0])));
    forEachCompletedSessionThisWeek(sessions, (session, sessionWeekday) => {
        const existingScore = result.get(sessionWeekday) ?? 0;
        result.set(sessionWeekday, existingScore + 1);
    })
    return result;
});

export const totalsAllTime = derived(sessionsStore, ({ sessions }) => {
    let totalArrows = 0;
    let highestScore = 0;
    sessions.forEach(s => {
        if(s.finishedAt === undefined) return;
        totalArrows += s.arrowsPerSet * s.setCount;
        highestScore = Math.max(highestScore, s.score);
    })
    return {
        totalArrows,
        totalSessions: sessions.length,
        highestScore
    }
})

export const totalsThisWeek = derived(sessionsStore, ({ sessions }) => {
    let totalArrows = 0;
    let highestScore = 0;
    let count = 0;
    forEachCompletedSessionThisWeek(sessions, s => {
        if(s.finishedAt === undefined) return;
        totalArrows += s.arrowsPerSet * s.setCount;
        highestScore = Math.max(highestScore, s.score);
        count++;
    })
    return {
        totalArrows,
        totalSessions: count,
        highestScore
    }
})


export const arrowsShotThisYear = derived(sessionsStore, ({ sessions }) => {
    const result = new Map<Months, number>(allMonths.map(d => ([d, 0])));
    forEachCompletedSessionThisYear(sessions, (session, sessionMonth) => {
        const existingScore = result.get(sessionMonth) ?? 0;
        result.set(sessionMonth, existingScore + session.arrowsPerSet * session.setCount);
    })
    return result;
});


export const sessionsThisYear = derived(sessionsStore, ({ sessions }) => {
    const result = new Map<Months, number>(allMonths.map(d => ([d, 0])));
    forEachCompletedSessionThisYear(sessions, (session, sessionMonth) => {
        const existingCount = result.get(sessionMonth) ?? 0;
        result.set(sessionMonth, existingCount + 1);
    })
    return result;
});

export const maxScoresThisYear = derived(sessionsStore, ({ sessions }) => {
    const result = new Map<Months, number>(allMonths.map(d => ([d, 0])));
    forEachCompletedSessionThisYear(sessions, (session, sessionMonth) => {
        let existingScore = result.get(sessionMonth) ?? 0;
        result.set(sessionMonth, Math.max(existingScore, session.score));
    })
    return result;
});