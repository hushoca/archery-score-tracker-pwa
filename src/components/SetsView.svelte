<script lang="ts">
    import type { Set } from "../types"
    import SetElem from "@components/Set.svelte"
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    export let startedAt : number;
    export let sets : Set[];
    export let setCount : number | null;
    export let arrowCount : number;
    export let tags : string[] | undefined = undefined;

    export let setClickable : boolean = false;

    export let mode : "View" | "InProgress";

    let total = 0;
    $: if(sets) {
        total = 0;
        sets.forEach(s => total += s.total);
    }

    function setClicked(set : Set, index : number) {
        dispatch("setClicked", {
            set,
            index
        });
    }
</script>

<main class="flex flex-col gap-2 grow px-2 text-center items-center mb-28">
    {#each sets as set, index}
        {#if setClickable}
            <button on:click={() => setClicked(set, index)} class="w-full">
                <SetElem {index} {set} {startedAt} />
            </button>
        {:else}
            <SetElem {index} {set} {startedAt} />
        {/if}
    {/each}
    <section class="bg-blue-50 rounded-lg shadow-lg p-2 px-4 w-full flex justify-between items-center">
        <div class="flex flex-col">
            <div class="text-left">
                <span class="font-bold">Sets:</span>
                {#if setCount && mode == "InProgress"}
                    <span>{sets.length}/{setCount}</span>
                {:else}
                    <span>{sets.length}</span>
                {/if}
            </div>
            <div class="text-left">
                <span class="font-bold">Average Set:</span>
                <span>{total == 0 ? 0 :(total / sets.length).toFixed(1)}</span>
            </div>
            {#if setCount && mode == "InProgress"}
                <div class="text-left">
                    <span class="font-bold">Max Viable Score:</span>
                    <span>{ arrowCount * 10 * (setCount - sets.length) + total}</span>
                </div>
            {/if}
        </div>
        <div class="text-right text-3xl row-span-2 flex items-center justify-end">
            {#if setCount}
                <span>{total}/{arrowCount * setCount * 10}</span>
            {:else}
                <span>{total}/{arrowCount * sets.length * 10}</span>
            {/if}       
        </div>
    </section>
    {#if tags && tags.length > 0}
        <section class="bg-blue-50 rounded-lg shadow-lg p-2 px-4 w-full text-left">
            <span class="font-bold">Tags: </span> {tags.join(", ")}
        </section>
    {/if}
</main>