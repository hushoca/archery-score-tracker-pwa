<script lang="ts">
    import CircularButton from "@components/CircularButton.svelte";
    import { deleteSessionAsync } from "@stores/sessions";
    import SetsView from "@components/SetsView.svelte";
    import { DateTime } from 'luxon';
    import { page } from '$app/stores';
    import { goto } from "$app/navigation";
    import type { PageData } from "./$types";
    import { confirmAsync } from "@stores/modal";

    const id = $page.params.id as string;

    export let data : PageData;
    const session = data.session;


    async function remove() { 
        const shouldRemove = await confirmAsync("Are you sure you want to delete this session?");
        if(shouldRemove) {
            await deleteSessionAsync(id);
            goto("/");
        }
    }
</script>

{#if session}
    {@const startedAt = DateTime.fromMillis(session.startedAt)}
    {@const finishedAt = DateTime.fromMillis(session.finishedAt ?? 0)}
    {@const duration = finishedAt.diff(startedAt).toFormat("hh:mm:ss")}
    <div class="grid grid-cols-2 p-2 text-xl">
        <span class="text-left overflow-hidden text-ellipsis whitespace-nowrap">{session.name}</span>
        <span class="text-right">{duration}</span>
    </div>
    <SetsView mode="View" startedAt={session.startedAt} sets={session.sets} setCount={session.setCount} arrowCount={session.arrowsPerSet} />
    <footer class="pb-4 shadow-sm flex justify-center gap-2 items-end fixed bottom-0 w-full">
        <CircularButton icon="return" color="gray" href="/"/>
        <CircularButton icon="trash" color="red" on:click={remove} />
    </footer>
{:else}
    <div class="font-bold text-center text-lg">Not found!</div>
{/if}