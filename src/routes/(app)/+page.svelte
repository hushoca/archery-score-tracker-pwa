<script lang="ts">
    import SessionElem from "@components/Session.svelte";
    import CircularButton from "@components/CircularButton.svelte";
    import type { PageData } from "./$types";
    import { activeSession } from "@stores/sessions";
    import { db } from "@util/db";
    import { liveQuery } from "dexie"

    export let data : PageData;
</script>

<main class="grid grid-cols-2 grid-rows-[auto_1fr] gap-3 grow p-4 text-center items-start">
    <section class="bg-blue-50 rounded-lg shadow-lg p-2 grid grid-cols-[3fr_1fr]">
        <div class="text-lg font-bold col-start-1 col-end-3">All Time</div>
        <div class="text-left font-bold">Arrows:</div>      <div class="text-right">{data.totalsAllTime.totalArrows}</div>
        <div class="text-left font-bold">Sessions:</div>    <div class="text-right">{data.totalsAllTime.totalSessions}</div>
        <div class="text-left font-bold">Max Score:</div>   <div class="text-right">{data.totalsAllTime.highestScore}</div>
    </section>
    <section class="bg-blue-50 rounded-lg shadow-lg p-2 grid grid-cols-[3fr_1fr]">
        <div class="text-lg font-bold col-start-1 col-end-3">This Week</div>
        <div class="text-left font-bold">Arrows:</div>      <div class="text-right">{data.totalsThisWeek.totalArrows}</div>
        <div class="text-left font-bold">Sessions:</div>    <div class="text-right">{data.totalsThisWeek.totalSessions}</div>
        <div class="text-left font-bold">Max Score:</div>   <div class="text-right">{data.totalsThisWeek.highestScore}</div>
    </section>
    <section class="bg-blue-50 rounded-lg shadow-lg p-2 col-start-1 col-end-3 h-full row-start-2 row-end-3">
        {#each data.lastSessions.sessions as session}
            <SessionElem {session} />
        {:else}
            <span>No previous sessions were found.<br/> Go start shooting you lazy bum!</span>
        {/each}
        {#if data.lastSessions.hasMore}
            <div class="pt-4 p-2 border-t border-t-blue-800 border-dotted">
                <a class="border-2 border-blue-800 rounded-sm p-2 px-4" href="/sessions">View More</a>
            </div>
        {/if}
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