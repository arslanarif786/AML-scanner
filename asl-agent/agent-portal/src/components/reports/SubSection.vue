<template>
  <div class="font-15px text-weight-bold color-heading text-capitalize col-3">
    {{ subSection["name"] }}
  </div>
  <div :class="`col-8 row`">
    <div
      class="col-12 row q-py-sm"
      v-for="(field, index) in subSection['fields']"
      :key="index"
    >
      <ReportField :field="field" />
    </div>
  </div>
</template>

<script>
/**
 * Description : This component is use to sow sub sections in report
 * @props { object} subSection
 */
import ReportField from "./ReportField.vue";
export default {
  name: "ReportSubsection",
  components: {
    ReportField,
  },
  props: {
    subSection: {
      type: Object,
      default: () => ({}),
    },
  },
  setup() {},
};
</script>
