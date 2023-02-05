<script>
    import SessionElem from "@components/Session.svelte";
    import CircularButton from "@components/CircularButton.svelte";
    import { activeSession, deleteSession, sessionsStore, totalsAllTime, totalsThisWeek} from "@stores/sessions";

    let allTime = $totalsAllTime;
    let thisWeek = $totalsThisWeek;
</script>

<main class="grid grid-cols-2 grid-rows-[auto_1fr] gap-3 grow p-4 text-center items-start pb-28">
    <section class="bg-blue-50 rounded-lg shadow-lg p-2 grid grid-cols-[3fr_1fr]">
        <div class="text-lg font-bold col-start-1 col-end-3">All Time</div>
        <div class="text-left font-bold">Arrows:</div>      <div class="text-right">{allTime.totalArrows}</div>
        <div class="text-left font-bold">Sessions:</div>    <div class="text-right">{allTime.totalSessions}</div>
        <div class="text-left font-bold">Max Score:</div>   <div class="text-right">{allTime.highestScore}</div>
    </section>
    <section class="bg-blue-50 rounded-lg shadow-lg p-2 grid grid-cols-[3fr_1fr]">
        <div class="text-lg font-bold col-start-1 col-end-3">This Week</div>
        <div class="text-left font-bold">Arrows:</div>      <div class="text-right">{thisWeek.totalArrows}</div>
        <div class="text-left font-bold">Sessions:</div>    <div class="text-right">{thisWeek.totalSessions}</div>
        <div class="text-left font-bold">Max Score:</div>   <div class="text-right">{thisWeek.highestScore}</div>
    </section>
    <section class="bg-blue-50 rounded-lg shadow-lg p-2 col-start-1 col-end-3 h-full row-start-2 row-end-3">
        <div class="text-xl font-bold">Sessions</div>
        {#each $sessionsStore.sessions as session}
            <SessionElem {session} on:delete={() => deleteSession(session.id)} />
        {:else}
            <span>No previous sessions were found.<br/> Go start shooting you lazy bum!</span>
        {/each}
        <div></div>
    </section>
</main>
<footer class="fixed left-0 right-0 bottom-0 pb-4 flex justify-center gap-2 items-end">
    <CircularButton icon="lineChart" href="graphs"/>
    {#if $activeSession}
        <CircularButton icon="play" size="lg" color="yellow" href="score"/>
    {:else}
        <CircularButton icon="plus" size="lg" href="new"/>
    {/if}
    <CircularButton icon="settings" href="settings" />
</footer>