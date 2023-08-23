<template>
  <q-btn
    flat
    class="bg-primary q-mr-md text-bold text-white"
    no-caps
    id="add-button"
  >
    <Plus :width="12" :color="'white'" class="q-mr-xs"></Plus>
    <span>{{ label }}</span>
  </q-btn>
</template>

<script>
/**
 * Description : This component is used to show an Add Button
 * @props {String} label
 */
import Plus from "../icons/PlusIcon.vue";
export default {
  components: {
    Plus,
  },
  props: {
    label: {
      default: "Add",
      type: String,
    },
  },
};
</script>

<style></style>
