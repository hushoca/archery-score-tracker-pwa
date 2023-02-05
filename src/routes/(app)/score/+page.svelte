<script lang="ts">
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import AddScoreModal from '@components/AddScoreModal.svelte';
    import CircularButton from "@components/CircularButton.svelte";
    import Set from "@components/Set.svelte"
    import { activeSession } from "@stores/sessions";
    import { allPoints, type Point } from "../../../types";
    import { DateTime } from "luxon"

    let setCount = $activeSession!.setCount;
    let arrowCount = $activeSession!.arrowsPerSet;
    let startedAt = DateTime.fromMillis($activeSession!.startedAt);

    let addMode = false;

    $: sets = $activeSession!.sets;

    function newSet(e : CustomEvent<Point[]>) {
        activeSession.update(s => {
            s!.sets.push(e.detail);
            return s;
        });
        addMode = false;
    }

    let total = 0;
    $: if(sets) {
        total = 0;
        sets.forEach(set => {
            set.forEach(point => {
                total += allPoints[point].point;
            });
        })
    }

    function discard() {
        if(confirm("Are you sure you want to discard this session?")) {
            goto("/score/discard");
        }
    }

    let clock = DateTime.now().diff(startedAt).toFormat("hh:mm:ss");
    onMount(() => {
        const interval = setInterval(() => {
            clock = DateTime.now().diff(startedAt).toFormat("hh:mm:ss");
        }, 1000)
        return () => clearInterval(interval);
    })

</script>

<div class="grid grid-cols-2 px-3 text-xl">
    <span class="text-left overflow-hidden text-ellipsis whitespace-nowrap">{$activeSession?.name}</span>
    <span class="text-right">{clock}</span>
</div>
<main class="flex flex-col gap-2 grow p-2 text-center items-center mb-28">
    {#each sets as points, index}
        <Set {index} {points} />
    {/each}
    <section class="bg-blue-50 rounded-lg shadow-lg p-2 w-full text-xl flex justify-around">
        <div>
            <span class="font-bold">Sets:</span>
            <span>{sets.length}/{setCount}</span>
        </div>
        <div>
            <span class="font-bold">Score:</span>
            <span>{total}/{arrowCount * setCount * 10}</span>
        </div>
    </section>
</main>
{#if addMode}
    <AddScoreModal arrowCount={arrowCount} on:discard={() => addMode = false} on:done={e => newSet(e)}/>
{:else}
    <footer class="pb-4 shadow-sm flex justify-center gap-2 items-end fixed bottom-0 w-full">
        <CircularButton icon="return" color="gray" href="/"/>
        {#if setCount == sets.length}
            <CircularButton icon="check" color="emerald" size="lg" href="/score/complete"/>
        {:else}
            <CircularButton icon="plus"  size="lg" on:click={() => addMode = true}/>
        {/if}
        <CircularButton icon="x" color="red" on:click={discard} />
    </footer>
{/if}
