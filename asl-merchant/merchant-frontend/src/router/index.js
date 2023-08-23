import {
  createRouter,
  createWebHistory
} from "vue-router";

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
      return "/merchant/searches";
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
  else next("/merchant/searches");
  /* if go to '/login' >>> the user can't go to login because
    *  if that user is logged In, so push back him on Searches Page
    *  first that user have to do logout, than he can go on '/login'
    */
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
    import( /* webpackChunkName: "login" */ "../views/auth/Login.vue"),
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

/**
  * Merchant portal routes
  **/

// {
//   path: "/merchant/dashboard",
//   name: "Dashboard",
//   beforeEnter: guardMyroute,
//   component: () =>
//     import(
//       /* webpackChunkName: "searches" */
//       "@/views/merchant/Dashboard.vue"
//     ),
// },
{
  path: "/merchant/searches",
  name: "Searches",
  beforeEnter: (to, from, next) => {
    next(guardMyRoute("view searches"));
  },
  component: () =>
    import(
      /* webpackChunkName: "searches" */
      "@/views/merchant/Searches.vue"
    ),
},
{
  path: "/merchant/quick-search",
  name: "Quick Search",
  beforeEnter: (to, from, next) => {
    next(guardMyRoute("quick search"));
  },
  component: () =>
    import(
      /* webpackChunkName: "quickSearch" */
      "@/views/merchant/QuickSearch.vue"
    ),
},
{
  path: "/merchant/search-detail/:id",
  name: "Search Detail",
  beforeEnter: (to, from, next) => {
    next(guardMyRoute("quick search"));
  },
  component: () =>
    import(
      /* webpackChunkName: "searchDetail" */
      "@/views/reports/ReportDetail.vue"
    ),
},
{
  path: "/merchant/change-password",
  name: "Change Password", 
  beforeEnter: (to, from, next) => {
    next(guardMyRoute("settings"));
  },
  component: () =>
    import(
      /* webpackChunkName: "settings" */
      "@/views/merchant/ChangePassword.vue"
    ),
},
{
  path: "/merchant/developers-hub",
  name: "DevelopersHub",
  beforeEnter: (to, from, next) => {
    next(guardMyRoute("view secret"));
  },
  component: () =>
    import(
      /* webpackChunkName: "developersHub" */
      "@/views/merchant/DevelopersHub.vue"
    ),
},
{
  path: "/merchant/users",
  name: "All Users",
  beforeEnter: (to, from, next) => {
    next(guardMyRoute("view user"));
  },
  component: () =>
    import(
      /* webpackChunkName: "merchantUsers" */
      "@/views/users/Users.vue"
    ),
},
{
  path: "/merchant/roles-permissions",
  name: "Roles and Permissions",
  beforeEnter: (to, from, next) => {
    next(guardMyRoute("view roles"));
  },
  component: () =>
    import(
      /* webpackChunkName: "merchantUsers" */
      "@/views/roles_permissions/RolesPermissions.vue"
    ),
},
{
  path: "/merchant/template",
  name: "Template",
  component: () =>
    import(
      /* webpackChunkName: "merchantUsers" */
      "@/views/merchant/Template.vue"
    ),
},

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;