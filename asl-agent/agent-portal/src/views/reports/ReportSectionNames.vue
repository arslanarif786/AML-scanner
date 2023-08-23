<template>
  <EditSectionNameModal
    :show="showEditSectionNameModal"
    :currentTab="
      this.$refs.sectionNameTree
        ? this.$refs.sectionNameTree.getNodeByKey(this.tab)
        : this.currentReport.report_sections[0]
    "
    @closeModal="showEditSectionNameModal = !showEditSectionNameModal"
    @update-section-name="
      renameSection(currentReport.report_sections, tab, $event)
    "
  />
  <q-tabs
    v-model="currentTab"
    vertical
    align="right"
    class="report_add_section q-ml-lg"
  >
    <!-- tree to show section to subsection hierarchy  -->
    <q-tree
      :nodes="currentReport.report_sections"
      node-key="id"
      selected-color="primary"
      v-model:selected="currentTab"
      :default-expand-all="true"
      no-selection-unset
      ref="sectionNameTree"
    >
      <template v-slot:default-header="prop">
        <div class="font-13px lh-15px text-weight-bold">
          {{ prop.node.label }}
        </div>
        <q-btn-dropdown
          dense
          unelevated
          flat
          color="#9C9DAF"
          icon="more_vert"
          class="action-report font-12px q-mr-xs"
        >
          <q-list class="bg-white">
            <q-item
              clickable
              v-close-popup
              v-for="option in dropdownOptions"
              :key="option.id"
            >
              <q-item-section
                @click.prevent="
                  handleOptions(option.id, tab, currentReport.report_sections)
                "
                :id="option.id"
              >
                <q-item-label>{{ option.label }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </template>
    </q-tree>
    <!-- add section button to add section  -->
    <q-btn
      text-color="grey"
      icon="add_circle"
      label="Add New Section"
      flat
      no-caps
      :ripple="false"
      @click="addSection"
    />
  </q-tabs>
</template>

<script>
import EditSectionNameModal from "../../components/reports/EditSectionNameModal.vue";
import { ref } from "vue";
import { findNodeById, generateId } from "@/js/helpers/helpers";
export default {
  name: "ReportSections",
  components: {
    EditSectionNameModal,
  },
  props: {
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
  computed: {
    currentTab: {
      get() {
        return this.tab;
      },
      set(val) {
        this.$emit("update:tab", val);
      },
    },
  },
  setup() {
    return {
      currentReport: ref({}),
      showEditSectionNameModal: ref(false),
      dropdownOptions: [
        {
          label: "rename section",
          id: "rename-section",
        },
        {
          label: "copy section",
          id: "copy-section",
        },
        {
          label: "delete section",
          id: "delete-section",
        },
      ],
    };
  },

  methods: {
    /**
     * description: this method is used to add a section into the report.
     */
    addSection() {
      let id = generateId();
      this.currentReport.report_sections.push({
        id: id,
        label: "New Section",
        children: [],
      });
      this.currentReport.report_data.push({
        id: id,
        name: "New Section",
        fields: [],
      });
    },
    /**
     * description: this method is used to rename the specific section from the report. It finds the section which user wants to update and updates the section name accordingly.
     * @param {Array} sections
     * @param {String} sectionId - id of the section which user wants to update
     * @param {String} newName - new name of the section
     *      */
    renameSection(sections, sectionId, newName) {
      let indexes = JSON.parse(
        JSON.stringify(findNodeById(sections, sectionId, "children"))
      );
      console.log(indexes, "index");
      if (indexes.child == -1) {
        this.currentReport.report_sections[indexes.parent].label = newName;
        this.currentReport.report_data[indexes.parent].name = newName;
      } else {
        console.log(
          "dhfjgfjsagjhsadfghsda",
          this.currentReport.report_sections[indexes.parent].children[
            indexes.child
          ].label
        );
        this.currentReport.report_sections[indexes.parent].children[
          indexes.child
        ].label = newName;
        console.log('iidaidas', 
            this.currentReport.report_data[indexes.parent])
        this.currentReport.report_data[indexes.parent].fields[
          findNodeById(
            this.currentReport.report_data[indexes.parent].fields,
            sectionId,
            "fields"
          ).parent
        ].name = newName;
      }
      // this.$emit("update:report", this.currentReport);
    },

    /**
     * description: This method is used to copy the specific section from the report. It further uses two sub-fucntions which run accordingly. There are two uses cases:
     * 1) The section is the parent section
     * 2) The section is a sub-section.
     * @param {Object} indexes- Object containg parent and child indexes of the section which user wants to copy
     * @param {*} id  - new Id of the copied section
     */
    copySection(indexes, id) {
      if (indexes.child == -1) {
        this.copyWholeSection(this.currentReport, indexes.parent, id);
      } else {
        this.copySingleSubSection(
          this.currentReport,
          indexes.parent,
          indexes.child,
          id
        );
      }
      // this.$emit("update:report", this.currentReport);
    },
    /**
     * description: this method is used to delete the specific section or subsection from the report.
     *
     * @param {Object} indexes- Object containg parent and child indexes
     */
    removeSection(indexes) {
      if (indexes.child == -1) {
        this.currentReport.report_sections.splice(indexes.parent, 1);
        this.currentReport.report_data.splice(indexes.parent, 1);
      } else {
        this.currentReport.report_sections[indexes.parent].children.splice(
          indexes.child,
          1
        );
        
      }
      // this.$emit("update:report", this.currentReport);
    },

    /**
     * description: this method handles the request type from the user and call the functions accordingly.
     * user can make three types of requests:
     * 1) rename section
     * 2) copy section
     * 3) delete section
     *
     * @param {String} optionType
     * @param {String} sectionId
     * @param {Array} sections
     */
    handleOptions(optionType, sectionId, sections) {
      let indexes = findNodeById(sections, sectionId, "children");
      console.log("handle", indexes);
      switch (optionType) {
        case "delete-section":
          this.removeSection(indexes);
          break;
        case "copy-section":
          this.copySection(indexes, generateId());
          break;
        case "rename-section":
          this.showEditSectionNameModal = true;
          break;
      }
    },

    /**
     * description: This method is used to update the ids of the sub-section. if the user copied the section which is containing sub-sections. This methods appends new ids into the subsections and avoid duplicate ids.
     * @param {Object} report
     * @param {Object} subsection
     * @param {Number} parentIndex
     * @param {Number} childIndex
     */
    updateSubSections(report, subsection, parentIndex, childIndex) {
      let id = generateId();
      let secname =
        report.report_sections[parentIndex + 1].children[childIndex];
      let secdata =
        report.report_data[parentIndex + 1].fields[
          findNodeById(
            report.report_data[parentIndex + 1].fields,
            subsection.id,
            "fields"
          ).parent
        ];
      secname.id = id;
      secdata.id = id;
    },
    /**
     * description: this method is used to copy the subsection if the user chooses to copy the only subsection.
     * @param {Object} report
     * @param {Number} parentIndex
     * @param {Number} childIndex
     * @param {String} id
     */
    copySingleSubSection(report, parentIndex, childIndex, id) {
      report.report_sections[parentIndex].children.splice(
        childIndex + 1,
        0,
        this.prepareSectionNameObj(
          report.report_sections[parentIndex].children[childIndex],
          id
        )
      );
      report.report_data[parentIndex].fields.splice(
        childIndex + 1,
        0,
        this.prepareSectionDataObj(
          report.report_data[parentIndex].fields[
            findNodeById(
              report.report_data[parentIndex].fields,
              this.tab,
              "fields"
            ).parent
          ],
          id
        )
      );
    },
    /**
     * description: this method is used to copy the report section if the section choosed by the user is the parent section.
     * @param {Object} report
     * @param {Number} parentIndex
     * @param {String} id
     */
    copyWholeSection(report, parentIndex, id) {
      report.report_sections.splice(
        parentIndex + 1,
        0,
        this.prepareSectionNameObj(report.report_sections[parentIndex], id)
      );
      report.report_data.splice(
        parentIndex + 1,
        0,
        this.prepareSectionDataObj(report.report_data[parentIndex], id)
      );
      if (report.report_sections[parentIndex + 1].children.length) {
        //if the parent section has sub-sections
        report.report_sections[parentIndex + 1].children.forEach(
          (subsection, index) => {
            this.updateSubSections(report, subsection, parentIndex, index);
          }
        );
      }
    },
    /**
     * description: this method returns the report section name object to be copied with the new ids
     * @param {Object} section
     * @param {String} id
     */
    prepareSectionNameObj(section, id) {
      return JSON.parse(
        JSON.stringify({
          id: id,
          label: `${section.label} copy`,
          ...(section.children
            ? { children: section.children.length ? section.children : [] }
            : {}),
        })
      );
    },
    /**
     * description: this method returns the report section data object to be copied with the new ids
     * @param {Object} section
     * @param {String} id
     */
    prepareSectionDataObj(section, id) {
      return JSON.parse(
        JSON.stringify({
          id: id,
          name: `${section.name} copy`,
          fields: [...section.fields],
        })
      );
    },
  },
};
</script>
<style>
.q-tree__node-header-content {
  justify-content: space-between;
}
.q-splitter--vertical .q-splitter__panel{
    height: 78vh !important;
    overflow: scroll !important;
}
.q-tabs--vertical .q-tabs__arrow--right , .q-tabs--vertical .q-tabs__arrow--left{
  color: peru !important;
}
</style>
