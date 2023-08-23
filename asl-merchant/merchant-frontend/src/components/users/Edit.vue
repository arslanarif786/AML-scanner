  <template>
  <Modal :show="show" @closeModal="closeModal" class="global-font-color" title="Edit User" :heightAuto="true">
    <template v-slot:body>
      <div class="row global-font-color">
        <div class="col-12 q-px-xs">
          <div class="q-pa-xs">
            <div class="q-my-xs">
              <label for="">Full Name</label>
            </div>
            <q-input outlined v-model="form.name" :dense="true" />
          </div>

          <div class="q-pa-xs">
            <div class="q-my-xs">
              <label for="">Email Address</label>
            </div>
            <q-input outlined v-model="form.email" :dense="true" readonly />
          </div>

          <div class="q-pa-xs">
            <div class="q-my-xs">
              <label for="">Select Role</label>
            </div>
            <q-select
              outlined
              v-model="form.role"
              :options="options"
              :dense="true"
            />
          </div>
        </div>
      </div>
    </template>

    <template v-slot:action>
      <span class="global-font-color q-pl-md" v-if="hasPermission('deactivate user')">
        {{
          form.de_activate == true ? "Deactivate User:" : "Activate User:"
        }}</span
      >
      <q-toggle
        v-if="hasPermission('deactivate user')"
        @update:model-value="activeDeactiveUser()"
        v-model="form.de_activate"
        color="primary"
        size="xs"
      />
      <q-space />
      <q-btn
        text-color="white"
        class="bg-primary q-pa-md q-mr-md"
        label="Update"
        unelevated
        no-caps
        @click="updateUser()"
      />
    </template>
  </Modal>
</template>

<script>
import { ref } from "@vue/reactivity";
import Modal from "@/components/common/Modal.vue";
import { EventBus } from "@/js/helpers/EventBus.js";

export default {
  props: {
    data: Object,
    show: {
      default: false,
      type: Boolean,
    },
    editUser: {
      default: () => ({}),
      type: Object,
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
        id: null,
        name: null,
        email: null,
        role: null,
        de_activate: true,
      }),
      link: ref(),
      fieldEditMode: ref([]),
      options: ref([]),
    };
  },
  watch: {
    // Assigning selected users object to the form object
    editUser() {
      console.log(this.editUser, "editr");
      this.form.id = this.editUser._id;
      this.form.name = this.editUser.name;
      this.form.email = this.editUser.email;
      this.form.role = this.editUser.role[0].name;
      this.form.de_activate = this.editUser.deleted_at ? false : true;
      this.options = JSON.parse(localStorage.getItem("allRoles"));
    },
  },
  methods: {
    /**
     * Method to close the modal
     */
    closeModal() {
      this.$emit("closeModal", "edit");
    },
    /**
     * Method to activate/Inactive user
     */
    activeDeactiveUser() {
      const status = {
        active: "merchant/user/activate/",
        inActive: "merchant/user/deactivate/",
      };

      var endpoint =
        this.form.de_activate == true ? status.inActive : status.active;
      this.apiRequest(endpoint + this.editUser._id, "merchant", "POST")
        .then((res) => {
          var rowObj = {
            status: this.form.de_activate == true ? "active" :"deactive",
            id: this.form.id,
          };
          
          EventBus.emit("status-change", rowObj);
          this.closeModal();
          this.success(res.data.data);
        })
        .catch((err) => {
          console.log(err);
        });
    },

    /**
     * Method to update the user
     */
    updateUser() {
      this.apiRequest(`merchant/update-user/${this.form.id}`, "merchant", "POST", {
        id: this.form.id,
        name: this.form.name,
        email: this.form.email,
        role: this.form.role,
      })
        .then(() => {
          this.closeModal();
          this.$emit("update-user", this.form);
          this.success("Merchant updated successfully");
        })
        .catch((err) => {
          console.log(err.response.data);
        });
    },
  },
};
</script>

<style></style>
