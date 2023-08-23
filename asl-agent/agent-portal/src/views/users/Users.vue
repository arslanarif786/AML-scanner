<template>
  <section class="default-bg page-spacing">
    <ActionBar>
      <template v-slot:title>All Users</template>

      <template v-slot:actions>
        <q-bar class="report-head">
          <ClearFilters @clear-filters="clearFilters" />
          <Filter
            :label="roleLabel"
            icon="person_3"
            :isCountry="false"
            :options="roles"
            :allowSearch="false"
            optionValue="name"
            optionKey="_id"
            @filter-value="handleRole"
          />
          <Filter
            label="Date Range"
            icon="date_range"
            :isDate="true"
            :isDateRange="true"
            @filter-value="handleDateRange"
          />

          <ActionSearchBar
            placeholder="Search by Name/Email"
            :modelValue="search"
            @update:modelValue="handleSearch"
            class="search_border"
          ></ActionSearchBar>
          <AddButton
            :label="'Create User'"
            @click="createModal = !createModal"
            v-if="hasPermission('add user')"
          ></AddButton>
        </q-bar>
      </template>
    </ActionBar>
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

      <template v-slot:body-cell-role="props">
        <q-td key="role" :props="props">
          <p class="text-grey-7">{{ props.row.role[0].name }}</p>
        </q-td>
      </template>
      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <div>
            <q-badge
              :class="`status-${props.row.status.toLowerCase()}`"
              :label="props.row.status.toLowerCase()"
              text-color="primary"
              class="q-px-sm q-py-xs font-9px"
            />
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <div>
            <q-btn
              v-if="hasPermission('edit user')"
              round
              id="edit-user"
              flat
              :size="'xs'"
              @click="closeModal(), (editedUser = props.row)"
              class="bg-grey-2 q-mr-sm"
            >
              <PencilAltIcon @click="editModal = !editModal"></PencilAltIcon>
              <q-tooltip>Edit Role</q-tooltip>
            </q-btn>
            <q-btn
              round
              id="view-user"
              flat
              :size="'xs'"
              @click="
                closeModal(),
                  (editedUser = props.row),
                  fetchPermissions(props.row)
              "
              class="bg-grey-2"
            >
              <EyeIcon @click="detailsModal = !detailsModal"></EyeIcon>
              <q-tooltip>View Details</q-tooltip>
            </q-btn>
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
    <ViewUser
      :editUser="editedUser"
      :fetchedPermissions="fetchedPermissions"
      :show="detailsModal"
      @closeModal="closeModal"
      :selectedUser="selectedUser"
    ></ViewUser>
    <CreateUser
      :roles="roles"
      :show="createModal"
      @closeModal="closeModal"
    ></CreateUser>
    <EditUser
      :roles="roles"
      :editUser="editedUser"
      :show="editModal"
      @closeModal="closeModal"
      @updateUser="updateUser"
    ></EditUser>
  </section>
</template>
<script>
/**
 * Description : This componnet is used to get all users
 */
import { ref } from "@vue/reactivity";
import EyeIcon from "../../components/icons/EyeIcon.vue";
import PencilAltIcon from "../../components/icons/PencilAltIcon.vue";
import ActionBar from "../../components/common/ActionBar.vue";
import ViewUser from "../../components/users/Show.vue";
import CreateUser from "../../components/users/Create";
import EditUser from "../../components/users/Edit.vue";
import AddButton from "../../components/common/AddButton.vue";
import ActionSearchBar from "@/components/common/ActionSearchBar.vue";
import Filter from "@/components/common/Filter.vue";
import ClearFilters from "@/components/common/ClearFilters.vue";
import { formatDate } from "@/js/helpers/helpers";
import Pagination from "../../components/common/Pagination.vue";
import { EventBus } from "@/js/helpers/EventBus.js";

