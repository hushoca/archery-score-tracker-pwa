import { getLastXSessionsAsync, getTotalsFor } from "@stores/sessions";

/** @type {import('./$types').PageLoad} */
export async function load() {
    return { 
        lastSessions : await getLastXSessionsAsync(4),
        totalsAllTime: await getTotalsFor("allTime"),
        totalsThisWeek: await getTotalsFor("week"),
    }
}