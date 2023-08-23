<template>
  <section class="screen-bg x-padding default-height q-pt-sm">
    <div class="row justify-between q-pa-sm q-mt-md q-ml-md">
      <!-- component title -->
      <div>
        <span
          class="aml-search-heading text-weight-bold font-19px global-font-color"
        >
          Quick Search By Name </span
        ><br />

        <br />
      </div>
    </div>

    <div class="screen-bg q-mt-sm q-pb-sm">
      <div class="row items-center q-pt-md q-ml-xl">
        <!-- name field -->
        <div class="col-10 q-pr-sm q-pl-md">
          <q-input
            color="primary"
            id="txtSearch"
            onkeydown="if(event.keyCode == 13)
              document.getElementById('btnSearch').click()"
            outlined
            v-model="name"
            :dense="true"
            placeholder="Type Name here"
            :rules="[
              (val) => !!val || 'Required',
              (val) => val.length >= 3 || 'Name minimum 3 characters',
            ]"
          />
          <!-- Filter Button -->
        </div>

        <!-- scanAML request button -->
        <div class="col-2 item-spacing q-pl-sm">
          <q-icon
            :name="showFilter ? 'close' : 'list'"
            color="#484964"
            class="cursor-pointer rounded-borders"
            style="border: 1px solid #dcdfe8; padding: 7px 15px !important"
            :ripple="false"
            size="25px"
            @click="showFilters"
          />
          <q-btn
            class="bg-primary font-13px text-white q-py-sm q-ml-md"
            :loading="loading"
            unelevated
            no-caps
            @click="
              scanAML(
                request,
                name,
                birth,
                reportCountry,
                reportCategory,
                entityType,
                fuzziness
              )
            "
            id="btnSearch"
            :disabled="name.length < 3"
            label="Scan AML"
          />
        </div>
        <div class="col-12 col-sm-12">
          <QuickSearchFilter
            :showFilter="showFilter"
            v-model:birth="birth"
            v-model:reportCountry="reportCountry"
            v-model:entityType="entityType"
            v-model:fuzziness="fuzziness"
            v-model:reportCategory="reportCategory"
            @clear-filters="clearFilters"
          />
        </div>
      </div>

      <!-- no data found loader component -->
      <q-spinner-dots
        color="primary"
        size="50px"
        class="d-block q-mx-auto q-my-lg"
        v-if="loading"
      />
      <!-- No data found component -->
      <NoDataFound
        v-else-if="!reports.length && !loading"
        title="No Reports Found"
        subtitle="It seems you don't have any data yet"
      />
      <div v-else class="q-pa-md q-ml-sm row items-start justify-start q-gutter-md">
        <template
          v-for="item in reports"
          :key="item.report_name ? item.report_name : item.origin"
        >
          <!-- single url component -->
          <div
            class="col-md-2 col-sm-3 report-holder"
            v-if="item.origin"
            style="margin-right: 75px"
          >
            <SingleUrl :url="item" :reportCountry="allCountries" />
          </div>
          <!-- single report component -->
          <div
            class="col-md-2 col-sm-3 report-holder"
            v-else
            style="margin-right: 75px"
          >
            <SingleReport :report="item" />
          </div>
        </template>
      </div>

      <!-- pagination component -->
      <div
        class="screen-bg d-flex justify-between align-center q-mx-xl q-mt-md"
      >
        <span class="color-secondary font-11px text-weight-medium"
          >Showing results
          <strong class="global-font-color">
            {{ pagination.startRecordNo }}-{{ pagination.endRecordNo }}
          </strong>
          from
          <strong class="global-font-color">{{
            pagination.totalReports
          }}</strong></span
        >
        <!-- pagination button component -->
        <Pagination :totalPages="pagination.lastPage"></Pagination>
      </div>
    </div>
  </section>
</template>
<script>
import { ref } from "@vue/reactivity";
import NoDataFound from "@/components/app/NoDataFound.vue";
import SingleReport from "@/components/reports/SingleReport.vue";
import SingleUrl from "@/components/reports/SingleUrl.vue";
import QuickSearchFilter from "./QuickSearchFilter.vue";
//import helpers from "@/js/helpers/helpers";
import Pagination from "../../components/common/Pagination.vue";
import { EventBus } from "@/js/helpers/EventBus.js";
/**
 * This component is used to search a person in Merchant Portal
 * user can search through multiple filters..
 * it also gives the cards of searched persons
 */
