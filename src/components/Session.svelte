<script lang="ts">
    import type { Session } from "../types";
    import { DateTime } from "luxon"
    import humanize from "humanize-duration"
    import { goto } from "$app/navigation";

    export let session : Session;

    const maxPossibleScore = session.arrowsPerSet * session.sets.length * 10;
    const startDate = DateTime.fromMillis(session.startedAt);
    const duration = DateTime.fromMillis(session.finishedAt!).diff(startDate);
    const durationText = humanize(duration.toMillis(), { round: true });
</script>

<button class="border-b border-dotted border-b-blue-800 p-2 text-left text-sm select-none w-full last-of-type:border-b-0" on:click={() => goto(`/view/${session.id}`)}>
    <div class="font-bold flex items-center justify-between text-base">
        <span class="overflow-hidden text-ellipsis whitespace-nowrap">{session.name}</span>
        <span class="whitespace-nowrap">{session.score} / {maxPossibleScore}</span>
    </div>
    <div class="grid grid-cols-[auto_1fr] gap-x-3">
        <span>When :</span> <span class="capitalize">{startDate.toRelativeCalendar()}</span>
        <span>Duration :</span> <span>{durationText}</span>
        <span>Arrows Shot :</span> <span>{session.arrowsPerSet * session.sets.length}</span>
    </div>
</button>