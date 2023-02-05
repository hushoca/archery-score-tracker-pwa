<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { fade } from 'svelte/transition';
    import { allPoints, orderedPoints, type Point } from '../types';
    import CircularButton from '@components/CircularButton.svelte';

    const dispatch = createEventDispatcher();
    
    export let points : Point[] = [];
    export let title : string;
    export let mode : "Edit" | "Add";
    export let arrowCount : number;

    function addPoint(p : Point) {
        points = [...points, p];
    }

    function removePoint(i : number) {
        points = points.filter((_, ind) => ind != i);
    }

</script>

<div class="bg-black bg-opacity-20 fixed inset-0 flex justify-center items-center p-8">
    <div class="bg-blue-50 rounded-lg shadow-lg p-2 w-full">
        <h1 class="font-bold text-lg border-b-2 border-b-blue-900 w-full text-center col-start-1 col-end-3">{title}</h1>
        <div class="flex flex-wrap gap-2 p-4 justify-evenly text-xl text-center border-b-2 border-b-blue-900">
            {#each points as point, index}
                <button class="border-4 font-bold rounded-full aspect-square w-10 flex items-center justify-center text-lg"
                style:border-color={allPoints[point].color} style:color={allPoints[point].color} style:border-style={point == "M" ? "dashed" : undefined} in:fade
                on:click={() => removePoint(index)}>
                        {point}
                </button>
            {:else}
                No points present.
            {/each}
        </div>
        {#if arrowCount > points.length}
            <div class="flex flex-wrap gap-2 p-4 justify-evenly">
                {#each orderedPoints.map(p => ({ point: p, details: allPoints[p]})) as { point, details }}
                <button class="border-4 font-bold rounded-full aspect-square w-14 flex items-center justify-center text-2xl"
                    style:border-color={details.color} style:color={details.color} style:border-style={point == "M" ? "dashed" : undefined}
                    on:click={() => addPoint(point)}>
                        {point}
                </button>
                {/each}
            </div>
        {:else}
            <div class="text-center p-2">
                {#if mode == "Add"}
                    Click the confirm button below to add this set or click the back button to discard it.
                {:else if mode == "Edit"}
                    Click the confirm button below to edit the set or click the back button to discard interface.
                {/if}
            </div>
        {/if}
    </div>
</div>
<footer class="pb-4 shadow-sm flex justify-center gap-2 items-end fixed bottom-0 w-full">
    {#if mode == "Edit"}
        <CircularButton icon="trash" color="red" on:click={() => dispatch("delete")} />
    {/if}
    <CircularButton icon="return" color="gray" on:click={() => dispatch("discard")} />
    {#if arrowCount == points.length}
        <CircularButton icon="check" color="emerald" on:click={() => dispatch("done", points)}/>
    {/if}
</footer>