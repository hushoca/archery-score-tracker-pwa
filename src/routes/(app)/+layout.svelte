<script lang="ts">
    import "../../app.css";
    import qrCode from "../../qr-code.svg"
    import { mobile } from "@stores/mobile";
</script>

<svelte:head>
    <title>Archery Score Tracker</title>
</svelte:head>

<main class="text-blue-900 bg-gradient-to-b from-blue-100 min-h-screen to-blue-300 overflow-auto">
    {#if $mobile}
        <slot />
    {:else}
        <div class="flex flex-col items-center p-4 gap-4 text-center">
            <div class="text-2xl">
                This website is intended to be used from a mobile device.<br/>
                Scan the barcode below to open it on your phone.<br/>
                Then go into the options on your browser and click install.
            </div>
            <img src={qrCode} alt="Website Address QR" class="w-96" />
            <div class="italic">
                If you are viewing this from a phone, please click 
                <a class="font-bold" href="/ignore-desktop-warning">here</a> to disable this warning and continue to the site.
            </div>
        </div>
    {/if}
</main>