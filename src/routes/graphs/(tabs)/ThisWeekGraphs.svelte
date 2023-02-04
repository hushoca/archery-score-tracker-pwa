<script>
    import BarChart from "../../../components/BarChart.svelte";
    import { arrowsShotThisWeek, maxScoresThisWeek, sessionsThisWeek } from "../../../stores/sessions";
    $: arrowsShot = [...$arrowsShotThisWeek.entries()].map(([key, val]) => ({ name: key, value: val }))
    $: maxScores = [...$maxScoresThisWeek.entries()].map(([key, val]) => ({ name: key, value: val }))
    $: sessions = [...$sessionsThisWeek.entries()].map(([key, val]) => ({ name: key, value: val }))
</script>

<main class="grid gap-3">
    <section class="col-start-1 col-end-3">
        <BarChart data={sessions} title="Sessions Attended" />
    </section>
    <section class="col-start-1 col-end-3">
        <BarChart data={maxScores} title="Highest Scores (per day)" />
    </section>
    <section class="col-start-1 col-end-3">
        <BarChart data={arrowsShot} title="Arrows Shot" />
    </section>
</main>