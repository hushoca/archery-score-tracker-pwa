<script lang="ts">
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

    let tags = writable<string[]>([]);
    liveQuery(() => db.tags.toArray()).subscribe(newTags => tags.set(newTags.map(t => t.id)));
</script>

<div class="max-h-44 overflow-auto gap-2 flex flex-wrap justify-center">
    {#each $tags as tag}
        {@const active = selectedTags.includes(tag)}
        <button class="border border-blue-700 px-2 overflow-hidden text-ellipsis" class:bg-blue-700={active} class:text-blue-50={active}
            on:click={() => toggleTag(tag)}>{tag}</button>
    {/each}
</div>
