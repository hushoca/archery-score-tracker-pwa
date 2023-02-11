import { getReportDataForWeekAsync } from "@stores/sessions";

export async function load() {
    return { 
        thisYear: getReportDataForWeekAsync()
    }
}