<script lang="ts">
    import SessionElem from "@components/Session.svelte";
    import CircularButton from "@components/CircularButton.svelte";
    import type { PageData } from "./$types";

    export let data : PageData;

</script>

<main class="p-3 pb-28 flex flex-col gap-2">
    <div class="text-xl font-bold text-center">Sessions</div>
    {#each data.sessions as [date, sessions]}
        <section class="bg-blue-50 rounded-lg shadow-lg p-2 col-start-1 col-end-3 h-full row-start-2 row-end-3">
            <h1 class="tracking-wider p-1 font-bold text-center bg-blue-700 text-blue-50 rounded-md">{date}</h1>
            {#each sessions as session}
                <SessionElem {session} />
            {/each}
        </section>
    {:else}
        <span>No previous sessions were found.<br/> Go start shooting you lazy bum!</span>
    {/each}
</main>
<footer class="fixed left-0 right-0 bottom-0 pb-4 flex justify-center gap-2 items-end">
    <CircularButton icon="return" color="gray" href="/"/>
</footer>