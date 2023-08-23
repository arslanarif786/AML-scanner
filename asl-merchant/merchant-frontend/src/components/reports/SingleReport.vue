<template>
  <q-card class="my-card report-card bg-white" flat>
    <q-img
      :src="report.report_thumbnail ? report.report_thumbnail : image"
      class="cursor-pointer"
      spinner-color="primary"
      spinner-size="30px"
      width="100"
      height="40"
      @click="router.push(`/merchant/search-detail/${report._id}`)"
    />
    <q-card-section class="q-pa-sm">
      <div
        class="q-mt-sm"
        style="display: flex; justify-content: space-between; height: 23px"
      >
        <p
          class="font-14px q-mb-none q-pl-sm text-weight-bold"
          style="color: #484848"
        >
          {{ processReportName(report.report_name) }}
          <q-tooltip>{{ report.report_name }}</q-tooltip>
        </p>
        <q-btn-dropdown
          dense
          unelevated
          flat
          icon="more_vert"
          class="action-report font-12px q-mr-xs"
        >
          <q-list class="bg-white">
            <q-item clickable v-close-popup>
              <q-item-section
                @click="downloadFile(`search/pdf/${report._id}`)"
                id="download-file"
              >
                <q-item-label>Download PDF</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
      <!-- created at field -->
      <div class="text-subtitle2 color-secondary font-12px q-px-sm">
        Created at: {{ createdAt }}
      </div>
      <!-- category field -->
      <div
        class="text-subtitle2 color-secondary font-12px text-weight-regular q-px-sm d-flex print-report-category"
      >
        Category:
        <div v-for="(category, index) in report.categories" :key="index">
          <q-chip size="10px" v-if="index == '0'">{{
            category.name ? category.name : category
          }}</q-chip>

          <q-btn
            v-if="index == '1'"
            round
            size="9px"
            class="bg-grey"
            text-color="white"
            flat
          >
            <span
              ><span size="10px">+</span
              >{{ report.categories.length - 1 }}</span
            >
            <q-tooltip
              class="bg-secondary text-black shadow-4"
              :offset="[6, 6]"
            >
              <ItemList :items="report.categories" />
            </q-tooltip>
          </q-btn>
        </div>
      </div>
      <!-- countries field -->
      <div
        class="text-subtitle2 color-secondary font-12px text-weight-regular q-px-sm d-flex"
      >
        Countries:
        <div v-for="(country, index) in report.countries" :key="index">
          <div :class="`flag flag-${(country.short_code? country.short_code.toLowerCase():'No Country')} q-ml-sm`">
            <q-tooltip>{{ country.name }}</q-tooltip>
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
/**
 * This component is a single report which contain all data about a report
 * this function is use to in listing all report with pagination
 * @props {Object} report
 */
import { useRouter } from "vue-router";
import helpers from "@/js/helpers/helpers";
import Placeholder from "@/assets/reports/placeholder.jpeg";
import ItemList from "../common/ItemList.vue";
export default {
  /**
   * This component recieves the props which contain all data about a report
   * @props {Object} report
   */
  props: {
    report: {
      type: Object,
      default: () => ({
        report_name: "",
        report_thumbnail: Placeholder,
        countries: [],
        categories: [],
        report_data: [],
      }),
    },
    reportIndex: {
      type: Number,
    },
  },
  components: {
    ItemList,
  },
  computed: {
    createdAt() {
      return helpers.formatDate(this.report.created_at);
    },
  },
  setup() {
    return {
      helpers: helpers,
      image: Placeholder,
      router: useRouter(),
    };
  },
  methods: {
    /**
     * this method is used to format name of report
     * if it is greater than 20 chartacters.
     */
    processReportName(name) {
      return name.length > 20 ? name.substring(0, 20) + "..." : name;
    },
    /**
     * this method is used to download the report
     * in the pdf format.
     */
    downloadFile(url) {
      console.log(url);
      this.apiRequest(`${url}`, "merchant", "get",{})
        .then(() => {
         window.open(`${process.env.REPORT_BACKEND_URL}/${url}`, "_blank").focus();
        })
           .catch((err) => {
          console.log(err.response);
        });
    },
  },
};
</script>
<style scoped>
.print-report-category {
  overflow: auto !important;
  cursor: pointer !important;
}
.q-btn .q-chip {
  margin: initial !important;
}
.my-card.report-card {
  height: 320px !important;
}
.q-img {
  height: 200px !important;
  background-repeat: no-repeat !important;
  background-position: center !important;
  background-size: contain !important;
}
#swal2-html-container {
  font-size: 14px !important;
}
</style>
