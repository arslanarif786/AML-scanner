<template>
  <div v-if="showFilter">
    <q-card class="text-black" flat>
      <q-card-section class="q-px-none screen-bg">
        <div class="row q-mb-md">
          <!-- Birth/Incorporation Date field -->
          <div class="col q-mx-md">
            <span class="font-13px">Birth/Incorporation Date</span>
            <q-input
              outlined
              @update:model-value="$emit('update:birth', $event)"
              :model-value="birth"
              color="primary"
              :dense="true"
              placeholder="26/07/21"
            >
              <Filter
                icon="date_range"
                :isDate="true"
                @filter-value="updateBirthValue"
              />
            </q-input>
          </div>

          <!-- country field -->
          <div class="col q-mx-md">
            <span class="font-13px">Country</span>

            <q-select
              @update:model-value="$emit('update:reportCountry', $event)"
              :model-value="reportCountry"
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
          <!-- entity type field -->
          <div class="col q-mx-md">
            <span class="font-13px">Entity Type</span>
            <q-select
              @update:model-value="$emit('update:entityType', $event)"
              :model-value="entityType"
              outlined
              dense
              @new-value="createValue"
              :options="['person', 'company']"
              @filter="filterCategories"
            />
          </div>
          <!-- fuzziness field -->
          <div class="col q-mx-md">
            <span class="font-13px">Fuzziness</span>
            <q-slider
              @update:model-value="$emit('update:fuzziness', $event)"
              :model-value="fuzziness"
              :min="0"
              :max="100"
              switch-label-side
              label-always
            />
          </div>
        </div>

        <!-- sources(category) loader component -->
        <q-spinner-dots
          color="primary"
          size="50px"
          class="d-block q-mx-auto q-my-lg"
          v-if="categoriesLoading"
        />

        <!-- sources(category) field -->
        <div v-else>
          <div class="row justify-start">
            <div class="q-pl-md q-pt-lg q-pr-sm">Sources</div>
            <div class="row wrap q-pa-sm q-mb-sm">
              <div
                class="q-pa-sm col-3"
                v-for="(filterCat, index) in filterOptions"
                :key="index"
              >
              <!-- checkboxes -->
                <q-checkbox
                  @update:model-value="$emit('update:reportCategory', $event)"
                  :model-value="reportCategory"
                  :val="filterCat['name']"
                  :label="filterCat['name']"
                  size="30px"
                />
              </div>
            </div>
          </div>
        </div>
        <!-- Clear Filter button -->
        <div class="row justify-end">
          <q-btn
            class="screen-bg font-13px text-bold text-primary q-py-sm q-mr-sm"
            unelevated
            no-caps
            @click="$emit('clear-filters')"
            label="Clear Filters"
          />
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { ref } from "@vue/reactivity";
import helpers from "@/js/helpers/helpers";
import Filter from "../../components/common/Filter.vue";
import { EventBus } from "@/js/helpers/EventBus.js";

/**
 * This component is used to filter the specific data
 * that is used in quick search page in Merchant Portal
 * user can search through multiple filters..
 */
export default {
/**
 * This component recieves the props from its parent component
 * props are the specific data that is used for filter searched
 * in Merchant Portal
 */
  props: {
    showFilter: {
      type: Boolean,
    },
    birth: {
      type: String,
    },
    reportCountry: {
      type: Array,
    },
    reportCategory: {
      type: Array,
    },
    fuzziness: {
      type: Number,
    },
    entityType: {
      type: String,
    },
  },

  components: {
    Filter,
  },

  setup() {
    return {
      categoriesLoading: ref(false),
      loading: ref(false),
      filterCountryOptions: ref([]),
      categoryOptions: ref([]),
      filterOptions: ref([]),
      helpers: helpers,
      countryOptions: ref([]),
    };
  },
  methods: {
    /**
     * This Method is used to create category values
     * @param {Object} val
     */
    createValue(val, done) {
      if (val.length > 0) {
        if (!this.categoryOptions.includes(val)) {
          this.saveCategory(val);
          this.categoryOptions.push(val);
        }
        done(val, "toggle");
      }
    },
    /**
     * This Method is used to get all the countries value from API
     * If credentials are correct, success message will return
     * If credentials are wrong, error message will return
     * @param Request $request
     * @return object
     */
    getAllCountries() {
      this.apiRequest(`agent/countries`, "agent", "GET", {}).then((res) => {
        this.countryOptions = res.data.data;
        this.filterCountryOptions = this.countryOptions;
        EventBus.emit("report-country", this.countryOptions);
      });
    },
    /**
     * This Method is used to get all the categories value from API
     * If credentials are correct, success message will return
     * If credentials are wrong, error message will return
     * @param Request $request
     * @return object
     */
    getAllCategories() {
      this.categoriesLoading = true;
      this.apiRequest(`agent/categories`, "agent", "GET", {})
        .then((res) => {
          this.categoryOptions = res.data.data;
          this.filterOptions = this.categoryOptions;
        })
        .finally(() => {
          this.categoriesLoading = false;
        });
    },
    /**
     * This Method is used to filter all the category value
     * @param {Object} val
     */
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
    /**
     *  This Method is used to filter all the countries value
     */
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
    /**
     * This Method is used to update Birth value
     * replace /instead of -
     * @param {Object} data
     * @return object
     */
    updateBirthValue(data) {
      this.$emit("update:birth", data);
    },
  },
  mounted() {
    this.getAllCountries();
    this.getAllCategories();
  },
};
</script>
