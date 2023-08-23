<template>
  <q-layout class="login_page" view="hHh lpR fFf">
    <div class="q-px-lg q-pt-lg">
      <span class="d-block text-right font-12px lh-10 color-secondary"
        >Having Trouble? <a href="#" class="text-primary">Get Help</a></span
      >
    </div>
    <q-page class="d-flex justify-center auth-height">
      <div>
        <span
          class="text-weight-bold font-26px text-center color-heading d-block q-my-xl"
          color="heading"
        >
          <!-- ASL Logo -->
          <img
            src="@/assets/auth/logo.svg"
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
                Reset Password
              </div>
              <div class="font-14px lh-10 color-secondary">
                Enter your new password to reset your password.
              </div>
            </q-card-section>
            <!-- Section for text fields -->
            <q-card-section>
              <q-form @submit="resetPassword" class="q-gutter-md">
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
                      field.label == 'New Password'
                        ? fieldRules.password
                        : field.label == 'Confirm New Password'
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

                <!-- Section for action button -->
                <div class="column">
                  <q-btn
                    id="resetbtn"
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
/**
 * Description:This component is used to reset password
 */
import { ref } from "@vue/reactivity";
import { useRoute, useRouter } from "vue-router";
export default {
  name: "ResetPassword",

  setup() {
    return {
      btnLabel: "Reset Password",
      router: useRouter(),
      loading: ref(false),
      queryEmail: ref(""),
      queryToken: ref(""),
      fieldRules: {
        password: (val) => !!val || "Password is required",
        confirmPasword: (val) => !!val || "Confirm Password is required",
      },
      fields: ref([
        {
          value: "",
          type: "password",
          label: "New Password",
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
          label: "Confirm New Password",
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
  },
  methods: {
    /**
     * Method to reset password
     * This method will pass valid email, token, and password to reset user's password
     */
    resetPassword() {
      //If text fields are empty
      if (!this.fields[0].value && !this.fields[1].value) {
        return this.error("Please fill required fields");
      }
      this.loading = true;
      this.apiRequest("resetPassword", "agent", "POST", {
        token: this.queryToken,
        password: this.fields[0].value,
        password_confirmation: this.fields[1].value,
        email: this.queryEmail,
      })
        .then(() => {
          this.loading = false;
          this.router.push({
            path: "/",
          });
          this.fields[0].value = "";
          this.fields[1].value = "";
        })
        .catch((error) => {
          console.log(error.response.data);
          this.loading = false;
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
