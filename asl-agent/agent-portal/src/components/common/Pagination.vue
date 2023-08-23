<template>
  <q-pagination
    v-model="currentPage"
    :max="totalPages ?? 1"
    :max-pages="4"
    direction-links
    flat
    id="custom-pagination"
    active-color="primary"
    color="#9B96A0"
    class="justify-end"
    size="11px"
    boundary-numbers
    @update:model-value="paginationRequest($event)"
  />
</template>

<script>
/**
 * Description : This componnet is used for pagination 
 * @props {Number} totalPages
 * This component generate an event to parent for next pagination request 
 */
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
