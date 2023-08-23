<template>
  <q-dialog v-model="open" class="modal">
    <q-card class="full-width">
      <q-card-section class="row items-center">
        <div class="text-h6">{{ title }}</div>
        <q-space />
        <q-btn round :size="'xs'" flat dense @click="close()" class="bg-grey-2" id="close-button">
          <CrossIcon class="h-4 w-4 text-grey-6"></CrossIcon>
        </q-btn>
      </q-card-section>

      <q-card-section
        class="overflow-auto"
        :style="`height:${heightAuto ? 'auto' : '450px'} !important`"
      >
        <slot name="body"></slot>
      </q-card-section>
      <q-card-section class="row items-center q-py-none">
        <slot name="footer"></slot>
      </q-card-section>
      <q-card-actions class="q-mb-lg justify-end" v-if="actions">
        <slot name="action"></slot>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
/**
 * this is the root component for all the modals in the application
 */
import { toRef } from "@vue/reactivity";
import CrossIcon from "@/components/icons/CrossIcon.vue";
export default {
  name: "Edit",
  components: {
    CrossIcon,
  },
  props: {
    data: Object,
    show: {
      default: false,
      type: Boolean,
    },
    title: {
      default: "",
      type: String,
    },
    actions: {
      default: true,
      type: Boolean,
    },
    heightAuto: {
      default: false,
      type: Boolean,
    },
  },
  setup(props) {
    return {
      open: toRef(props, "show"),
    };
  },
  methods: {
    close() {
      this.$emit("closeModal");
    },
  },
};
</script>

<style lang="scss" scoped>
.modal .q-dialog__inner--minimized > div {
  max-width: 700px !important;
}
</style>
