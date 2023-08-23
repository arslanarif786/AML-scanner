<template>
  <section class="screen-bg default-height all-users-spacing">
    <ActionBar>
      <template v-slot:title
        ><div class="q-pa-md global-font-color font-16px">All Users</div></template
      >

      <template v-slot:actions>
        <q-bar class="report-head">
          <AddButton
            :label="'Create New User'"
            @click="createModal = !createModal"
            v-if="hasPermission('add user')"
            class="q-ml-lg"
          ></AddButton>
        </q-bar>
      </template>
    </ActionBar>
    <q-table
      class="q-mx-lg no-shadow screen-bg"
      title=""
      color="primary"
      :rows="rows"
      :columns="columns"
      :loading="loading"
      row-key="name"
      bordered
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
            class="global-font-color"
          >
            <span class="font-13px text-bold">{{ col.label }}</span>
          </q-th>
        </q-tr>
      </template>
      <template v-slot:top-left>
        <ActionSearchBar
            placeholder="Search by User Name"
            :modelValue="search"
            @update:modelValue="handleSearch"
            class="search_border"
          ></ActionSearchBar>
      </template>
      <template v-slot:top-right>
        <ClearFilters @clear-filters="clearFilters" />
          <Filter
            :label="roleLabel"
            icon="person_outline"
            :isCountry="false"
            :options="roles"
            :allowSearch="false"
            optionValue="name"
            optionKey="_id"
            @filter-value="handleRole"
          />
          <Filter
            label="Select Date Range"
            icon="date_range"
            :isDate="true"
            :isDateRange="false"
            @filter-value="handleDateRange"
          />
      </template>
      <template v-slot:body-cell="props">
        <q-td :props="props">
          <p class="global-font-color">{{ props.value }}</p>
        </q-td>
      </template>

      <template v-slot:body-cell-role="props">
        <q-td key="role" :props="props">
          <p class="global-font-color">{{ props.row.role[0] ? props.row.role[0].name : ' '}}</p>
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
              class="global-font-color q-mr-sm"
            >
              <PencilAltIcon @click="editModal = !editModal"></PencilAltIcon>
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
              class="global-font-color q-mr-sm"
            >
              <EyeIcon @click="detailsModal = !detailsModal"></EyeIcon>
            </q-btn>
            
          </div>
        </q-td>
      </template>
    </q-table>
    <div
      class="screen-bg d-flex justify-between align-center q-ml-lg q-mr-lg q-pa-sm"
      style="margin-top: -2px"
    >
      <span class="color-secondary font-11px text-weight-medium"
        >Showing results
        <strong class="global-font-color">
          {{ pagination.startRecordNo }}-{{ pagination.endRecordNo }}
        </strong>
        from
        <strong class="global-font-color">{{ pagination.rowsNumber }}</strong></span
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
 * Description : This component is used to fetch all merchants 
 */
import { ref } from "@vue/reactivity";
import EyeIcon from "../../components/icons/EyeIcon.vue";
import PencilAltIcon from "../../components/icons/PencilAltIcon.vue";

import ActionBar from "../../components/common/ActionBar.vue";
import ViewMerchant from "../../components/users/Show.vue";
import CreateMerchant from "../../components/users/Create";
import EditMerchant from "../../components/users/Edit.vue";
import AddButton from "../../components/common/AddButton.vue";
import ActionSearchBar from "@/components/common/ActionSearchBar.vue";
import Filter from "@/components/common/Filter.vue";
import ClearFilters from "@/components/common/ClearFilters.vue";
import helpers from "@/js/helpers/helpers";
import Pagination from "../../components/common/Pagination.vue";
import { EventBus } from "@/js/helpers/EventBus.js";


export default {
  name: "All Users",
  components: {
    EyeIcon,
    PencilAltIcon,
    ViewMerchant,
    CreateMerchant,
    EditMerchant,
    ActionBar,
    AddButton,
    ActionSearchBar,
    Filter,
    ClearFilters,
    Pagination,

  },
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
      columns: [
        {
          name: "name",
          required: true,
          label: "Name",
          align: "left",
          field: (row) => row.name,
          format: (val) => `${val}`
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
          field: (row) => helpers.formatDate(row.created_at),
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
  beforeUnmount(){
    EventBus.off("pagination-request");
  },
  methods: {
    /**
     * !Note: This function will only be hit when admin login into the merchant account
     * @param {String} id
     */
    secretLogin(id) {
      window.open( `${process.env.MERCHANT_FRONTEND_URL}/?id=${id}&secret_login=true`,'_blank')
    },
    /**
     * Method to fetch roles of logged in user
     */
    fetchRoles() {
      this.apiRequest("merchant/roles", "merchant", "GET")
        .then((res) => {
          this.roles = res.data.data.data;
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
     * @param {Object} e This is $event when function has been called
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
     * @param {Object} row
     */
    fetchPermissions(row) {
      this.selectedUser = row.role[0];
      this.apiRequest(
        "merchant/permissions/" + row.role[0]._id,
        "merchant",
        "GET"
      )
        .then((res) => {
          this.fetchedPermissions = res.data.data;
        })
        .catch((err) => {
          console.log(err.response.data);
        });
    },
    /**
     * Method to handle start and end date from date range filter
     * @param {Object} value
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
     * @param {Object} e This is $event when function has been called
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
     * @param {Integer} value
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
     * Method to fetch all merchants with pagination and also for pagination , we use this function
     * 1) if request successfull ,response will be print 
     * 2) if request fail, error snakbar will be show 
     * @param {object} request
     * @param {String} from
     * @param {String} to
     * @param {Integer} role_id
     * @param {String} search
     */
    handleRequest(request, from, to, role_id, search) {
      this.loading = true;
      this.request = request;
      this.apiRequest(
        `merchant?page=${request.page}&per_page=${request.rowsPerPage}&start_date=${from}&end_date=${to}&role_id=${role_id}&search=${search}`,
        "merchant",
        "GET"
      )
        .then((res) => {
          this.loading = false;
          this.rows = res.data.data.data;
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
     * @param {String} type
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
     * this function takes the id of the role and returns the name of the role
     * @param {String} roleId
     * @param {array} roles
     */
    getRoleName(roleId, roles) {
      return roles.filter((role) => role._id == roleId)[0].name;
    },
    /**
     * this function helps to clear all the filters being used
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
