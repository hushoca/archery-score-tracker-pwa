<script lang="ts">
    import { goto } from "$app/navigation";
    import { completeSession } from "../../../stores/sessions";
    completeSession();
    goto("/")
</script>