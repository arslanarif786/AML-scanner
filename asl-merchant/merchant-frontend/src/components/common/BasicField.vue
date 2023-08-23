<template lang="">
  <div
    class="col-12 col-md-6 field-container q-pa-sm q-my-md"
    :class="{ [`col-lg-${cols}`]: cols }"
  >
    <div>
      <div class="d-flex justify-between">
        <label for="f-name"
          >{{ label }}
          <span class="q-ml-md pointer" v-if="!disabledField">
            <a
              herf="#"
              v-if="label == 'Link' || label == 'link'"
              @click="uploadPdfInput(index, 'Link')"
              class="text-primary"
              style="cursor: pointer"
              >Upload PDF ?</a
            >
            <a
              herf="#"
              v-if="
                (label == 'Attachment' || label == 'attachment') &&
                !disabledField
              "
              @click="uploadPdfInput(index, 'Attachment')"
              class="text-primary"
              style="cursor: pointer"
              >Add Link?</a
            >
          </span>
        </label>
        <div class="d-none q-mr-sm action-btns">
          <q-icon
            v-for="field in editFields"
            :key="field.icon"
            size="20px"
            :name="field.icon"
            @click="field.method(index)"
            class="cursor-pointer q-mr-xs field-options color-secondary"
          />
        </div>
      </div>
      <template v-if="type === 'file'">
        <q-file
          v-if="type === 'file' && !disabledField"
          class="q-pr-md q-pt-sm"
          outlined
          :type="type"
          :name="name"
          :id="label.toLowerCase().replaceAll(' ', '-')"
          :model-value="value"
          :label="placeholder"
          :accept="
            helpers.toLower(name) == 'attachment' ? 'application/pdf' : ''
          "
          dense
          :disable="disabledField"
          @update:modelValue="updateValue"
        >
          <template v-slot:append>
            <p class="upload">Browse</p>
          </template>
        </q-file>
        <span v-else class="text-grey-7 d-block q-mt-md">
          <a :href="value" target="_blank"> View Source</a>
        </span>
      </template>
      
      <!-- <q-select
        v-else-if="type === 'select'"
        outlined
        class="q-pr-md q-pt-sm"
        :model-value="value"
        :id="label.toLowerCase().replaceAll(' ', '-')"
        @update:modelValue="updateValue"
        option-value="_id"
        option-label="name"
        :options="options"
        :disable="disabledField"
        dense
      > -->
      <q-select
      v-else-if="type === 'select'"
      :model-value="value?value:null"
      @update:modelValue="updateValue"
      use-input
      use-chips
      outlined
      dense
      option-value="_id"
      option-label="name"
      @new-value="createValue"
      :options="filterOptions"
      @filter="filterCategories"
      class="q-mt-sm"
      :disable="disabledField"
      
    >
        <template v-slot:option="scope" v-if="name == 'country'">
          <q-item v-bind="scope.itemProps" class="d-flex align-center">
            <div
              :class="`flag flag-${helpers.toLower(
                scope.opt['short_code']
              )} q-mr-sm`"
            ></div>
            {{ scope.opt.name }}
          </q-item>
        </template>
      </q-select>
      <template v-else>
        <span
          v-if="type === 'url' && disabledField"
          class="text-grey-7 d-block q-mt-md"
        >
          <a :href="value" target="_blank">View Source</a>
        </span>
        <q-input
          v-else
          class="q-pr-md q-pt-sm"
          outlined
          :type="type"
          :name="name"
          :id="label.toLowerCase().replaceAll(' ', '-')"
          :model-value="value"
          :placeholder="placeholder"
          :disable="disabledField"
          dense
          @update:modelValue="updateValue"
         
        />
      </template>
    </div>
  </div>

</template>
<script>
/**
 * this component manages to render dynamic fields in the form
 */
import { EventBus } from "@/js/helpers/EventBus.js";
import helpers from "@/js/helpers/helpers";
import { ref } from "@vue/reactivity";

export default {
  name: "CustomField",
  props: {
    isEditable: {
      default: true,
      type: Boolean,
    },
    disabledField: {
      default: false,
      type: Boolean,
    },
    label: {
      type: String,
      default: "Label",
    },
    name: {
      type: String,
      default: "name",
    },
    placeholder: {
      type: String,
      default: "placeholder",
    },
    type: {
      type: String,
      default: "text",
    },
    index: {
      type: Number,
      default: 0,
    },
    value: {
      type: [Array,String,Number, File],
      default: () => [],
    },
    cols: {
      type: Number,
      default: 4,
    },
    options: {
      type: Array,
      default: () => [],
    },
  },
  components: {},
  setup(props) {
    return {
      model: ref(null),
      appendOptions: ref([]),
      filterOptions: ref([]),
      reportCategory: ref([]),
      emitEvent(props) {
        EventBus.emit("append-options", props);
      },

      helpers: helpers,
      editable: ref(false),
      base64: ref(""),
      editFields: [
        {
          icon: "delete_outline",
          method: (index) => {
            EventBus.emit("deleteField", index);
          },
        },
        ...(props.isEditable
          ? [
              {
                icon: "edit",
                method: (index) => {
                  EventBus.emit("editField", index);
                },
              },
            ]
          : []),
      ],
    };
  },

  methods: {
    insertNewValue(name, val) {
      var newName = name == "type" ? "types" : "categories";

      this.apiRequest(`merchant/${newName}`, "merchant", "POST", { name: val }).then(
        () => {
          this.success(`New ${name} Added`);
        }
      );
    },

    createValue(val, done) {
      if (val.length > 0) {
        if (!this.appendOptions.includes(val)) {
          this.appendOptions.push(val);
          if (this.name != "country") this.insertNewValue(this.name, val);
        }
        done(val, "toggle");
      }
    },
    filterCategories(val, update) {
      update(() => {
        if (val === "") {
          this.filterOptions = this.appendOptions;
        } else {
          const needle = val.toLowerCase();
          this.filterOptions = this.appendOptions.filter(
            (v) => v.name.toLowerCase().indexOf(needle) > -1
          );
        }
      });
    },
    uploadPdfInput(key, string) {
      var obj = {};
      obj["key"] = key;
      obj["label"] = string;
      EventBus.emit("changeInputtoFile", obj);
    },
    /**
     * this method is used to update label of the field in case of contentEditable
     */
    updateLabel(e) {
      if (e.target.innerText.trim() !== "") {
        this.$emit("update:label", e.target.innerText.trim());
      } else {
        e.target.innerHTML = this.label;
      }
      this.editable = false;
    },
    /**
     * this method is used to make value bind to the field
     * @param {String} value
     */
    updateValue(e) {
      if (e && e.type == "application/pdf") {
        this.createBase64File(e);
      } else {
        this.$emit("update:value", e);
      }
    },
    /**
     * this method is used to make field editable
     */
    makeEditable() {
      this.editable = true;
    },
    createBase64File(FileObject) {
      let obj = {};
      const reader = new FileReader();
      reader.onload = (event) => {
        this.base64 = event.target.result;
        obj["name"] = FileObject.name;
        obj["value"] = this.base64;
      };
      reader.readAsDataURL(FileObject);

      this.$emit("update:value", obj);
    },
  },
  watch: {
    options(value) {
      this.filterOptions = JSON.parse(JSON.stringify(value));
      this.appendOptions = JSON.parse(JSON.stringify(value));

    },
   
    
  },

};
</script>
