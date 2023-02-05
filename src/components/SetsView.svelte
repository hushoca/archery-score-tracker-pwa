<script lang="ts">
    import type { Set } from "../types"
    import SetElem from "@components/Set.svelte"
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    export let startedAt : number;
    export let sets : Set[];
    export let setCount : number | undefined;
    export let arrowCount : number;

    export let setClickable : boolean = false;

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
    <section class="bg-blue-50 rounded-lg shadow-lg p-2 w-full text-xl flex justify-around">
        <div>
            <span class="font-bold">Sets:</span>
            {#if setCount}
                <span>{sets.length}/{setCount}</span>
            {:else}
                <span>{sets.length}</span>
            {/if}
        </div>
        <div>
            <span class="font-bold">Score:</span>
            {#if setCount}
                <span>{total}/{arrowCount * setCount * 10}</span>
            {:else}
                <span>{total}</span>
            {/if}            
        </div>
    </section>
</main>