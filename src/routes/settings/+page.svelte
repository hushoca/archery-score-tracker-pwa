<script lang="ts">
    import { sessionsStore } from "../../stores/sessions";
    import { DateTime } from "luxon"
    import type { Point } from "../../types";
    import CircularButton from "../../components/CircularButton.svelte";

    function download(filename : string, data : string) {
        const blob = new Blob([data], {type: 'text/csv'});
        const elem = window.document.createElement('a');
        elem.href = window.URL.createObjectURL(blob);
        elem.download = filename;        
        document.body.appendChild(elem);
        elem.click();        
        document.body.removeChild(elem);
    }

    function formatSets(arrows : Point[][], arrowsPerSet : number) { 
        let str = "";
        arrows.forEach((arrows, index) => {
            str += arrows.join(",") + "\n"
        });
        return str.replace(/\n$/, "");
    }

    function exportData() {
        let csv = `"session_name","started_at","finished_at","sets","arrows_per_set","set_count","total_score",\n`;
        $sessionsStore.sessions.forEach(s => {
            const startedAt = DateTime.fromMillis(s.startedAt).toISO();
            const finishedAt = DateTime.fromMillis(s.finishedAt!).toISO();
            csv += `"${s.name?.replaceAll('"', '""')}","${startedAt}","${finishedAt}","${formatSets(s.sets, s.arrowsPerSet)}","${s.arrowsPerSet}","${s.setCount}","${s.score}",\n`;
        })
        const fileExportDateTime = DateTime.now().toISO();
        download(`data_${fileExportDateTime}.csv`, csv);
    }
</script>

<div class="p-4">
    <button class="p-2 bg-blue-700 text-blue-50 rounded-md flex items-center justify-center flex-grow w-full" on:click={exportData}>Download Your Data</button>
</div>
<footer class="fixed left-0 right-0 bottom-0 pb-4 flex justify-center gap-2 items-end">
    <CircularButton icon="return" color="gray" href="/" />
</footer>