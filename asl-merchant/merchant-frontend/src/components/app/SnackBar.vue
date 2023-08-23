<template>
  <div></div>
</template>

<script>
/**
 * Description:  snackbar designed according to application theme and called everytime using root emits
 * throughout the application.
 *
 * how to use: paste it to your component:
 * import EventBus from "@/js/helpers/EventBus.js";
 * EventBus.emit("show-notification-bar", {
                  type: positive / negatice / info / warning,
                            message: your message here,
                            });
 */
import { EventBus } from "@/js/helpers/EventBus.js";
import { useQuasar } from "quasar";
export default {
  name: "snackbar",
  setup() {
    const $q = useQuasar();
    return {
      showNotif(message, type) {
        $q.notify({
          message: message,
          color: type,
          position: "top-right",
          timeout: 2500,
          classes: "shadow-0",
        });
      },
    };
  },
  mounted() {
    EventBus.on("show-notification-bar", (data) => {
      this.showNotif(data.message, data.type);
    });
  },
};
</script>
