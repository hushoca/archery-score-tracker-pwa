<script lang="ts">
    import { goto } from "$app/navigation";
    import { mobile } from "../../../stores/mobile";

    mobile.set(true);
    goto("/");
</script>