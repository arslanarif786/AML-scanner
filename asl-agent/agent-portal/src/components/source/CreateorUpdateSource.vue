<template>
  <div>
    <Modal
      :show="show"
      @closeModal="closeModal"
      :title="isEdit ? 'Edit Source' : 'Add Source'"
    >
      <template v-slot:body>
        <div class="" style="max-width: 100%">
          <q-tabs
            v-model="tab"
            dense
            class="text-grey"
            active-color="primary"
            indicator-color="primary"
            align="left"
            narrow-indicator
          >
            <q-tab
              name="basic_fields"
              no-caps
              label="Basic Fields"
              @click="showAddFieldButton()"
            />
            <q-tab
              name="additional_fields"
              no-caps
              label="Additional Fields"
              @click="showAddFieldButton()"
            />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="basic_fields">
              <div class="row">
                <BasicField
                  v-for="(field, index) in fields"
                  :key="index"
                  :label="field.label"
                  :name="field.name"
                  :type="field.type"
                  :cols="6"
                  :placeholder="field.placeholder"
                  :options="field.options"
                  v-model:value="field.value"
                  :index="index"
                  :isEditable="false"
                  :disabledField="disabledField"
                  @update:label="updateLabel($event, field)"
                >
                </BasicField>
              </div>
            </q-tab-panel>

            <q-tab-panel name="additional_fields">
              <div class="row">
                <CustomField
                  v-for="(field, index) in additionalFields"
                  :key="index"
                  :label="field.label"
                  :name="field.name"
                  :type="field.type"
                  :cols="6"
                  :placeholder="field.placeholder"
                  :options="field.options"
                  :fields="fields"
                  :additionalFields="additionalFields"
                  v-model:value="field.value"
                  :index="index"
                  :isEditable="false"
                  :disabledField="disabledField"
                  @update:label="updateLabel($event, field)"
                />
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </template>

      <template v-slot:action>
        <q-btn-dropdown
          flat
          icon="add_circle"
          label="Add custom Fields"
          text-color="primary"
          class="q-pa-sm q-mr-sm text-left justify-start"
          unelevated
          :disable="disabledField"
          no-caps
          v-if="showCustomFieldButton"
        >
          <q-list class="custom-option q-pa-sm" dense>
            <q-item
              clickable
              v-for="inputOption in inputOptions"
              :key="inputOption.type"
              id="add-additional-field"
              @click="addAdditionalField(inputOption.type)"
            >
              <q-item-section>
                <q-item-label
                  class="
                    q-my-sm
                    font-12px
                    lh-15
                    text-primary text-weight-medium
                  "
                  >{{ inputOption.label }}</q-item-label
                >
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>

        <q-btn
          text-color="white"
          class="bg-primary q-px-lg q-mr-sm"
          label="Edit"
          :disable="fields.length === 0"
          unelevated
          no-caps
          id="edit-source"
          :loading="loading"
          v-if="isViewModel && disabledField == true"
          @click="makeEditable"
        />
        <q-btn
          v-else
          text-color="white"
          class="bg-primary q-px-lg q-mr-sm"
          :label="isEdit ? 'update' : 'save'"
          :disable="fields.length === 0"
          unelevated
          no-caps
          :loading="loading"
          id="save-update-source"
          @click="
            isEdit
              ? editSource(fields, additionalFields, source.row._id)
              : createSource(fields)
          "
        />
      </template>
    </Modal>
  </div>
</template>

<script>
/**
 * description: this component is used to create or update a source
 * @props {Object} source
 * @props {Boolean} isEdit
 * @props {Boolean} show
 */
import CustomField from "@/components/common/CustomField.vue";
import BasicField from "@/components/common/BasicField.vue";
import { EventBus } from "@/js/helpers/EventBus.js";
import { ref } from "@vue/reactivity";
import Modal from "@/components/common/Modal.vue";

