<template>
  <div
    class="cursor-pointer q-px-none"
    v-for="(link, index) in links"
    :key="index"
  >
    <q-chip size="10px" class="text-primary light-bg" v-if="index<2">
      <a :href="link" target="_blank" style="text-decoration: none !important">
        Link {{ index + 1 }}
      </a>
    </q-chip>
  </div>
  <q-btn
    round
    size="9px"
    class="bg-grey"
    text-color="white"
    flat
    v-if="links.length > 2"
  >
    <span><span size="10px">+</span>{{ items.length }}</span>
    <q-menu>
      <q-list style="min-width: 80px" class="bg-secondary text-black shadow-4">
        <q-item
          v-close-popup
          v-for="(item, index) in links"
          :key="index"
          class="q-px-xs"
        >
          <!-- MenuList Component called at the time of multiple Urls-->
          <q-item-section clickable class="gap">
            <a
              :href="item"
              target="_blank"
              class="text-black font-12px text-center"
              style="text-decoration: none !important"
            >
              Link {{ index + (show + 1) }}
            </a>
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script>
/**
 * This component recieves the items props
 * from quick search page in Merchant Portal
 * It basically gives the list of the child Links
 * used in Urls searched in quick search page
 */
export default {
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    show: {
      type: Number,
      default: 2,
    },
  },
  computed: {
    additionalUrls() {
      let arr = this.items;
      arr = arr.length > this.show ? arr.splice(0, this.show) : [];
      return arr;
    },
    links() {
      let arr = this.items;
      arr =
        arr.length > this.show
          ? arr.splice(this.show - 1, arr.length - this.show)
          : arr;
      return arr;
    },
    
  },
};
</script>
