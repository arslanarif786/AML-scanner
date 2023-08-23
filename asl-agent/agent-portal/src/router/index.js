import { createRouter, createWebHistory } from "vue-router";

/**
 * Checks if user is authenticated in or not,
 * If token is valid, user will be redirected inside the backoffice
 * Otherwise, user will be redirected to the login page
 */
function guardMyRoute(permission) {
  
  if (localStorage.getItem("token")) {
    if (localStorage.getItem("userPermissions").includes(permission)) {
      return true;
    } else {
      return "/401";
    }
  } else {
    return "/"; // go to 'login'
  }
}

/**
 * Checks if user is logged in or not,
 * If token is valid, user will be redirected inside the backoffice
 * Otherwise, user will be redirected to the login page
 */
function loginRoute(to, from, next) {
  var isLogged = false;
  if (localStorage.getItem("token") === null) isLogged = true;
  else isLogged = false;

  if (isLogged) next();
  else next("/sources"); // go to '/login'
}
/**
 * Routes define here
 */
const routes = [
  {
    path: "/",
    name: "Login",
    beforeEnter: loginRoute,
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/auth/Login.vue"),
  },
  {
    path: "/401",
    name: "Error401",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/auth/Error401.vue"),
  },
  {
    path: "/verify-email",
    name: "Verify Email",
    beforeEnter: loginRoute,
    component: () =>
      import(
        /* webpackChunkName: "verifyemail" */
        "../views/auth/EmailVerify.vue"
      ),
  },
  {
    path: "/forget-password",
    name: "ForgetPassword",
    beforeEnter: loginRoute,
    component: () =>
      import(
        /* webpackChunkName: "forgotpassword" */
        "../views/auth/ForgetPassword.vue"
      ),
  },
  {
    path: "/reset-password",
    name: "ResetPassword",
    beforeEnter: loginRoute,
    component: () =>
      import(
        /* webpackChunkName: "resetpassword" */
        "../views/auth/ResetPassword.vue"
      ),
  },
  {
    path: "/first-login",
    name: "FirstTimeLogin",
    beforeEnter: loginRoute,
    component: () =>
      import(
        /* webpackChunkName: "firstlogin" */
        "../views/auth/FirstTimeLogin.vue"
      ),
  },
  {
    path: "/reports",
    name: "ViewReports",
    beforeEnter: (to, from, next) => {
      next(guardMyRoute("view report"));
    },
    component: () =>
      import(
        /* webpackChunkName: "viewreport" */
        "../views/reports/ViewReports.vue"
      ),
    children: [],
  },
  {
    path: "/report/create/new",
    name: "CreatNewReport",
    beforeEnter: (to, from, next) => {
      next(guardMyRoute("edit report"));
    },
    component: () =>
      import(
        /* webpackChunkName: "editreport" */
        "../views/reports/CreateNewReportUpdated.vue"
      ),
  },
  {
    path: "/reports/:id",
    name: "EditReport",
    beforeEnter: (to, from, next) => {
      next(guardMyRoute("edit report"));
    },
    component: () =>
      import(
        /* webpackChunkName: "editreport" */
        "../views/reports/EditReport.vue"
      ),
  },
  
  {
    path: "/report-detail/:id",
    name: "Detail",
    beforeEnter: (to, from, next) => {
      next(guardMyRoute("view report"));
    },
    component: () =>
      import(
        /* webpackChunkName: "reportDetails" */
        "../views/reports/ReportDetail.vue"
      ),
  },
  {
    path: "/quick-search",
    name: "Quick Search",
    beforeEnter: (to, from, next) => {
      next(guardMyRoute("view report"));
    },
    component: () =>
      import(
        /* webpackChunkName: "quickSearch" */
        "@/views/quick_search/QuickSearch.vue"
      ),
  },
  {
    path: "/activity-logs",
    name: "ActivityLog",
    beforeEnter: (to, from, next) => {
      next(guardMyRoute("activity log"));
    },
    component: () =>
      import(
        /* webpackChunkName: "activitylog" */
        "../views/activity_log/ActivityLog.vue"
      ),
  },
  {
    path: "/crawler-statics",
    name: "CrawlerStatics",
    beforeEnter: (to, from, next) => {
      next(guardMyRoute("view user"));
    },
    component: () =>
      import(
        /* webpackChunkName: "firstlogin" */
        "../views/crawler/CrawlerStatics.vue"
      ),
  },
  {
    path: "/sources",
    name: "Sources",
    beforeEnter: (to, from, next) => {
      next(guardMyRoute("view source"));
    },
    component: () =>
      import(
        /* webpackChunkName: "sources" */
        "../views/source/Source.vue"
      ),
  },
  {
    path: "/users",
    name: "Users",
    beforeEnter: (to, from, next) => {
      next(guardMyRoute("view user"));
    },
    component: () =>
      import(
        /* webpackChunkName: "users" */
        "../views/users/Users.vue"
      ),
    //
  },
  {
    path: "/roles-permissions",
    name: "RolesPermissions",
    beforeEnter: (to, from, next) => {
      next(guardMyRoute("view role"));
    },
    component: () =>
      import(
        /* webpackChunkName: "rolespermissions" */
        "../views/roles_permissions/RolesPermissions.vue"
      ),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
