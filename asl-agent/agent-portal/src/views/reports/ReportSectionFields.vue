<template>
  <!-- This vueDraggable is for custom appendable fields -->
  <VueDraggable
    :list="sectionFields"
    item-key="index"
    class="row"
    @end="updateFieldList"
    v-if="sectionFields.length > 0"
  >
    <CustomField
      v-for="(field, index) in sectionFields"
      :key="index"
      :cols="field.type == 'select' || field.type == 'textarea' ? 12 : 6"
      :label="field.label"
      :name="field.name"
      :type="field.type"
      :isEditable="false"
      :options="field.options"
      :placeholder="field.placeholder"
      :multiple="field.options && field.options.length ? true : false"
      v-model:value="field.value"
      :index="index"
      @update:label="updateLabel(index, $event)"
    />
  </VueDraggable>
      <div class="justify-center items-center text-center row q-ma-lg" v-else>
        <div class="col-12"><img :src="'../../no-field.svg'"/></div>
        <div class="col-12"><p class="font-14px"><b>No Field Is Added</b></p></div>
        <div class="col-12"><p class="font-12px text-grey">Please add custom field buttons on the top right side of the <br> section to start adding the fields.</p></div>
      </div>
  <div class="q-my-md">
    <!-- This is save report button -->
    <q-btn
      color="primary"
      :label="route.params['id']? 'Update' : 'Save'"
      no-caps
      unelevated
      class="q-px-xl q-py-sm font-14px fw-600"
      @click="$emit('save-report')"
    />
  </div>
</template>

<script>
import { ref } from "vue";
import { EventBus } from "@/js/helpers/EventBus.js";
import CustomField from "@/components/common/CustomField.vue";
import { VueDraggableNext } from "vue-draggable-next";
import { useRoute } from "vue-router";

export default {
  name: "ReportSectionFields",
  props: {
    fields: {
      type: Array,
      default: () => [],
    },
    tab: {
      type: String,
      default: "",
    },
    sectionId: {
      type: String,
      default: "",
    },
  },
  components: {
    CustomField,
    VueDraggable: VueDraggableNext,
  },
  watch: {
    fields: {
      handler(val) {
        this.sectionFields = val;
      },
      deep: true,
      immediate: true,
    },
  },
  setup() {
    return {
      sectionFields: ref([]),
      route:useRoute(),
    };
  },
  methods: {
    /**
     * description: this function helps to update the label of the field.
     * @param {Number} index
     * @param {String} label
     */
    updateLabel(index, label) {
      this.sectionFields[index].label = label;
      this.sectionFields[index].name = label.replace(/ /g, "_").toLowerCase();
      this.updateSectionFieldsEvent();
    },
    /**
     * description: this function helps to delete the the field from the current section
     * @param {Number} index
     *
     */
    deleteFeild(index) {
      this.sectionFields.splice(index, 1);
    },
    /**
     * Description: This function is call when we add or remove fields in a section 
     */
    updateFieldList() {
      this.updateSectionFieldsEvent();
    },
    /**
     * Description: This function make an object and send event to parent of update fields and sections
     * 
     */
    updateSectionFieldsEvent() {
      var obj = {};
      obj.fields = this.sectionFields;
      obj.sectionId = this.sectionId;
      EventBus.emit("update-section-fields", obj);
    },
  },
  mounted() {
    // this event helps to delete field from the current section
    EventBus.on("deleteField", (index) => {
      if (this.tab == this.sectionId) {
        this.sectionFields.splice(index, 1);
        this.updateSectionFieldsEvent();
      }
    });
  },
};
</script>

<style scoped>
.q-tab-panels .q-panel{
  height: 78vh !important;
  overflow: scroll !important;
}


</style>
