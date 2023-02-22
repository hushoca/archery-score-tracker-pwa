<script lang="ts">
    import "../../app.css";
    import qrCode from "../../qr-code.svg"
	import { crossfade, fade } from 'svelte/transition';
    import { flip } from "svelte/animate";

    const [send, receive] = crossfade({
		duration: d => Math.sqrt(d * 200),

		fallback(node, params) {
			const style = getComputedStyle(node);
			const transform = style.transform === 'none' ? '' : style.transform;

			return {
				duration: 300,
				css: t => `
					transform: ${transform} scale(${t});
					opacity: ${t}
				`
			};
		}
	});

    const originalPics = [
        "./screenshots/ss8.png",
        "./screenshots/ss3.png",
        "./screenshots/ss1.png",
        "./screenshots/ss6.png",
        "./screenshots/ss2.png",
        "./screenshots/ss4.png",
        "./screenshots/ss5.png",
    ]

    let pictures = [...originalPics];
    let activePicture : string | null = null;
    
    function changePic(pic : string | null) {
        pictures = originalPics.filter(p => p !== pic);
        activePicture = pic;
    }

</script>

<main class="bg-gradient-to-b from-slate-200 to-slate-300 min-h-screen">
    <div class="pt-10 flex flex-col items-center gap-5 w-2/3 mx-auto">
        <header class="flex flex-col items-center justify-center">
            <img src="./favicon.png" class="w-20" alt="Banner" />
            <h1 class="text-2xl">Score Tracking App</h1>
        </header>
        <div class="text-center">
            Despite the abundance of archery score tracking applications available on the market, none have met my specific requirements. Consequently, I developed an application that offers features such as score and time tracking, graph generation, and the option to export scores as CSV files. To install this app on your phone, please revisit this address on your phone and click on the installation prompt that appears on page load.
        </div>
        <div class="flex items-center justify-center gap-2 p-4 px-8">
            {#each pictures as pic (pic)}
                <button on:click={() => changePic(pic)} in:receive="{{key: pic}}" out:send="{{key: pic}}" animate:flip>
                    <img src={pic} alt="Screenshot" loading="lazy" class="drop-shadow-lg rounded-md border-white">
                </button>
            {/each}
        </div>
        {#if activePicture}
            <button class="flex flex-col absolute inset-0 bg-opacity-30 bg-black items-center justify-center p-5 gap-5 cursor-pointer w-full" on:click={() => changePic(null)}>
                <img src={activePicture} alt="Screenshot" loading="lazy" class="drop-shadow-lg rounded-md h-full relative" in:receive="{{key: activePicture}}" out:send="{{key: activePicture}}">
            </button>
        {/if}
        <div class="flex flex-col items-center justify-center gap-2">
            <span class="text-sm">Scan barcode below to open this site on your phone</span>
            <img src={qrCode} alt="Website Address QR" class="w-48" />
        </div>
    </div>
</main>