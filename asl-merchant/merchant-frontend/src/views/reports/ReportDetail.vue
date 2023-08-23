<template lang="">
  <q-spinner-dots
    v-if="loading"
    color="primary"
    size="50px"
    class="d-block q-mx-auto q-my-xl"
  />
  <div v-else class="screen-bg q-pt-lg">
    <q-bar
      class="q-bar row no-wrap q-bar--standard q-bar--light report-head"
      style="margin-top: -30px; padding: 35px 25px 0px 231px"
    >
      <div class="cursor-pointer non-selectable">
        <div class="text-h5 font-16px">{{ report["report_name"] }}</div>
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
    <div class="screen-bg" style="padding: 20px 17px 0 231px">
      <span class="text-primary d-block text-center q-mb-lg">{{
        reportHead
      }}</span>
      <div class="report-body q-py-md screen-bg">
        <ReportMetaData
          :report="report"
          :image="report.report_thumbnail ? report.report_thumbnail : image"
        />
        <q-expansion-item
          header-class="q-mr-sm"
          class="q-my-md"
          default-opened
          v-for="(section, index) in report.report_data"
          :key="index"
        >
          <template v-slot:header>
            <q-item-section class="font-16px color-heading text-weight-bold">
              {{ section["name"] }}
            </q-item-section>
          </template>

          <q-card class="screen-bg">
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
import { ref } from "vue";
import { useRoute } from "vue-router";
import ReportMetaData from "@/components/reports/ReportMetaData";
import ReportField from "@/components/reports/ReportField";
import SubSection from "@/components/reports/SubSection";
import Placeholder from "@/assets/reports/placeholder.jpeg";
/**
 * Description: This component is used to get all the details of search person
 * A detailed description along with all the biodata and other relevant information regarding him.
 */
export default {
  name: "ReportDetail",
  components: {
    ReportMetaData,
    ReportField,
    SubSection,
  },
  setup() {
    return {
      loading: ref(false),
      reportHead: "AML Scanner Online Service Scan Results Report",
      image: Placeholder,
      route: useRoute(),
      report: ref({}),
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
    this.loading = true;
    //get specific report from the backend
    this.apiRequest(
      `search/reports/${this.route.params["id"]}`,
      "report",
      "GET",
      {}
    )
      .then((res) => {
        this.report = res.data.data;
      })
      .finally(() => {
        this.loading = false;
      });
  },
};
</script>
<style lang=""></style>
