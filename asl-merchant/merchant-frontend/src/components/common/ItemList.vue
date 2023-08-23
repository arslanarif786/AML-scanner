<template>
  <q-item dense v-for="(item, index) in items" :key="index">
    <span>{{ item.name ? item.name : item }}</span>
  </q-item>
</template>

<script>
export default {
  components: {},
  props: {
    items: {
      type: Object,
    },
  },
};
</script>

<style></style>
