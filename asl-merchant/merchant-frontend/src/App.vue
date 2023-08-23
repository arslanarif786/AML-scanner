<template>
  <q-layout view="lHh LpR fFf">
    <!-- Sidebar component is running in merchant portal -->
    <Sidebar v-if="$route.path.includes('/merchant')" />

    <SnackBar />
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import SnackBar from "@/components/app/SnackBar.vue";
import Sidebar from "@/components/app/Sidebar.vue";

undefined;
export default {
  name: "LayoutDefault",

  components: {
    Sidebar,
    SnackBar
  },

};
</script>