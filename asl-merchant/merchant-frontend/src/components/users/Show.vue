<template>
  <Modal :show="show" class="global-font-color" title="View Permissions" @closeModal="closeModal">
    <template v-slot:body class="global-font-color">
      <div class="row q-mb-md global-font-color">
        <div class="col-12"><b>Username: </b> {{ editUser.name }}</div>
        <div class="col-12"><b>Role: </b> {{ selectedUser.name }}</div>
      </div>
      <h6 class="global-font-color">Permissions Allowed</h6>
      <div class="row" v-if="fetchedPermissions.length">
        <div
          class="col-xs-12 col-sm-6 col-md-6 q-pr-md q-pt-md"
          v-for="(permission, index) in fetchedPermissions"
          :key="index"
        >
          <!-- <p class="q-mb-md text-bold">Permission Type</p> -->
          <p class="q-pa-none q-ma-none global-font-color">{{ permission.name }}</p>
        </div>
      </div>
      <div v-else>
        <p class="default-bg text-center">Loading...</p>
      </div>
    </template>
  </Modal>
</template>

<script>
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