export default {
  name: "Source",
  components: {
    EyeIcon,
    PencilAltIcon,
    ViewUser,
    CreateUser,
    EditUser,
    ActionBar,
    AddButton,
    ActionSearchBar,
    Filter,
    ClearFilters,
    Pagination,
  },
  /**
   * Description : computed function is used to get roles name by their ids
   */
  computed: {
    roleLabel() {
      return this.roleValue
        ? this.getRoleName(this.roleValue, this.roles)
        : "Select Role";
    },
  },
  setup() {
    return {
      detailsModal: ref(false),
      createModal: ref(false),
      editModal: ref(false),
      search: ref(""),
      editedUser: ref({}),
      rows: ref([]),
      loading: ref(false),
      roles: ref([]),
      request: ref({}),
      from: ref(""),
      to: ref(""),
      fetchedPermissions: ref([]),
      selectedUser: ref({}),
      roleValue: ref(""),
      totalPages: ref(0),
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
          name: "email",
          align: "left",
          label: "Email",
          field: "email",
        },
        {
          name: "role",
          align: "left",
          label: "Role",
          field: "role",
        },
        {
          name: "created_at",
          align: "left",
          label: "Created At",
          field: (row) => formatDate(row.created_at),
        },
        {
          name: "status",
          align: "left",
          label: "Status",
          field: "status",
        },
        {
          name: "action",
          align: "center",
          label: "Action",
          field: "action",
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
    this.fetchRoles();
    this.handleRequest(
      { page: "1", rowsPerPage: "10" },
      this.from,
      this.to,
      this.roleValue,
      this.search
    );
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

    EventBus.on("status-change", (obj) => {
      this.rows.map((ele) => {
        if (ele._id == obj.id) {
          ele.status = obj.status.toLowerCase();
        }
      });
    });
  },
  methods: {
    /**
     * Method to fetch roles of logged in user
     */
    fetchRoles() {
      this.apiRequest("agent/roles", "agent", "GET")
        .then((res) => {
          this.roles = res.data.data;
          var roles = [];
          this.roles.forEach((item) => {
            roles.push(item.name);
          });
          localStorage.setItem("allRoles", JSON.stringify(roles));
        })
        .catch((err) => {
          console.log(err.response);
        });
    },

    /**
     * Updating users in table, need to be fixed
     */
    updateUser(e) {
      this.rows.map((object) => {
        if (e.id == object._id) {
          object.name = e.name;
          object.email = e.email;
          object._id = e.id;
          object.role[0].name = e.role;
        }
      });
    },
    /**
     * Method to fetch permissions against role
     */
    fetchPermissions(row) {
      this.selectedUser = row.role[0];
      this.apiRequest("agent/permissions/" + row.role[0]._id, "agent", "GET")
        .then((res) => {
          this.fetchedPermissions = res.data.data;
        })
        .catch((err) => {
          console.log(err.response.data);
        });
    },
    /**
     * Method to handle start and end date from date range filter
     */
    handleDateRange(value) {
      this.from = value.from;
      this.to = value.to;
      this.handleRequest(
        this.request,
        this.from,
        this.to,
        this.roleValue,
        this.search
      );
    },
    /**
     * Method to handle users filtered by search bar i.e; name, email
     */
    handleSearch(e) {
      this.search = e;
      this.handleRequest(
        this.request,
        this.from,
        this.to,
        this.roleValue,
        this.search
      );
    },

    /**
     * Method to handle users filtered by role
     */
    handleRole(value) {
      this.roleValue = value;
      this.handleRequest(
        this.request,
        this.from,
        this.to,
        this.roleValue,
        this.search
      );
    },
    /**
     * Method to fetch all users
     */
    handleRequest(request, from, to, role_id, search) {
      this.loading = true;
      this.request = request;
      this.apiRequest(
        `agent?page=${request.page}&per_page=${request.rowsPerPage}&start_date=${from}&end_date=${to}&role_id=${role_id}&search=${search}`,
        "agent",
        "GET"
      )
        .then((res) => {
          this.loading = false;
          this.rows = res.data.data.data;
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
    /**
     * Method to close modal on the base of condition
     */
    closeModal(type) {
      switch (type) {
        case "detail":
          this.detailsModal = false;
          break;
        case "create":
          this.createModal = false;
          break;
        case "edit":
          this.editModal = false;
          break;
      }
    },

    /**
     * description: this function takes the id of the role and returns the name of the role
     * @param {String} roleId
     * @param {array} roles
     */
    getRoleName(roleId, roles) {
      return roles.filter((role) => role._id == roleId)[0].name;
    },
    /**
     * description: this function helps to clear all the filters being used
     */
    clearFilters() {
      this.roleValue = "";
      this.to = "";
      this.from = "";
      this.search = "";
      this.handleRequest(
        this.request,
        this.from,
        this.to,
        this.roleValue,
        this.search
      );
    },
  },
};
</script>
