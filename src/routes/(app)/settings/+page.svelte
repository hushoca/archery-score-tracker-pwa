<script lang="ts">
    import { DateTime } from "luxon";
    import CircularButton from "@components/CircularButton.svelte";
    import qrCode from "../../../qr-code.svg";
    import { version } from "$app/environment";
    import { getDataCSVAsync } from "@stores/sessions";
    import Pencil from "@icons/Pencil.svelte";
    import Download from "@icons/Download.svelte";
    import Share from "@icons/Share.svelte";

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

    function share() {
        navigator.share({
            title: "Archery Score Tracker",
            text: "You can start using the archery score tracker app by following this link and installing it.",
            url: "https://" + window.location.host
        })
    }
</script>

<div class="p-2 grid gap-1">
    <span class="text-lg font-bold text-center">Settings</span>
    <div class="w-full grid grid-cols-[min-content_auto] gap-x-2 border-t-2 border-t-blue-900 py-2 border-b-2 border-b-blue-900">
        <span class="font-bold">Version:</span>
        <span>0x{parseInt(version).toString(16)}</span>
        <span class="font-bold">Author:</span>
        <span>Huseyin Hoca</span>
        <span class="font-bold">Website:</span>
        <span>huseyinhoca.com / hhoca.com</span>
    </div>
    <div class="flex flex-wrap gap-2 justify-center pt-2">
        <a class="px-4 py-2 bg-blue-700 text-blue-50 rounded-md flex items-center justify-center gap-2 whitespace-nowrap" href="/manage/tags">
            <Pencil/> Manage Tags
        </a>
        <button class="px-4 py-2 bg-blue-700 text-blue-50 rounded-md flex items-center justify-center gap-2 whitespace-nowrap" on:click={exportData}>
            <Download/> Download Your Data
        </button>
        <button class="px-4 py-2 bg-blue-700 text-blue-50 rounded-md flex items-center justify-center gap-2 whitespace-nowrap" on:click={share}>
            <Share/> Share with a friend
        </button>
    </div>
</div>
<footer class="fixed left-0 right-0 bottom-0 pb-4 flex justify-center gap-2 items-end">
    <CircularButton icon="return" color="gray" href="/" />
</footer>