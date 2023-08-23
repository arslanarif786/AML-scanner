<template>
  <section class="default-bg page-spacing">
    <ActionBar>
      <template v-slot:title>Crawler Statics</template>
    </ActionBar>
    <!-- widget of crawling Statics -->
    <Widget :resData="resData" />
    <q-table
      class="q-mx-lg no-shadow"
      title=""
      color="primary"
      :rows="rows"
      :columns="columns"
      :loading="loading"
      row-key="name"
      v-model:pagination="pagination"
      hide-bottom
      bordered
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
            <span class="font-13px text-weight-medium"
              ><b>{{ col.label }}</b></span
            >
          </q-th>
        </q-tr>
      </template>
      <template v-slot:body-cell="props">
        <q-td :props="props">
          <p class="text-grey-7">{{ props.value }}</p>
        </q-td>
      </template>

      <template v-slot:body-cell-origin="props">
        <q-td key="role" :props="props">
          <a target="_blank" class="text-grey-7" :href="props.row.origin"
            >{{ props.row.origin.substr(0, 100)
            }}{{ props.row.origin.length > 100 ? "..." : "" }}</a
          >
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
    <ViewMerchant
      :editUser="editedUser"
      :fetchedPermissions="fetchedPermissions"
      :show="detailsModal"
      :userType="`merchant`"
      @closeModal="closeModal"
      :selectedUser="selectedUser"
    ></ViewMerchant>
    <CreateMerchant
      :roles="roles"
      :show="createModal"
      :userType="`merchant`"
      @closeModal="closeModal"
    ></CreateMerchant>
    <EditMerchant
      :roles="roles"
      :editUser="editedUser"
      :show="editModal"
      :userType="`merchant`"
      @closeModal="closeModal"
      @updateUser="updateUser"
    ></EditMerchant>
  </section>
</template>
<script>
/**
 * Description: This component is used to get all merchant
 */
import { ref } from "@vue/reactivity";
import ActionBar from "../../components/common/ActionBar.vue";
import Pagination from "../../components/common/Pagination.vue";
import { EventBus } from "@/js/helpers/EventBus.js";
import Widget from "../../components/CrawlerStatics/Widgets.vue";

export default {
  name: "CrawlStatics",
  components: {
    Pagination,
    ActionBar,
    Widget,
  },

  setup() {
    return {
      rows: ref([]),
      loading: ref(false),
      request: ref({}),
      resData: ref([]),

      totalPages: ref(1),
      columns: [
        {
          name: "origin",
          required: true,
          label: "Source URLS",
          align: "left",
          field: (row) => row.origin,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: "array_count",
          align: "left",
          label: "Crawled Links",
          field: "array_count",
        },
      ],
      pagination: ref({
        sortBy: "desc",
        descending: false,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0,
      }),
    };
  },

  mounted() {
    this.handleRequest({ page: "1", rowsPerPage: "10" });
    // this event helps to fetch new record from server using page no
    EventBus.on("pagination-request", (pageNo) => {
      this.handleRequest(
        { page: pageNo, rowsPerPage: "10" },
        this.from,
        this.to,
        this.roleValue,
        this.search
      );
    });
  },
  methods: {
    /**
     * Method to fetch all records of crawling origin and its related url's count with pagination and also for pagination , we use this function
     * 1) if request successfull ,response will be print
     * 2) if request fail, error snakbar will be show
     * @param {object} request
     */
    handleRequest(request) {
      this.loading = true;
      this.request = request;
      this.apiRequest(
        `search/crawling-statistics?page=${request.page}&per_page=${request.rowsPerPage}`,
        "report",
        "GET"
      )
        .then((res) => {
          this.loading = false;
          this.resData = res.data.data.data[0];
          console.log(this.resData);
          this.rows = this.resData.statistics;
          this.totalPages = res.data.data.last_page;
          this.pagination["page"] = res.data.data.current_page;
          this.pagination["rowsPerPage"] = res.data.data.per_page;
          this.pagination["rowsNumber"] = res.data.data.total;
          this.pagination["startRecordNo"] = res.data.data.from;
          this.pagination["endRecordNo"] = res.data.data.to;
        })
        .catch((err) => {
          this.loading = false;
          console.log(err.response.data);
        });
    },
  },
};
</script>
<style scoped>
.widget-class {
  background-color: rgb(201, 201, 201);
  border-radius: 2px !important ;
}
.border-style {
  border-right: 4px solid white !important;
}
.bg-light-green {
  background-color: #edf5e847;
}
</style>
