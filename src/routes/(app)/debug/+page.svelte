<script lang="ts">
    import { db } from "@util/db";
    import { liveQuery } from "dexie";
    import type { Session } from "../../../types";
    import { writable } from "svelte/store";

    let data = writable<Session[]>([]);
    liveQuery(() => db.sessions.toArray()).subscribe(data.set);
</script>