<template>
  <Modal :show="show" title="View Permissions" @closeModal="closeModal">
    <template v-slot:body>
      <div class="row q-mb-md">
        <div class="col-12"><b>Username: </b> {{ editUser.name }}</div>
        <div class="col-12"><b>Role: </b> {{ selectedUser.name }}</div>
      </div>
      <h6>Permissions Allowed</h6>
      <div class="row" v-if="fetchedPermissions.length">
        <div
          class="col-xs-12 col-sm-6 col-md-6 q-pr-md q-pt-md"
          v-for="(permission, index) in fetchedPermissions"
          :key="index"
        >
          <p class="q-pa-none q-ma-none">{{ permission.name }}</p>
        </div>
      </div>
      <div v-else>
        <p class="text-grey-7 text-center">Loading...</p>
      </div>
    </template>
  </Modal>
</template>

<script>
/**
 * Description : This component is used to show user 
 * @props {Boolean} show
 * @props {Array} fetchedPermissions
 * @props {Object} editUser
 * @props {Object} selectedUser
 */
import Modal from "@/components/common/Modal.vue";

export default {
  props: {
    data: Object,
    show: {
      default: false,
      type: Boolean,
    },
    editUser: {
      // default: () => ({}),
      type: Object,
    },
    fetchedPermissions: {
      type: Array,
    },
    selectedUser: {
      type: Object,
    },
  },
  components: {
    Modal,
  },
  watch: {
    editUser() {
      return this.editUser;
    },
  },
  methods: {
    /**
     * Methos to close the modal
     */
    closeModal() {
      this.$emit("closeModal", "detail");
    },
  },
};
</script>

<style></style>
