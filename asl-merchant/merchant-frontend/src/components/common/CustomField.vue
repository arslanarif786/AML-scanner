<template lang="">
  <div
    class="col-12 col-md-6 field-container q-pa-sm q-my-md"
    :class="{ [`col-lg-${cols}`]: cols }"
  >
    <div>
      <div class="d-flex justify-between">
        <label
          for="f-name"
          :contenteditable="editable"
          @blur="updateLabel"
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
        outlined
        class="q-pr-md q-pt-sm"
        :model-value="value"
        :id="label.toLowerCase().replaceAll(' ', '-')"
        @update:modelValue="updateValue"
        :options="options"
        dense
        :disable="disabledField"
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
 * this component manages to render dynamic fields in the form
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
      type: [String, File],
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
</style>
