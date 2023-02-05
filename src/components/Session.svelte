<script lang="ts">
    import type { Session } from "../types";
    import { DateTime } from "luxon"
    import humanize from "humanize-duration"
    import { createEventDispatcher } from "svelte";
    import { clickOutside } from "@util/clickOutside";

    const dispatch = createEventDispatcher();

    export let session : Session;

    const maxPossibleScore = session.arrowsPerSet * session.setCount * 10;
    const startDate = DateTime.fromMillis(session.startedAt);
    const duration = DateTime.fromMillis(session.finishedAt!).diff(startDate);
    const durationText = humanize(duration.toMillis(), { round: true });

    let menuMode = false;
    let menuHeight = 0;

    let containerDiv : HTMLDivElement;

    function enterMenuMode() {
        const { height } = containerDiv.getBoundingClientRect();
        menuHeight = height;
        menuMode = true;
    }

    function remove() {
        confirm("Are you sure you want to remove this session?") && dispatch("delete");
    }
</script>

{#if menuMode}
    <div class="border-t border-t-blue-800 p-2 flex items-center justify-evenly" style:height="{menuHeight}px" use:clickOutside={() => menuMode = false}>
        <button class="bg-red-600 text-red-50 p-3 px-6 rounded-lg shadow-md" on:click={remove}>Delete</button>
        <button class="bg-gray-300 text-black p-3 px-6 rounded-lg shadow-md" on:click={() => menuMode = false}>Cancel</button>
    </div>
{:else}
    <div bind:this={containerDiv}>
        <button class="border-t border-t-blue-800 p-2 text-left text-sm select-none w-full" on:click={enterMenuMode}>
            <div class="font-bold flex items-center justify-between text-lg">
                <span>{session.name}</span>
                <span>{session.score} / {maxPossibleScore}</span>
            </div>
            <div class="grid grid-cols-[auto_1fr] gap-x-3">
                <span>When :</span> <span class="capitalize">{startDate.toRelativeCalendar()}</span>
                <span>Duration :</span> <span>{durationText}</span>
                <span>Arrows Shot :</span> <span>{session.arrowsPerSet * session.setCount}</span>
            </div>
        </button>
    </div>
{/if}