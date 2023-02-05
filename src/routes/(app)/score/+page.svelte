<script lang="ts">
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import AddScoreModal from '@components/AddEditScoreModal.svelte';
    import CircularButton from "@components/CircularButton.svelte";
    import { activeSession } from "@stores/sessions";
    import { allPoints, type Point, type Set, type Session } from "../../../types";
    import { DateTime } from "luxon"
    import SetsView from "@components/SetsView.svelte";

    let setCount = $activeSession!.setCount;
    let arrowCount = $activeSession!.arrowsPerSet;
    let startedAtMillis = $activeSession!.startedAt;
    let startedAt = DateTime.fromMillis(startedAtMillis);

    let mode : "add" | "edit" | "hidden" = "hidden";

    $: sets = $activeSession!.sets;

    function newSet(e : CustomEvent<Point[]>) {
        activeSession.update(s => {
            let total = 0;
            e.detail.forEach(p => total += allPoints[p].point);
            s!.sets.push({
                total,
                points: e.detail,
                recordedAt: DateTime.now().toMillis(),
            });
            return s;
        });
        mode = "hidden";
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

    let editPoints : Point[];
    let editSetIndex : number | null = null;

    function openEditSetModal(ev : CustomEvent<{ index: number, set : Set }>) {
        editPoints = ev.detail.set.points;
        editSetIndex = ev.detail.index;
        mode = "edit";
    }

    function changeSet(ev : CustomEvent<Point[]>) {
        activeSession.update(session => ({
            ...session,
            sets: session!.sets.map((set, index) => {
                if(index === editSetIndex) {
                    return {
                        ...set,
                        points: ev.detail
                    }
                }
                return set;
            })
        } as Session))
        mode = "hidden";
    }

    function deleteSet() {
        if(confirm("Are you sure you want to remove this set?")) {
            activeSession.update(session => ({
                ...session,
                sets: session!.sets.filter((set, index) => index != editSetIndex)
            } as Session))
            mode = "hidden";
        }
    }
</script>

<div class="grid grid-cols-2 p-2 text-xl">
    <span class="text-left overflow-hidden text-ellipsis whitespace-nowrap">{$activeSession?.name}</span>
    <span class="text-right">{clock}</span>
</div>
<SetsView startedAt={startedAtMillis} {sets} {setCount} {arrowCount} setClickable={true} on:setClicked={openEditSetModal} />

{#if mode == "add"}
    <AddScoreModal mode="Add" title="New Set" arrowCount={arrowCount} on:discard={() => mode = "hidden"} on:done={newSet} />
{:else if mode == "edit"}
    <AddScoreModal mode="Edit" title="Edit Set {(editSetIndex ?? 0) + 1}" arrowCount={arrowCount} 
        on:discard={() => mode = "hidden"} on:done={changeSet} on:delete={deleteSet} bind:points={editPoints} />
{:else if mode == "hidden"}
    <footer class="pb-4 shadow-sm flex justify-center gap-2 items-end fixed bottom-0 w-full">
        <CircularButton icon="return" color="gray" href="/"/>
        {#if setCount == sets.length}
            <CircularButton icon="check" color="emerald" size="lg" href="/score/complete"/>
        {:else}
            <CircularButton icon="plus"  size="lg" on:click={() => mode = "add"}/>
        {/if}
        <CircularButton icon="x" color="red" on:click={discard} />
    </footer>
{/if}
