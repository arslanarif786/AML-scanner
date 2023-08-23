<template>
<div class="d-flex">
  <SearchIcon class="q-mt-sm"/>
  <q-input
    type="text"
    class="font-13px q-mx-sm action-search-bar"
    borderless
    dense
    debounce="500"
    :placeholder="placeholder"
    id="action-search-bar"
    :model-value="modelValue"
    @update:model-value="updateValue"
  />
</div>
</template>

<script>
import SearchIcon from "../icons/SearchIcon.vue"
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
  components:{
    SearchIcon
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
  position: inherit !important;
}
</style>
>
