<template>
  <q-btn flat class="color-secondary font-12px" no-caps @click="clearFilters" id="clear-filters">
    <q-icon size="15px" name="close" class="q-mx-sm"></q-icon>
    Clear Filter
  </q-btn>
</template>

<script>
export default {
  setup() {},
  methods: {
    /**
     * description: this method emits event clear-filters which a parent component can listen to and clear filters
     */
    clearFilters() {
      this.$emit("clear-filters");
    },
  },
};
</script>
