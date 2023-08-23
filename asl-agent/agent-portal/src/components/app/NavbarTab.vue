<template>
  <div>
    <q-tabs align="center" class="" no-caps>
      <!-- Tab for Source and Reports -->
      <q-route-tab
        :to="navTab.path"
        class="text-primary font-14 lh-15"
        :label="navTab.label"
        v-if="!navTab.isDropdown"
      />
      <!-- Dropdown tab for User Management -->
      <q-btn-dropdown
        style="font-size: 14px !important"
        no-caps
        class="text-primary q-py-md"
        v-if="navTab.isDropdown == true"
        auto-close
        stretch
        flat
        :label="navTab.label"
      >
        <q-list v-for="(list, index) in navTab.child" :key="index">
          <q-item class="text-primary" clickable :to="list.path">
            <q-item-section class="management-label">{{
              list.label
            }}</q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </q-tabs>
  </div>
</template>

<script>
export default {
  props: ["navTab"],
};
</script>

<style lang="scss" scoped>
.management-label {
  font-family: "Lato", sans-serif !important;
  font-size: 14px !important;
}
</style>
