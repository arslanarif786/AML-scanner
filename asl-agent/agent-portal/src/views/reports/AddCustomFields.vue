<template>
  <p class="font-14px q-pl-lg"><b>Add Custom Fields</b></p>
  <div class="q-pa-md" style="max-width: 350px">
    <q-list>
      <q-item
        clickable
        v-ripple
        class="custom-field-chip"
        v-for="inputOption in options"
        :key="inputOption.type"
        @click="addField(inputOption.type, currentReport.report_data, tab)"
      >
        <q-item-section avatar>
          <q-icon color="primary" size="20px">
            <span class="material-icons">
              {{ inputOption.icon }}
            </span>
          </q-icon>
        </q-item-section>
        <q-item-section>{{ inputOption.label }}</q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script>
import { ref } from "vue";
import { findNodeById } from "@/js/helpers/helpers";
export default {
  props: {
    options: {
      type: Array,
      default: () => [],
    },
    report: {
      type: Object,
      default: () => {},
    },
    tab: {
      type: String,
      default: "",
    },
  },
  watch: {
    report: {
      handler(val) {
        this.currentReport = val;
      },
      deep: true,
      immediate: true,
    },
  },
  setup() {
    return {
      currentReport: ref({}),
    };
  },
  methods: {
    /**
     * description: this function add a new field to the report, it checks if current section is parent section, it add field in parent array otherwise it adds field in sub section array.
     * @param {String} inputType
     * @param {integer} tab
     * @param {Object} report
     */
    addField(inputType, sections, sectionId) {
      let indexes = findNodeById(sections, sectionId, "fields");
      let field = {
        label: inputType,
        name: inputType,
        type: inputType,
        placeholder: inputType,
        value: "",
      };
      if (indexes.child == -1) {
        this.currentReport.report_data[indexes.parent].fields.push(field);
      } else {
        this.currentReport.report_data[indexes.parent].fields[
          indexes.child
        ].fields.push(field);
      }
      this.$emit('udpate:report',this.currentReport)
    },
  },
};
</script>
<style scoped>
.custom-field-chip {
  color: black;
  background-color: #f8f7f4 !important;
  border-radius: 6px;
  height: 1px !important;
  border-color: #efede9 !important ;
  margin-bottom: 10px !important;
}

.q-item {
  min-height: 33px !important;
}
.q-item__section--avatar {
  min-width: 33px !important;
}
</style>
