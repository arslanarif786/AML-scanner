<template>
  <section class="screen-bg default-height password-section-spacing global-font-color">
    <div class="q-pl-sm q-pt-md q-pb-md">
    </div>

    <div class="justify-center screen-bg password-main-spacing">
      <h6 class="row text-bold q-mb-lg password-spacing font-16px"> Change Password </h6>
      <div class="row items-center justify-center w-100">

        <div class="q-mr-xl col-4">
          <!-- Old Password field -->
          <div class="q-mb-sm"> Old Password </div>
          <q-input outlined dense v-model="oldPassword" :type="isPwd ? 'password' : 'text'" label="Enter Old Password" label-color=""
            :rules="[
              (val) =>
                val.length >= 6 || 'Password minimum 6 characters',
            ]">
            <template v-slot:append>
              <q-icon :name="isPwd ? 'visibility' : 'visibility_off'" class="cursor-pointer eye-color" @click="isPwd = !isPwd" />
            </template>
          </q-input>
        </div>

        <div class="col-4">
          <!-- New Password field -->
          <div class="q-mb-sm"> New Password </div>
          <q-input outlined dense v-model="newPassword" label="Enter New Password" :type="isPwd2 ? 'password' : 'text'"
            :rules="[
              (val) =>
                val.length >= 6 || 'Password minimum 6 characters',
            ]">
            <template v-slot:append>
              <q-icon :name="isPwd2 ? 'visibility' : 'visibility_off'" class="cursor-pointer eye-color"
                @click="isPwd2 = !isPwd2" />
            </template>
          </q-input>
        </div>
      </div>
      <div class="row items-center justify-center w-100">
        <!-- Confirm New Password field -->
        <div class="col-4 q-mr-xl ">
          <div class="q-mb-sm"> Confirm New Password </div>
          <q-input outlined dense v-model="confirmPassword" label="Re-Enter New Password"
            :type="isPwd3 ? 'password' : 'text'" :rules="[
              (val) =>
                val.length >= 6 || 'Password minimum 6 characters',
              (val) =>
                val == newPassword || 'Password do not match',
            ]">
            <template v-slot:append>
              <q-icon :name="isPwd3 ? 'visibility' : 'visibility_off'" class="cursor-pointer eye-color"
                @click="isPwd3 = !isPwd3" />
            </template>
          </q-input>
        </div>
        <div class="col-4"></div>
      </div>
      <div class="row justify-start" style="padding: 0 0px 20px 170px;">
        <q-btn color="white" class="back-color" no-caps unelevated label="Update" :loading="loading" @click="changePassword"
          style="margin-top: 30px;" />
      </div>

    </div>
  </section>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router';
/**
  * Description: This component is used to update the password in Merchant Portal
  * It takes old password and sets new and confirm new password
  */

export default {
  setup() {

    return {
      loading: ref(false),
      user: JSON.parse(localStorage.getItem("user")),
      request: ref({}),
      isPwd: ref(true),
      isPwd3: ref(true),
      isPwd2: ref(true),
      oldPassword: ref(''),
      newPassword: ref(''),
      confirmPassword: ref(''),
      router: useRouter()
    }
  },
  methods: {
    /**
     * This method update new password in it.
     */
    changePassword() {
      this.loading = true
      this.apiRequest(
        `merchant/change-password/${this.user._id}`,
        "merchant",
        "POST",
        {
          old_password: this.oldPassword,
          new_password: this.newPassword,
          new_password_confirmation: this.confirmPassword,
          user_id: this.user._id
        })
        .then(() => {
          this.success('Password Updated successfully!')
          this.clearFields();
        })
        .finally(() => {
          this.loading = false;
        });
    },

    clearFields() {
      this.oldPassword = null
      this.newPassword = null
      this.confirmPassword = null
    }
  }
}
</script>