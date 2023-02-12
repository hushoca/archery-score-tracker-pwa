import { getLastYearsSessionsGroupedByMonthAsync } from "@stores/sessions";

export async function load() {
    return {
        sessions : getLastYearsSessionsGroupedByMonthAsync()
    }
}