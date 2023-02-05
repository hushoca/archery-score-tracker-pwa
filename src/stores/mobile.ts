import { writable } from "svelte/store";
import { persist } from "@util/persist";
import MobileDetect from "mobile-detect"

const md = new MobileDetect(window.navigator.userAgent);

export const mobile = persist(writable<boolean>(md.mobile() != null), "isMobile", 1);