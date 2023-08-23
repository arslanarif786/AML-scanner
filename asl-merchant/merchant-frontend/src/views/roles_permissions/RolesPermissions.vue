<template>
  <div>
    <section class="screen-bg roles-spacing global-font-color default-height">
      <ActionBar>
        <template v-slot:title
          ><span class="font-16px q-pl-sm"
            >Roles and Permissions</span
          ></template
        >
        <template v-slot:actions>
          <AddButton
            :label="'Create New Role'"
            v-if="hasPermission('add role')"
            @click="createModal = !createModal"
            class="q-mx-sm"
          ></AddButton>
        </template>
      </ActionBar>

      <div>
        <RolePermissionList
          @allPermissions="allPermissions($event)"
          :createdRole="createdRole"
        />
      </div>
    </section>

    <!-- Section for creating role -->
    <CreateRoleModal
      :emittedPermissions="emittedPermissions"
      :show="createModal"
      @closeModal="createModal = false"
      @addRole="addRole"
    />
  </div>
</template>

<script>
import ActionBar from "@/components/common/ActionBar.vue";
import AddButton from "@/components/common/AddButton.vue";
import RolePermissionList from "@/components/role_permission/RolePermissionList";
import CreateRoleModal from "@/components/role_permission/CreateRoleModal";
import { ref } from "@vue/reactivity";

export default {
  components: {
    ActionBar,
    AddButton,
    RolePermissionList,
    CreateRoleModal,
  },
  setup() {
    return {
      createModal: ref(false),
      emittedPermissions: ref([]),
      emittedRoles: ref([]),
      createdRole: ref({}),
    };
  },
  methods: {
    // Emitting all permissions from child component .i.e;RolePermissionList.vue
    allPermissions(e) {
        e.forEach((item) => {
          this.emittedPermissions.push(item.name);
        });
    },

    // Emitting newly added role from child component .i.e;CreateRoleModal.vue
    addRole(e) {
      this.createdRole = e;
    },
  },
};
</script>

<style></style>
