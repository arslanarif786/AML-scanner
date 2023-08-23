<template>
  <Modal
    :show="open"
    @closeModal="closeModal"
    title="Update Section Name"
    :heightAuto="true"
  >
    <template v-slot:body>
      <div class="row">
        <div class="col-12 q-px-xs">
          <div class="q-pa-xs">
            <div class="q-my-xs">
              <label for="">Section Name</label>
            </div>
            <q-input
              outlined
              :dense="true"
              v-model="name"
              id="section-name"
              placeholder="Enter Section Name"
            />
          </div>
        </div>
      </div>
    </template>

    <template v-slot:action>
      <q-btn flat text-color="white" class="q-pa-md q-mr-sm" unelevated no-caps>
        <span
          class="text-primary q-pl-xs"
          @click="closeModal"
          id="cancel-button"
          >Cancel</span
        >
      </q-btn>
      <q-btn
        text-color="white"
        class="bg-primary q-pa-md q-mr-sm float-right"
        label="Update"
        unelevated
        :disabled="!name"
        no-caps
        id="update-button"
        @click="updateSectionName"
      />
    </template>
  </Modal>
</template>

<script>
/**
 * Description : this component helps to show a modal to update a specific section name
 * @props {Boolean} show
 * @props {object} currentTab
 */
import { useRouter } from "vue-router";
import Modal from "@/components/common/Modal.vue";
import { toRef, ref } from "@vue/reactivity";
export default {
  name: "ReportNameModal",
  props: {
    show: {
      default: false,
      type: Boolean,
    },
    currentTab: {
      default: () => {},
      type: Object,
    },
  },
  components: {
    Modal,
  },
  /**
   * use  to show current tab
   */
  watch: {
    show(val) {
      if (val) {
        this.name = this.currentTab.label;
      }
    },
  },
  setup(props) {
    return {
      router: useRouter(),
      name: ref(""),
      open: toRef(props, "show"),
    };
  },

  methods: {
    /**
     * description: this method helps to close the modal
     */
    closeModal() {
      this.$emit("closeModal");
    },

    /**
     * description:this method updates the section name in case of updation
     */
    updateSectionName() {
      this.$emit("update-section-name", this.name);
      this.closeModal();
    },
  },
};
</script>
