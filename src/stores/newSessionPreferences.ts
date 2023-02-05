import { persist } from "@util/persist";
import { writable } from "svelte/store";

type NewSessionPreferences = {
    arrowsPerSet : number;
    sets: number | null;
}

export const newSessionPreferences = persist({ 
    writable: writable<NewSessionPreferences>({
        arrowsPerSet: 6,
        sets: 10
    }), 
    name: "newSessionPreferences", 
    version: 1
});