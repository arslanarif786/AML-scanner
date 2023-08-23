<template>
  <q-layout view="lHh LpR fFf">
    <Navbar v-if="!removeBar.includes(path)" />
    <SnackBar />
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import Navbar from "./components/app/Navbar.vue";
import SnackBar from "@/components/app/SnackBar.vue";
import { useRoute } from "vue-router";
import { computed } from "vue";
undefined;
export default {
  name: "LayoutDefault",

  components: {
    Navbar,
    SnackBar,
  },
  setup() {
    const route = useRoute();
    const path = computed(() => route.path);
    return {
      path: path,
      removeBar: [
        "/",
        "/forget-password",
        "/reset-password",
        "/first-login",
        "/verify-email",
        "/report/create",
      ],
    };
  },
};
</script>
