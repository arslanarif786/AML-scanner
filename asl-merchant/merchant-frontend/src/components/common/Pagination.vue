<template>
  <q-pagination
    v-model="currentPage"
    :max="totalPages ?? 1"
    :max-pages="4"
    direction-links
    flat
    id="custom-pagination"
    active-color="global-font-color"
    color="global-font-color"
    class="justify-end global-font-color"
    size="11px"
    boundary-numbers
    @update:model-value="paginationRequest($event)"
  />
</template>

<script>
import { ref } from "@vue/reactivity";
import { EventBus } from "@/js/helpers/EventBus.js";
export default {
  name: "Pagination",
  props: ["totalPages"],
  setup() {
    return {
      currentPage: ref(1),
    };
  },
  mounted() {},
  methods: {
    paginationRequest(page) {
      EventBus.emit("pagination-request", page);
      this.currentPage = page;
    },
  },
};
</script>
