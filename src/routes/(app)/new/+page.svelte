<script lang="ts">
    import { goto } from "$app/navigation";
    import CircularButton from "@components/CircularButton.svelte";
    import TagSelector from "@components/TagSelector.svelte";
    import MoreVertical from "@icons/MoreVertical.svelte";
    import Plus from "@icons/Plus.svelte";
    import { showAddNewTagModalAsync } from "@stores/modal";
    import { newSessionPreferences } from "@stores/newSessionPreferences";
    import { activeSession } from "@stores/sessions";
    import { DateTime } from "luxon"
    import { v4 as newGuid } from "uuid"

    function start() {
        activeSession.set({
            id: newGuid(),
            name,
            score: 0,
            arrowsPerSet: $newSessionPreferences.arrowsPerSet,
            setCount: $newSessionPreferences.sets,
            startedAt: DateTime.now().toMillis(),
            sets: [],
            tags: $newSessionPreferences.tags
        });
        goto(`/score`, { replaceState: true });
    }

    const now =  DateTime.now();
    const today = now.weekdayLong;
    const hour = now.hour;
    let timePeriod = "";
    if(hour >= 0 && hour < 12) {
        timePeriod = "morning";
    } else if(hour >= 12 && hour <= 17) {
        timePeriod = "afternoon";
    } else {
        timePeriod = "evening";
    }

    async function addNewTag() {
        const value = await showAddNewTagModalAsync();
        if(value != null) {
            newSessionPreferences.update(p => {
                p.tags.push(value.id);
                return p;
            })
        }
    }

    let name : string = `${today} ${timePeriod}`;
</script>

<main class="flex flex-col gap-2 grow p-2 text-center items-center">
    <h1 class="font-bold text-lg">Start a New Session</h1>
    <section class="bg-blue-50 rounded-lg shadow-lg p-4 px-6 grid grid-cols-[1fr_1fr] gap-2 text-left items-center">
            <span class="font-bold">Name:</span>
            <input type="text" bind:value={name} class="bg-gradient-to-b from-blue-50 to-blue-100 border rounded-sm border-blue-700 p-1 w-full" />
            <span class="font-bold">Arrows (per set):</span>
            <select bind:value={$newSessionPreferences.arrowsPerSet} class="bg-gradient-to-b from-blue-50 to-blue-100 border rounded-sm border-blue-700 p-1 text-center">
                <option value={3}>3</option>
                <option value={6}>6</option>
            </select>
            <span class="font-bold">Total Sets:</span>
            <select bind:value={$newSessionPreferences.sets} class="bg-gradient-to-b from-blue-50 to-blue-100 border rounded-sm border-blue-700 p-1 text-center">
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
                <option value={null}>No Limit</option>
            </select>
    </section>
    <section class="bg-blue-50 rounded-lg shadow-lg p-4 px-6 text-left items-center w-full">
        <div class="flex gap-1 border-b border-b-blue-700 pb-2">
            <span class="font-bold text-lg grow">Tags</span>
            <button class="bg-blue-700 text-blue-50 flex items-center aspect-square px-2 rounded-full" on:click={addNewTag}>
                <Plus/>
            </button>
            <a class="bg-blue-700 text-blue-50 flex items-center aspect-square px-2 rounded-full" href="/manage/tags">
                <MoreVertical/>
            </a>
        </div>
        <div class="p-2 pt-4">
            <TagSelector bind:selectedTags={$newSessionPreferences.tags} />
        </div>
    </section>
    {#if $newSessionPreferences.sets}
        <section class="bg-blue-50 rounded-lg shadow-lg p-2 py-4 px-6 grid grid-cols-[1fr_auto] gap-2 text-left items-center w-full">
            <span class="font-bold">Max possible score:</span>
            <span>{$newSessionPreferences.arrowsPerSet * $newSessionPreferences.sets * 10}</span>
        </section>
    {/if}
</main>
<footer class="fixed left-0 right-0 bottom-0 pb-4 flex justify-center gap-2 items-end">
    <CircularButton icon="return" color="gray" href="/"/>
    <CircularButton icon="play" color="emerald" on:click={start}/>
</footer>