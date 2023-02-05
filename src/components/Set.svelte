<script lang="ts">
    import { DateTime } from "luxon";
    import { allPoints, type Set } from "../types";

    export let index : number;
    export let set : Set;
    export let startedAt : number;

    const duration = DateTime.fromMillis(set.recordedAt).diff(DateTime.fromMillis(startedAt)).toFormat("hh:mm:ss");
</script>

<section class="bg-blue-50 rounded-lg shadow-lg p-1 px-2 w-full grid grid-cols-2">
    <div class="text-left font-bold">Set {index + 1}</div>
    <div class="text-right font-bold">Score: {set.total}</div>
    <div class="col-start-1 col-end-3 flex justify-center gap-2 border-y border-y-blue-900 py-3">
        {#each set.points as point}
            <div class="border-4 font-bold text-blue-600 border-blue-600 rounded-full aspect-square w-8 flex items-center justify-center"
                style:border-color={allPoints[point].color} style:color={allPoints[point].color} style:border-style={point == "M" ? "dashed" : undefined}>
                {point}
            </div>
        {/each}
    </div>
    <div class="text-center font-bold col-span-2 pt-1">{duration}</div>
</section>