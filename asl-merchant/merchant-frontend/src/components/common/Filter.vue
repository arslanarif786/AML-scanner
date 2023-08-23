<template>
  <q-btn
    v-if="isDate"
    color="primary"
    :label="label"
    :icon="icon"
    flat
    no-caps
    class="font-12px q-pa-xs q-mx-sm"
    id="date"
  >
    <q-popup-proxy
      @before-show="dateRange"
      cover
      transition-show="scale"
      transition-hide="scale"
    >
      <q-date
        @update:model-value="dateRange"
        :range="isDateRange"
        class="q-pa-sm"
        :model-value="dateValue"
        :options="optionsFn"
      >
        <div class="row items-center justify-end q-gutter-sm">
          <q-btn
            label="Cancel"
            color="primary"
            flat
            v-close-popup
            id="cancel-button"
          />
          <q-btn
            label="OK"
            id="ok-button"
            color="primary"
            flat
            v-close-popup
            @click="selectOption(dateValue, 'date')"
          />
        </div>
      </q-date>
    </q-popup-proxy>
  </q-btn>
  <q-btn-dropdown
    v-else
    color="primary"
    :label="label"
    :icon="icon"
    flat
    :id="label.toLowerCase().replaceAll(' ', '-')"
    @before-show="updateOptions"
    no-caps
    class="font-12px no-icon q-pa-xs q-mx-sm"
    dropdown-icon="none"
  >
    <div v-if="allowSearch">
      <q-input
        placeholder="search"
        id="search-bar"
        outlined
        class="q-pa-sm search-field"
        @update:model-value="search"
      />
    </div>
    <q-list>
      <q-item
        class="q-mx-sm"
        style="max-width: 200px !important"
        v-for="option in componentOptions"
        :key="option"
        clickable
        @click="selectOption(option[optionKey], '')"
        v-close-popup
      >
        <q-item-section>
          <q-item-label
            class="font-12px color-secondary lh-15 text-weight-medium"
          >
            <div
              v-if="isCountry"
              :class="`flag flag-${option['short_code'].toLowerCase()} q-mr-sm`"
            ></div>
            {{ option[optionValue] }}</q-item-label
          >
        </q-item-section>
      </q-item>
    </q-list>
    <div class="text-center q-my-sm" v-if="allowDateRange">
      <q-btn
        icon="event"
        flat
        color="primary"
        label="Custom Date"
        no-caps
        dense
        id="date-range"
        class="font-12px"
      >
        <q-popup-proxy
          @before-show="dateRange"
          cover
          transition-show="scale"
          transition-hide="scale"
        >
          <q-date
            @update:model-value="dateRange"
            range
            class="q-pa-sm"
            :model-value="dateValue"
          >
            <div class="row items-center justify-end q-gutter-sm">
              <q-btn
                label="Cancel"
                color="primary"
                flat
                v-close-popup
                id="cancel-button"
              />
              <q-btn
                label="OK"
                id="ok-button"
                color="primary"
                flat
                v-close-popup
                @click="selectOption(dateValue, '')"
              />
            </div>
          </q-date>
        </q-popup-proxy>
      </q-btn>
    </div>
  </q-btn-dropdown>
</template>

<script>
import { ref } from "@vue/reactivity";
import helpers from "@/js/helpers/helpers";
import { date } from "quasar";
export default {
  props: {
    label: {
      type: String,
      default: "",
    },
    icon: {
      type: String,
      default: "",
    },
    allowSearch: {
      type: Boolean,
      default: false,
    },
    allowDateRange: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Array,
      default: () => [],
    },
    isCountry: {
      type: Boolean,
      default: false,
    },
    isDate: {
      type: Boolean,
      default: false,
    },
    isDateRange: {
      type: Boolean,
      default: false,
    },
    optionValue: {
      type: String,
    },
    optionKey: {
      type: String,
    },
  },
  setup() {
    return {
      helpers: helpers,
      dateValue: ref(""),
      componentOptions: ref([]),
      optionsFn(d) {
        return d <= date.formatDate(Date.now(), "YYYY/MM/DD");
      },
    };
  },

  methods: {
    /**
     * this function helps to makes search from values in case of search is allowed
     * @param {string} e
     */
    search(e) {
      if (e) {
        this.componentOptions = this.options.filter((option) => {
          return option[this.optionValue]
            .toLowerCase()
            .includes(e.toLowerCase());
        });
      } else {
        this.componentOptions = this.options;
      }
    },

    /**
     * description: this function helps to update the option value in case of user selects any value
     * @param {Object} option
     * @param {string} type
     */
    selectOption(option, type) {
      if (this.isDateRange) {
        type
          ? type == "date"
            ? option.to
              ? option.to.length > 2
                ? this.$emit("filter-value", option)
                : this.error("Please select date range correctly")
              : this.error("Please select date range correctly")
            : ""
          : this.$emit("filter-value", option);
      } else {
        this.$emit("filter-value", option);
      }
    },
    /**
     * description: this function helps update the options in filter when user clicks it
     * @param {Object} option
     */
    updateOptions() {
      this.componentOptions = this.options;
    },
    dateRange(e) {
      console.log(e);
      this.dateValue = e;
    },
  },
};
</script>
<style lang="scss">
.no-icon .q-btn-dropdown__arrow {
  display: none !important;
}
.search-field .q-field__control {
  height: 30px !important;
}
</style>
