<template>
  <q-layout class="login_page" view="hHh lpR fFf">
    <q-page class="d-flex justify-center">
      <div>
        <span
          class="text-weight-bold font-26px text-center color-heading d-block q-my-xl"
          color="heading"
        >
          <!-- ASL Logo -->
          <img
            src="@/assets/auth/logo.png"
            style="width: 141px; height: 25px"
          />
        </span>
        <div class="row justify-center">
          <q-card
            class="w-500 q-pa-lg"
            style="box-shadow: 0px 4px 40px rgba(239, 240, 241, 0.6)"
          >
            <q-card-section class="text-center q-mb-md">
              <div
                class="font-24px lh-25 text-weight-bold color-heading q-mb-md"
              >
                First Time Login
              </div>
              <div class="font-14px lh-10 color-secondary">
                Setup your account to login to the platform.
              </div>
            </q-card-section>
            <!-- Section for input fields -->
            <q-card-section>
              <q-form @submit="setPassword" class="q-gutter-md">
                <template v-for="field in fields" :key="field.label">
                  <label
                    :for="field.label"
                    class="font-14px text-weight-medium lh-15"
                    >{{ field.label }}</label
                  >
                  <q-input
                    class="q-my-sm quasar-input-h-50 qx-mb-sm"
                    outlined
                    :id="field.label"
                    :type="field.type"
                    :name="field.label"
                    :placeholder="field.placeholder"
                    v-model="field.value"
                    :rules="[
                      field.label == 'Name'
                        ? fieldRules.name
                        : field.label == 'Password'
                        ? fieldRules.password
                        : field.label == 'Confirm Password'
                        ? fieldRules.confirmPasword
                        : '',
                    ]"
                  >
                    <template v-slot:append v-if="field.appendIcon">
                      <span
                        class="material-icons cursor-pointer"
                        @click="field.method(field)"
                      >
                        {{ field.icon }}
                      </span>
                    </template>
                  </q-input>
                </template>

                <!-- Section for button -->
                <div class="column">
                  <q-btn
                    id="firstlogin"
                    :label="btnLabel"
                    type="submit"
                    color="primary"
                    :loading="loading"
                    :unelevated="true"
                    class="h-50 q-mt-lg"
                    :no-caps="true"
                  />
                </div>
              </q-form>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </q-page>
  </q-layout>
</template>
<script>
import { ref } from "@vue/reactivity";
import { useRoute, useRouter } from "vue-router";
export default {
  name: "FirstTimeLogin",
  setup() {
    return {
      router: useRouter(),
      btnLabel: "Set Up Account",
      loading: ref(false),
      queryEmail: ref(""),
      queryToken: ref(""),
      queryRoleId: ref(""),
      fieldRules: {
        name: (val) => !!val || "Name is required",
        password: (val) => !!val || "Password is required",
        confirmPasword: (val) => !!val || "Confirm Password is required",
      },
      fields: ref([
        {
          value: "",
          type: "text",
          label: "Name",
          placeholder: "Enter Name",
          appendIcon: "false",
          icon: "",
        },
        {
          value: "",
          type: "password",
          label: "Password",
          placeholder: "Enter Password",
          appendIcon: "true",
          icon: "visibility",
          method: (field) => {
            field.type == "text"
              ? (field.type = "password")
              : (field.type = "text");
            field.type == "text"
              ? (field.icon = "visibility_off")
              : (field.icon = "visibility");
          },
        },
        {
          value: "",
          type: "password",
          label: "Confirm Password",
          placeholder: "Enter Password",
          appendIcon: "true",
          icon: "visibility",
          method: (field) => {
            field.type == "text"
              ? (field.type = "password")
              : (field.type = "text");
            field.type == "text"
              ? (field.icon = "visibility_off")
              : (field.icon = "visibility");
          },
        },
      ]),
    };
  },

  /**
   * On component mount, Token and Email is being fetched through router query params,
   * This route will be visited after clicking on link through email
   */
  mounted() {
    const route = new useRoute();
    this.queryToken = route.query.invitation_code;
    this.queryEmail = route.query.email;
    this.queryRoleId = route.query.role_id;
  },
  methods: {
    /**
     * Method to set name, and password for the user's first time login
     */
    setPassword() {
      if (
        !this.fields[0].value &&
        !this.fields[1].value &&
        !this.fields[2].value
      ) {
        return this.error("Please fill required fields");
      }
      this.loading = true;
      this.apiRequest("register", "merchant", "POST", {
        name: this.fields[0].value,
        email: this.queryEmail,
        password: this.fields[1].value,
        token: this.queryToken,
        role_id: this.queryRoleId,
      })
        .then(() => {
          this.loading = false;
          this.router.push({
            path: "/",
          });
        })
        .catch((err) => {
          this.loading = false;
          console.log(err.response.data, "err");
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.login_page {
  background: url("~~@/assets/login-back.svg");
}
</style>
