import { openDB as _openDb } from "idb"
import { allDays, allMonths, type Days, type Months, type Session, type Set } from "../types";
import { persist } from "@util/persist";
import { get, writable } from "svelte/store";
import { DateTime, type DateTimeUnit } from "luxon"

// import { allDays, allMonths, allPoints, type Days, type Months, type Session } from "../types";

// interface SessionStore {
//     sessions: Session[];
// }

const storeName = "sessions";
const openDb = async () => await _openDb("ScoreTrackerDB", 1, {
    upgrade(database, oldVersion, newVersion, transaction, event) {
        if(oldVersion < 1) {
            database.createObjectStore(storeName, { keyPath: "id" }).createIndex("finishedAt", "finishedAt");
        }
    },
});

export const activeSession = persist({
    writable: writable<Session | null>(null),
    name: "activeSession",
    version: 1
});

export async function completeSessionAsync() {
    const activeSess = get(activeSession);
    if (activeSess == null) return;
    activeSess.finishedAt = DateTime.now().toMillis();
    let score = 0;
    activeSess.sets.forEach(set => {
        score += set.total;
    });
    activeSess.score = score;
    const db = await openDb();
    await db.add(storeName, activeSess);
    db.close();
    activeSession.set(null);
}

export async function deleteSessionAsync(sessionId: string) {
    const db = await openDb();
    await db.delete(storeName, sessionId);
    db.close();
}

function formatSets(sets : Set[], arrowsPerSet : number) { 
    let str = "";
    sets.forEach(set => {
        str += set.points.join(",") + "\n"
    });
    return str.replace(/\n$/, "");
}

export async function getDataCSVAsync() {
    const sessions = await getSessionsDescAsync();
    let csv = `"session_name","started_at","finished_at","sets","arrows_per_set","set_count","total_score",\n`;
    for await(const session of sessions) {
        const startedAt = DateTime.fromMillis(session.startedAt).toISO();
        const finishedAt = DateTime.fromMillis(session.finishedAt!).toISO();
        csv += `"${session.name?.replaceAll('"', '""')}","${startedAt}","${finishedAt}","${formatSets(session.sets, session.arrowsPerSet)}","${session.arrowsPerSet}","${session.setCount}","${session.score}",\n`;
    }
    return csv;
}

export async function getLastXSessionsAsync(noOfSessionsToReturn : number) {
    const sessionsGen = await getSessionsDescAsync();
    let index = 0;
    let sessions : Session[] = [];
    let hasMore = false;
    for await (const session of sessionsGen) {
        if(index == noOfSessionsToReturn) {
            hasMore = true;
            break;
        }
        sessions.push(session);
        index++;
    }
    return { hasMore, sessions } ;
}

export async function getSessionAsync(id : string) {
    const db = await openDb();
    const obj = await db.get(storeName, id);
    db.close();
    return obj as Session;
}

export async function getAllSessionsGroupedByMonthAsync() {
    const sessions = await getSessionsDescAsync();
    const groups = new Map<string, Session[]>();
    for await (const session of sessions) {
        const date = DateTime.fromMillis(session.finishedAt!).toFormat("MMM yyyy");
        const existingSessions = groups.get(date);
        if(existingSessions === undefined) {
            groups.set(date, [ session ]);
        } else {
            groups.set(date, [ ...existingSessions, session ]);
        }
    }
    return [...groups.entries()];    
}

// function forEachCompletedSessionThisWeek(sessions: Session[], lambda: (s: Session, weekday: Days) => void) {
//     const now = DateTime.now();
//     const weekStart = now.startOf("week");
//     for (let i = sessions.length - 1; i >= 0; i--) {
//         const session = sessions[i];
//         if (session.finishedAt === undefined) continue;
//         const sessionDate = DateTime.fromMillis(session.finishedAt);
//         if (weekStart > DateTime.fromMillis(session.finishedAt)) break;
//         lambda(session, allDays[sessionDate.weekday - 1]);
//     }
// }

// function forEachCompletedSessionThisYear(sessions: Session[], lambda: (s: Session, month: Months) => void) {
//     const now = DateTime.now();
//     const yearStart = now.startOf("year");
//     for (let i = sessions.length - 1; i >= 0; i--) {
//         const session = sessions[i];
//         if (session.finishedAt === undefined) continue;
//         const sessionDate = DateTime.fromMillis(session.finishedAt);
//         if (yearStart > DateTime.fromMillis(session.finishedAt)) break;
//         lambda(session, allMonths[sessionDate.month - 1]);
//     }
// }

// export const arrowsShotThisWeek = derived(sessionsStore, ({ sessions }) => {
//     const result = new Map<Days, number>(allDays.map(d => ([d, 0])));
//     forEachCompletedSessionThisWeek(sessions, (session, sessionWeekday) => {
//         const existingScore = result.get(sessionWeekday) ?? 0;
//         result.set(sessionWeekday, existingScore + session.arrowsPerSet * session.sets.length);
//     })
//     return result;
// });


