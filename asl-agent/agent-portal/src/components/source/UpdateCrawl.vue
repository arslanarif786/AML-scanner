<template>
  <div>
    <Modal
      :show="show"
      @closeModal="closeModal"
      title="Source Scheduling"
      :heightAuto="true"
    >
      <template v-slot:body>
        <div class="" style="max-width: 100%">
          <div class="row">
            <div class="col-12">
              <label for="crawl_time" class="font-14px text-weight-medium lh-15"
                >Crawl Time</label
              >
              <q-input
                class="q-my-sm quasar-input-h-50 qx-mb-sm"
                outlined
                id="crawl_time"
                type="time"
                name="crawlTime"
                v-model="crawlTime"
              >
              </q-input>
            </div>
            <div class="col-12">
              <label
                for="crawl_count"
                class="font-14px text-weight-medium lh-15"
                >Crawl Count</label
              >
              <q-input
                class="q-my-sm quasar-input-h-50 qx-mb-sm"
                outlined
                id="crawl_count"
                type="number"
                name="crawlCount"
                v-model="crawlFrequency"
              >
              </q-input>
            </div>
            <div class="col-12">
              <label for="crawl_turn" class="font-14px text-weight-medium lh-15"
                >Crawl Turn</label
              >
              <q-select
                class="q-my-sm quasar-input-h-50 qx-mb-sm"
                outlined
                id="crawl_turn"
                type="time"
                name="crawlTurn"
                v-model="crawlTurn"
                :options="crawlOptions"
                option-value="id"
                option-label="name"
              >
              </q-select>
            </div>
          </div>
        </div>
      </template>

      <template v-slot:action>
        <q-btn
          text-color="white"
          class="bg-primary q-px-lg q-mr-sm"
          label="save"
          unelevated
          no-caps
          :loading="loading"
          id="save-update-source"
          @click="isDefault ? UpdateDefaultParams() : UpdateSourceCrawlData()"
        />
      </template>
    </Modal>
  </div>
</template>

<script>
/**
 * description: this component is used to schedule priority to crawl a source
 * @props {String} sourceId
 * @props {Boolean} show
 */
import { ref } from "@vue/reactivity";
import Modal from "@/components/common/Modal.vue";

export default {
  props: {
    sourceId: {
      type: String,
      default: "",
    },
    show: {
      default: false,
      type: Boolean,
    },
    isDefault: {
      default: false,
      type: Boolean,
    },
  },
  components: {
    Modal,
  },
  watch: {
    show(val) {
      if (val) {
        this.isDefault
          ? this.fetchDefaultParams()
          : this.fetchSourceCrawlData(this.sourceId);
      }
    },
  },
  setup() {
    return {
      loading: false,
      crawlTime: ref(""),
      crawlFrequency: ref(""),
      crawlTurn: ref(""),
      crawlOptions: [
        {
          id: "-1",
          name: "Once",
        },
        {
          id: "1",
          name: "Every day",
        },
        {
          id: "3",
          name: "Bi-Weekly",
        },
        {
          id: "7",
          name: "Weekly",
        },
        {
          id: "15",
          name: "Bi-Monthly",
        },
        {
          id: "30",
          name: "Monthly",
        },
      ],
    };
  },

  methods: {
    /**
     * description: this method helps to close the modal
     */
    closeModal() {
      this.clearFields();
      this.$emit("closeModal", "create");
    },
    /**
     * description: this method checks if all the fields are empty or not.
     */
    validateFields() {
      return this.crawlTime || this.crawlFrequency || this.crawlTurn;
    },
    /**
     * description: this method helps to clear the form fields.
     */
    clearFields() {
      this.crawlTime = "";
      this.crawlFrequency = "";
      this.crawlTurn = "";
    },

    /**
     * description: this method helps to fetch the source crawl data. ID is provided in the parameter and it uses axios request to fetch data from the server
     * @param {String} id
     */
    fetchSourceCrawlData(id) {
      this.apiRequest(`agent/get-crawling-details/${id}`, "agent", "GET").then(
        (res) => {
          this.crawlTime = res.data.data[0].crawl_time;
          this.crawlFrequency = res.data.data[0].crawl_frequency;
          this.crawlTurn = this.crawlOptions.filter(
            (item) => item.id == res.data.data[0].next_turn
          )[0];
        }
      );
    },
    /**
     * description: this method helps to fetch the source crawl data. ID is provided in the parameter and it uses axios request to fetch data from the server
     * @param {String} id
     */
    fetchDefaultParams() {
      this.apiRequest(`agent/crawler-default-params`, "agent", "GET").then(
        (res) => {
          this.crawlTime = res.data.data.crawl_time;
          this.crawlFrequency = res.data.data.crawl_frequency;
          this.crawlTurn = this.crawlOptions.filter(
            (item) => item.id == res.data.data.next_turn
          )[0];
        }
      );
    },
    /**
     * description: this method helps to store the crawling scheduling info.
     */
    UpdateSourceCrawlData() {
      if (!this.validateFields()) {
        this.error("Please fill atleast on field");
        return;
      }
      this.loading = true;
      this.apiRequest(
        `agent/update-crawling-details/${this.sourceId}`,
        "agent",
        "POST",
        {
          crawl_time: this.crawlTime,
          crawl_frequency: this.crawlFrequency,
          next_turn: this.crawlTurn.id,
        }
      )
        .then(() => {
          this.success("Source scheduled successfully");
          this.closeModal();
        })
        .finally(() => {
          this.loading = false;
        });
    },
    /**
     * description: this method helps to store the crawling scheduling info.
     */
    UpdateDefaultParams() {
      if (!this.validateFields()) {
        this.error("Please fill atleast on field");
        return;
      }
      this.loading = true;
      this.apiRequest(`agent/crawler-default-params`, "agent", "POST", {
        crawl_time: this.crawlTime,
        crawl_frequency: this.crawlFrequency,
        next_turn: this.crawlTurn.id,
      })
        .then(() => {
          this.success("Crawler scheduled successfully");
          this.closeModal();
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style></style>
