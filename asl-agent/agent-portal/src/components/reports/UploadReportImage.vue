<template>
  <div class="q-my-md">
    <q-img
      :src="this.image"
      id="image-viewer"
      spinner-color="primary"
      spinner-size="30px"
      height="160px"
      width="160px"
      class="d-block q-mx-auto rounded-borders"
    >
    </q-img>
    <label for="reportimg">
      <img :src="'../../edit-img.svg'" class="upload-img-button" />
    </label>
    <input
      id="reportimg"
      name="reportimg"
      type="file"
      class="d-none"
      @input="handleFileSelect"
    />
  </div>
</template>

<script>
/**
 * Description : This component is use to upload image in a report
 * @props { String} thumbnail
 */
import { ref } from "@vue/reactivity";
import Placeholder from "@/assets/reports/placeholder.jpeg";
import { EventBus } from "@/js/helpers/EventBus.js";

export default {
  props: {
    thumbnail: {
      type: String,
    },
  },
  /**
   * assign value to image variable
   */
  watch: {
    thumbnail(val) {
      if (val) {
        this.image = val;
      }
    },
  },
  setup() {
    return {
      image: ref(Placeholder),
    };
  },
  methods: {
    handleFileSelect(evt) {
      var files = evt.target.files;
      var file = files[0];
      console.log(file,'sdhjgfjdhgasjhgasjh');
      if (file.size > 3000) {
        this.error("Image size is greater than 3 MB");
      } else {
        if (files && file) {
          this.getBase64(file).then((res) => {
            this.image = res;
            EventBus.emit("image-uploaded", res);
          });
        }
      }
    },

    /**
     * description: this method helps to get the base64 of the image
     * @param {File} file
     */
    getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    },
  },
};
</script>

<style lang="scss">
.upload-img-button {
  position: absolute;
  left: 74% !important;
  bottom: 72% !important;
  width: 11% !important;
  cursor: pointer !important;
}
.upload-img-button:hover {
  opacity: 1;
}
</style>
