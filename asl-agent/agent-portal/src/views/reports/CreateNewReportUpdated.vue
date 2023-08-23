<template lang="">
<q-spinner-dots
          v-if="loader"
          color="primary"
          size="5em"
          class="save-loader"
/>
  <q-splitter v-model="splitterModel" style="height: auto; padding: 20px" :class="loader ? 'disabledContent' : ''">

    <template v-slot:before>
      <ReportHeader v-model:report="report" :tab="tab" />
      <q-splitter v-model="contentSplitterModel" class="q-pt-lg q-mt-lg">
        <template v-slot:before>
          <!--
                Upload image component
               -->
          <UploadReportImage @image-uploaded="imageUploaded" />
          <SectionNames v-model:report="report" v-model:tab="tab" />
        </template>
        <template v-slot:after>
  <q-tab-panels
    v-model="tab"
    swipeable
    vertical
    transition-prev="jump-up"
    transition-next="jump-up"
  >
    <q-tab-panel
      class="q-px-xl col-12"
      v-for="section in modifiedSections"
      :key="section"
      :name="section.id"
    >
      <div class="row">
        <div class="col-12">
          <p class="font-16px">
            <b>{{ section.name }}</b>
          </p>
        </div>
      </div>
      <ReportSectionFields
        v-model:fields="section.fields"
        :tab="tab"
        :sectionId="section.id"
        @save-report="saveReport(report)"
      />
    </q-tab-panel>
  </q-tab-panels>
</template>
      </q-splitter>
    </template>
    <template v-slot:after>
      <!-- 
          1) This is side list of custom fields type
          2) On click any field, this will append in related section or sub-section
        
         -->
      <AddCustomFields
        :options="inputOptions"
        v-model:report="report"
        :tab="tab"
        @add-custom-field="addField($event.type, report, $event.label)"
      />
    </template>
  </q-splitter>
</template>
<script>
/**
 * Description: Tghis component is used to edit report
 */
import { ref } from "vue";
import SectionNames from "./ReportSectionNames.vue";
import ReportHeader from "./ReportHeader.vue";
import AddCustomFields from "./AddCustomFields.vue";
import ReportSectionFields from "./ReportSectionFields.vue";
import { useRoute, useRouter } from "vue-router";
import UploadReportImage from "@/components/reports/UploadReportImage.vue";
import { EventBus } from "@/js/helpers/EventBus.js";
import { createReportObject } from "@/js/helpers/helpers.js";

