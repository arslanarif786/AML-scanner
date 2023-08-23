/**
 * Description: This file consists of snackbar plugins that can be used and we can reduce code duplicacy
 * @param {String} Message message to be shown in snackbar
 */

export default {
  install(app) {
    app.config.globalProperties.warningAlert = (message) => {
      this.$swal({
        title: message,
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          this.$swal("Deleted!", "Your file has been deleted.", "success");
        }
      });
    };
  },
};
