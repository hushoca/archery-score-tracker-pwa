import type { SvelteComponent } from "svelte";
import { writable } from "svelte/store";
import { v4 as newGuid } from "uuid";

type Button = {
    style: "primary" | "secondary";
    name : string;
    result : any;
}

type Modal = {
    id: string;
    title: string;
    body: string | SvelteComponent,
    resolve: (result : any) => void,
    buttons: Button[];
}

export const modal = writable<Modal | null>(null);

function showModalAsync<T>(title : string, body: string, buttons : Button[]) {
    return new Promise<T>((resolve, _) => {
        const resolveProxy = (val : any) => { 
            resolve(val);
            modal.set(null);
        }
        modal.set({
            id: newGuid(),
            body,
            title,
            buttons,
            resolve: resolveProxy
        });
    });
}

export const confirmAsync = async (text : string, title : string = "Confirm") =>
    await showModalAsync<boolean>(title, text, [
        { name: "Cancel", result: false, style: "secondary" },
        { name: "Ok", result: true, style: "primary" }
    ])