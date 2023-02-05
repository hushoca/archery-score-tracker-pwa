<script lang="ts">
    import Check from "@icons/Check.svelte";
    import LineChart from "@icons/LineChart.svelte";
    import Play from "@icons/Play.svelte";
    import Plus from "@icons/Plus.svelte";
    import Return from "@icons/Return.svelte";
    import Settings from "@icons/Settings.svelte";
    import X from "@icons/X.svelte";

    const icons = {
        "plus": Plus,
        "settings": Settings,
        "lineChart": LineChart,
        "play": Play,
        "return": Return,
        "x": X,
        "check": Check
    }

    type Icon = keyof typeof icons;

    export let href : string | undefined = undefined;
    export let size : "md" | "lg" = "md";
    export let icon : Icon;
    export let color : "blue" | "yellow" | "gray" | "emerald" | "red" = "blue";
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<svelte:element this={href === undefined? "button" : "a"} class:w-20={size == "lg"} class:w-16={size == "md"} 
    class:text-4xl={size == "lg"} class:text-2xl={size == "md"}
    class:bg-blue-600={color == "blue"} class:text-blue-100={color == "blue"}
    class:bg-yellow-600={color == "yellow"} class:text-yellow-100={color == "yellow"}
    class:bg-gray-600={color == "gray"} class:text-gray-100={color == "gray"}
    class:bg-emerald-600={color == "emerald"} class:text-emerald-100={color == "emerald"}
    class:bg-red-600={color == "red"} class:text-red-100={color == "red"}
    class="rounded-full aspect-square shadow-lg flex items-center justify-center"
    on:click {href}>
    <svelte:component this={icons[icon]} />
</svelte:element>