export default {
  props: {
    source: {
      type: Object,
      default: () => ({}),
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
    show: {
      default: false,
      type: Boolean,
    },
  },
  components: {
    Modal,
    CustomField,
    BasicField,
    // PencilIcon,
  },
  setup() {
    return {
      loading: false,
      field: ref({}),
      inputOptions: [{ type: "text", label: "Text Field" }],
      fields: ref([]),
      link: ref(),
      fieldEditMode: ref([]),
      countryOptions: ref([]),
      categoryOptions: ref([]),
      typeOptions: ref([]),
      tab: ref("basic_fields"),
      additionalFields: ref([]),
      isViewModel: ref(true),
      disabledField: ref(true),
      showCustomFieldButton: ref(false),
      crawlDays: ref([
        {
          _id: "-1",
          name: "Once",
        },
        {
          _id: "1",
          name: "Every day",
        },
        {
          _id: "7",
          name: "Weekly",
        },
        {
          _id: "3",
          name: "Bi-Weekly",
        },
      ]),
    };
  },
  /**
   * watch is used to arrange the basic and additional fields in source form
   * it also determined either it is going to be edit or create
   */
  watch: {
    isEdit: {
      deep: true,
      handler(val) {
        if (val) {
          this.fields = [];
          this.additionalFields = [];
          let basicFieldsNames = [
            "name",
            "type",
            "country",
            "link",
            "category",
            "frequency",
            "total_entities",
            "link",
            "attachment",
          ];
          Object.keys(this.source.row).forEach((key) => {
            if (
              key !== "_id" &&
              key !== "updated_at" &&
              key !== "created_at" &&
              !key.includes("/api")
            ) {
              if (basicFieldsNames.includes(key)) {
                /**
                 * Description: This function is use to prepare add source form fields (basic,additional)
                 */
                this.prepareFieldsArray(this.fields, key, this.source.row);
              } else {
                this.prepareFieldsArray(
                  this.additionalFields,
                  key,
                  this.source.row
                );
              }
            }
          });
          this.getAllCountries();
          this.getAllCategories();
          this.getAllTypes();
        }
      },
    },
    show(val) {
      if (!this.isEdit && val) {
        this.fields = this.createFields();
        this.additionalFields = [];
        this.disabledField = false;
      }
    },
  },
  methods: {
    /**
     * description: this method helps to append form fields in  arrray [fields]
     * @param {string} name this the name of field
     * @param {array} fields this is an array which contain fields name and related data
     * @param {object} row this object contain one field record
     */
    prepareFieldsArray(fields, name, row) {
      let type =
        name == "type" ||
        name == "country" ||
        name == "category" ||
        name == "crawl_days"
          ? "select"
          : name == "attachment"
          ? "file"
          : name == "link"
          ? "url"
          : name == "total_entities"
          ? "number"
          : "text";
      fields.push({
        label: name.replaceAll("_", " "),
        name: name,
        type: type,
        placeholder: `Enter ${name.replaceAll("_", " ")} here`,
        value: row[name] ? row[name].toString() : "",
      });
    },

    /**
     * description: this method helps to append select options of any record in fields arrray
     * @param {string} name this the name of which record's options have to append
     * @param {array} fields options will be append in this array
     * @param {object} optionsData this object contain all options record
     */
    appendOptionsInFields(name, fields, optionsData) {
      fields.map((e) => {
        if (e.name == name) {
          e.options = optionsData;
        }
      });
    },
    /**
     * description: this method helps to make modal editable
     */
    makeEditable() {
      this.isViewModel = false;
      this.disabledField = false;
    },
    /**
     * description: this method helps to show or hide  add_custom_field button
     */
    showAddFieldButton() {
      this.showCustomFieldButton ? this.showCustomFieldButton=false : this.showCustomFieldButton=true;
    },
    /**
     * description: this method helps to close the modal
     */
    closeModal() {
      this.isViewModel = true;
      this.disabledField = true;
      this.$emit("closeModal", "create");
    },
    /**
     * this method is used to validate that ,either new field is exit (in basic or additional fields) or not
     */
    validateAdditionalField(basic, additional, newLabel) {
      var isUpdate = true;
      if (additional) {
        basic.map((key) => {
          if (key.label == newLabel) {
            isUpdate = false;
          }
        });
        additional.map((key) => {
          if (key.label == newLabel) {
            key.label = "text1";
            isUpdate = false;
          }
        });
      }
      return isUpdate;
    },
    /**
     * description: this method returns fields required to create a source
     */
    updateLabel(label, field) {
      var d = this.validateAdditionalField(
        this.fields,
        this.additionalFields,
        label
      );

      if (d) {
        field.label = label;
        field.placeholder = `Enter ${label} here`;
      }
    },
    createFields() {
      let basic_fields = [
        {
          label: "Name",
          name: "name",
          type: "text",
          placeholder: "Enter source name here",
          value: "",
        },
        {
          label: "Category",
          name: "category",
          type: "select",
          placeholder: "Select category",
          value: "",
          options: [],
        },
        {
          label: "Type",
          name: "type",
          type: "select",
          placeholder: "Select type",
          value: "",
          options: [],
        },
        {
          label: "Country",
          name: "country",
          type: "select",
          placeholder: "Select country",
          value: "",
          options: [],
        },
        {
          label: "Frequency",
          name: "frequency",
          type: "text",
          placeholder: "Enter Frequency here",
          value: "",
        },
        {
          label: "Total Entities",
          name: "total_entities",
          type: "number",
          placeholder: "Enter total entities here",
          value: "",
        },
        {
          label: "Link",
          name: "link",
          type: "text",
          placeholder: "Enter link here",
          value: "",
        },
      ];
      // call method to get countries
      this.getAllCountries();
      this.getAllCategories();
      this.getAllTypes();

      return basic_fields;
    },
    /**
     * description: this method is used to add a custom field to the fields array
     * @param {string} type
     */
    addField(type) {
      let field = {
        label: type,
        name: type,
        type: type,
        placeholder: type,
        value: "",
      };
      this.fields.push(field);
    },

    /**
     * description: this method is used to add a additional field to the additionalFields array
     * @param {string} type
     */
    addAdditionalField(type) {
      let additional_field = {
        label: `${type + (this.additionalFields.length + 1)}`,
        name: `${type + (this.additionalFields.length + 1)}`,
        type: type,
        placeholder: type,
        value: "",
      };
      this.additionalFields.push(additional_field);
    },

    /**
     * description: this method is used to prepare data to create or update a specific source.
     * it replaces underscores
     * @param {Array} source
     */
    prepareDataForSource(source, additional_fields) {
      let sourceData = {};
      if (additional_fields) {
        additional_fields.forEach((ele) => {
          source.push(ele);
        });
      }
      source.forEach((element) => {
        if (!element.value) {
          this.error(`${element.name} is required`);
        }
        let val = element.value.value ? element.value.value : element.value;
        if (
          element.name == "type" ||
          element.name == "country" ||
          element.name == "category"
        ) {
          val = element.value.name ? element.value.name : element.value;
        }
        sourceData[element.label.replaceAll(" ", "_").toLowerCase()] = val;
      });
      return sourceData;
    },

    /**
     * description: this method is used to validate firlds of a form.
     * 1) pass field array which are required
     * 2)this function will return true and false
     * 3)if their is some field which is required, it will return false along with an error message
     * @param {Array} fields
     */

    validateFormFields(fields) {
      let validity = true;
      fields.map((ele) => {
        if (
          !ele.value ||
          ele.value == "" ||
          ele.value == null ||
          ele.value == undefined
        ) {
          this.error(`${ele.label} is required`);
          validity = false;
        }
      });
      return validity;
    },

    /**
     * description: this method is used to create or update a specific source to the server.
     * @param {Array} fields
     */
    createSource(fields) {
      this.loading = true;

      if (this.validateFormFields(fields)) {
        this.apiRequest(
          "agent/sources",
          "agent",
          "POST",
          this.prepareDataForSource(fields)
        )
          .then((res) => {
            var newFields = this.prepareDataForSource(fields);
            newFields._id = res.data.data._id;

            EventBus.emit("createSource", newFields);
            this.success("Source Added Successfully");
          })
          .finally(() => {
            this.loading = false;
          });
        this.closeModal();
      }
    },
    /**
     * description: this method is used to edit a specific source to the server.
     * @param {Array} fields
     * @param {string} sourceId
     */
    editSource(fields, additional_fields, sourceId) {
      this.loading = true;
      this.apiRequest(
        `agent/sources/${sourceId}`,
        "agent",
        "POST",
        this.prepareDataForSource(fields, additional_fields)
      )
        .then(() => {
          this.$emit("editSource", {
            field: this.prepareDataForSource(fields, additional_fields),
            index: this.source.index,
          });
          this.success("Source Updated Successfully");
        })
        .finally(() => {
          this.loading = false;
        });
      this.closeModal();
    },
    /**
     * description: this method helps to get the list of countries from the server
     */
    getAllCountries() {
      this.apiRequest(`agent/countries`, "agent", "GET", {}).then((res) => {
        this.countryOptions = res.data.data;
        this.appendOptionsInFields("country", this.fields, this.countryOptions);
      });
    },

    /**
     * description: this method helps to get the list of categories and countries from the server
     */
    getAllCategories() {
      this.apiRequest(`agent/categories`, "agent", "GET", {}).then((res) => {
        this.categoryOptions = res.data.data;
        this.appendOptionsInFields(
          "category",
          this.fields,
          this.categoryOptions
        );
      });
    },
    /**
     * description: this method helps to get the list of types and countries from the server
     */
    getAllTypes() {
      this.apiRequest(`agent/types`, "agent", "GET", {}).then((res) => {
        this.typeOptions = res.data.data;
        this.appendOptionsInFields("type", this.fields, this.typeOptions);
      });
    },
  },
  mounted() {
    EventBus.on("deleteField", (index) => {
      this.additionalFields.splice(index, 1);
    });
    EventBus.on("editField", (index) => {
      try {
        this.showEditModal = true;
        this.additionalFields = this.additionalFields[index];
      } catch (e) {
        console.log(e);
      }
    });
    EventBus.on("changeInputtoFile", (obj) => {
      try {
        this.fields[obj.key].type = obj.label == "Link" ? "file" : "text";
        this.fields[obj.key].name = obj.label == "Link" ? "attachment" : "link";
        this.fields[obj.key].label =
          obj.label == "Link" ? "Attachment" : "Link";
        this.fields[obj.key].placeholder =
          obj.label == "Link" ? "Upload PDF Here" : "Enter Link here";
        this.fields[obj.key].value = "";
      } catch (e) {
        console.log(e);
      }
    });
  },
};
</script>

<style></style>
