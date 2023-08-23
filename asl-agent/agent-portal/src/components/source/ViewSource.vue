<template>
  <Modal :show="show" @closeModal="closeModal" title="View Source Detail">
    <template v-slot:body>
      <div class="row q-pa-md">
        <div
          class="col-xs-12 col-sm-6 col-md-6 q-pr-md"
          v-for="(value, key) in source"
          :key="key"
        >
          <div>
            <label for="" class="color-heading text-weight-medium font-13px">{{
              trimSourceLabel(key)
            }}</label>
            <p class="word-break color-secondary font-13px">{{ value }}</p>
          </div>
        </div>
      </div>
    </template>
  </Modal>
</template>

<script>
/**
 * this component is used to view a specific source detail
 * @props {Object} source
 * @props {Boolean} show
 */
import Modal from "@/components/common/Modal.vue";

export default {
  props: {
    source: {
      default: () => ({}),
      type: Object,
    },
    show: {
      default: false,
      type: Boolean,
    },
  },
  components: {
    Modal,
  },
  methods: {
    /**
     * description: this method helps to close the modal
     */
    closeModal() {
      this.$emit("closeModal", "detail");
    },

    /**
     * this function is used to trim labels of the source
     * @param {String} label
     */
    trimSourceLabel(label) {
      return label.replaceAll("_", " ").trim();
    },
  },
};
</script>

<style></style>
