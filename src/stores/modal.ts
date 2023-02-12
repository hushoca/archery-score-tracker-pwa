import PromptModalBody from "@components/PromptModalBody.svelte";
import { db } from "@util/db";
import { DateTime } from "luxon";
import type { Tag } from "../types";
import { writable } from "svelte/store";
import { v4 as newGuid } from "uuid";

interface Button {
    style: "primary" | "secondary";
    name : string;
}

interface Modal {
    id : string;
    title: string;
    buttons: Button[];
    resolve: (result : any) => void
    handleButtonClick: (index : number) => void
}

export class ResolveButton implements Button {
    constructor(
        public name : string,
        public style : "primary" | "secondary",
        public result : any
    ) { }
}

export class ReturnModelButton implements Button {
    constructor(
        public name : string,
        public style : "primary" | "secondary",
    ) { }
}

export class TextModal implements Modal {
    public id: string = newGuid();
    constructor(
        public title: string,
        public text : string,
        public resolve: (result: any) => void,
        public buttons: Button[]
    ) { }

    handleButtonClick(index: number) {
        const button = this.buttons[index];
        if(button instanceof ResolveButton) this.resolve(button.result);
        if(button instanceof ReturnModelButton) throw "Not supported!";
        modal.set(null);
    }
}

export class ComponentModal implements Modal {
    public id: string = newGuid();
    constructor(
        public title: string,
        public component : any,
        public resolve: (result: any) => void,
        public buttons: Button[],
        public model : any = null,
        public __props : any = {}
    ) {}

    handleButtonClick(index: number) {
        const button = this.buttons[index];
        if(button instanceof ResolveButton) this.resolve(button.result);
        if(button instanceof ReturnModelButton) this.resolve(this.model);
        modal.set(null);
    }
}


export const modal = writable<Modal | null>(null);

const confirmButtons = [
    new ResolveButton("Cancel", "secondary", false),
    new ResolveButton("Okay", "primary", true),
]
export function confirmAsync( body: any, title : string = "Confirm") {
    return new Promise<boolean>((resolve, _) => {
        modal.set(new TextModal(title, body, resolve, confirmButtons));
    });
}

const promptButtons = [
    new ResolveButton("Cancel", "secondary", null),
    new ReturnModelButton("Done", "primary"), 
]
export function promptAsync(text : string, title : string = "Please enter value") {
    return new Promise<string | null>((resolve, _) => {
        modal.set(new ComponentModal(title, PromptModalBody, resolve, promptButtons, "", { text }));
    });
}

export async function showAddNewTagModalAsync() {
    const value = await promptAsync("Enter a value for the new attribute:", "New Attribute");
    if(value == null || value?.trim() == "") return null;
    if(await db.tags.get(value) !== undefined) return null;
    const tag : Tag = { 
        id: value, 
        createdAt: DateTime.now().toMillis(), 
        usedBy: [] 
    }
    await db.tags.add(tag);
    return tag;
}