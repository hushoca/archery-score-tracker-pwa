import { persist } from "@util/persist";
import { writable } from "svelte/store";

type NewSessionPreferences = {
    arrowsPerSet : number;
    sets: number | null;
    tags: string[];
}

export const newSessionPreferences = persist({ 
    writable: writable<NewSessionPreferences>({
        arrowsPerSet: 6,
        sets: 10,
        tags: []
    }), 
    name: "newSessionPreferences", 
    version: 2,
    migrations: [
        {
            from: 1,
            to: 2,
            execute(data) {
                return { ...data, tags: [] };
            },
        }
    ]
});