<template>
  <Modal
    :show="open"
    @closeModal="closeModal"
    title="Edit Field"
    :heightAuto="true"
  >
    <template v-slot:body>
      <div class="row">
        <div
          class="col-12 q-px-xs"
          v-for="(field, key) in editFields"
          :key="key"
        >
          <div class="q-pa-xs">
            <div class="q-my-xs">
              <label for="">{{ field }}</label>
            </div>
            <q-input
              outlined
              :dense="true"
              v-model="values[field]"
              :id="field.toLowerCase().replaceAll(' ', '-')"
            />
          </div>
        </div>
      </div>
    </template>

    <template v-slot:action>
      <q-btn flat text-color="white" class="q-pa-md q-mr-sm" unelevated no-caps>
        <span class="text-primary q-pl-xs">Cancel</span>
      </q-btn>
      <q-btn
        text-color="white"
        class="bg-primary q-pa-md q-mr-sm float-right"
        label="Update"
        unelevated
        :disabled="isDisabled"
        no-caps
        @click="editField"
      />
    </template>
  </Modal>
</template>

<script>
/**
 * this component helps to show a modal to update a specific field
 * @props {Boolean} show
 * @props {Object} field
 * @props {number} index
 */
import Modal from "@/components/common/Modal.vue";
import { toRef, ref } from "@vue/reactivity";
export default {
  name: "EditReportModal",
  props: {
    show: {
      default: false,
      type: Boolean,
    },
    field: {
      type: Object,
      default: () => ({}),
    },
    index: {
      type: Number,
      default: 0,
    },
  },
  components: {
    Modal,
  },

  setup(props) {
    return {
      open: toRef(props, "show"),
      values: ref({
        label: "",
        name: "",
        placeholder: "",
      }),
    };
  },
  /**
   * computed is used to filter keys of field and remove some keys from array of field
   */
  computed: {
    editFields() {
      return Object.keys(this.field).filter(
        (key) => key != "type" && key != "value" && key != "name"
      );
    },
    isDisabled() {
      return !(this.values.label && this.values.placeholder);
    },
  },
  /**
   * watch remove proxy from object of field value
   */
  watch: {
    field(val) {
      this.values = JSON.parse(JSON.stringify(val));
    },
  },
  methods: {
    /**
     * description: this method helps to close the modal
     */
    closeModal() {
      this.$emit("closeModal", "edit");
    },

    /**
     * description:this method updates the value of field in case of updation
     */
    editField() {
      this.values.options &&
        (this.values.options = JSON.parse(
          JSON.stringify(this.values?.options.toString().split(","))
        ));
      this.closeModal();
      this.$emit("editField", { field: this.values, index: this.index });
    },
  },
};
</script>
