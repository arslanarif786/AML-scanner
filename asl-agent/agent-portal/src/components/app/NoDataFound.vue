<template>
  <div class="d-flex justify-center align-center" style="min-height: 65vh">
    <div>
      <img
        :src="url"
        class="d-block q-mx-auto"
        style="height: 116px; width: 100px;"
      />
      <span
        class="d-block text-center font-18px text-weight-bold lh-20 q-my-md"
        >{{ title }}</span
      >
      <span class="d-block text-center color-secondary font-13px lh-20">{{
        subtitle
      }}</span>
    </div>
  </div>
</template>

<script>
/**
 * this component is used to render when no data is found
 */
import NotFound from "@/assets/no_data_found/NoDataFoundBlue.svg";
export default {
  props: {
    url: {
      type: String,
      default: NotFound,
    },
    title: {
      type: String,
      default: "No Data Found",
    },
    subtitle: {
      type: String,
      default: "It seems you don't have any data yet",
    },
  },
  setup() {
    return {};
  },
};
</script>
