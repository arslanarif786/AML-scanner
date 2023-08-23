<template>
  <Modal :show="open" @closeModal="closeModal" class="global-font-color" title="Create Role">
    <template v-slot:body>
      <div class="">
        <div
          class="col-12 q-px-xs"
          v-for="(item, key) in modalFields"
          :key="key"
        >
          <!-- Text field for role name -->
          <label v-if="item.field == 'text'" class="global-font-color" for="">{{ item.label }}</label>
          <q-input
            v-if="item.field == 'text'"
            v-model="item.value"
            outlined
            :id="item.label.toLowerCase().replaceAll(' ','-')"
            :dense="true"
            :placeholder="item.placeholder"
          />
          <!-- Dropdown for selecting permissions -->
          <label v-if="item.field == 'dropdown'" class="q-mt-md global-font-color">{{
            item.label
          }}</label>
          <q-select
            class="q-mt-md global-font-color"
            v-if="item.field == 'dropdown'"
            filled
            v-model="item.value"
            multiple
            :options="emittedPermissions"
            use-chips
            stack-label
            :label="item.label"
            :id="item.label.toLowerCase().replaceAll(' ','-')"
          />
        </div>
      </div>
    </template>

    <!-- Template slot for dialog box actions -->
    <template v-slot:action>
      <q-btn
        flat
        text-color="white"
        class="q-pa-md q-mr-sm q-ml-auto"
        unelevated
        no-caps
        id="cancel-button"
      >
        <span class="text-primary q-pl-xs" @click="closeModal()">Cancel</span>
      </q-btn>
      <q-btn
        text-color="white"
        class="bg-primary q-pa-md q-mr-sm float-right"
        label="Create"
        unelevated
        no-caps
        id="create-button"
        :loading="loading"
        @click="createRole()"
      />
    </template>
  </Modal>
</template>

<script>
import Modal from "@/components/common/Modal.vue";
import { toRef, ref } from "@vue/reactivity";
export default {
  name: "CreateRoleModal",
  components: {
    Modal,
  },

  props: {
    show: {
      default: false,
      type: Boolean,
    },
    emittedPermissions: {
      type: Array,
    },
  },

  setup(props) {
    return {
      open: toRef(props, "show"),
      loading: ref(false),
      modalFields: ref([
        {
          label: "Role",
          value: "",
          placeholder: "Enter Role",
          field: "text",
        },
        {
          label: "Permissions",
          placeholder: "Select Permissions",
          value: [],
          field: "dropdown",
          permissions: [],
        },
      ]),
    };
  },

  methods: {
    //   Method to close the modal
    closeModal() {
      this.$emit("closeModal", "create");
    },

    /**
     * Method to create new role
     */
    createRole() {
      this.loading = true;
      this.apiRequest("merchant/role/store", "merchant", "POST", {
        name: this.modalFields[0].value,
        permissions: this.modalFields[1].value,
      })
        .then((res) => {
          console.log(res.data.data, "role created");
          this.loading = false;
          this.closeModal();
          this.$emit("addRole", res.data.data);
          this.modalFields[0].value = "";
          this.modalFields[1].value = [];
          this.success("New Role has been added");
        })
        .catch((err) => {
          this.loading = false;
          console.log(err.response.data, "error");
        });
    },
  },
};
</script>

<style></style>
