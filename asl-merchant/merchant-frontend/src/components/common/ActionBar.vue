<template>
  <q-bar class="q-pt-lg q-pb-lg q-mb-sm screen-bg">
    <div class="font-20px text-weight-bold lh-24">
      <slot name="title"></slot>
    </div>
    <q-space />
    <div>
      <slot name="actions"></slot>
    </div>
  </q-bar>
</template>

<script>
export default {
    
};
</script>

<style></style>
