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
                Enter your email to send reset password link.
              </div>
            </q-card-section>
            <q-card-section>
              <q-form @submit="sendResetLink" class="q-gutter-md">
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
                    :rules="[fieldRules.email]"
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
                <div class="row align-center">
                  <router-link
                    to="/"
                    class="font-13px lh-15 text-primary text-capitalize text-weight-medium"
                    style="justify-content: flex-end; display: flex; flex: auto"
                  >
                    Go to Login</router-link
                  >
                </div>
                <div class="column">
                  <q-btn
                    id="forgetbtn"
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
 * Description:This component is used to retain password 
 */
import { ref } from "@vue/reactivity";
import { useRouter } from "vue-router";

export default {
  name: "ForgetPassword",
  setup() {
    return {
      router: useRouter(),
      btnLabel: "Send Reset Link",
      loading: ref(false),
      fieldRules: {
        email: (val) =>
          /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/.test(
            val
          ) || "Invalid email",
      },
      fields: ref([
        {
          value: "",
          type: "email",
          label: "Email",
          placeholder: "Enter Email Address",
          appendIcon: "false",
          icon: "",
        },
      ]),
    };
  },
  methods: {
    /**
     * This method will send reset password link to the provided email
     * from where user can reset their password
     * */
    sendResetLink() {
      if (!this.fields[0].value) {
        return this.error("Please fill required fields");
      }
      this.loading = true;
      this.apiRequest("forgot", "agent", "POST", {
        email: this.fields[0].value,
      })
        .then(() => {
          this.router.push({
            path: "/verify-email",
          });
          localStorage.setItem("forgot-email", this.fields[0].value);
          this.loading = false;
        })
        .catch((err) => {
          console.log(err.response);
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
