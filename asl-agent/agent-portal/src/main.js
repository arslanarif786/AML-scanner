import {
  createApp
} from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import apiRequest from "./services/apiRequest";
import snackbar from "./services/snackbar";
import permissions from "./services/permissions";
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import {
  Quasar,
  Notify
} from "quasar";
import quasarUserOptions from "./quasar-user-options";


createApp(App)
  .use(Quasar, {
    ...quasarUserOptions,
    plugins: {
      Notify,
    },
  })
  .use(store)
  .use(router)
  .use(apiRequest)
  .use(snackbar)
  .use(permissions)
  .use(VueSweetalert2)
  .mount("#app");


