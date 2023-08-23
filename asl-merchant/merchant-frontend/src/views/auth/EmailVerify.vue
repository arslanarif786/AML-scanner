<template>
  <q-layout class="login_page" view="hHh lpR fFf">
    <q-page class="d-flex justify-center">
      <div>
        <span
          class="text-weight-bold font-26px text-center color-heading d-block q-my-xl"
          color="heading"
        >
          <img
            src="@/assets/auth/logo.png"
            style="width: 141px; height: 25px"
          />
          <!-- ASL Logo -->
        </span>
        <div class="row justify-center">
          <q-card
            class="w-500 q-pa-lg"
            style="box-shadow: 0px 4px 40px rgba(239, 240, 241, 0.6)"
          >
            <q-card-section class="text-center q-mb-md">
              <img
                src="@/assets/auth/email.png"
                style="width: 82px; height: 82px"
              />
              <div
                class="font-24px lh-25 text-weight-bold color-heading q-mt-md"
              >
                Verify Your Email
              </div>
              <div class="font-14px color-secondary q-mt-md">
                An email has been sent to {{ email }} with a link to verify your
                account. If you do not have received the email, Please check
                your spam box or contact support team.
              </div>
            </q-card-section>
            <q-card-section>
              <div class="column">
                <router-link
                  to="/"
                  class="font-13px text-center text-primary text-capitalize text-weight-medium"
                >
                  Back to Login</router-link
                >
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </q-page>
  </q-layout>
</template>
<script>
export default {
  name: "EmailVerify",
  setup() {
    return {};
  },
  // Setting provided email for resetting password in local storage
  mounted() {
    this.email = localStorage.getItem("forgot-email");
  },
  // Setting provided email empty in local storage on page destroying
  unmounted() {
    this.email = localStorage.setItem("forgot-email", "");
  },
};
</script>
<style lang="scss" scoped>
.login_page {
  background: url("~~@/assets/login-back.svg");
}
</style>
