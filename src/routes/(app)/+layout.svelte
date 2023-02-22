<script lang="ts">
    import "../../app.css";
    import { mobile } from "@stores/mobile";
    import { navigating } from '$app/stores'
    import LoadingSpinner from "@components/LoadingSpinner.svelte";
    import ModalHandler from "@components/ModalHandler.svelte";
    import DesktopPage from "./DesktopPage.svelte";
</script>

<svelte:head>
    <title>Archery Score Tracker</title>
</svelte:head>

{#if $navigating}
    <main class="text-blue-900 bg-gradient-to-b from-blue-200 min-h-screen to-indigo-200 overflow-auto flex justify-center items-center">
        <LoadingSpinner />
    </main>
{:else}
    {#if $mobile}
        <main class="text-blue-900 bg-gradient-to-b from-blue-200 min-h-screen to-indigo-200 overflow-auto">
            <slot />
            <ModalHandler />
        </main>
    {:else}
        <DesktopPage />
    {/if}
{/if}
