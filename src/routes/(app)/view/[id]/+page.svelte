<script lang="ts">
    import CircularButton from "@components/CircularButton.svelte";
    import { deleteSession } from "@stores/sessions";
    import SetsView from "@components/SetsView.svelte";
    import { sessionsStore } from "@stores/sessions";
    import { DateTime } from 'luxon';
    import { page } from '$app/stores';
    import { goto } from "$app/navigation";

    const id = $page.params.id as string;
    const session = $sessionsStore.sessions.find(s => s.id == id);

    let startedAt = DateTime.fromMillis(session?.startedAt ?? 0);
    let finishedAt = DateTime.fromMillis(session?.finishedAt ?? 0);
    let duration = finishedAt.diff(startedAt).toFormat("hh:mm:ss");

    function remove() { 
        if(confirm("Are you sure you want to delete this session?")) {
            deleteSession(id);
            goto("/");
        }
    }
</script>

{#if session}
    <div class="grid grid-cols-2 p-2 text-xl">
        <span class="text-left overflow-hidden text-ellipsis whitespace-nowrap">{session.name}</span>
        <span class="text-right">{duration}</span>
    </div>
    <SetsView mode="View" startedAt={session.startedAt} sets={session.sets} setCount={session.setCount} arrowCount={session.arrowsPerSet} />
    <footer class="pb-4 shadow-sm flex justify-center gap-2 items-end fixed bottom-0 w-full">
        <CircularButton icon="return" color="gray" href="/"/>
        <CircularButton icon="trash" color="red" on:click={remove} />
    </footer>
{/if}
