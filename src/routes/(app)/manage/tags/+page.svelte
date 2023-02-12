<script lang="ts">
    import CircularButton from "@components/CircularButton.svelte";
    import { db } from "@util/db";
    import { liveQuery } from "dexie";
    import type { Session, Tag } from "../../../../types";
    import { writable } from "svelte/store";
    import X from "@icons/X.svelte";
    import { confirmAsync, showAddNewTagModalAsync } from "@stores/modal";
    import { newSessionPreferences } from "@stores/newSessionPreferences";
    let tags = writable<Tag[]>([]);
    liveQuery(() => db.tags.toArray()).subscribe(tags.set);

    async function deleteTag(tag : Tag) {
        let msg = `Are you sure you want to delete "${tag.id}"?`;
        if(tag.usedBy.length > 0 ) msg += `\n\nDeleting this tag will also remove it from ${tag.usedBy.length} session(s) it is attached to. This action cannot be reverted!`;
        const shouldDelete = await confirmAsync(msg)
        if(shouldDelete) {
            await db.transaction("readwrite", db.sessions, db.tags, async () => {
                await db.tags.delete(tag.id);
                await db.sessions.where("tags").equals(tag.id).modify((s : Session) => {
                    s.tags = s.tags.filter(t => t != tag.id);
                    return s;
                })
            });
            newSessionPreferences.update(nsp => {
                nsp.tags = nsp.tags.filter(t => t != tag.id)
                return nsp;
            })
        }
    }

</script>

<main class="p-2 grid gap-2">
    <h1 class="text-lg font-bold text-center">Manage Session Tags</h1>
    <div class="grid gap-2">
        <section class="bg-blue-50 rounded-lg shadow-lg p-2 px-4 w-full grid grid-cols-[1fr_1fr_auto] gap-2">
            <span class="text-left font-bold">Tag</span>
            <span class="text-center font-bold">Applied to</span>
            <span></span>
            {#each $tags as tag}
                <span class="overflow-hidden text-ellipsis">{tag.id}</span>
                <span class="text-center">{tag.usedBy.length} set(s)</span>
                <div class="text-right">
                    <button class="bg-red-600 text-blue-50 p-1 aspect-square rounded-full" on:click={() => deleteTag(tag)}>
                        <X/>
                    </button>
                </div>
            {/each}
        </section>
    </div>
</main>
<footer class="fixed left-0 right-0 bottom-0 pb-4 flex justify-center gap-2 items-end">
    <CircularButton icon="return" color="gray" on:click={() => history.back()} />
    <CircularButton icon="plus" color="blue" on:click={showAddNewTagModalAsync} />
</footer>