// export const sessionsAttendedThisWeek = derived(sessionsStore, ({ sessions }) => {
//     const result = new Map<Days, number>(allDays.map(d => ([d, 0])));
//     forEachCompletedSessionThisWeek(sessions, (session, sessionWeekday) => {
//         result.set(sessionWeekday, result.get(sessionWeekday) ?? 0 + 1);
//     })
//     return result;
// });

// export const maxScoresThisWeek = derived(sessionsStore, ({ sessions }) => {
//     const result = new Map<Days, number>(allDays.map(d => ([d, 0])));
//     forEachCompletedSessionThisWeek(sessions, (session, sessionWeekday) => {
//         const existingScore = result.get(sessionWeekday) ?? 0;
//         result.set(sessionWeekday, Math.max(existingScore, session.score));
//     })
//     return result;
// });

// export const sessionsThisWeek = derived(sessionsStore, ({ sessions }) => {
//     const result = new Map<Days, number>(allDays.map(d => ([d, 0])));
//     forEachCompletedSessionThisWeek(sessions, (session, sessionWeekday) => {
//         const existingScore = result.get(sessionWeekday) ?? 0;
//         result.set(sessionWeekday, existingScore + 1);
//     })
//     return result;
// });

async function* getSessionsDescAsync() {
    const db = await openDb();
    try {
        let cursor = await db.transaction(storeName).store.index("finishedAt").openCursor(undefined, "prev");
        while(cursor) {
            yield cursor.value as Session;
            cursor = await cursor.continue();
        }
    } finally {
        db.close();
    }
}

async function* limit(gen : AsyncGenerator<Session, void, unknown>, limit : DateTimeUnit) {
    const now = DateTime.now();
    const weekStart = now.startOf(limit).toMillis();
    for await (const session of gen) {
        if(session.finishedAt! < weekStart) break;
        yield session;
    }
}

export async function getTotalsFor(limitUnit : DateTimeUnit | "allTime") {
    const sessions = limitUnit !== "allTime" ? limit(getSessionsDescAsync(), limitUnit) : await getSessionsDescAsync();
    let totalArrows = 0;
    let highestScore = 0;
    let totalSessions = 0;
    for await (const session of sessions) {
        totalArrows += session.arrowsPerSet * session.sets.length;
        highestScore = Math.max(highestScore, session.score);
        totalSessions++;
    }
    return {
        totalArrows,
        totalSessions,
        highestScore
    }
}


type DefaultReportData = { 
    arrowsShot : number, 
    sessions: number, 
    maxScore: number 
}

export async function getReportDataForYearAsync() {
    const sessions = await limit(getSessionsDescAsync(), "year");
    const report = new Map<Months, DefaultReportData>(
        allMonths.map(d => ([d, { arrowsShot: 0, sessions: 0, maxScore: 0 }]))
    );
    for await (const session of sessions) {
        const monthIndex = DateTime.fromMillis(session.finishedAt!).month - 1;
        const month = allMonths[monthIndex];
        const obj = report.get(month)!;
        obj.arrowsShot += session.arrowsPerSet * session.sets.length;
        obj.sessions++;
        obj.maxScore = Math.max(obj.maxScore, session.score);
        report.set(month, obj)
    }
    return report;
}

export async function getReportDataForWeekAsync() {
    const sessions = await limit(getSessionsDescAsync(), "week");
    const report = new Map<Days, DefaultReportData>(
        allDays.map(d => ([d, { arrowsShot: 0, sessions: 0, maxScore: 0 }]))
    );
    for await (const session of sessions) {
        const dayIndex = DateTime.fromMillis(session.finishedAt!).weekday - 1;
        const day = allDays[dayIndex];
        const obj = report.get(day)!;
        obj.arrowsShot += session.arrowsPerSet * session.sets.length;
        obj.sessions++;
        obj.maxScore = Math.max(obj.maxScore, session.score);
        report.set(day, obj)
    }
    return report;
}


// export const arrowsShotThisYear = derived(sessionsStore, ({ sessions }) => {
//     const result = new Map<Months, number>(allMonths.map(d => ([d, 0])));
//     forEachCompletedSessionThisYear(sessions, (session, sessionMonth) => {
//         const existingScore = result.get(sessionMonth) ?? 0;
//         result.set(sessionMonth, existingScore + session.arrowsPerSet * session.sets.length);
//     })
//     return result;
// });


// export const sessionsThisYear = derived(sessionsStore, ({ sessions }) => {
//     const result = new Map<Months, number>(allMonths.map(d => ([d, 0])));
//     forEachCompletedSessionThisYear(sessions, (session, sessionMonth) => {
//         const existingCount = result.get(sessionMonth) ?? 0;
//         result.set(sessionMonth, existingCount + 1);
//     })
//     return result;
// });

// export const maxScoresThisYear = derived(sessionsStore, ({ sessions }) => {
//     const result = new Map<Months, number>(allMonths.map(d => ([d, 0])));
//     forEachCompletedSessionThisYear(sessions, (session, sessionMonth) => {
//         let existingScore = result.get(sessionMonth) ?? 0;
//         result.set(sessionMonth, Math.max(existingScore, session.score));
//     })
//     return result;
// });