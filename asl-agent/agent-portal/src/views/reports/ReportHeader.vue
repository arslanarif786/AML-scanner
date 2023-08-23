<template>
  <div class="row">
    <div class="col-3">
      <router-link to="/reports" style="text-decoration: none; color: inherit">
        <q-btn
          icon="arrow_back"
          dense
          unelevated
          flat
          color="primary"
          no-caps
          class="q-mx-sm font-13px text-weight-bolder q-px-sm"
          label="Back to Report"
        />
      </router-link>
    </div>
    <div class="content-heading col-7">
      <h6 class="font-20px">
        <span v-if="route.params['id']">Edit Report</span
        ><span v-else>Add New Report</span>
      </h6>
      <small class="small-heading-text"
        >Please enter correct information of required fields</small
      >
    </div>
    <div class="col-2">
      <!-- button to add a subsection  -->
      <q-btn
        icon="add"
        dense
        unelevated
        flat
        color="primary"
        no-caps
        class="q-mx-sm font-13px text-weight-bolder q-px-sm bg-secondary"
        label="Add Sub-Section"
        @click="addSubsection(currentReport, tab)"
      />
    </div>
  </div>
</template>
<script>
import { ref } from "vue";
import { findNodeById, generateId } from "@/js/helpers/helpers";
import { useRoute } from "vue-router";
export default {
  props: {
    report: {
      type: Object,
      default: () => {},
    },
    tab: {
      type: String,
      default: "",
    },
  },
  watch: {
    report: {
      handler(val) {
        this.currentReport = val;
      },
      deep: true,
      immediate: true,
    },
  },
  setup() {
    return {
      currentReport: ref({}),
      route: useRoute(),
    };
  },
  methods: {
    /**
     * description: this function add a new field to the report, it checks if current section is parent section, it add field in parent array otherwise it adds field in sub section array.
     * @param {String} inputType
     * @param {integer} tab
     * @param {Object} report
     */
    addSubsection(report, sectionId) {
      if (sectionId != "bb5dc8842c") {
        let id = generateId();
        let indexes = findNodeById(
          report.report_sections,
          sectionId,
          "children"
        );
        console.log("sections", report.report_sections);
        console.log("section id", sectionId);
        console.log("indexs", indexes);

        let subsection = {
          id: id,
          name: "new sub-section",
          fields: [],
        };
        let sectionName = {
          id: id,
          label: "new sub-section",
        };
        this.currentReport.report_data[
          findNodeById(report.report_data, sectionId, "fields").parent
        ].fields.push(subsection);
        this.currentReport.report_sections[indexes.parent].children.push(
          sectionName
        );
      } else {
        this.warning("Sub-Section can not be append on Report Details Section");
      }

      // this.$emit('udpate:report',this.currentReport)`
    },
  },
};
</script>
