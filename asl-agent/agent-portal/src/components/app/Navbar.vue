<template>
  <q-header>
    <q-bar class="bg-white h-55" :stretch="true">
      <div class="cursor-pointer text-weight-bold font-20 lh-25">
        <!-- AML Logo -->
        <img src="@/assets/auth/logo.svg" style="width: 141px; height: 25px" />
      </div>
      <q-separator
        vertical
        spaced="20px"
        class="q-my-md"
        style="margin-right: 0px !important"
      />
      <!-- Navbar Tab Component -->
      <div v-for="(tab, index) in tabs" :key="index">
        <navbar-tab :navTab="tab" />
      </div>
      <q-space />
      <!-- Account Settings Component -->
      <AccSettings :username="username" :accountSettings="accountSettings" />
      <!-- :avatar="avatar" -->
    </q-bar>
  </q-header>
</template>
<script>
/**
 * this component is used to render navigation bar
 */
import AccSettings from "@/components/app/AccSettings.vue";
import NavbarTab from "@/components/app//NavbarTab.vue";
import { useRouter } from "vue-router";
import { ref } from "@vue/reactivity";

export default {
  name: "Navbar",
  components: {
    AccSettings,
    NavbarTab,
  },
  setup() {
    const router = useRouter();
    return {
      username: localStorage.getItem("userName"),
      // avatar: "https://cdn.quasar.dev/img/boy-avatar.png", // This is required for future phase
      tabs: ref([
        ...(localStorage.getItem("userPermissions").includes("view source")
          ? [
              {
                label: "Source",
                path: "/sources",
                isDropdown: false,
              },
            ]
          : []),
        ...(localStorage.getItem("userPermissions").includes("view report")
          ? [
              {
                label: "Reports",
                path: "/reports",
                isDropdown: false,
              },
            ]
          : []),
        ...(localStorage.getItem("userPermissions").includes("view report")
          ? [
              {
                label: "Quick Search",
                path: "/quick-search"
              },
            ]
          : []),
        ...(localStorage.getItem("userPermissions").includes("view user")
          ? [
              {
                label: "Crawler Statics",
                path: "/crawler-statics"
              },
            ]
          : []),
        ...(localStorage.getItem("userPermissions").includes("view user") ||
        localStorage.getItem("userPermissions").includes("view role")
          ? [
              {
                label: "User Management",
                isDropdown: true,
                child: [
                  ...(localStorage
                    .getItem("userPermissions")
                    .includes("view user")
                    ? [
                        {
                          label: "All Users",
                          path: "/users",
                        },
                      ]
                    : []),
                  ...(localStorage
                    .getItem("userPermissions")
                    .includes("view role")
                    ? [
                        {
                          label: "Roles and Permissions",
                          path: "/roles-permissions",
                        },
                      ]
                    : []),
                ],
              },
            ]
          : []),
        ...(localStorage.getItem("userPermissions").includes("activity log")
          ? [
              {
                label: "Activity Logs",
                path: "/activity-logs",
                isDropdown: false,
              },
            ]
          : []),
      ]),
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
