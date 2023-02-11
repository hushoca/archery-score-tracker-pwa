<script lang="ts">
    export let title : string;
    export let data: { name: string, value: number }[];
    let maxVal = 0;
    $: if(data) {
        maxVal = 0;
        data.forEach(d => maxVal = Math.max(maxVal, d.value));
        if(maxVal == 0) maxVal = 100;
    }
</script>

<div class="grid gap-2 bg-blue-50 pt-2 px-3 pb-9 rounded-lg shadow-lg">
    <h2 class="text-lg tracking-wide font-bold text-center">{title}</h2>
    <section class="border-t-0 border-r-0 border-blue-600 border-2 inline-grid gap-1 px-3 aspect-[2/1] justify-evenly items-end pt-6" style:grid-template-columns="repeat({data.length}, 1fr)">
        {#each data as {name, value}}
            <div class="bg-blue-500 text-blue-100 text-center relative" style:height="{value * 100 / maxVal}%">
                <div class="invisible text-sm">{value}</div>
                <div class="invisible text-sm">{name}</div>
                <div class="absolute left-1/2 -top-6 -translate-x-1/2 text-blue-700 text-sm">{value}</div>
                <div class="absolute left-1/2 -bottom-6 -translate-x-1/2 text-blue-700 text-sm">{name}</div>
            </div>
        {/each}
    </section>
</div>