export default {
  name: "CreateReport",
  components: {
    SectionNames,
    ReportHeader,
    AddCustomFields,
    ReportSectionFields,
    UploadReportImage,
  },
  computed: {
    //this property is used to get an array to render sections in tab panels
    modifiedSections() {
      return this.prepareModifiedSections(this.report.report_data);
    },
  },
  watch: {},
  setup() {
    return {
      drag: ref(true),
      loader: ref(false),
      birthIncorporationDate: ref(""),
      reportCategory: ref([]),
      reportCountry: ref([]),
      reportName: ref(""),
      reportThumbnail: ref(""),
      filterOptions: ref([]),
      filterCountryOptions: ref([]),
      router: useRouter(),
      route: useRoute(),
      loading: ref(false),
      showEditModal: ref(false),
      showEditSectionNameModal: ref(false),
      field: ref({}),
      currentEditFieldIndex: ref(0),
      parentSectionIndex: ref(0),
      childSectionIndex: ref(-1),
      tab: ref("bb5dc8842c"),
      splitterModel: ref(85),
      contentSplitterModel: ref(20),
      categoryOptions: ref([]),
      countryOptions: ref([]),
      inputOptions: [
        { type: "text", label: "Text", icon: "text_fields" },
        // { type: "file", label: "Upload File" },
        { type: "date", label: "Date", icon: "event" },
        { type: "time", label: "Time", icon: "schedule" },
        { type: "url", label: "URL", icon: "attachment" },
        { type: "number", label: "Number", icon: "format_list_numbered_rtl" },
        { type: "textarea", label: "Paragraph", icon: "format_align_right" },
        { type: "email", label: "Email", icon: "alternate_email" },
        { type: "tel", label: "Telephone", icon: "phone" },
      ],
      report: ref(createReportObject()),
    };
  },
  methods: {
    /**
     * description: this function helps to prepare a flattened array all sections and subsections at the same level with the unique identifier(name) of the section.
     * @param {array} sections
     * @returns {array}
     */
    prepareModifiedSections(sections) {
      let modifiedSections = [];
      sections.forEach((section) => {
        let obj = {};
        obj["id"] = section["id"];
        obj["name"] = section["name"];
        obj["fields"] = [];
        section.fields.forEach((field) => {
          if (field.fields) {
            modifiedSections.push({
              id: field.id,
              name: field.name,
              fields: [...field.fields],
            });
          } else {
            obj["fields"].push(field);
          }
        });
        modifiedSections.push(obj);
      });
      return modifiedSections;
    },
    /**
     * this function handles image uploaded in report.
     * @param {Base64} report
     */
    imageUploaded(image) {
      this.report.report_thumbnail = image;
    },

    /**
      * this function makes request to the backend and update the report to the database.
      * @param {Object} report
      * @param {String} id
           
        */
    saveReport(report) {
      if (this.validatSactionFields()) {
        this.loader = true;

        this.apiRequest(
          `search/reports`,
          "report",
          "POST",
          this.makeObjectTosaveReport(report)
        )
          .then(() => {
            this.success("Report has been Created successfully");
            this.loader = false;
            this.report = createReportObject();
            this.getAllCountries();
            this.getAllCategories();
          })
          .finally(() => {
            this.loader = false;
          });
      }
    },
    /**
     * Desc:This function is use to validate required fields in sections
     * Initially this function is used to validate obly first saction required fields
     */

    validatSactionFields() {
      let validate = true;
      this.report.report_data[0].fields.forEach((ele) => {
        if (!ele.id) {
          if (!ele.value) {
            this.error(`${ele.label} is required`);
            validate = false;
          }
          if (ele.name == "countries" || ele.name == "categories") {
            if (!ele.value.length > 0) {
              this.error(`${ele.label} is required`);
              validate = false;
            }
          }
        }
      });
      return validate;
    },
    /**
     * Desc: This function is used to make a single object with related fields of report
     * @param {object} report
     */
    makeObjectTosaveReport(report) {
      let obj = {};
      var thiss = this;
      let countries = [];
      let categories = [];
      report.report_data.forEach((ele) => {
        if (ele.id == "bb5dc8842c") {
          ele.fields.forEach((item) => {
            if (item.name == "countries") {
              thiss.reportCountry = item.value;
            } else if (item.name == "categories") {
              thiss.reportCategory = item.value;
            } else {
              obj[item.name] = item.value;
            }
          });
        }
      });

      thiss.reportCategory.forEach((item) => {
        categories.push(item.name);
      });
      thiss.reportCountry.forEach((item) => {
        countries.push(item.name);
      });

      //  obj["entity_type"] = this.entityType ? "company" : "person";
      //  obj["report_name"] = this.reportName;
      obj["categories"] = thiss.reportCategory;
      obj["countries"] = thiss.reportCountry;
      //  obj["birth_incorporation_date"] = this.birthIncorporationDate;
      obj["report_thumbnail"] = this.reportThumbnail;
      //  console.log(report.report_data, "jdshgfdjgsajhsdahjfgdhjfasdhjd");
      //  report.report_data[0].fields.forEach((item) => {
      //    item.value = obj[item.name];
      //  });
      // var data = this.prepareModifiedSections(report.report_data);
      var data = report.report_data;

      obj["report_data"] = data;
      obj["report_sections"] = report.report_sections;
      console.log(obj);

      return obj;
    },
    /**
     * description: this method helps to get file object
     *
     */
    handleFileSelect(evt) {
      //   var files = evt.target.files;
      var file = evt;
      this.reportThumbnail = evt;
      var thiss = this;

      if (file) {
        this.getBase64(file).then((res) => {
          thiss.reportThumbnail = res;
        });
      }
    },
    /**
     * description: this method helps to get the base64 of the image
     * @param {File} file
     */
    getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    },
    /**
     * description: this method helps to get the list of countries from the server
     */
    getAllCountries() {
      this.apiRequest(`agent/countries`, "agent", "GET", {}).then((res) => {
        this.countryOptions = res.data.data;
        this.filterCountryOptions = this.countryOptions;
        this.assignOptions("countries", this.countryOptions);
      });
    },

    /**
     * description: this method helps to get the list of categories and countries from the server
     */
    getAllCategories() {
      this.apiRequest(`agent/categories`, "agent", "GET", {}).then((res) => {
        this.categoryOptions = res.data.data;
        this.filterOptions = this.categoryOptions;

        this.assignOptions("categories", this.categoryOptions);
      });
    },

    assignOptions(name, options) {
      this.report.report_data[0].fields.map((ele) => {
        if (ele.name == name) {
          ele.options = options;
        }
      });
    },
    assignFieldsToSection(sectionId, fields) {
      this.report.report_data.map((ele) => {
        if (ele.id == sectionId) {
          ele.fields = fields;
        } else {
          if (ele.fields) {
            ele.fields.map((item) => {
              if (item.fields && item.id == sectionId) {
                item.fields = fields;
              }
            });
          }
        }
      });
    },
  },
  mounted() {
    this.getAllCategories();
    this.getAllCountries();
    // this event helps to get base64 of image when it has been uploaded
    EventBus.on("image-uploaded", (data) => {
      this.reportThumbnail = data;
    });
    EventBus.on("update-section-fields", (data) => {
      console.log(data.fields);
      this.assignFieldsToSection(data.sectionId, data.fields);
    });
  },
  beforeUnmount() {
    EventBus.off("update-section-fields");
  },
};
</script>
<style scoped>
.imge-text-primary {
  color: #bd8c5e;
  background-color: #f1e9d8;
  padding: 6px;
  margin-top: 15px;
  margin-right: -7px;
  border-radius: 4px;
}

.q-item {
  min-height: 33px !important;
}
.q-item__section--avatar {
  min-width: 33px !important;
}
.content-heading {
  position: absolute !important;
  left: 270px !important;
}
.small-heading-text {
  color: #9b96a0 !important;
  font-size: 13px;
}
.q-checkboc {
  margin-top: 26px !important;
}
.upload {
  margin: -6px !important;
  color: #bd8c5e;
  font-size: 12px;
  background-color: #f1e9d8;
  border-radius: 2px !important;
  padding: 6px 15px 6px 15px;
}
.q-field__control-container .q-field__native {
  height: 10px !important;
  overflow: auto !important;
}
.save-loader {
  top: 50% !important;
  right: 50% !important;
  position: absolute !important;
}
.disabledContent {
  pointer-events: none;
  opacity: 0.4;
}
</style>
