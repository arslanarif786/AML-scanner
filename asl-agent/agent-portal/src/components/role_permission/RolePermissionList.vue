<template>
  <div class="row items-start">
    <!-- Roles Side -->
    <div class="col-2">
      <span class="q-ml-lg text-weight-bold text-weight-xl">Roles</span>
      <q-list
        rounded
        dense
        style="width: 90%; margin: auto; margin-top: 10px; height: 10vh"
      >
        <q-scroll-area style="height: 70vh">
          <q-item
            v-for="(role, index) in roles.slice().reverse()"
            :key="index"
            clickable
            v-ripple
            :active="active === index"
            active-class="text-primary text-weight-bold selected-role"
          >
            <!-- getPermissions(role.perm), -->
            <q-item-section
              @click="setActiveRole(role, index), (selectedRole = role)"
            >
              <q-item-label
                >{{ role.name.substr(0, 15)
                }}{{ role.name.length > 15 ? ".." : "" }}</q-item-label
              >
            </q-item-section>
          </q-item>
        </q-scroll-area>
      </q-list>
    </div>
    <q-separator vertical />
    <!-- Permissions Side -->
    <div class="col">
      <span class="q-ml-lg text-weight-bold text-weight-xl">Permissions</span>
      <q-scroll-area style="height: 63vh">
        <div class="row q-ml-md q-mt-lg">
          <div
            class="q-pa-sm col-4"
            v-for="(permission, index) in permissions"
            :key="index"
          >
          <!-- :model-value="permission.name" -->
            <q-checkbox
              :false-value="null"
              :true-value="permission.name"
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
      </q-scroll-area>

      <!-- Section for Save button -->
      <div class="q-mt-md q-ml-lg">
        <q-btn
          v-if="hasPermission('edit role')"
          @click="updateRolePermission()"
          color="primary"
          id="update-role"
          style="width: 122px; height: 38px"
          label="Save"
          :loading="loading"
        />
      </div>
    </div>
  </div>
</template>

<script>
/**
 * Description : This component is used to show the list of roles and permissions
 * @props {Object} createRole
 */
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
      loading: ref(false),
      permissions: ref([]),
      selectedPermissions: ref([]),
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
     * Method to fetch Permissions
     */
    fetchPermissions() {
      this.apiRequest("agent/permissions", "agent", "GET")
        .then((res) => {
          this.permissions = res.data.data;
          this.$emit("allPermissions", this.permissions);
        })
        .catch((err) => {
          console.log(err.response);
        });
    },

    /**
     * Method to set selective role from the roles list
     * and to fetch all Permissions that are created for the platform
     */
    setActiveRole(role, index) {
      this.active = index;
      this.apiRequest("agent/permissions/" + role._id, "agent", "GET")
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
        "agent/role/store/" + this.selectedRole._id,
        "agent",
        "POST",
        {
          name: this.selectedRole.name,
          permissions: this.selectedPermissions,
        }
      )
        .then(() => {
          this.success("Role has been updated");
          this.loading = false;
        })
        .catch((err) => {
          console.log(err.response.data);
          this.loading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.selected-role {
  background-color: #f8f7f4;
  border-radius: 4px;
}
</style>
