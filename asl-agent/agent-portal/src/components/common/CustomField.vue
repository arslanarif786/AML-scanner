<template lang="">
  <div
    class="col-12 col-md-6 field-container q-pa-sm q-my-md"
    :class="{ [`col-lg-${cols}`]: cols }"
  >
    <div>
      <div class="d-flex justify-between">
        <label
          v-if="type != 'checkbox'"
          for="f-name"
          :contenteditable="editable"
          @click="makeEditable"
          @keydown.esc.prevent="updateLabel"
          @keydown.enter.prevent="updateLabel"
          >{{ label }}</label
        >
        <div class="d-none q-mr-sm action-btns" v-if="!disabledField">
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
      <q-file
        v-if="type === 'file'"
        class="q-pr-md q-pt-sm"
        outlined
        :type="type"
        :name="name"
        :id="label.toLowerCase().replaceAll(' ', '-')"
        :model-value="value"
        :label="placeholder"
        dense
        :disable="disabledField"
        @update:modelValue="updateValue"
      >
        <template v-slot:append>
          <p class="upload">Browse</p>
        </template>
      </q-file>
      <q-select
        v-else-if="type === 'select'"
        use-input
        use-chips
        outlined
        dense
        option-value="_id"
        option-label="name"
        class="q-pr-md q-pt-sm"
        :model-value="value"
        :id="label.toLowerCase().replaceAll(' ', '-')"
        @update:modelValue="updateValue"
        :options="options"
        :multiple="multiple"
        :disable="disabledField"
      >
        <template
          v-slot:option="scope"
          v-if="name == 'country' || name == 'countries'"
        >
          <q-item v-bind="scope.itemProps" class="d-flex align-center">
            <div
              :class="`flag flag-${scope.opt[
                'short_code'
              ].toLowerCase()} q-mr-sm`"
            ></div>
            {{ scope.opt.name }}
          </q-item>
        </template>
      </q-select>
      <q-editor
        v-else-if="type === 'textarea'"
        min-height="40px"
        @update:modelValue="updateValue"
        dense
        :disable="disabledField"
        :model-value="value"
        :id="label.toLowerCase().replaceAll(' ', '-')"
        :toolbar="[
          [
            {
              label: $q.lang.editor.align,
              icon: $q.iconSet.editor.align,
              fixedLabel: true,
              list: 'only-icons',
              options: ['left', 'center', 'right', 'justify'],
            },
          ],
          ['bold'],
          ['link'],
          ['removeFormat'],
          ['unordered', 'ordered'],
        ]"
      />
      <q-checkbox
        :model-value="value ?? null"
        class="q-mt-lg"
        :name="name"
        @update:modelValue="updateValue"
        :label="label"
        color="primary"
        v-else-if="type == 'checkbox'"
        true-value="company"
        false-value="person"
      />
      <q-input
        v-else
        class="q-pr-md q-pt-sm"
        outlined
        :type="type"
        :name="name"
        :id="label.toLowerCase().replaceAll(' ', '-')"
        :model-value="value"
        :placeholder="placeholder"
        dense
        :disable="disabledField"
        @update:modelValue="updateValue"
      />
    </div>
  </div>
</template>
<script>
/**
 * Description : This component manages to render dynamic fields in the form
 * CustomField componnet contain its custom design whith props same as BasicField component
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
      type: [String, File, Array],
    },
    cols: {
      type: Number,
      default: 4,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Array,
      default: () => [],
    },
    fields: {
      type: Array,
      default: () => [],
    },
    additionalFields: {
      type: Array,
      default: () => [],
    },
  },
  setup(props) {
    return {
      editable: ref(false),
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
     * this method is used to update label of the field in case of contentEditable
     */
    updateLabel(e) {
      var validFields = this.validateAdditionalField(
        this.fields,
        this.additionalFields,
        e.target.innerText.trim()
      );
      if (e.target.innerText.trim() !== "") {
        if (validFields) {
          this.$emit("update:label", e.target.innerText.trim());
        } else {
          e.target.innerHTML = this.label;
          this.error("This field is already exist");
        }
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
      this.$emit("update:value", e);
    },
    /**
     * this method is used to make field editable
     */
    makeEditable() {
      this.editable = true;
    },
  },
};
</script>
<style lang="scss" scoped>
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
.field-container:hover .action-btns {
  display: inline-block;
}
.upload {
  margin: -6px !important;
  color: #5D5FEC;
  font-size: 12px;
  background-color: #f1e9d8;
  border-radius: 2px !important;
  padding: 6px 15px 6px 15px;
}
</style>
