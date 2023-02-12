<script lang="ts">
    import { DateTime } from "luxon";
    import CircularButton from "@components/CircularButton.svelte";
    import qrCode from "../../../qr-code.svg";
    import { version } from "$app/environment";
    import { getDataCSVAsync } from "@stores/sessions";

    function download(filename : string, data : string) {
        const blob = new Blob([data], {type: 'text/csv'});
        const elem = window.document.createElement('a');
        elem.href = window.URL.createObjectURL(blob);
        elem.download = filename;        
        document.body.appendChild(elem);
        elem.click();        
        document.body.removeChild(elem);
    }

    async function exportData() {
        const fileExportDateTime = DateTime.now().toISO();
        const csv = await getDataCSVAsync();
        download(`data_${fileExportDateTime}.csv`, csv);
    }
</script>

<div class="p-4 grid gap-2">
    <div>
        <span class="font-bold">Version: </span>
        <span>0x{parseInt(version).toString(16)}</span>
    </div>
    <a class="p-2 bg-blue-700 text-blue-50 rounded-md flex items-center justify-center flex-grow w-full" href="/manage/tags">Manage Tags</a>
    <button class="p-2 bg-blue-700 text-blue-50 rounded-md flex items-center justify-center flex-grow w-full" on:click={exportData}>Download Your Data</button>
    <div class="flex flex-col items-center p-4">
        <h1 class="font-bold text-xl">Share with a friend:</h1>
        <img src={qrCode} alt="Install App QR" class="w-56" />
    </div>
</div>
<footer class="fixed left-0 right-0 bottom-0 pb-4 flex justify-center gap-2 items-end">
    <CircularButton icon="return" color="gray" href="/" />
</footer>