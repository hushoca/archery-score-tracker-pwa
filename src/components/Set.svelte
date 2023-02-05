<script lang="ts">
    import { allPoints, type Point } from "../types";

    export let index : number;
    export let points : Point[];

    let total = 0;
    points.forEach(s => {
        total += allPoints[s].point;
    });

</script>

<section class="bg-blue-50 rounded-lg shadow-lg p-2 w-full grid grid-cols-2">
    <div class="text-left font-bold">Set {index + 1}</div>
    <div class="text-right font-bold">Score: {total}</div>
    <div class="col-start-1 col-end-3 flex justify-center gap-2 border-t border-t-blue-700 pt-2">
        {#each points as score}
            <div class="border-4 font-bold text-blue-600 border-blue-600 rounded-full aspect-square w-8 flex items-center justify-center"
                style:border-color={allPoints[score].color} style:color={allPoints[score].color} style:border-style={score == "M" ? "dashed" : undefined}>
                {score}
            </div>
        {/each}
    </div>
</section>