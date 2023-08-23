<template>
  <div class="col-3">
    <span
      class="font-15px text-weight-bold col-5 color-heading text-capitalize"
    >
      {{ field["label"] }}
    </span>
  </div>
  <div class="col-6">
    <div v-if="field['label'] == 'Categories' || field['label'] == 'Countries'">
      <span
        class="font-15px text-weight-medium sub_heading col-6"
        v-for="list in field['value']"
        :key="list"
      >
        {{ list.name ? list.name : list }},
      </span>
    </div>
    <div v-if="field['label'] == 'Category' || field['label'] == 'Country'">
      <div v-if="field['value'][0]._id">
        <span class="font-15px text-weight-medium sub_heading col-6" v-for="list in field['value']"
        :key="list">
          {{ list.name ? list.name : list }},
        </span>
      </div>
      <div v-else>
        
        <span class="font-15px text-weight-medium sub_heading col-6">
          {{ field["value"] }},
        </span>
      </div>
    </div>

    <span
      v-if="
        field['label'] != 'Category' &&
        field['label'] != 'Country' &&
        field['label'] != 'Categories' &&
        field['label'] != 'Countries'
      "
      class="font-15px text-weight-medium sub_heading col-6"
      v-html="field.value ? field.value : field"
    >
    </span>
  </div>
</template>

<script>
/**
 * Description : This component is use to show field name in report
 * @props {object} field
 */
export default {
  props: {
    field: {
      type: Object,
      default: () => ({}),
    },
  },
  setup() {},
};
</script>
