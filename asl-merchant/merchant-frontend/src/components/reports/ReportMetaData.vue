<template>
  <q-expansion-item
    class="q-my-sm"
    default-opened
    :header-style="{ backgroundColor: '#F2F2F7' }"
    header-class="q-mr-sm"
  >
    <template v-slot:header>
      <q-item-section class="font-16px color-heading text-weight-bold default-bg"> Report Details </q-item-section>
    </template>

    <q-card class="screen-bg">
      <q-card-section>
        <div class="row justify-between font-16px">
          <div class="col-md-2 col-sm-3">
            <q-img
              :src="image"
              spinner-color="primary"
              spinner-size="30px"
              height="200px"
              width="200px"
              class="d-block q-mx-auto rounded-borders"
            />
          </div>

          <div :class="`col-md-9 col-sm-8 row`">
            <div
              class="col-12 row q-py-md"
              :class="{
                'border-bottom': index !== fields.length - 1,
              }"
              v-for="(field, index) in fields"
              :key="field['label']"
            >
              <ReportField
                :field="{ label: field['label'], value: report[field.key] }"
              />
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-expansion-item>
</template>

<script>
import ReportField from "@/components/reports/ReportField";
export default {
  components: {
    ReportField,
  },
  props: {
    image: {
      type: String,
    },
    report: {
      type: Object,
      default: () => ({}),
    },
  },
  setup() {
    return {
      fields: [
        {
          label: "Name",
          key: "report_name",
        },
        {
          label: "Entity Type",
          key: "entity_type",
        },
        {
          label: "Birth/Incorporation Date",
          key: "birth_incorporation_date",
        },
        {
          label: "Categories",
          key: "categories",
        },
        {
          label: "Countries",
          key: "countries",
        },
      ],
    };
  },
};
</script>
