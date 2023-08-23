/**
 * Description: This file consists of snackbar plugins that can be used and we can reduce code duplicacy
 * @param {String} Message message to be shown in snackbar
 */
export default {
  install(app) {
    app.config.globalProperties.hasPermission = (permission) => {
      return localStorage.getItem("userPermissions").includes(permission)
        ? true
        : false;
    };
  },
};
