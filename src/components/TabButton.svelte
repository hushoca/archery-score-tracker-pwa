<script lang="ts">
    export let href : string | undefined = undefined
    export let value : string;
    export let active : boolean = false;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<svelte:element this={href ? "a" : "button"} {href} class="p-2  rounded-md text-sm flex items-center justify-center flex-grow border-2 border-blue-700" on:click
    class:bg-blue-700={active} class:text-blue-50={active}>
    {value}
</svelte:element>
