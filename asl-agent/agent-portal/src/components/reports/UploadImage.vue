<template>
  <div>
    <div
      v-if="previewImage"
      class="imagePreviewWrapper justify-end"
      :style="{ 'background-image': `url(${previewImage})` }"
    >
      <span
        class="material-icons pencil-material-icon flex justify-end text-dark"
        @click="selectImage"
        >clear</span
      >
    </div>

    <q-file
      v-else
      ref="fileInput"
      outlined
      type="file"
      name="image"
      id="image"
      label="Upload Image"
      @input="pickFile"
      dense
    >
      <template v-slot:append>
        <p class="upload">Browse</p>
      </template>
    </q-file>
  </div>
</template>
 
<script>
 import { EventBus } from "@/js/helpers/EventBus.js";
export default {
  data() {
    return {
      previewImage: null,
    };
  },
  components: {},
  methods: {
    selectImage() {
        this.previewImage=null;
    //   this.$refs.fileInput.click();
    },
    pickFile(evt) {
      var files = evt.target.files;
      var file = files[0];
      if (files && file) {
        this.getBase64(file).then((res) => {
          this.previewImage = res;
          EventBus.emit('image-uploaded',this.previewImage);
        });
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
 
<style scoped lang="scss">
.imagePreviewWrapper {
  width: 100px;
  height: 100px;
  display: block;
  cursor: pointer;
  margin: 0 auto 30px;
  background-size: cover;
  background-position: center center;
  border-radius: 5px;
}
.upload {
  margin: -6px !important;
  color: #bd8c5e;
  font-size: 12px;
  background-color: #f1e9d8;
  border-radius: 2px !important;
  padding: 6px 15px 6px 15px;
}
.pencil-material-icon {
    position: relative;
    bottom: 2px;
    left: 78px;
  text-align: right !important;
  padding: 4px;
  border-radius: 4px !important;
  background-color: #f1e9d8;
}
</style>