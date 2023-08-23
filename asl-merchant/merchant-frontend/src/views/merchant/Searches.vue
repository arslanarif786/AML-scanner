<template>
  <section class="screen-bg default-height layout-padding q-pt-sm">
    <!-- <div class="text-h5 text-bold q-pa-lg font-20px global-font-color">All Searches</div> -->
    <!-- table used to display search history -->
    <q-table title="" :loading="loading" :rows="rows" :columns="columns" color="primary" row-key="name"
      class="no-shadow q-mx-lg er screen-bg q-mt-lg" bordered v-model:pagination="pagination" hide-bottom>
      <template v-slot:no-data="{}">
        <div class="full-width row flex-center q-gutter-sm">
          <span> No Data Found ! </span>
        </div>
      </template>
      <template v-slot:top-left>
        <div class="text-bold global-font-color font-16px">
          All Searches
        </div>
      </template>
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th v-for="col in props.cols" :key="col.name" :props="props" class="global-font-color">
            <span class="font-13px text-bold">{{ col.label }}</span>
          </q-th>
        </q-tr>
      </template>

      <template v-slot:body-cell="props">
        <q-td :props="props">
          <p class=" global-font-color">{{ props.value }}</p>
        </q-td>
      </template>

      <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <div>
            <q-btn round id="view-user" flat :size="'xs'" @click="
              closeModal(),
              (editedUser = props.row)
            " class=" global-font-color">
              <EyeIcon @click="detailsModal = !detailsModal"></EyeIcon>
            </q-btn>
          </div>
        </q-td>
      </template>

    </q-table>
    <div class="d-flex justify-between align-center q-ml-lg q-mr-lg q-pa-sm screen-bg"
      style="margin-top:-2px;">
      <span class="text-grey-7 font-11px text-weight-medium">Showing results
        <strong class="global-font-color">
          {{ pagination.startRecordNo }}-{{ pagination.endRecordNo }}
        </strong>
        from
        <strong class="global-font-color">{{ pagination.rowsNumber }}</strong></span>
      <!-- pagination button component -->
      <Pagination :totalPages="totalPages"></Pagination>
    </div>

    <ViewSource :editUser="editedUser" :fetchedPermissions="fetchedPermissions" :show="detailsModal"
      @closeModal="closeModal" :selectedUser="selectedUser"></ViewSource>
  </section>
</template>


<script>
/**
  * Description: This component is used to display search history in Merchant Portal
  * it gives the complete history of the specified user
  */
import { ref } from "vue";
import EyeIcon from "../../components/icons/EyeIcon.vue";
import ViewSource from "../../components/users/Show.vue";
import Pagination from "../../components/common/Pagination.vue";
import { EventBus } from "@/js/helpers/EventBus.js";
export default {
  name: "Searches",
  components: {
    Pagination,
    EyeIcon,
    ViewSource
  },
  /**
    * This computed property is used to store activityType of search history in Merchant Portal
    */
  computed: {
    activityTypeLabel() {
      return this.activityType ? this.activityType : "Activity Type";
    },
  },
  setup() {
    return {
      loading: ref(false),
      request: ref({}),
      totalPages: ref(),
      detailsModal: ref(false),
      editedUser: ref({}),
      fetchedPermissions: ref([]),
      selectedUser: ref({}),
      user: ref(JSON.parse(localStorage.getItem("user"))),
      columns: [
        {
          name: "date",
          required: true,
          label: "Date",
          align: "left",
          field: (row) => (row.created_at.substr(0, 10)),
          format: (val) => `${val}`
        },
        {
          name: "time",
          align: "left",
          label: "Time",
          field: (row) => (row.created_at.substr(11, 8))
        },
        {
          name: "keywordresults",
          align: "center",
          label: "keyword",
          field: (row) => (row.keyword ? row.keyword : "Randal Townsend"),
        },
        {
          name: "ip",
          align: "center",
          label: "IP",
          field: (row) => (row.ip ? row.ip : "---------")
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
  methods: {
    /**
     * this method is used to handle request for search history.
     * @param {Object} request
     */
    handleRequest(request, type, from, to) {
      this.loading = true;
      this.request = request;
      this.apiRequest(
        `search/searches?page=${request.page}&per_page=${request.rowsPerPage}&user_id=${this.user._id}&type=${type}&from=${from}&to=${to}`,
        "report",
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
    * Method to close modal on the base of condition
    */
    closeModal(type) {
      switch (type) {
        case "detail":
          this.detailsModal = false;
          break;
      }
    }
  },
  /**
    * when this component is rendered, all the details of search history has shown
    */
  mounted() {
    this.handleRequest(
      { page: "1", rowsPerPage: "10" },
      this.activityType,
      this.from,
      this.to
    );
    EventBus.on("pagination-request", (pageNo) => {
      this.handleRequest(
        { page: pageNo, rowsPerPage: "10" },
        this.activityType,
        this.from,
        this.to
      );
    });
  },
  beforeUnmount(){
    EventBus.off("pagination-request");
  }
};
</script>


<style lang=""></style>