<template>
  <Modal
    :show="open"
    @closeModal="closeModal"
    title="Create Report"
    :heightAuto="true"
  >
    <template v-slot:body>
      <div class="row">
        <div class="col-6 q-pa-xs">
          <div class="q-my-xs">
            <label for="">Entity/Business Name</label>
          </div>
          <q-input
            outlined
            id="name"
            :dense="true"
            v-model="reportName"
            :rules="[(val) => !!val || 'Entity/Business is required']"
            placeholder="Enter Entity/Business of Report"
          />
        </div>
        <div class="col-6 q-pa-xs">
          <div class="q-my-xs">
            <label for="">Category</label>
          </div>
          <q-select
            v-model="reportCategory"
            use-input
            use-chips
            outlined
            multiple
            id="categories"
            dense
            option-value="_id"
            option-label="name"
            @new-value="createValue"
            :options="filterOptions"
            @filter="filterCategories"
          />
        </div>
        <div class="col-6 q-pa-xs">
          <div class="q-my-xs">
            <label for="">Country</label>
          </div>
          <q-select
            v-model="reportCountry"
            use-input
            use-chips
            outlined
            id="countries"
            multiple
            dense
            option-value="short_code"
            option-label="name"
            input-debounce="0"
            :options="filterCountryOptions"
            @filter="filterCountries"
          >
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps" class="d-flex align-center">
                <div>
                  <div
                    :class="`flag flag-${scope.opt[
                      'short_code'
                    ].toLowerCase()} q-mr-sm`"
                  ></div>
                  {{ scope.opt.name }}
                </div>
              </q-item>
            </template>
          </q-select>
        </div>
        <div class="col-6 q-pa-xs">
          <div class="q-my-xs">
            <label for="">Birth/Incorporation Date</label>
          </div>
          <q-input
            outlined
            id="birthIncorporationDate"
            dense
            v-model="birthIncorporationDate"
            type="date"
            placeholder="Select Date"
          />
        </div>
        <div class="col-6 q-pa-xs">
          <q-checkbox
            true-value="company"
            false-value="person"
            id="entityType"
            v-model="entityType"
            size="sm"
            dense
            label="is Company ?"
          />
        </div>
      </div>
    </template>

    <template v-slot:action>
      <q-btn
        flat
        text-color="white"
        class="q-pa-md q-mr-sm"
        unelevated
        no-caps
        id="cancel-button"
        @click="closeModal"
      >
        <span class="text-primary q-pl-xs">Cancel</span>
      </q-btn>
      <q-btn
        id="create-button"
        text-color="white"
        class="bg-primary q-pa-md q-mr-sm float-right"
        label="Create"
        unelevated
        no-caps
        :disable="!reportName"
        @click="createReport(reportName, reportCategory, reportCountry)"
      />
    </template>
  </Modal>
</template>

<script>
/**
 * description: this component helps to show a modal to create a new report and takes the name of the report, category and country as input
 * @props {Boolean} show
 */
import { useRouter } from "vue-router";
import Modal from "@/components/common/Modal.vue";
import { toRef, ref } from "@vue/reactivity";
export default {
  name: "ReportNameModal",
  props: {
    show: {
      default: false,
      type: Boolean,
    },
  },
  components: {
    Modal,
  },

  setup(props) {
    return {
      model: ref(null),
      filterOptions: ref([]),
      filterCountryOptions: ref([]),
      router: useRouter(),
      open: toRef(props, "show"),
      reportName: ref(""),
      reportCountry: ref([]),
      reportCategory: ref([]),
      categoryOptions: ref([]),
      countryOptions: ref([]),
      birthIncorporationDate: ref(""),
      entityType: ref("person"),
    };
  },

  methods: {
    filterCategories(val, update) {
      update(() => {
        if (val === "") {
          this.filterOptions = this.categoryOptions;
        } else {
          const needle = val.toLowerCase();
          this.filterOptions = this.categoryOptions.filter(
            (v) => v.name.toLowerCase().indexOf(needle) > -1
          );
        }
      });
    },
    filterCountries(val, update) {
      update(() => {
        if (val === "") {
          this.filterCountryOptions = this.countryOptions;
        } else {
          const needle = val.toLowerCase();
          this.filterCountryOptions = this.countryOptions.filter(
            (v) => v.name.toLowerCase().indexOf(needle) > -1
          );
        }
      });
    },
    createValue(val, done) {
      if (val.length > 0) {
        if (!this.categoryOptions.includes(val)) {
          this.saveCategory(val);
          this.categoryOptions.push(val);
        }
        done(val, "toggle");
      }
    },
    saveCategory(val) {
      this.apiRequest(`agent/categories`, "agent", "POST", { name: val }).then(
        () => {
          this.success("New Category Added");
        }
      );
    },
    /**
     * description: this method helps to close the modal
     */
    closeModal() {
      this.$emit("closeModal");
    },

    /**
     * description: this method helps to pass values to the create report so that user can add fields and save the report
     * @param {String} reportName
     * @param {String} reportCategory
     * @param {String} reportCountry
     */
    createReport(reportName, reportCategory, reportCountry) {
      let categories = reportCategory.map((ele) => {
        return ele.name;
      });
      let countries = reportCountry.map((ele) => {
        return ele.short_code;
      });
      this.router.push(
        `/create-report?name=${reportName}&categories=${JSON.stringify(
          categories
        )}&countries=${JSON.stringify(countries)}&birthIncorporationDate=${
          this.birthIncorporationDate
        }&entityType=${this.entityType}`
      );
    },
    /**
     * description: this method helps to get the list of countries from the server
     */
    getAllCountries() {
      this.apiRequest(`agent/countries`, "agent", "GET", {}).then((res) => {
        this.countryOptions = res.data.data;
        this.filterCountryOptions = this.countryOptions;
      });
    },

    /**
     * description: this method helps to get the list of categories and countries from the server
     */
    getAllCategories() {
      this.apiRequest(`agent/categories`, "agent", "GET", {}).then((res) => {
        this.categoryOptions = res.data.data;
        this.filterOptions = this.categoryOptions;
      });
    },
  },
  mounted() {
    this.getAllCategories();
    this.getAllCountries();
  },
};
</script>
