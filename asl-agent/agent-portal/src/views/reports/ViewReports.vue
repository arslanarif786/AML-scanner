<template>
  <div class="q-pa-md">
    <q-bar class="report-head">
      <div class="cursor-pointer non-selectable">
        <div class="text-h5">All Report</div>
      </div>

      <q-space />

      <!-- this code will be used in future  -->
      <!-- <Filter
        label="DOB"
        icon="show_chart"
        :isDate="true"
        @filter-value="handleDOB"
      /> -->
      <ClearFilters @clear-filters="clearFilters" />
      <!-- date range filter  -->
      <Filter
        label="Date Range"
        icon="date_range"
        :isDate="true"
        :isDateRange="true"
        @filter-value="handleDateRange"
      />

      <!-- country filter  -->
      <Filter
        :label="countryLabel"
        icon="public"
        :isCountry="true"
        :options="countryOptions"
        :allowSearch="true"
        optionValue="name"
        optionKey="short_code"
        @filter-value="handleCountry"
      />

      <!-- this code will be used in future  -->
      <ActionSearchBar
        placeholder="Search by Name"
        class="search_border"
        :modelValue="searchByName"
        @update:modelValue="handleSearch"
      ></ActionSearchBar>
      <router-link
        to="/report/create/new"
        style="text-decoration: none; color: inherit"
      >
        <q-btn
          v-if="hasPermission('add report')"
          dense
          unelevated
          icon="add"
          class="add-report text-white bg-primary"
          label="Add New Report"
        >
        </q-btn>
      </router-link>
    </q-bar>

    <q-spinner-dots
      color="primary"
      size="50px"
      class="d-block q-mx-auto q-my-lg"
      v-if="loading"
    />
    <NoDataFound
      v-else-if="!reports.length && !loading"
      title="No Reports Found"
      subtitle="It seems you don't have any data yet"
    />
    <div v-else class="q-pa-md q-ma-none row items-start q-gutter-md">
      <template v-for="(item, index) in reports" :key="item.report_name">
        <div class="col-md-2 col-sm-3 report-holder">
          <SingleReport :report="item" :reportIndex="index" />
        </div>
      </template>
    </div>

    <!-- modal used to create report  -->
    <ReportNameModal
      :show="showCreateReportModal"
      @closeModal="showCreateReportModal = false"
    />
    <div
      class="d-flex justify-between align-center q-ml-lg q-mr-lg q-pa-sm"
      style="background-color: white; margin-top: -2px"
    >
      <span class="color-secondary font-11px text-weight-medium"
        >Showing results
        <strong class="text-dark">
          {{ pagination.startRecordNo }}-{{ pagination.endRecordNo }}
        </strong>
        from
        <strong class="text-dark">{{ pagination.rowsNumber }}</strong></span
      >
      <!-- pgination button component -->
      <Pagination :totalPages="totalPages"></Pagination>
    </div>
  </div>
</template>
<script>
/**
 * Description : This component is used to see reports with pagination
 */
import { ref } from "vue";
import NoDataFound from "@/components/app/NoDataFound.vue";
import ReportNameModal from "@/components/reports/ReportNameModal.vue";
import ActionSearchBar from "../../components/common/ActionSearchBar.vue";
import Filter from "@/components/common/Filter.vue";
import ClearFilters from "@/components/common/ClearFilters.vue";
import SingleReport from "@/components/reports/SingleReport.vue";
import img from "@/assets/reports/Activity.svg";
import Pagination from "../../components/common/Pagination.vue";

