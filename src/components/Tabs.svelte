<script lang="ts">
    export let tabs : { title: string, body: any }[];
    let activeTabIndex = 0;

    function change(index: number) {
        activeTabIndex = index;
    }
</script>

<div class="grid grid-flow-col auto-cols-fr gap-1">
    {#each tabs as tab, index}
        {#if index == activeTabIndex}
            <button class="p-2 bg-blue-700 text-blue-50 rounded-md text-sm flex items-center justify-center flex-grow">{tab.title}</button>
        {:else}
            <button class="p-2 border-2 border-blue-700 text-blue-700 rounded-md text-sm flex items-center justify-center flex-grow" on:click={() => change(index)}>
                {tab.title}
            </button>
        {/if}
    {/each}
</div>
<div>
    <svelte:component this={tabs[activeTabIndex].body} />
</div>