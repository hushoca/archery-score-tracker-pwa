<script lang="ts">
    import BarChart from "@components/BarChart.svelte";
    import TagSelector from "@components/TagSelector.svelte";
    import { db } from "@util/db";
    import { DateTime } from "luxon";
    import { allDays, allMonths, type Days, type DefaultReportData, type ExtendedReportData, type Months, type Session } from "../../../../types";
    
    let selectedTags : string[] = [];

    const allTypes = ["arrowsShot", "sessions", "maxScore", "arrowsMissed", "avgAccuracy"] as const;
    const typeLabels = ["Arrows Shot", "Sessions Completed", "Max Score", "Arrows Missed", "Avg. Accuracy (%)"];

    const allPeriods = [ "week", "year" ] as const;
    const periodLabels = ["This Week", "This Year"];

    let type : typeof allTypes[number] = "arrowsShot";
    let period : typeof allPeriods[number] = "week";
    $: graphTitle = typeLabels[allTypes.indexOf(type)];

    let sessionCount = 0;
    let graphData : { name: string, value: any }[] = [];
    $: {
        (async () => {
            let sessions : Session[] = [];
            const dateLimitMillis = DateTime.now().startOf(period).toMillis();
            const query =  db.sessions.where("finishedAt").aboveOrEqual(dateLimitMillis)
            if(selectedTags.length > 0) {
                sessions =  await query.and(s => {
                    return selectedTags.every(t => s.tags.includes(t));
                }).toArray();
            } else {
                sessions = await query.toArray();
            }
            if(period == "year") graphData = groupSessionDataYear(sessions, type);
            if(period == "week") graphData = groupSessionDataWeek(sessions, type);
            sessionCount = sessions.length;
        })();
    }

    function groupSessionDataYear(sessions : Session[], type : typeof allTypes[number]) {
        let report = new Map<Months, ExtendedReportData>(
            allMonths.map(d => ([d, { 
                arrowsShot: 0, 
                sessions: 0, 
                maxScore: 0, 
                arrowsMissed: 0,
                avgAccuracy: 0,
                totalPointsScored: 0
            }]))
        );
        sessions.forEach(s => {
            const monthIndex = DateTime.fromMillis(s.finishedAt!).month - 1;
            const month = allMonths[monthIndex];
            const existingVal = report.get(month)!;
            existingVal.arrowsShot += s.sets.length * s.arrowsPerSet;
            existingVal.sessions++;
            existingVal.maxScore = Math.max(existingVal.maxScore, s.score);
            const missedArrows = s.sets.flatMap(set => set.points).filter(p => p == "M").length;
            existingVal.arrowsMissed += missedArrows;
            existingVal.totalPointsScored += existingVal.maxScore;
            report.set(month, existingVal);
        });
        for(const [key, val] of report) {
            if(val.totalPointsScored == 0) val.avgAccuracy = 0;
            if(val.totalPointsScored > 0) {
                const maxPossible = val.arrowsShot * 10
                val.avgAccuracy = val.totalPointsScored * 100 / maxPossible;
            }
            report.set(key, val)
        }
        return [...report.entries()].map(([key, val]) => {
            return { 
                name: key, 
                value: val[type]
            }
        });
    }

    function groupSessionDataWeek(sessions : Session[], type : typeof allTypes[number]) {
        let report = new Map<Days, ExtendedReportData>(
            allDays.map(d => ([d, { 
                arrowsShot: 0, 
                sessions: 0, 
                maxScore: 0, 
                arrowsMissed: 0,
                avgAccuracy: 0,
                totalPointsScored: 0
            }]))
        );
        sessions.forEach(s => {
            const dayIndex = DateTime.fromMillis(s.finishedAt!).weekday - 1;
            const day = allDays[dayIndex];
            const existingVal = report.get(day)!;
            existingVal.arrowsShot += s.sets.length * s.arrowsPerSet;
            existingVal.sessions++;
            existingVal.maxScore = Math.max(existingVal.maxScore, s.score);
            const missedArrows = s.sets.flatMap(set => set.points).filter(p => p == "M").length;
            existingVal.arrowsMissed += missedArrows;
            existingVal.totalPointsScored += existingVal.maxScore;
            report.set(day, existingVal);
        });
        for(const [key, val] of report) {
            if(val.totalPointsScored == 0) val.avgAccuracy = 0;
            if(val.totalPointsScored > 0) {
                const maxPossible = val.arrowsShot * 10
                val.avgAccuracy = val.totalPointsScored * 100 / maxPossible;
            }
            report.set(key, val)
        }
        return [...report.entries()].map(([key, val]) => {
            return { 
                name: key, 
                value: val[type] 
            }
        });
    }

</script>

<main class="grid gap-2">
    <section>
        <BarChart data={graphData} title={graphTitle} />
    </section>
    <section class="p-2 bg-blue-50 rounded-lg shadow-lg grid gap-2">
        <span class="font-bold">Type:</span>
        {#each allTypes as current, index}
            <div class="flex items-center gap-2">
                <input type="radio" id={current} bind:group={type} value={current} />
                <label for={current}>{typeLabels[index]}</label>
            </div>
        {/each}
    </section>
    <section class="p-2 bg-blue-50 rounded-lg shadow-lg grid gap-2">
        <span class="font-bold">Period:</span>
        {#each allPeriods as current, index}
            <div class="flex items-center gap-2">
                <input type="radio" id={current} bind:group={period} value={current} />
                <label for={current}>{periodLabels[index]}</label>
            </div>
        {/each}
    </section>
    <section class="p-2 bg-blue-50 rounded-lg shadow-lg grid gap-2">
        <span class="font-bold">Should contain tags:</span>
        <TagSelector bind:selectedTags />
    </section>
    <section class="p-2 bg-blue-50 rounded-lg shadow-lg grid gap-2">
        <span class="text-center text-sm">Chart is based on {sessionCount} session(s) matching this criteria</span>
    </section>
</main>