/**
 * Description: This file consists of axios request plugin that can be used to make requests and errors can be handled at once rather than repeating code
 * @param {String} url
 * @param {String} methods
 * @param {Object} data object containing data to be sent with post
 * !Note: Please send empty object {} in case of GET request as parameter
 */
import { EventBus } from "@/js/helpers/EventBus.js";
import axios from "axios";
import router from "../router";
// axios.defaults.baseURL = process.env.BACKEND_URL;

/**
 * Axios interceptors
 * If token will get expires, 401 status will be return
 * and user will be redirected to the login page
 */
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status == 401) {
      localStorage.removeItem("token");
      router
        .push({
          path: "/",
        })
        .catch(() => true);
    }
    return Promise.reject(error);
  }
);

export default {
  install(app) {
    const baseUrls = {
      agent: process.env.AGENT_BACKEND_URL,
      admin: process.env.ADMIN_BACKEND_URL,
      report: process.env.REPORT_BACKEND_URL,
      search: process.env.REPORT_BACKEND_URL,
      merchant: process.env.MERCHANT_BACKEND_URL,
      secret: process.env.SECRET_BACKEND_URL,
    };
    app.config.globalProperties.apiRequest = (url, type, method, data) => {
      const options = {
        url: `${baseUrls[type]}/${url}`,
        method: method,
        data: data,
        headers: {
          Authorization:
            type == "search"
              ? `Bearer ${localStorage.getItem("search_token")}`
              : `Bearer ${localStorage.getItem("token")}`,
         ...(type != 'search' ? {type: 'merchant'}:{}),
          Accept: "application/json", 
          'Content-Type' : 'multipart/form-data',
        },
      };

      return new Promise((resolve, reject) => {
        axios(options)
          .then((res) => {
            resolve(res);
          })
          .catch((error) => {
            console.log(error.response.data, "error");
            EventBus.emit("show-notification-bar", {
              type: "negative",
              message: error.response.data.data,
            });
            reject(error.response.data.data);
          });
      });
    };
  },
};
