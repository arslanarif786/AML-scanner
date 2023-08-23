<template>
<div v-for="(item, index) in items" :key="index">
  <q-item dense v-if="index!='0'">
    <span >{{ item.name ? item.name :item }}</span>
  </q-item>
  </div>
</template>

<script>
/**
 * Description : This component is used to show items in a list
 * @props {Object} items
 */
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
