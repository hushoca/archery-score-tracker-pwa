<script lang="ts">
    import { modal } from "@stores/modal";
</script>

{#if $modal !== null}
    <div class="bg-opacity-40 bg-black fixed inset-0 flex items-center justify-center p-4">
        {#key $modal.id}
            <section class="bg-blue-50 rounded-md overflow-hidden shadow-lg">
                <header class="bg-blue-200 p-2 font-bold text-center tracking-wide">{$modal.title}</header>
                <main class="p-2 whitespace-pre-wrap">{$modal.body}</main>
                <footer class="p-2 grid grid-flow-col gap-2">
                    {#each $modal.buttons as button}
                        <button class="border-2 border-blue-700 py-1" on:click={() => $modal?.resolve(button.result)}
                            class:bg-blue-700={button.style == "primary"} class:text-blue-50={button.style == "primary"} 
                            class:text-blue-700={button.style == "secondary"}>
                            {button.name}
                        </button>
                    {/each}
                </footer>
            </section>
        {/key}
    </div>
{/if}