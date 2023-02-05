<script lang="ts">
    import type { Session } from "../types";
    import { DateTime } from "luxon"
    import humanize from "humanize-duration"
    import { goto } from "$app/navigation";

    export let session : Session;

    const maxPossibleScore = session.arrowsPerSet * session.setCount * 10;
    const startDate = DateTime.fromMillis(session.startedAt);
    const duration = DateTime.fromMillis(session.finishedAt!).diff(startDate);
    const durationText = humanize(duration.toMillis(), { round: true });
</script>

<button class="border-t border-t-blue-800 p-2 text-left text-sm select-none w-full" on:click={() => goto(`/view/${session.id}`)}>
    <div class="font-bold flex items-center justify-between text-lg">
        <span>{session.name}</span>
        <span>{session.score} / {maxPossibleScore}</span>
    </div>
    <div class="grid grid-cols-[auto_1fr] gap-x-3">
        <span>When :</span> <span class="capitalize">{startDate.toRelativeCalendar()}</span>
        <span>Duration :</span> <span>{durationText}</span>
        <span>Arrows Shot :</span> <span>{session.arrowsPerSet * session.setCount}</span>
    </div>
</button>