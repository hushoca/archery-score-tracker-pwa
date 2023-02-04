<script lang="ts">
    import "../app.css";
</script>

<svelte:head>
    <title>Archery Score Tracker</title>
</svelte:head>
<main class="text-blue-900 bg-gradient-to-b from-blue-100 min-h-screen to-blue-300 overflow-auto">
    <header>
        <h1 class="text-3xl text-center p-2 pt-5 font-bold">Archery Score Tracker</h1>
    </header>
    <slot />
</main>