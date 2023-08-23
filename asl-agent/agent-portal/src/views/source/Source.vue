<template>
  <section class="default-bg page-spacing">
    <ActionBar>
      <template v-slot:title>All Sources</template>
      <template v-slot:actions>
        <span class="q-mr-sm">
          <ClearFilters @clear-filters="clearFilters" />
          <!-- country filter  -->
          <Filter
            :label="countryLabel"
            icon="public"
            :isCountry="true"
            :options="countryOptions"
            :allowSearch="true"
            optionValue="name"
            optionKey="name"
            @filter-value="handleCountry"
          />
          <!-- category filter  -->
          <Filter
            :label="categoryLabel"
            icon="apps"
            optionValue="name"
            optionKey="name"
            :options="categoryOptions"
            @filter-value="handleCategory"
          />
          <!-- this code will be used in future  -->
          <!-- <q-btn flat class="text-primary" no-caps>
          <ShareIcon class="text-primary q-mr-xs"></ShareIcon>
          <span class="text-primary">Export To CSV</span>
        </q-btn> -->

          <q-btn
            flat
            class="bg-white q-mr-md text-bold"
            no-caps
            @click="(crawlUpdate = true), (isDefault = true)"
          >
            <span class="text-primary">Schedule Crawler</span>
          </q-btn>
          <q-btn
            flat
            class="bg-white q-mr-md text-bold"
            no-caps
            @click="uploadModal = true"
          >
            <UploadIcon class="text-primary q-mr-xs"></UploadIcon>
            <span class="text-primary">Upload CSV</span>
          </q-btn>

          <AddButton
            v-if="hasPermission('add source')"
            :label="'Add Source'"
            @click="createModal = true"
          >
          </AddButton>
        </span>
      </template>
    </ActionBar>
    <q-table
      title=""
      :rows="rows"
      :columns="columns"
      :loading="loading"
      row-key="name"
      class="no-shadow q-mx-lg"
      color="primary"
      v-model:pagination="pagination"
      hide-bottom
    >
      <template v-slot:no-data="{}">
        <div class="full-width row flex-center q-gutter-sm">
          <span> No Data Found ! </span>
        </div>
      </template>

      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
            class="text-weight-medium"
          >
            <span class="font-13px text-weight-medium">{{ col.label }}</span>
          </q-th>
        </q-tr>
      </template>
      <template v-slot:body-cell="props">
        <q-td :props="props">
          <p class="text-grey-7 q-ma-none">{{ props.value }}</p>
        </q-td>
      </template>
      <template v-slot:body-cell-country="props">
        <q-td :props="props" class="text-grey-7">
          <span class="text-grey-7">
            <div
              :class="`flag flag-${findShortCode(props.row.country)} q-mr-sm`"
            ></div>
            {{ props.row.country }}</span
          >
        </q-td>
      </template>
      <template v-slot:body-cell-details="props">
        <q-td :props="props">
          <div>
            <q-btn
              v-if="hasPermission('edit source')"
              round
              flat
              id="edit-source"
              :size="'xs'"
              @click="editSource(props)"
              class="bg-grey-2 q-mr-sm"
            >
              <PencilAltIcon></PencilAltIcon>
            </q-btn>
            <!-- /**
              This code will be used in near future to create or edit crawl scheduling
             */ -->

            <q-btn
              icon="access_time"
              round
              flat
              color="primary"
              no-caps
              dense
              id=""
              @click="UpdateSourceCrawl(props)"
              class="font-12px"
            />
            <!-- <q-btn
              icon="website"
              round
              flat
              color="grey"
              no-caps
              dense
              id=""
              @click="viewSourceCrawlDetail()"
              class="font-12px"
            /> -->
          </div>
        </q-td>
      </template>
    </q-table>
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

    <!-- modal used to create new source or edit the existing source -->
    <CreateorUpdateSource
      :show="createModal"
      @editSource="updateSource($event)"
      @closeModal="closeModal"
      :source="currentSource"
      :isEdit="isEditSource"
      :modelHeight="450"
    ></CreateorUpdateSource>
    <!-- modal used to create or edit the source crawl scheduling -->
    <UpdateCrawl
      :show="crawlUpdate"
      @editSource="updateSource($event)"
      @closeModal="closeModal"
      :sourceId="crawlSourceId"
      :modelHeight="450"
      :isDefault="isDefault"
    ></UpdateCrawl>

    <!-- modal used to see the source crawl scheduling details -->
    <SourceCrawlDetail
      :show="seeCrawlDetail"
      @closeModal="closeModal"
      :modelHeight="450"
    ></SourceCrawlDetail>

    <!-- modal used to upload csv file  -->
    <UploadSource :show="uploadModal" @closeModal="closeModal" />
  </section>