export default {
  name: "Quick Search",
  components: {
    NoDataFound,
    SingleReport,
    SingleUrl,
    QuickSearchFilter,
    Pagination,
  },
  setup() {
    return {
      showFilter: ref(false),
      loading: ref(false),
      from: ref(""),
      to: ref(""),
      request: ref({}),
      page: ref(1),
      lastPage: ref(0),
      perPage: ref(12),
      birth: ref(""),
      entityType: ref(""),
      name: ref(""),
      fuzziness: ref(100),
      reportCategory: ref([]),
      reportCountry: ref([]),
      reports: ref([]),
      countryValue: ref(""),
      countryOptions: ref([]),
      allCountries: ref([]),
      pagination: ref({
        sortBy: "desc",
        descending: false,
        page: 1,
        perPage: 12,
        totalReports: 0,
        totalPage: 1,
        lastPage: 1,
        startRecordNo: 1,
        endRecordNo: 10,
      }),
    };
  },
  /**
   *  This Property is used to computed countryLabel and their values.
   */
  computed: {
    countryLabel() {
      return this.countryValue
        ? this.getCountryName(this.countryValue, this.countryOptions)
        : "Select Country";
    },
  },
  methods: {
    /**
     * This Method clears all the value fields
     * that we use for quick search
     */
    showFilters() {
      this.showFilter == false
        ? (this.showFilter = true)
        : (this.showFilter = false);
    },

    /**
     * This Method clears all the value fields
     * that we use for quick search
     */
    clearFilters() {
      this.name = "";
      this.birth = "";
      this.reportCountry = "";
      this.reportCategory = "";
      this.entityType = "";
      this.fuzziness = "";
      this.showFilter = false;
    },

    /**
     * This Method is used to handle the request to view reports from the database.
     * on click event, arguments are passed
     * if name is not selected, error massage will return
     * In case of valid credentials, reports have been shown, and a success message is return
     *
     * @param Request $request
     * @return object
     */
    scanAML(
      request,
      name,
      birth,
      countries,
      categories,
      entityType,
      fuzziness
    ) {
      this.showFilter = false;
      this.loading = true;
      this.request = request;

      this.apiRequest(
        `search/report?page=${request.page ? request.page : 1}`,
        "search",
        "POST",
        this.prepareQueryFields(
          name,
          birth,
          countries,
          categories,
          entityType,
          fuzziness
        )
      )
        .then((res) => {
          this.pagination["page"] = res.data.data.current_page;
          this.pagination["perPage"] = res.data.data.per_page;
          this.pagination["lastPage"] = res.data.data.last_page;
          this.pagination["totalReports"] = res.data.data.total;
          this.pagination["startRecordNo"] = res.data.data.from;
          this.pagination["endRecordNo"] = res.data.data.to;
          this.reports = res.data.data.data
            ? res.data.data.data
            : res.data.data;
        })
        .catch((err) => {
          console.log(err);
          this.loading = false;
        })
        .finally(() => {
          this.loading = false;
        });
    },

    /**
     * This Method is used to prepare array for countries
     * @param {Object} values
     * @return object
     */
    prepareCountriesArray(values) {
      return values.map((v) => v.short_code);
    },

    /**
     * This Method is used to prepare Object to be sent to query fields
     * @param {Object} queryFieldValues
     * @return object
     */
    prepareQueryFields(
      name,
      birth,
      countries,
      categories,
      entityType,
      fuzziness
    ) {
      return {
        name: name.trim(),
        ...(birth
          ? { birth_incorporation_date: birth.replaceAll("/", "-") }
          : {}),
        ...(countries.length
          ? { countries: this.prepareCountriesArray(countries) }
          : {}),

        ...(categories.length ? { categories: categories } : {}),

        ...(entityType ? { entity_type: entityType } : {}),
        fuzziness: fuzziness,
        per_page: 12,
      };
    },

    /**
     * This method lets you help get the token for the search api to be used to get reports in quick search.
     * @param {Object} secrets
     */
    getApiToken(request) {
      this.apiRequest("get-access-token", "report", "POST", request).then(
        (res) => {
          localStorage.setItem("search_token", res.data.data.token);
        }
      );
    },
  },

  mounted() {
    this.getApiToken({
      client_key: "abcd12345678",
      client_secret: "abcdefghijklmnopqrstuvwxy12345678",
    });
    // this event helps to fetch new record from server using page no

    // Event Bus ON
    EventBus.on("pagination-request", (pageNo) => {
      this.scanAML(
        { page: pageNo, perPage: "12" },
        this.name,
        this.birth,
        this.reportCountry,
        this.reportCategory,
        this.entityType,
        this.fuzziness
      );
    });

    EventBus.on("report-country", (allCountries) => {
      this.allCountries = allCountries;
    });
  },

  // global Event Bus must be off
  beforeUnmount() {
    EventBus.off("pagination-request");
    EventBus.off("report-country");
  },
};
</script>


<style scoped>
.report-holder {
  margin-left: 20px !important;
  margin-right: 23px !important;
}
</style>