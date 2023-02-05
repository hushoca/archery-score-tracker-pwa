import { writable } from "svelte/store";
import { persist } from "@util/persist";
import MobileDetect from "mobile-detect"

const md = new MobileDetect(window.navigator.userAgent);

export const mobile = persist({ 
    writable: writable<boolean>(md.mobile() != null), 
    name: "isMobile", 
    version: 1
});