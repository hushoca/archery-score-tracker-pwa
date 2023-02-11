<script lang="ts">
    import { goto } from "$app/navigation";
    import { completeSessionAsync } from "@stores/sessions";
    import { onMount } from "svelte";
    onMount(() => {
        completeSessionAsync().then(() => goto("/"));
    })
</script>

<div class="text-center">Saving...</div>