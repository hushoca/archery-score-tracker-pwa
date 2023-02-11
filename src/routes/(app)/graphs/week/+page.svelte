<script lang="ts">
    import BarChart from "@components/BarChart.svelte";
    import type { PageData } from "./$types";
    
    export let data : PageData;
    const entries = [...data.thisYear.entries()];

    const sessionsData = entries.map(([key, val]) => ({ name: key, value: val.sessions }));
    const maxScoresData = entries.map(([key, val]) => ({ name: key, value: val.maxScore }));
    const arrowsShotData = entries.map(([key, val]) => ({ name: key, value: val.arrowsShot }));
</script>

<main class="grid gap-3">
    <section class="col-start-1 col-end-3">
        <BarChart data={sessionsData} title="Sessions Attended" />
    </section>
    <section class="col-start-1 col-end-3">
        <BarChart data={maxScoresData} title="Highest Scores (per month)" />
    </section>
    <section class="col-start-1 col-end-3">
        <BarChart data={arrowsShotData} title="Arrows Shot" />
    </section>
</main>