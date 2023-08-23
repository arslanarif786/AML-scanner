<template>
  <div>
    <section class="page-spacing">
      <ActionBar>
        <template v-slot:title>Roles and Permissions</template>
        <template v-slot:actions>
        
          <AddButton
            :label="'Create New Role'"
            @click="createModal = !createModal"
            v-if="hasPermission('add role')"
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
/**
 * Description : This component is used to show roles and permission
 * Api's are not called in this component to get roles and permissions 
 */
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
      checkbox: ref(false),
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