</template>
<script>
/**
 * Description : This component is to show all sources data
 */
import { ref } from "@vue/reactivity";
import Filter from "@/components/common/Filter.vue";
import ClearFilters from "@/components/common/ClearFilters.vue";
import UploadSource from "@/components/source/UploadSource.vue";
// import EyeIcon from "../../components/icons/EyeIcon.vue";
import PencilAltIcon from "../../components/icons/PencilAltIcon.vue";
import ActionBar from "../../components/common/ActionBar.vue";
import CreateorUpdateSource from "../../components/source/CreateorUpdateSource.vue";
import UpdateCrawl from "../../components/source/UpdateCrawl.vue";
import SourceCrawlDetail from "../../components/source/SourceCrawlDetail.vue";
import AddButton from "../../components/common/AddButton.vue";
import UploadIcon from "../../components/icons/UploadIcon.vue";
import Pagination from "../../components/common/Pagination.vue";
import { EventBus } from "@/js/helpers/EventBus.js";

export default {
  name: "Source",
  components: {
    // EyeIcon,
    PencilAltIcon,
    CreateorUpdateSource,
    UpdateCrawl,
    ActionBar,
    AddButton,
    UploadIcon,
    Pagination,
    SourceCrawlDetail,
    Filter,
    UploadSource,
    ClearFilters,
  },
  setup() {
    return {
      request: ref({}),
      currentPage: ref(1),
      totalPages: ref(1),
      currentSource: ref({}),
      isEditSource: ref(false),
      isDefault: ref(false),
      crawlUpdate: ref(false),
      seeCrawlDetail: ref(false),
      loading: ref(false),
      detailsModal: ref(false),
      createModal: ref(false),
      uploadModal: ref(false),
      countryValue: ref(""),
      categoryValue: ref(""),
      countryOptions: ref([]),
      categoryOptions: ref([]),
      crawlSourceId: ref(""),
      columns: [
        {
          name: "name",
          required: true,
          label: "Name",
          align: "left",
          field: (row) => row.name,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: "type",
          align: "left",
          label: "Type",
          field: "type",
          sortable: true,
        },
        {
          name: "category",
          align: "left",
          label: "Category",
          field: "category",
        },
        {
          name: "country",
          align: "left",
          label: "Country",
          field: "country",
          sortable: false,
        },

        {
          name: "frequency",
          align: "left",
          label: "Frequency",
          field: "frequency",
          sortable: true,
          sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
        },
        {
          name: "total_entities",
          align: "center",
          label: "Total Entities",
          field: "total_entities",
          sortable: true,
          sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
        },
        {
          name: "details",
          align: "center",
          label: "Details",
          field: "detials",
          sortable: true,
          sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
        },
      ],
      rows: ref([]),
      pagination: ref({
        sortBy: "desc",
        descending: false,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0,
      }),
    };
  },
  /**
   * Description : computed property is used to set country and category value
   */
  computed: {
    countryLabel() {
      return this.countryValue ? this.countryValue : "Select Country";
    },
    categoryLabel() {
      return this.categoryValue ? this.categoryValue : "Select Category";
    },
  },
  methods: {
    /**
     * description: this methods takes the country name and returns the shortcode of the country
     */
    findShortCode(country) {
      if (country)
        return this.countryOptions
          .find((c) => c.name.toLowerCase() === country.toLowerCase())
          ?.short_code.toLowerCase();
    },
    /**
     * description: handleCountry is used to handle the country filter.
     * @param {String} value
     */
    handleCountry(value) {
      this.countryValue = value;
      this.handleRequest(this.request, this.countryValue, this.categoryValue);
    },

    /**
     * description: handleCategory is used to handle the category filter.
     * @param {String} value
     */
    handleCategory(value) {
      this.categoryValue = value;
      this.handleRequest(this.request, this.countryValue, this.categoryValue);
    },

    /**
     * description: handleRequest is used to handle the request to view sources from the database.
     * @param {Object} request
     * @param {String} country
     * @param {String} category
     */
    handleRequest(request, country, category) {
      this.request = request;
      this.loading = true;
      this.apiRequest(
        `agent/sources?page=${request.page}&per_page=${request.rowsPerPage}&country=${country}&category=${category}`,
        "agent",
        "GET",
        {}
      )
        .then((res) => {
          this.rows = res.data.data.data;
          this.totalPages = res.data.data.last_page;
          this.pagination["page"] = res.data.data.current_page;
          this.pagination["rowsPerPage"] = res.data.data.per_page;
          this.pagination["rowsNumber"] = res.data.data.total;
          this.pagination["startRecordNo"] = res.data.data.from;
          this.pagination["endRecordNo"] = res.data.data.to;
        })
        .finally(() => {
          this.loading = false;
        });
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
     * description: getAllCategories is used to get all categories from database.
     * @param {String} value
     */
    getAllCategories() {
      this.apiRequest(`agent/categories`, "agent", "GET", {}).then((res) => {
        this.categoryOptions = res.data.data;
      });
    },

    /**
     * description: this methods is used to close the create modal.
     * @param {object} type
     */
    closeModal(type) {
      var types = {
        detail: () => {
          this.detailsModal = false;
        },
        create: () => {
          this.createModal = false;
          this.crawlUpdate = false;
          this.seeCrawlDetail = false;
          this.isDefault = false;
          this.isEditSource = false;
        },
        upload: () => {
          this.uploadModal = false;
        },
      };
      return types[type]();
    },

    /**
     * description: this methods is used open dialog to edit a specific source.
     * @param {Object} source
     */
    editSource(source) {
      this.isEditSource = true;
      this.currentSource = { row: source.row, index: source.rowIndex };
      this.createModal = true;
    },

    /**
     * description: this methods is used open dialog to edit or creat source scheduling for crawling.
     * @param {Object} source
     */
    UpdateSourceCrawl(source) {
      this.crawlUpdate = true;
      this.crawlSourceId = source.row._id;
    },
    /**
     * description: this methods is used open dialog to see details of source scheduling .
     */
    viewSourceCrawlDetail() {
      this.seeCrawlDetail = true;
    },

    /**
     * description: this methods is used to update the value of updated source in the table
     * @param {Object} e
     * @returns {array} this.rows
     */
    updateSource(e) {
      if (e.index > 9) {
        e.index = e.index - 10;
      }

      e.field["_id"] = this.rows[e.index]._id;
      this.rows[e.index] = e.field;
    },
    /**
     * description: this methods is used to filter a specific source to remove unnecessary columns.
     * @param {Object} source
     */
    filterSource(source) {
      let array = Object.entries(source);
      let filtered = array.filter(
        ([key]) =>
          key != "_id" &&
          key != "created_at" &&
          key != "updated_at" &&
          !key.includes("/api")
      );
      return Object.fromEntries(filtered);
    },

    /**
     * description: this function helps to clear all the filters being used
     */
    clearFilters() {
      this.countryValue = "";
      this.categoryValue = "";
      this.handleRequest(this.request, this.countryValue, this.categoryValue);
    },
  },
  mounted() {
    this.handleRequest(
      { page: "1", rowsPerPage: "10" },
      this.countryValue,
      this.categoryValue
    );
    this.getAllCategories();
    this.getAllCountries();

    // this event helps to fetch new record from server using page no
    EventBus.on("pagination-request", (pageNo) => {
      this.handleRequest(
        { page: pageNo, rowsPerPage: "10" },
        this.countryValue,
        this.categoryValue
      );
    });
    EventBus.on("createSource", (res) => {
      this.rows.splice(0, 0, res);
    });
  },
};
</script>
