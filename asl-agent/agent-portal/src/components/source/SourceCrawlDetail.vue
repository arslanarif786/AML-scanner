<template>
  <div>
    <Modal
      :show="show"
      @closeModal="closeModal"
      :title="isEdit ? 'Source Scheduling Detail' : 'Source Scheduling Detail'"
    >
    </Modal>
  </div>
</template>

<script>
/**
 * description: this component is used to create or update a source
 * @props {Boolean} show
 */

// import { EventBus } from "@/js/helpers/EventBus.js";
import { ref } from "@vue/reactivity";
import Modal from "@/components/common/Modal.vue";

export default {
  props: {
    show: {
      default: false,
      type: Boolean,
    },
  },
  components: {
    Modal,
  },
  setup() {
    return {
      loading: false,
      isViewModel: ref(true),
      disabledField: ref(false),
    };
  },

  methods: {
    /**
     * description: this method helps to close the modal
     */
    closeModal() {
      this.isViewModel = true;
      this.disabledField = true;
      this.$emit("closeModal", "create");
    },
  },
};
</script>

<style></style>
