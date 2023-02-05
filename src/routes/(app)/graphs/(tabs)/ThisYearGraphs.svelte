<script>
    import BarChart from "../../../components/BarChart.svelte";
    import { arrowsShotThisYear, maxScoresThisYear, sessionsThisYear } from "../../../stores/sessions";
    $: arrowsShot = [...$arrowsShotThisYear.entries()].map(([key, val]) => ({ name: key, value: val }))
    $: maxScores = [...$maxScoresThisYear.entries()].map(([key, val]) => ({ name: key, value: val }))
    $: sessions = [...$sessionsThisYear.entries()].map(([key, val]) => ({ name: key, value: val }))
</script>

<main class="grid gap-3">
    <section class="col-start-1 col-end-3">
        <BarChart data={sessions} title="Sessions Attended" />
    </section>
    <section class="col-start-1 col-end-3">
        <BarChart data={maxScores} title="Highest Scores (per month)" />
    </section>
    <section class="col-start-1 col-end-3">
        <BarChart data={arrowsShot} title="Arrows Shot" />
    </section>
</main>