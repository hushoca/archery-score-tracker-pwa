import { allDays, allMonths, type Days, type DefaultReportData, type Months, type Session, type Set } from "../types";
import { persist } from "@util/persist";
import { get, writable } from "svelte/store";
import { DateTime, type DateTimeUnit } from "luxon"
import { db } from "@util/db";

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
    await db.transaction("readwrite", db.sessions, db.tags, async () => {
       await db.sessions.add(activeSess);
       await db.tags.where("id").anyOf(activeSess.tags).modify(t => t.usedBy.push(activeSess.id));
    });
    activeSession.set(null);
}

export async function deleteSessionAsync(sessionId: string) {
    await db.transaction("readwrite", db.sessions, db.tags, async () => {
        await db.sessions.delete(sessionId);
        await db.tags.where({ usedBy: sessionId }).modify(t => {
            t.usedBy = t.usedBy.filter(u => u != sessionId);
            return t;
        });
    });
}

function formatSets(sets : Set[], arrowsPerSet : number) { 
    let str = "";
    sets.forEach(set => {
        str += set.points.join(",") + "\n"
    });
    return str.replace(/\n$/, "");
}

export async function getDataCSVAsync() {
    let csv = `"session_name","started_at","finished_at","sets","arrows_per_set","set_count","total_score",\n`;
    await db.sessions.orderBy("finishedAt").each(session => {
        const startedAt = DateTime.fromMillis(session.startedAt).toISO();
        const finishedAt = DateTime.fromMillis(session.finishedAt!).toISO();
        csv += `"${session.name?.replaceAll('"', '""')}","${startedAt}","${finishedAt}","${formatSets(session.sets, session.arrowsPerSet)}","${session.arrowsPerSet}","${session.setCount}","${session.score}",\n`;
    })
    return csv;
}

export async function getLastXSessionsAsync(noOfSessionsToReturn : number) {
    const sessionCount = await db.sessions.count();
    return { 
        hasMore: sessionCount > noOfSessionsToReturn, 
        sessions: await db.sessions.orderBy("finishedAt").reverse().limit(noOfSessionsToReturn).toArray()
    } ;
}

export async function getSessionAsync(id : string) {
    return db.sessions.get(id);
}

export async function getLastYearsSessionsGroupedByMonthAsync() {
    const startOfYearMillis = DateTime.now().startOf("year").toMillis();
    const groups = new Map<string, Session[]>();
    await db.sessions.where("finishedAt").aboveOrEqual(startOfYearMillis).each(session => {
        const date = DateTime.fromMillis(session.finishedAt!).toFormat("MMM yyyy");
        const existingSessions = groups.get(date);
        if(existingSessions === undefined) {
            groups.set(date, [ session ]);
        } else {
            groups.set(date, [ ...existingSessions, session ]);
        }
    })
    return [...groups.entries()];    
}

export async function getTotalsFor(limitUnit : DateTimeUnit | "allTime") {
    let totalArrows = 0;
    let highestScore = 0;
    let totalSessions = 0;

    function processSession(session : Session) {
        totalArrows += session.arrowsPerSet * session.sets.length;
        highestScore = Math.max(highestScore, session.score);
        totalSessions++;
    }

    if(limitUnit == "allTime") {
        await db.sessions.each(processSession);
    } else {
        const limitMillis = DateTime.now().startOf(limitUnit).toMillis();
        await db.sessions.where("finishedAt").aboveOrEqual(limitMillis).each(processSession);
    }

    return {
        totalArrows,
        totalSessions,
        highestScore
    }
}

export async function getReportDataForYearAsync() {
    const report = new Map<Months, DefaultReportData>(
        allMonths.map(d => ([d, { arrowsShot: 0, sessions: 0, maxScore: 0 }]))
    );
    const yearStartMillis = DateTime.now().startOf("year").toMillis();
    await db.sessions.where("finishedAt").aboveOrEqual(yearStartMillis).each(session => {
        const monthIndex = DateTime.fromMillis(session.finishedAt!).month - 1;
        const month = allMonths[monthIndex];
        const obj = report.get(month)!;
        obj.arrowsShot += session.arrowsPerSet * session.sets.length;
        obj.sessions++;
        obj.maxScore = Math.max(obj.maxScore, session.score);
        report.set(month, obj)
    });
    return report;
}

export async function getReportDataForWeekAsync() {
    const weekStartMillis = DateTime.now().startOf("week").toMillis();
    const report = new Map<Days, DefaultReportData>(
        allDays.map(d => ([d, { arrowsShot: 0, sessions: 0, maxScore: 0 }]))
    );
    await db.sessions.where("finishedAt").aboveOrEqual(weekStartMillis).each(session => {
        const dayIndex = DateTime.fromMillis(session.finishedAt!).weekday - 1;
        const day = allDays[dayIndex];
        const obj = report.get(day)!;
        obj.arrowsShot += session.arrowsPerSet * session.sets.length;
        obj.sessions++;
        obj.maxScore = Math.max(obj.maxScore, session.score);
        report.set(day, obj)
    });
    return report;
}