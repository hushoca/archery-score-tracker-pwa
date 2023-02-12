<script lang="ts">
    import CircularButton from "@components/CircularButton.svelte";
    import { page } from '$app/stores';
    import TabButton from "@components/TabButton.svelte";
    $: path = $page.url.pathname;
</script>

<div class="grid gap-2 p-2">
    <div class="grid grid-flow-col auto-cols-fr gap-1">
        <TabButton value="This Year" href="/graphs" active={path == "/graphs"}/>
        <TabButton value="This Week" href="/graphs/week" active={path == "/graphs/week"}/>
        <TabButton value="Custom" href="/graphs/custom" active={path == "/graphs/custom"}/>
    </div>
    <div class="pb-24">
        <slot />
    </div>
</div>
<footer class="fixed left-0 right-0 bottom-0 pb-4 flex justify-center gap-2 items-end">
    <CircularButton icon="return" color="gray" href="/" />
</footer>