<template>
  <q-btn
    flat
    class="color-secondary font-12px"
    no-caps
    @click="clearFilters"
    id="clear-filters"
  >
    <q-icon size="15px" name="close" class="q-mx-sm"></q-icon>
    Clear Filters
  </q-btn>
</template>

<script>
/**
 * Description: This componnet is used to clear alll filter
 * This compnent generate an event which is listen by parent componnet
 */
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
