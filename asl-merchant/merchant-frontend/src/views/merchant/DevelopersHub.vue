<template>
  <section class="screen-bg default-height layout-padding">
    <div class="q-pa-md">
      <h5 class="q-pa-sm q-pt-md font-16px text-bold global-font-color">Generate Secret Key</h5>
    </div>

    <div class="justify-center screen-bg q-pa-md hub-spacing">
      <div class="row justify-between items-center w-100 q-pl-sm" style="margin-top: 20px">
        <div class="col-xs-12 col-sm-5 col-md-4 col-lg-5 q-pr-md">
          <!-- Client key -->
          <div class="q-mb-sm">Client Key</div>
          <q-input outlined dense v-model="clientKey" disable />
        </div>

        <div class="col-xs-12 col-sm-5 col-md-4 col-lg-5 q-pr-md">
          <!-- Secret key -->
          <div class="q-mb-sm">Client Secret</div>
          <q-input color="global-font-color" outlined dense v-model="secretKey" :type="isPwd ? 'password' : 'text'">
            <template v-slot:append>
              <q-icon :name="isPwd ? 'visibility' : 'visibility_off'" class="cursor-pointer eye-color" @click="isPwd = !isPwd" />
            </template>
          </q-input>
        </div>

        <div class="col-xs-12 col-sm-6 col-md-3 col-lg-2">
          <q-btn color="primary no-shadow" class="secret-key-btn" :loading="loading" no-caps unelevated label="Generate Secret Key" @click="handleRequest()"/>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
/**
  * Description: This component is used to get ClientKey and SecretKey in Merchant Portal
  * It also generates the new secret key against same client
  */

import { ref } from "vue";

export default {
  setup() {
    return {
      loading: ref(false),
      clientKey: ref(JSON.parse(localStorage.getItem("clientKey"))),
      secretKey: ref(JSON.parse(localStorage.getItem("secretKey"))),
      isPwd: ref(true),
      user: ref(JSON.parse(localStorage.getItem("user"))),
    };
  },
  /**
   * description: in mounted we use api get method to fetch client key & secret key for developers hub.
   * @param {Object} request
   */
  mounted() {
    let secrets = JSON.parse(localStorage.getItem("secrets"));
    this.clientKey = secrets.client_key;
    this.secretKey = secrets.client_secret;
  },
  methods: {
    /**
     * description: handleRequest is used to handle request to fetch new client key & new secret key
     * @param {Object} request
     */
    handleRequest() {
      this.loading = true;
      this.apiRequest(
        `search/client-credentials/${this.user._id}`,
        "report",
        "POST",
        {}
      )
        .then((res) => {
          localStorage.setItem(
            "secrets",
            JSON.stringify({
              client_key: res.data.data.client_key,
              client_secret: res.data.data.client_secret,
            })
          );
          this.clientKey = res.data.data.client_key;
          this.secretKey = res.data.data.client_secret;
          this.success('Client Secret Updated!')
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>
