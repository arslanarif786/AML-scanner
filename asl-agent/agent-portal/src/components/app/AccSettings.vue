<template>
  <q-btn-dropdown color="transparent" flat text-color="dark" no-caps>
    <template v-slot:label>
      <div class="row items-center no-wrap">
        <!-- <q-avatar size="32px" class="q-mx-sm">
            <img :src="avatar" />
          </q-avatar> -->
        <div class="text-center font-14px text-weight-medium text-dark">
          {{ username }}
        </div>
      </div>
    </template>
    <q-list>
      <q-item
        v-for="setting in accountSettings"
        :key="setting.label"
        clickable
        v-close-popup
        @click="setting.method"
      >
        <q-item-section @click="setting.method" id="logout">
          <q-item-label>{{ setting.label }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>

<script>
export default {
  props: {
    avatar: {
      type: String,
      default: "",
    },
    username: {
      type: String,
      default: "",
    },
    accountSettings: {
      type: Array,
      default: () => [],
    },
  },
  setup(props) {
    return {
      ...props,
    };
  },

};
</script>
