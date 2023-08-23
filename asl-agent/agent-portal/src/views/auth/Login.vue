<template>
  <q-layout class="login_page" view="hHh lpR fFf">
    <div class="q-px-lg q-pt-lg">
      <span class="d-block text-right font-12px lh-10 color-secondary"
        >Having Trouble?
        <a href="mailto:" class="text-primary">Get Help</a></span
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
            style="width: 200px; height: 35.4px"
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
                Login
              </div>
              <div class="font-14px lh-10 color-secondary">
                Enter your credentials to access your account.
              </div>
            </q-card-section>
            <!-- Section for input fields -->
            <q-card-section>
              <q-form @submit="login" class="q-gutter-md">
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
                      field.label == 'Email'
                        ? fieldRules.email
                        : fieldRules.password,
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

                <div class="row align-center">
                  <!-- <q-checkbox
                    v-model="rememberLogin"
                    label="keep me logged in"
                    class="col"
                    dense
                  /> -->
                  <router-link
                    to="/forget-password"
                    class="font-13px lh-15 text-primary text-capitalize text-weight-medium"
                    style="justify-content: flex-end; display: flex; flex: auto"
                  >
                    Forget Password?</router-link
                  >
                </div>
                <div class="column">
                  <q-btn
                    id="loginbtn"
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
 * Description:This component is used to login
 */
import { ref } from "@vue/reactivity";
import { useRouter } from "vue-router";
export default {
  name: "Login",
  setup() {
    return {
      router: useRouter(),
      btnLabel: "Login",
      rememberLogin: ref(false),
      loading: ref(false),
      sourceTabPermission: ref(null),
      fieldRules: {
        email: (val) =>
          /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/.test(
            val
          ) || "Invalid email",
        password: (val) => !!val || "Password is required",
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
      ]),
    };
  },
  methods: {
    // Function for validating email pattern using regEx
    isValidEmail(val) {
      const emailPattern =
        /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
      return emailPattern.test(val) || "Invalid email";
    },
    /**
     * Method to login user by providing valid credentials,
     * after successfully logging in the system, it will check if user has permission of to view sources,
     * user will be redirected to the source route else user will be redirected to reports route
     */
    login() {
      if (!this.fields[0].value && !this.fields[1].value) {
        return this.error("Please fill required fields");
      }
      this.loading = true;
      this.apiRequest("login", "agent", "POST", {
        email: this.fields[0].value,
        password: this.fields[1].value,
      })
        .then((res) => {
          this.loading = false;
          this.saveResponseIntoLocalstorageAndRedirect(res);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    /**
     * Description: checkSecretLogin function is used to login secretly into account using an id which is given in query perameter
     * This function only work when admin want to login into an account by passing an id into the url and a secret_login=true perameter
     */
    checkSecretLogin() {
      this.loading = false;
      var secretLogin = this.$route.query.secret_login;
      var secretUserId = this.$route.query.id;

      if (secretLogin == "true") {
        this.apiRequest(`agent/secret-login/${secretUserId}`, "secret", "POST")
          .then((res) => {
            
            this.loading = false;
            this.saveResponseIntoLocalstorageAndRedirect(res);
          })
          .catch((err) => {
            console.log(err.response);
          });
      }
    },
    /**
     * Desc: This function is used to save response into localStorage and redirct to next component
     * @param {object} res
     */
    saveResponseIntoLocalstorageAndRedirect(res) {
      localStorage.setItem("userPermissions", res.data.data.user.permissions);
      localStorage.setItem("userName", res.data.data.user.name);
      localStorage.setItem("token", res.data.data.authorization.token);
      localStorage.setItem("user", JSON.stringify(res.data.data.user));
      this.sourceTabPermission = this.hasPermission("view source");
      this.router.push(
        this.sourceTabPermission == true ? "/sources" : "/reports"
      );
    },
  },
  created() {
    this.checkSecretLogin();
  },
};
</script>
<style lang="scss" scoped>
.login_page {
  background: url("~~@/assets/login-back.svg");
}
</style>
