<template>
  <Modal
    :show="show"
    @closeModal="closeModal"
    title="Create User"
    :heightAuto="true"
  >
    <template v-slot:body>
      <div class="row">
        <div class="col-12 q-px-xs">
          <!-- <div class="q-pa-xs">
            <div class="q-my-xs">
              <label for="">Full Name</label>
            </div>
            <q-input outlined v-model="form.name" :dense="true" />
          </div> -->

          <div class="q-pa-xs">
            <div class="q-my-xs">
              <label for="">Email Address</label>
            </div>
            <q-input outlined v-model="form.email" :dense="true" />
          </div>

          <div class="q-pa-xs">
            <div class="q-my-xs">
              <label for="">Select Role</label>
            </div>
            <!-- :options="options" -->
            <q-select
              outlined
              v-model="form.role"
              :options="roles"
              option-value="_id"
              option-label="name"
              :dense="true"
            />
          </div>
        </div>
      </div>
    </template>

    <template v-slot:action>
      <q-btn
        text-color="white"
        class="bg-primary q-pa-md q-mr-md q-ml-auto"
        label="Create"
        unelevated
        :loading="loading"
        no-caps
        @click="inviteUser()"
      />
    </template>
  </Modal>
</template>

<script>
import { ref } from "@vue/reactivity";
import Modal from "@/components/common/Modal.vue";

export default {
  props: {
    data: Object,
    show: {
      default: false,
      type: Boolean,
    },
    roles: {
      type: Array,
    },
  },
  components: {
    Modal,
  },
  setup() {
    return {
      form: ref({
        // name: null,
        email: null,
        role: null,
      }),
      loading: ref(false),
      link: ref(),
      fieldEditMode: ref([]),
      options: ref([]),
    };
  },

  methods: {
    /**
     * Method to close the modal
     */
    closeModal() {
      this.$emit("closeModal", "create");
    },

    /**
     * Method to send invite to the new user
     */
    inviteUser() {
      if (!this.form.email && !this.form.role) {
        return this.error("Please fill required fields");
      }
      this.loading = true;
      this.apiRequest("merchant/sendInvitation", "merchant", "POST", {
        email: this.form.email,
        role_id: this.form.role._id,
      })
        .then(() => {
          this.closeModal();
          this.loading = false;
          this.form = {};
          this.success("Invitation link has been sent to the provided email");
        })
        .catch((err) => {
          this.loading = false;
          console.log(err.response.data, "user error");
        });
    },
  },
};
</script>

<style></style>
