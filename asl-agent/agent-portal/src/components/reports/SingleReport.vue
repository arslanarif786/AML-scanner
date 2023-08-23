<template>
  <q-card class="my-card report-card" flat>
    <q-img
      :src="report.report_thumbnail ? report.report_thumbnail : image"
      class="cursor-pointer"
      spinner-color="primary"
      spinner-size="30px"
      width="100"
      height="40"
      @click="router.push(`/report-detail/${report._id}`)"
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
          <q-list class="custom-action bg-white">
            <q-item clickable v-close-popup>
              <q-item-section
                @click="downloadFile(`search/pdf/${report._id}`)"
                id="download-file"
              >
                <q-item-label>Download PDF</q-item-label>
              </q-item-section>
            </q-item>
            <q-item
              v-if="hasPermission('edit report')"
              clickable
              v-close-popup
              @click="duplicateReport(report._id)"
            >
              <q-item-section id="duplicate-report">
                <q-item-label>Duplicate</q-item-label>
              </q-item-section>
            </q-item>
            <q-item
              v-if="hasPermission('edit report')"
              clickable
              v-close-popup
              @click="editFile(report._id)"
            >
              <q-item-section id="edit-report">
                <q-item-label>Edit Report</q-item-label>
              </q-item-section>
            </q-item>
            <q-item
              v-if="hasPermission('edit report')"
              clickable
              v-close-popup
              @click="warningAlert(report._id)"
            >
              <q-item-section id="delete-report">
                <q-item-label>Delete Report</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
      <div class="text-subtitle2 color-secondary font-12px q-px-sm">
        Created at: {{ createdAt }}
      </div>
      <div
        class="
          text-subtitle2
          color-secondary
          font-12px
          text-weight-regular
          q-px-sm
          d-flex
          print-report-category
        "
      >
        Category:
        <div v-for="(category, index) in report.categories" :key="index">
          <q-chip size="10px" v-if="index == '0'">{{ category.name ? category.name : category }}</q-chip>

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
      <div
        class="
          text-subtitle2
          color-secondary
          font-12px
          text-weight-regular
          q-px-sm
          d-flex
        "
      >
        Countries:
        <div v-for="(country,index) in report.countries" :key="country">
          <div v-if="country.short_code && index =='0'" :class="`flag flag-${country.short_code.toLowerCase()} q-ml-sm`">
            <q-tooltip>{{ country.name }}</q-tooltip>
          </div>
          <q-btn
            v-if="index == '1'"
            round
            size="9px"
            class="bg-grey q-ml-sm q-mb-sm"
            text-color="white"
            flat
          >
            <span
              ><span size="10px">+</span
              >{{ report.countries.length - 1 }}</span
            >
            <q-tooltip
              class="bg-secondary text-black shadow-4"
              :offset="[6, 6]"
            >
              <ItemList :items="report.countries" />
            </q-tooltip>
          </q-btn>
        </div>

      </div>
    </q-card-section>
  </q-card>
</template>

<script>
/**
 * Description : This component is a single report which contain all data about a report
 * this function is use to in listing all report with pagination
 * @props {Object} report
 */
import { useRouter } from "vue-router";
import {formatDate} from "@/js/helpers/helpers";
import Placeholder from "@/assets/reports/placeholder.jpeg";
// import PlusIcon from "./../icons/PlusIcon.vue";
import ItemList from "../common/ItemList.vue";
import { EventBus } from "@/js/helpers/EventBus.js";
export default {
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
    reportIndex:{
      type:Number,
    }
  },
  components: {
    // PlusIcon,
    ItemList,
  },
  computed: {
    createdAt() {
      return formatDate(this.report.created_at);
    },
  },
  setup() {
    return {
      image: Placeholder,
      router: useRouter(),
    };
  },
  methods: {
     /**
     * description: this function takes the country name and return country code
     * @param {String} countryCode
     * @param {array} countries
     */
    getCountryCode(countryName, countries) {
      return countries.filter((country) => country.name == countryName)[0]
        .short_code;
    },
    /**
     * description: processReportName is used to format name of report if it is greater than 20 chartacters.
     */
    processReportName(name) {
      return name && name.length > 20 ? name.substring(0, 20) + "..." : name;
    },
    /**
     * description: downloadFile is used to download the report in the pdf format.
     */
    downloadFile(url) {
      window.open(`${process.env.REPORT_BACKEND_URL}/${url}`, "_blank").focus();
    },

    /**
     * description: editFile is used to edit the report.
     * @param {string} id
     */
    editFile(id) {
      this.router.push(`/reports/${id}`);
    },

    /**
     * Desc: This function is used to dublicate specific report
     * @param {string} id
     */
    duplicateReport(id) {
      this.apiRequest(
        `search/reports/duplicate/${id}`,
        "report",
        "POST",
        {}
      ).then((res) => {
        EventBus.emit('duplicate-report',res.data.data)
        
      });
    },

    /**
     * description: warningAlert is used to show sweet alert message before calling delete api call.
     * @param {string} id
     */

    warningAlert(id) {
      this.$swal({
        title: `Are you sure ?`,
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        cancelButtonColor: "#bcb8b7",
        confirmButtonColor: "#5D5FEC",
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          this.deleteReport(id);
        }
      });
    },

    /**
     * description: deleteReport function is used to delete the report.
     * @param {string} id
     */

    deleteReport(id) {


      this.apiRequest(`search/reports/${id}`, "report", "Delete", {})
        .then((res) => {
          console.log(res);
          EventBus.emit('delete-report',this.reportIndex)
          this.success('Report has been deleted.');
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
.custom-action {
  height: auto !important;
}
#swal2-html-container {
  font-size: 14px !important;
}
</style>
