<template>
  <q-spinner-dots
      v-if="loader"
      color="primary"
      size="50px"
      class="d-block q-mx-auto q-my-lg"
    />
  <div v-else class="q-pb-md q-pl-md q-pr-md">
    <q-table
      title=""
      :rows="rows"
      :columns="columns"
      row-key="name"
      :rows-per-page-options="[0]"
      :pagination="pagination"
      hide-bottom
      bordered
      class="no-shadow screen-bg"
      style="min-height: 80vh"
    >
      <!-- Roles Side -->
      <template v-slot:header>
        <div
          class="row justify-between font-13px"
          style="
            color: #9c9daf;
            border-bottom: 1px solid;
            border-color: inherit;
          "
        >
          <div class="row q-pl-sm">
            <q-item
              v-for="(role, index) in roles.slice().reverse()"
              :key="index"
              clickable
              v-ripple
              :active="active === index"
              active-class="text-primary text-weight-bold selected-role"
            >
              <q-item-section
                @click="setActiveRole(role, index), (selectedRole = role)"
              >
                <q-item-label>{{ role.name }}</q-item-label>
              </q-item-section>
            </q-item>
          </div>
          <div class="q-pr-md q-pt-sm q-pb-sm global-font-color">
            <q-checkbox
              v-model="permissionBtn"
              label="Select All Permissions"
              @click.prevent="selectAllPermissions"
              size="30px"
            />
          </div>
        </div>
      </template>

      <!-- Permissions Side  -->
      <template v-slot:body-cell>
        <div style="height: 30vh">
          <div class="row q-ml-md q-mt-lg global-font-color font-13px">
            <div
              class="q-pa-sm col-4"
              v-for="(permission, index) in permissions"
              :key="index"
            >
              <q-checkbox
                :false-value="null"
                size="35px"
                :true-value="permission.name"
                :model-value="permission.name"
                dense
                :label="permission.name"
                color="primary"
                class="q-mr-md"
                v-model="selectedPermissions"
                :val="permission.name"
                :disable="!hasPermission('edit role')"
              />
            </div>
          </div>
        </div>
      </template>

      <!-- Section for Save button -->
      <template v-slot:bottom-row>
        <div class="q-mt-lg q-ml-lg d-flex justify-end q-mb-xl q-mr-xl">
          <q-btn
            v-if="hasPermission('edit roles')"
            @click="updateRolePermission()"
            color="primary"
            id="update-role"
            style="width: 100px; height: 38px; border-radius: 8px"
            label="Save"
            no-caps
            unelevated
            :loading="loading"
          />
        </div>
      </template>
    </q-table>
  </div>
</template>

<script>
import { ref } from "@vue/reactivity";

export default {
  props: {
    createdRole: {
      default: () => ({}),
      type: Object,
    },
  },
  setup() {
    return {
      active: ref(),
      selectedRole: ref(""),
      roles: ref([]),
      loader: ref(false),
      loading: ref(false),
      permissions: ref([]),
      selectedPermissions: ref([]),
      permissionBtn: ref(false),
      columns: [
        {
          name: "role",
          align: "left",
          label: "Role",
          field: "role",
        },
      ],
      rows: [
        {
          name: "permission",
          align: "left",
          label: "Permission",
          field: "permission",
        },
      ],
      pagination: {
        page: 1,
        rowsPerPage: 0, // 0 means all rows
      },
    };
  },

  mounted() {
    this.fetchRoles();
    this.fetchPermissions();
  },

  watch: {
    createdRole() {
      return this.roles.push(this.createdRole);
    },
  },

  methods: {
    /**
     * Method to fetch roles of logged in user
     */
    fetchRoles() {
      this.loader = true;
      this.apiRequest("merchant/roles", "merchant", "GET")
        .then((res) => {
          this.roles = res.data.data.data;
          var roless = [];
          this.roles.forEach((item) => {
            roless.push(item.name);
          });

          localStorage.setItem("allRoles", JSON.stringify(roless));
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.loader = false;
        });
    },

    /**
     * This Method is used to fetch Permissions
     */
    fetchPermissions() {
      this.loader = true;
      this.apiRequest("merchant/permissions", "merchant", "GET")
        .then((res) => {
          this.permissions = res.data.data.data;
          this.$emit("allPermissions", this.permissions);
        })
        .catch((err) => {
          console.log(err.response);
        })
        .finally(() => {
          this.loader = false;
        });
    },

    /**
     * This method is used to set all permissions
     * from the permission list
     */
    selectAllPermissions() {
      this.selectedPermissions = this.permissionBtn
        ? this.permissions.map((e) => {
            return e.name;
          })
        : (this.selectedPermissions = []);
      this.$emit("allPermissions", this.permissions ? this.permissions : "");
    },

    /**
     * Method to set selective role from the roles list
     * and to fetch all Permissions that are created for the platform
     */
    setActiveRole(role, index) {
      this.active = index;
      this.apiRequest("merchant/permissions/" + role._id, "merchant", "GET")
        .then((res) => {
          this.selectedPermissions = res.data.data.map((item) => {
            return item.name;
          });
        })
        .catch((err) => {
          console.log(err.response.data);
        });
    },

    /**
     * This method will be used to update role name and permissions against specific role.
     * (We are not updating role name for now, this will be done in future)
     */
    updateRolePermission() {
      this.loading = true;
      this.apiRequest(
        "merchant/role/store/" + this.selectedRole._id,
        "merchant",
        "POST",
        {
          name: this.selectedRole.name,
          permissions: this.selectedPermissions,
        }
      )
        .then(() => {
          this.success("Role has been updated");
        })
        .catch((err) => {
          console.log(err.response.data);
        })
        .finally(() => {
          this.loading = false;
        })
    },
  },
};
</script>

<style lang="scss" scoped>
.selected-role {
  background-color: unset;
}
</style>
