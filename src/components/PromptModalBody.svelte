<script lang="ts">
    export let model : any;
    export let text = "Enter value:"

    function loseFocusOnEnter(ev : KeyboardEvent) {
        if(ev.key == "Enter") {
            (ev.target as HTMLInputElement).blur();
        }
    }

</script>

<main class="px-2 pt-2 grid gap-1">
    <span class="pr-5">{text}</span>
    <input type="text" bind:value={model} class="border border-blue-700 py-1 px-2" on:keydown={loseFocusOnEnter}/>
</main>