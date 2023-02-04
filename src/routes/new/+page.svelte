<script lang="ts">
    import { goto } from "$app/navigation";
    import CircularButton from "../../components/CircularButton.svelte";
    import { activeSession } from "../../stores/sessions";
    import { DateTime } from "luxon"
    import { v4 as newGuid } from "uuid"

    let sets : number = 10;
    let arrows: number = 6;

    function start() {
        activeSession.set({
            id: newGuid(),
            name,
            score: 0,
            arrowsPerSet: arrows,
            setCount: sets,
            startedAt: DateTime.now().toMillis(),
            sets: [] 
        });
        goto(`/score`);
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

    let name : string = `${today} ${timePeriod}`;
</script>

<main class="flex flex-col gap-4 grow p-2 text-center items-center">
    <section class="bg-blue-50 rounded-lg shadow-lg p-2 px-6 grid grid-cols-[1fr_1fr] gap-2 text-left items-center">
            <span class="font-bold">Name:</span>
            <input type="text" bind:value={name} class="bg-gradient-to-b from-blue-50 to-blue-100 border rounded-md border-blue-700 p-1 w-full" />
            <span class="font-bold">Arrows (per set):</span>
            <select bind:value={arrows} class="bg-gradient-to-b from-blue-50 to-blue-100 border rounded-md border-blue-700 p-1 text-center">
                <option value={3}>3</option>
                <option value={6}>6</option>
            </select>
            <span class="font-bold">Total Sets:</span>
            <select bind:value={sets} class="bg-gradient-to-b from-blue-50 to-blue-100 border rounded-md border-blue-700 p-1 text-center">
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
            </select>
    </section>
    <section class="bg-blue-50 rounded-lg shadow-lg p-2 px-6 grid grid-cols-[1fr_auto] gap-2 text-left items-center">
        <span class="font-bold">Max possible score:</span>
        <span>{sets * arrows * 10}</span>
</section>
</main>
<footer class="fixed left-0 right-0 bottom-0 pb-4 flex justify-center gap-2 items-end">
    <CircularButton icon="return" color="gray" href="/"/>
    <CircularButton icon="play" color="emerald" on:click={start}/>
    <!-- <CircularButton icon="play" size="lg" color="yellow"/> -->
</footer>