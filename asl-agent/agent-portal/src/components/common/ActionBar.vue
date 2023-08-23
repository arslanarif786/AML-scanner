<template>
  <q-bar class="q-pt-xl q-pb-lg q-mb-md q-pl-lg default-bg" style="padding-right:5px">
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
export default {};
</script>

<style></style>
