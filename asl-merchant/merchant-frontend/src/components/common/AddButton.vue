<template>
  <q-btn flat class="bg-secondary-light text-bold global-font-color" no-caps id="add-button">
    <q-icon name="person_add_alt" class="q-pr-sm"/>
    <span>{{ label }}</span>
  </q-btn>
</template>

<script>
export default {
  props: {
    label: {
      default: "Add",
      type: String,
    },
  },
};
</script>

<style></style>
