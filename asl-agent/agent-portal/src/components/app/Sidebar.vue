<template>
  <div class="q-pa-md">
    <q-header class="h-55">
      <q-toolbar>
        <q-toolbar-title>
          <div class="row justify-between font-18px">
            <!-- Page Title -->
            <div
              v-if="$route.name.includes('Sources')"
              class="text-bold  q-pt-sm q-pl-sm"
            >
              Sources
            </div>
            <div
              v-else-if="$route.name.includes('Reports')"
              class="text-bold q-pt-sm q-pl-sm"
            >
              Reports
            </div>
            
            <div
              v-else-if="
                $route.name.includes('Users') ||
                $route.name.includes('RolesPermissions')
              "
              class="text-bold q-pt-sm q-pl-sm"
            >
              User Management
            </div>
          
            <div v-else class="text-bold  q-pt-sm q-pl-sm">
               Activity Logs
            </div>
            <!-- Account Settings Component -->
            <div class="cursor-pointer">
              <AccSettings
                :username="username"
                :accountSettings="accountSettings"
              />
            </div>
          </div>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-drawer
      v-model="drawer"
      show-if-above
      :width="200"
      :breakpoint="500"
      class="drawer-back default-bg"
    >
      <q-scroll-area class="fit">
        <div class="cursor-pointer text-weight-bold logo-spacing font-20 lh-25">
          <!-- AML Logo -->
          <router-link to="/sources">
            <img
              src="@/assets/auth/logo.svg"
              style="width: 141px; margin: 10px 5px 15px 16px; height: 25px"
            />
          </router-link>
        </div>
        <!-- SIDEBAR routes -->
        <div class="q-pl-sm q-gutter-sm">
          <q-tree
            class="cursor-pointer"
            :nodes="tabs"
            node-key="label"
            icon="navigate_next"
            selected-color="primary"
            v-model:selected="selected"
            no-selection-unset
            no-connectors
          />
        </div>
      </q-scroll-area>
    </q-drawer>
  </div>
</template>
<script>
import AccSettings from "@/components/app/AccSettings.vue";
import { ref } from "vue";
import Search from "@/assets/sidebar/Search.svg";
import ZoomIn from "@/assets/sidebar/Zoom in.svg";
import Coins from "@/assets/sidebar/Coins.svg";
import Settings from "@/assets/sidebar/Settings.svg";
import User from "@/assets/sidebar/User.svg";
import { useRoute, useRouter } from "vue-router";
/*
 * This component is used to get Sidebar in Merchant Portal
 * All the Merchant Portal routes added in it.
 */
export default {
  components: {
    AccSettings,
  },
  /*
   * Watchers are used to check the routes
   * i.e. current route (new Route) and last route.
   */
  watch: {
    selected: {
      immediate: true,
      handler(newRoute, oldRoute) {
        if (
          oldRoute !== newRoute &&
          newRoute &&
          this.routes[newRoute.toLowerCase()]
        ) {
          this.router.push(this.routes[newRoute.toLowerCase()]);
        }
      },
    },
  },
  setup() {
    const selected = ref(null);
    const route = useRoute();
    const router = useRouter();
    const routes = ref({
      searches: "/merchant/searches",
      "quick search": "/merchant/quick-search",
      "developers hub": "/merchant/developers-hub",
      "all users": "/merchant/users",
      "roles and permissions": "/merchant/roles-permissions",
      "change password": "/merchant/change-password",
    });
    return {
      Search: Search,
      ZoomIn: ZoomIn,
      Coins: Coins,
      Settings: Settings,
      User: User,
      selected,
      route,
      router: router,
      username: localStorage.getItem("userName"),
      drawer: ref(false),
      routes,
      /*
       * tabs are used in sidebar routes to switch to multiple routes
       * i.e. current route and last route.
       */
      tabs: ref([
        {
          ...(localStorage.getItem("userPermissions").includes("view source")
            ? {
                icon: `img:${Search}`,
                label: "Source",
              }
            : {}),
        },
        {
          ...(localStorage.getItem("userPermissions").includes("view report")
            ? {
                icon: `img:${ZoomIn}`,
                label: "Reports",
              }
            : {}),
        },
        {
          icon: `img:${User}`,
          label: "User Managment",
          isDropdown: true,
          children: [
            ...(localStorage.getItem("userPermissions").includes("view user")
              ? [
                  {
                    label: "All Users",
                  },
                ]
              : []),
            ...(localStorage.getItem("userPermissions").includes("view roles")
              ? [
                  {
                    label: "Roles and Permissions",
                  },
                ]
              : []),
          ],
        },
        {
          ...(localStorage.getItem("userPermissions").includes("activity log")
            ? {
                icon: `img:${Coins}`,
                label: "Activity Logs",
              }
            : {}),
        },
      ]),
      /*
       * accountSettings is present in navbar
       * it is used to switch to logout.
       */
      accountSettings: [
        {
          label: "API Doc",
          method: () => {
            window
              .open(`${process.env.REPORT_BACKEND_URL}-doc`, "_blank")
              .focus();
          },
        },
        {
          label: "Logout",
          method: () => {
            localStorage.clear();
            router.push({ path: "/" });
          },
        },
      ],
    };
  },
};
</script>
<style scoped>
.drawer-back {
  background-color: white;
}
.q-layout__section--marginal {
    background-color: white !important;
    color: #000;
}
</style>