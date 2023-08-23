<template>
  <section class="default-bg page-spacing">
    <q-bar class="report-head q-mx-md">
      <div class="cursor-pointer non-selectable">
        <div class="text-h5">Activity Logs</div>
      </div>
      <q-space />
      <ClearFilters @clear-filters="clearFilters" />
      <Filter
        :label="activityTypeLabel"
        icon="person_3"
        :isCountry="false"
        :options="activityOptions"
        :allowSearch="false"
        optionValue="name"
        optionKey="_id"
        @filter-value="handleType"
      />
      <Filter
        label="Date Range"
        icon="date_range"
        :isDate="true"
        :isDateRange="true"
        @filter-value="handleDateRange"
      />
    </q-bar>
    <!-- table used to display activity logs -->
    <q-table
      title=""
      :loading="loading"
      :rows="rows"
      :columns="columns"
      color="primary"
      row-key="name"
      class="no-shadow q-mx-lg"
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
          <p class="text-grey-7">{{ props.value }}</p>
        </q-td>
      </template>

      <template v-slot:body-cell-type="props">
        <q-td :props="props">
          <div>
            <q-badge
              color="secondary"
              :label="props.value"
              text-color="primary"
              class="q-px-sm q-py-xs"
            />
          </div>
          <div class="my-table-details">
            {{ props.row.details }}
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
  </section>
</template>
<script>
/**
 * description: ActivityLog component is used to display activity logs.
 */
import { ref } from "vue";
import Filter from "@/components/common/Filter.vue";
import ClearFilters from "@/components/common/ClearFilters.vue";
import {formatDate} from "@/js/helpers/helpers";
import Pagination from "../../components/common/Pagination.vue";
import { EventBus } from "@/js/helpers/EventBus.js";
export default {
  name: "ActivityLog",
  components: {
    Filter,
    ClearFilters,
    Pagination,
  },
  /**
   * Description : computed propertyset value of activityType variable ,what type of activity is 
   */
  computed: {
    activityTypeLabel() {
      return this.activityType ? this.activityType : "Activity Type";
    },
  },
  setup() {
    return {
      loading: ref(false),
      activityType: ref(""),
      from: ref(""),
      to: ref(""),
      request: ref({}),
      totalPages: ref(),
      activityOptions: [
        { name: "Viewed", _id: "Viewed" },
        { name: "Created", _id: "Created" },
        { name: "Updated", _id: "Updated" },
        { name: "Deleted", _id: "Deleted" },
      ],
      columns: [
        {
          name: "by",
          required: true,
          label: "By",
          align: "left",
          field: (row) => (row.user ? row.user.email : "no email"),
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: "description",
          align: "left",
          label: "Description",
          field: "subject",
        },
        {
          name: "type",
          align: "left",
          label: "Type",
          field: "type",
        },
        {
          name: "createdate",
          align: "left",
          label: "Created At",
          field: (row) => formatDate(row.created_at),
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
     * description: handleCountry is used to handle the activity Type filter.
     * @param {String} value
     */
    handleType(value) {
      this.activityType = value;
      this.handleRequest(this.request, this.activityType, this.from, this.to);
    },
    /**
     * description: handleCountry is used to handle the date Range filter.
     * @param {String} value
     */
    handleDateRange(value) {
      this.from = value.from;
      this.to = value.to;
      this.handleRequest(this.request, this.activityType, this.from, this.to);
    },
    /**
     * description: handleRequest is used to handle request for activity logs.
     * @param {Object} request
     * @param {string} type
     * @param {string} from
     * @param {string} to
     */
    handleRequest(request, type, from, to) {
      this.loading = true;
      this.request = request;
      this.apiRequest(
        `agent/activity-log?page=${request.page}&per_page=${request.rowsPerPage}&type=${type}&start_date=${from}&end_date=${to}`,
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
     * description: this function helps to clear all the filters being used
     */
    clearFilters() {
      this.to = "";
      this.from = "";
      this.activityType = "";
      this.handleRequest(this.request, this.activityType, this.from, this.to);
    },
  },
  mounted() {
    this.handleRequest(
      { page: "1", rowsPerPage: "10" },
      this.activityType,
      this.from,
      this.to
    );
    /**
     * This event will be hit when pagination reuest will be call.
     */
    EventBus.on("pagination-request", (pageNo) => {
      this.handleRequest(
        { page: pageNo, rowsPerPage: "10" },
        this.activityType,
        this.from,
        this.to
      );
    });
  },
};
</script>
<style lang=""></style>
