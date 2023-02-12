<script lang="ts">
    import MoreVertical from "@icons/MoreVertical.svelte";
    import Plus from "@icons/Plus.svelte";
    import { db } from "@util/db";
    import { liveQuery } from "dexie";
    import { writable } from "svelte/store";
    import { showAddNewTagModalAsync } from "@stores/modal";

    export let selectedTags : string[];

    function toggleTag(tag : string) {
        const index = selectedTags.findIndex(t => t == tag);
        if(index == -1) {
            selectedTags.push(tag);
        } else {
            selectedTags.splice(index, 1);
        }
        selectedTags = selectedTags;
    }

    async function addNewTag() {
        const value = await showAddNewTagModalAsync();
        if(value != null) {
            selectedTags.push(value.id);
            selectedTags = selectedTags;
        }
    }

    let tags = writable<string[]>([]);
    liveQuery(() => db.tags.toArray()).subscribe(newTags => tags.set(newTags.map(t => t.id)));
</script>

<div class="flex gap-1 border-b border-b-blue-700 pb-2">
    <span class="font-bold text-lg grow">Tags</span>
    <button class="bg-blue-700 text-blue-50 flex items-center aspect-square px-2 rounded-full" on:click={addNewTag}>
        <Plus/>
    </button>
    <a class="bg-blue-700 text-blue-50 flex items-center aspect-square px-2 rounded-full" href="/manage/tags">
        <MoreVertical/>
    </a>
</div>
<div class="max-h-44 overflow-auto gap-2 flex flex-wrap justify-center p-2 pt-4">
    {#each $tags as tag}
        {@const active = selectedTags.includes(tag)}
        <button class="border border-blue-700 px-2 overflow-hidden text-ellipsis" class:bg-blue-700={active} class:text-blue-50={active}
            on:click={() => toggleTag(tag)}>{tag}</button>
    {/each}
</div>
