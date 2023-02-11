import { getReportDataForYearAsync } from "@stores/sessions";

export async function load() {
    return { 
        thisYear: getReportDataForYearAsync()
    }
}