<template lang="">
  <div
    class="col-12 col-md-6 field-container q-pa-sm q-my-md"
    :class="{ [`col-lg-${cols}`]: cols }"
  >
    <div>
      <div class="d-flex justify-between">
        <label for="f-name" v-if="type!='checkbox'"
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
            name.toLowerCase() == 'attachment' ? 'application/pdf' : ''
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

      <q-select
        v-else-if="type === 'select'"
        :model-value="value ? value : null"
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
        :multiple="multiple"
        :disable="disabledField"
      >
        <template v-slot:option="scope" v-if="name == 'country' || name == 'countries' ">
          <q-item v-bind="scope.itemProps" class="d-flex align-center">
            <div
              :class="`flag flag-${
                scope.opt['short_code'].toLowerCase()
              } q-mr-sm`"
            ></div>
            {{ scope.opt.name }}
          </q-item>
        </template>
      </q-select>
      <q-toggle :model-value="value??null" class="q-mt-lg" :name="name" @update:modelValue="updateValue" :label="label" color="primary" v-else-if="type=='checkbox'" true-value="company"
      false-value="person" />
      <template v-else>
        <span
          v-if="type === 'url' && disabledField"
          class="text-grey-7 d-block q-mt-md"
        >
          <a :href="value" target="_blank">View Source</a>
        </span>
        <q-input
          v-else
          class="q-pt-sm"
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
 * Description : This component manages to render dynamic fields in the form
 * BasicField componnet is simple field which contains props
 * @props {Boolean} IsEditable
 * @props {Boolean} disabledField
 * @props {string} label
 * @props {string} name
 * @props {string} placeholder
 * @props {string} type
 * @props {Number} index
 * @props {String} value
 * @props {Number} cols
 * @props {Array} options
 */
import { EventBus } from "@/js/helpers/EventBus.js";
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
    multiple: {
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
      type: [Array, String, Number, File],
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

      this.apiRequest(`agent/${newName}`, "agent", "POST", { name: val }).then(
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
<style scoped>
.field-options:hover {
  transform: scale(1.1);
  transition: all 0.2s ease-in-out;
}

.field-options {
  transition: all 0.2s ease-in-out;
}
.field-container:hover {
  border: 2px dotted #5D5FEC !important;
  border-radius: 4px !important;
}

.upload {
  margin: -6px !important;
  color: #5D5FEC;
  font-size: 12px;
  background-color: #F1E9D8;
  border-radius: 2px !important;
  padding: 6px 15px 6px 15px;
}
</style>
