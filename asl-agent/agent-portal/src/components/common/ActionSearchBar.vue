<template>
  <q-input
    type="text"
    class="q-py-sm font-13px q-mx-sm action-search-bar"
    outlined
    dense
    debounce="500"
    :placeholder="placeholder"
    id="action-search-bar"
    :model-value="modelValue"
    @update:model-value="updateValue"
  />
</template>

<script>
/**
 * Description : This component is used to search something,
 * This component contain a input which is used to search 
 * This componnet generate an event when some one write something in search field 
 * @props {String} placeholder
 * @props {String} modelValue
 */
export default {
  props: {
    placeholder: {
      default: "Search",
      type: String,
    },
    modelValue: {
      default: "",
      type: String,
    },
  },

  methods: {
    /**
     * description: this method emits an event to update the search value
     * @param {String} event
     */
    updateValue(event) {
      this.$emit("update:modelValue", event);
    },
  },
};
</script>

<style lang="scss">
.action-search-bar .q-field__control {
  height: 30px !important;
}
</style>
>
