import { getAllSessionsGroupedByMonthAsync } from "@stores/sessions";

export async function load() {
    return {
        sessions : getAllSessionsGroupedByMonthAsync()
    }
}