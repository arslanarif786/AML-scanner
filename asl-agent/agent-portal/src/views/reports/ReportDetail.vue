<template lang="">
<q-spinner-dots
          v-if="loader"
          color="primary"
          size="5em"
          class="save-loader"
/>
  <div style="padding: 16px 130px" v-else>
    <q-bar class="report-head">
      <div class="cursor-pointer non-selectable">
        <div class="text-h5">{{ report["report_name"] }}</div>
      </div>

      <q-space />
      <q-btn
        dense
        unelevated
        class="add-report text-white bg-primary"
        @click="downloadFile()"
      >
        <img src="@/assets/reports/download.svg" />
        <span class="text-white q-pl-sm">Download PDF</span>
      </q-btn>
    </q-bar>
    <div style="background-color: #f2f2f2; padding: 30px">
      <span class="text-primary d-block text-center q-mb-lg">{{
        reportHead
      }}</span>
      <div class="report-body q-py-md bg-white">
        <ReportMetaData
          :report="report"
          :image="report.report_thumbnail ? report.report_thumbnail : image"
        />
        <q-expansion-item
          :header-style="{ backgroundColor: '#F2F2F2' }"
          header-class="q-mr-sm"
          class="q-my-md"
          default-opened
          v-for="(section, index) in reportFilterData"
          :key="index"
        >
          <template v-slot:header>
            <q-item-section class="font-20px color-heading text-weight-bold">
              {{ section["name"] }}
            </q-item-section>
          </template>

          <q-card>
            <q-card-section>
              <div class="row">
                <div
                  class="col-12 row q-py-md"
                  :class="{
                    'border-bottom': index !== section['fields'].length - 1,
                  }"
                  v-for="(field, index) in section['fields']"
                  :key="field['name']"
                >
                  <SubSection :subSection="field" v-if="field.fields" />
                  <ReportField :field="field" v-else />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </div>
    </div>
  </div>
</template>
<script>
/**
 * Description : This component is used to see detail of a single report
 */
import { ref } from "vue";
import { useRoute } from "vue-router";
import ReportMetaData from "@/components/reports/ReportMetaData";
import ReportField from "@/components/reports/ReportField";
import SubSection from "@/components/reports/SubSection";
import Placeholder from "@/assets/reports/placeholder.jpeg";
export default {
  name: "ReportDetail",
  components: {
    ReportMetaData,
    ReportField,
    SubSection,
  },
  setup() {
    return {
      reportHead: "AML Scanner Online Service Scan Results Report",
      image: Placeholder,
      route: useRoute(),
      report: ref({}),
      reportFilterData:ref({}),
      loader:ref(false),
    };
  },
  methods: {
    /**
     * description: downloadFile is used to download the report in the pdf format.
     */
    downloadFile() {
      window
        .open(
          `${process.env.REPORT_BACKEND_URL}/search/pdf/${this.route.params["id"]}`,
          "_blank"
        )
        .focus();
    },
  },
  mounted() {
    this.loader=true;
    //get specific report from the backend
    this.apiRequest(
      `search/reports/${this.route.params["id"]}`,
      "report",
      "GET",
      {}
    ).then((res) => {
      this.loader=false;
      this.report = res.data.data;
      this.reportFilterData=this.report.report_data.filter((e)=>e.id!="bb5dc8842c")
     
    });
  },
};
</script>
<style scoped>
.save-loader{
  top: 50% !important;
  right: 50% !important;
  position: absolute !important;
}
</style>