import { EventBus } from "@/js/helpers/EventBus.js";
export default {
  name: "Report",
  components: {
    ActionSearchBar,
    SingleReport,
    ReportNameModal,
    NoDataFound,
    Filter,
    ClearFilters,
    Pagination,
  },
  /**
   * Description : computed is used to get country label
   */
  computed: {
    countryLabel() {
      return this.countryValue
        ? this.getCountryName(this.countryValue, this.countryOptions)
        : "Select Country";
    },
  },
  setup() {
    return {
      loading: ref(false),
      totalPages: ref(1),
      pagination: ref({
        sortBy: "desc",
        descending: false,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0,
      }),
      from: ref(""),
      to: ref(""),
      searchByName: ref(""),
      request: ref({}),
      currentPage: ref(1),
      lastPage: ref(0),
      totalReports: ref(0),
      perPage: ref(10),
      showCreateReportModal: ref(false),
      countryValue: ref(""),
      countryOptions: ref([]),
      reports: ref([]),
      dob: ref({
        image_path: img,
        name: "DOB",
      }),
      dateRange: ref({
        image_path: img,
        name: "Date Range",
      }),
    };
  },
  methods: {
    /**
     * description: this function helps to manage search by name
     * @param {String} value
     */
    handleSearch(value) {
      this.searchByName = value;
      this.handleRequest(
        this.request,
        this.countryValue,
        this.from,
        this.to,
        this.searchByName
      );
    },

    /**
     * description: this function helps to manage date of birth filter
     * @param {String} value
     */
    handleDOB(value) {
      console.log("DOB filter", value);
    },

    /**
     * description: handlePageChange is used to handle the page change.
     * @param {number} page
     */
    handlePageChange(page) {
      this.currentPage = page;
      this.handleRequest(
        { page: page, rowsPerPage: this.perPage },
        this.countryValue,
        this.from,
        this.to,
        this.searchByName
      );
    },
    /**
     * description: handleDateRange is used to handle the date range filter.
     * @param {String} value
     */
    handleDateRange(value) {
      this.from = value.from;
      this.to = value.to;
      this.handleRequest(
        this.request,
        this.countryValue,
        this.from,
        this.to,
        this.searchByName
      );
    },
    /**
     * description: handleCountry is used to handle the country filter.
     * @param {String} value
     */
    handleCountry(value) {
      this.countryValue = value;
      this.handleRequest(
        this.request,
        this.countryValue,
        this.from,
        this.to,
        this.searchByName
      );
    },

    /**
     * description: getAllCountries is used to get all countries from database.
     * @param {String} value
     */
    getAllCountries() {
      this.apiRequest(`agent/countries`, "agent", "GET", {}).then((res) => {
        this.countryOptions = res.data.data;
      });
    },

    /**
     * description: this function takes the short codeof the country and returns the name of the country
     * @param {String} countryCode
     * @param {array} countries
     */
    getCountryName(countryCode, countries) {
      return countries.filter((country) => country.short_code == countryCode)[0]
        .name;
    },

    /**
     * description: handleRequest is used to handle the request to view reports from the database.
     * @param {Object} request
     * @param {String} countryValue
     * @param {String} from
     * @param {String} to
     *
     */
    handleRequest(request, country, from, to, name) {
      this.loading = true;
      this.request = request;
      this.apiRequest(
        `search/reports?user_data=${localStorage.getItem("user")}&page=${
          request.page
        }&per_page=${
          request.rowsPerPage
        }&countries[0]=${country}&start_date=${from}&end_date=${to}&name=${name}`,
        "report",
        "GET",
        {}
      )
        .then((res) => {
          this.totalPages = res.data.data.last_page;
          this.pagination["page"] = res.data.data.current_page;
          this.pagination["rowsPerPage"] = res.data.data.per_page;
          this.pagination["rowsNumber"] = res.data.data.total;
          this.pagination["startRecordNo"] = res.data.data.from;
          this.pagination["endRecordNo"] = res.data.data.to;
          this.currentPage = res.data.data.current_page;
          this.perPage = res.data.data.per_page;
          this.reports = res.data.data.data;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    /**
     * description: this function helps to clear all the filters being used
     */
    clearFilters() {
      this.searchByName = "";
      this.to = "";
      this.from = "";
      this.countryValue = "";
      this.handleRequest(
        this.request,
        this.countryValue,
        this.from,
        this.to,
        this.searchByName
      );
    },
  },
  mounted() {
    /**
     * This method call when component mounted
     * *info: Page No by default is 1
     */
    this.handleRequest(
      { page: this.currentPage, rowsPerPage: this.perPage },
      this.countryValue,
      this.from,
      this.to,
      this.searchByName
    );
    this.getAllCountries();

    EventBus.on("delete-report", (index) => {
      this.reports.splice(index, 1);
    });

    /**
     * this event is used to duplicate a report
     */
    EventBus.on("duplicate-report", (data) => {
      this.reports.unshift(data);
      this.success('Report has been duplicated successfully');
    });

    // this event helps to fetch new record from server using page no
    EventBus.on("pagination-request", (pageNo) => {
      this.handleRequest(
        { page: pageNo, rowsPerPage: this.perPage },
        this.countryValue,
        this.from,
        this.to,
        this.searchByName
      );
    });
  },
};
</script>
<style lang="scss">
.report-holder {
  margin-left: 20px !important;
  margin-right: 20px !important;
}
</style>
