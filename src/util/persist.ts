import { browser } from "$app/environment";
import type { Writable } from "svelte/store";

export function persist<T>(writable : Writable<T>, name: string, version: number) {
    const key = `${name}-v${version}`;
    if(browser) {
        const dataJson = localStorage.getItem(key);
        if(dataJson) {
            writable.set(JSON.parse(dataJson));
        } 
        writable.subscribe(d => {
            localStorage.setItem(key, JSON.stringify(d));
        })
    }
    return writable;
}