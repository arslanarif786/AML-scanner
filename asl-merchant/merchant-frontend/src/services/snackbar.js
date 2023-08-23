/**
 * Description: This file consists of snackbar plugins that can be used and we can reduce code duplicacy
 * @param {String} Message message to be shown in snackbar
 */
import {
    EventBus
} from "@/js/helpers/EventBus";
export default {
    install(app) {
        app.config.globalProperties.success = (message) => {
            EventBus.emit("show-notification-bar", {
                type: "positive",
                message: message,
            });
        };
        app.config.globalProperties.error = (message) => {
            EventBus.emit("show-notification-bar", {
                type: "negative",
                message: message,
            });
        };
        app.config.globalProperties.info = (message) => {
            EventBus.emit("show-notification-bar", {
                type: "info",
                message: message,
            });
        };
        app.config.globalProperties.warning = (message) => {
            EventBus.emit("show-notification-bar", {
                type: "warning",
                message: message,
                indeterminate: true,
            });
        };
    },
};