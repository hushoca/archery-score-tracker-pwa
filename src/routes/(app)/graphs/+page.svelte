<script>
    import CircularButton from "../../components/CircularButton.svelte";
    import Tabs from "../../components/Tabs.svelte";
    import ThisWeekGraphs from "./(tabs)/ThisWeekGraphs.svelte";
    import ThisYearGraphs from "./(tabs)/ThisYearGraphs.svelte";
</script>

<main class="grid gap-2 p-2 text-center items-center pb-28">
    <Tabs tabs={[
        { title: "This Week", body: ThisWeekGraphs },
        { title: "Year", body: ThisYearGraphs },
    ]} />
</main>
<footer class="fixed left-0 right-0 bottom-0 pb-4 flex justify-center gap-2 items-end">
    <CircularButton icon="return" color="gray" href="/" />
</footer>