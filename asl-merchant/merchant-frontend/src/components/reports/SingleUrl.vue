<template>
  <q-card
    flat
    class="my-card bg-white"
    style="min-width: 275px; border-radius: 4px"
  >
    <q-card-section>
      <div class="row">
        <div
          class="text-subtitle2 color-secondary font-12px text-weight-regular"
        >
          <q-chip
            size="10px"
            class="q-chip__content chip-spacing chip-bg-color cursor-pointer text-primary"
          >
            <span style="font-size: 13px"> {{ url.fuzziness.toFixed(2) }}% </span>
            <span class="match-margin" size="8px"> MATCH </span>
          </q-chip>
        </div>

        <div class="col q-pl-md q-pt-sm">
          <div class="text-h6 font-16px q-px-sm cursor-pointer">
            <a
              :href="url.origin"
              target="_blank"
              style="text-decoration: none !important"
              class="text-black"
            >
              {{ processReportName(url.source ? url.source.name : url.origin) }}
            </a>
          </div>
          <div
            class="text-subtitle2 color-secondary font-12px text-weight-regular q-px-sm q-pb-sm d-flex align-center"
          >
          
            Countries:
            <div
              v-if="country"
              :class="`flag flag-${(country ? country.short_code : '')} q-ml-sm`"
            >
              <q-tooltip>{{ url.source? url.source.country:'No Country' }}</q-tooltip>
            </div>
          </div>
        </div>
      </div>
    </q-card-section>

    <q-separator />

    <q-card-actions>
      <div
        class="text-subtitle2 font-12px text-weight-regular d-flex print-report-category col-12"
      >
        Category
        <q-chip
          size="10px"
          class="text-primary light-bg"
          v-if="url.source && url.source.category"
          >{{ url.source.category }}</q-chip
        >
        <div class="font-10px q-mx-sm" v-else>No category</div>
      </div>

      <div
        class="text-subtitle2 font-12px row content-center text-weight-regular print-report-category col-12"
      >
        Further References
        <!--  MenuList Component called at the time of multiple Urls  -->
        <MenuList :items="url['child_urls']" v-if="url['child_urls'].length" />
        <div class="font-10px q-mx-sm" v-else>No references found</div>
      </div>
    </q-card-actions>
  </q-card>
</template>

<script>
/**
 * This component is a single url which contain all data about urls
 * this function is use in listing all urls
 */
import { useRouter } from "vue-router";
import helpers from "@/js/helpers/helpers";
import Placeholder from "@/assets/reports/placeholder.jpeg";
import MenuList from "../common/MenuList.vue";
import { ref } from "vue";
export default {
  /**
   * It receieves props which contain all data about urls
   * including fuziness, name, type, country, created at
   * @props {Object} report
   */
  props: {
    url: {
      type: Object,
      default: () => ({
        fuzziness: 0,
        name: "",
        type: "",
        country: "",
        created_at: "12-20-2202",
      }),
    },
    reportCountry: {
      type: Array,
    },
  },
  components: {
    MenuList,
  },
  mounted(){
    //console.log("in single url",this.reportCountry);
    this.country = this.reportCountry.find(e => e.name === this.url.source.country);
  },
  computed: {
    createdAt() {
      return helpers.formatDate(this.url.created_at);
    },
  },
  setup() {
    return {
      helpers: helpers,
      image: Placeholder,
      router: useRouter(),
      country: ref({})
    };
  },
  methods: {
    /**
     * this method is used to format name of report
     * if it is greater than 20 chartacters.
     */
    processReportName(name) {
      return name.length > 20 ? name.substring(0, 20) + "..." : name;
    },
  },
};
</script>
<style scoped>
.print-report-category {
  overflow: auto !important;
  cursor: pointer !important;
}
.q-btn .q-chip {
  margin: initial !important;
}
.my-card.report-card {
  height: 340px !important;
}
.q-img {
  height: 200px !important;
  background-repeat: no-repeat !important;
  background-position: center !important;
  background-size: contain !important;
}
</style>
