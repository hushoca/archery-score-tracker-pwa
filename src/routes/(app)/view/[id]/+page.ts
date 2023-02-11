import { getSessionAsync } from "@stores/sessions";
import type { PageLoadEvent, RouteParams } from "./$types";

/** @type {import('./$types').PageLoad} */
export async function load({ params } : PageLoadEvent) {
    return { 
        session: getSessionAsync(params.id)
    }
}