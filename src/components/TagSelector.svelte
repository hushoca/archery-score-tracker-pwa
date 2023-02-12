<script lang="ts">
    import Plus from "@icons/Plus.svelte";
    import { promptAsync } from "@stores/modal";

    export let selectedTags : string[];
    export let allTags : string[];

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
        const value = await promptAsync("Enter a value for the new attribute:", "New Attribute");
        if(value == null || value?.trim() == "") return;
        if(allTags.includes(value)) return;
        allTags.push(value);
        selectedTags.push(value);
        allTags = allTags;
        selectedTags = selectedTags;
    }
</script>

<span class="font-bold">Tags:</span>
<div class="max-h-44 overflow-auto gap-2 flex flex-wrap justify-center p-2">
    {#each allTags as tag}
        {@const active = selectedTags.includes(tag)}
        <button class="border border-blue-700 px-2" class:bg-blue-700={active} class:text-blue-50={active}
            on:click={() => toggleTag(tag)}>{tag}</button>
    {/each}
    <button class="bg-blue-700 text-blue-50 px-2 flex items-center gap-1" on:click={addNewTag}>
        <Plus/> Add New
    </button>
</div>
