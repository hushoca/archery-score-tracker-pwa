<script lang="ts">
    import { goto } from "$app/navigation";
    import { activeSession } from "../../../stores/sessions";
    activeSession.set(null)
    goto("/")
</script>