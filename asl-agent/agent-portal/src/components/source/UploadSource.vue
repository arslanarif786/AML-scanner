<template>
  <Modal
    :show="open"
    @closeModal="closeModal"
    title="Upload CSV"
    :actions="false"
  >
    <template v-slot:body>
      <q-uploader
        id="source-uploader"
        :url="`${backendUrl}/agent/sources/import`"
        flat
        :multiple="false"
        field-name="file"
        accept=".csv,.xlsx, .xls"
        max-file-size="10000000"
        :headers="[
          {
            name: 'Authorization',
            value: 'Bearer ' + token,
          },
          {
            name: 'type',
            value: 'agent',
          },
        ]"
        hide-upload-btn
        class="custom-uploader"
        @failed="uploadFailed"
        @rejected="uploadRejected"
        @uploaded="fileUploaded"
      >
        <template v-slot:header="scope">
          <div
            class="row no-wrap items-center q-pa-lg q-gutter-xs justify-center"
          >
            <div @click="scope.pickFiles">
              <q-uploader-add-trigger v-if="scope.canAddFiles" />
              <div>
                <img
                  :src="uploadIcon"
                  alt="upload"
                  class="d-block q-mx-auto q-mb-md"
                />
                <span
                  class="font-14px text-weight-medium color-heading lh-15 d-block"
                  >Select a CSV File to upload</span
                >
                <span
                  class="font-10px color-secondary lh-15 d-block text-center q-mt-sm"
                  >or drag and drop it here</span
                >
              </div>
            </div>
          </div>
        </template>

        <template v-slot:list="scope">
          <q-list separator>
            <q-item v-for="file in scope.files" :key="file.__key">
              <q-item-section>
                <div class="row justify-between q-my-sm">
                  <span class="text-weight-medium font-12px">
                    {{ file.name }}
                    <span class="font-11px q-ml-sm">
                      Status: {{ file.__status }}
                    </span>
                  </span>
                  <div>
                    <span v-if="scope.isUploading" class="font-11px">
                      {{ file.__sizeLabel }} / {{ file.__progressLabel }}
                    </span>

                    <span>
                      <q-icon
                        size="20px"
                        class="cursor-pointer text-primary"
                        v-if="scope.canUpload"
                        name="cloud_upload"
                        id="upload-file"
                        @click="scope.upload"
                      >
                        <q-tooltip>Upload File</q-tooltip>
                      </q-icon>
                      <q-icon
                        class="q-mx-sm cursor-pointer text-primary"
                        size="20px"
                        name="delete"
                        id="delete-file"
                        v-if="scope.canUpload"
                        @click="scope.removeFile(file)"
                      >
                        <q-tooltip>Delete File</q-tooltip>
                      </q-icon>
                      <q-icon
                        class="q-mx-sm cursor-pointer text-primary"
                        size="20px"
                        name="clear"
                        id="clear-file"
                        v-if="scope.isUploading"
                        @click="scope.abort"
                      >
                        <q-tooltip>Clear File</q-tooltip>
                      </q-icon>
                    </span>
                  </div>
                </div>
                <q-linear-progress
                  size="3px"
                  :value="parseFloat(file.__progressLabel) / 100"
                  color="primary"
                  class="q-my-sm"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </template>
      </q-uploader>
    </template>
  </Modal>
</template>

<script>
/**
 * this component is used to upload a sources csv to the server.
 * @props {Boolean} show
 */
import UploadIcon from "@/assets/upload_csv/upload.png";
import Modal from "@/components/common/Modal.vue";
import { toRef } from "@vue/reactivity";
export default {
  name: "EditReportModal",
  props: {
    show: {
      default: false,
      type: Boolean,
    },
  },
  components: {
    Modal,
  },

  setup(props) {
    return {
      open: toRef(props, "show"),
      token: localStorage.getItem("token"),
      backendUrl: process.env.AGENT_BACKEND_URL,
      uploadIcon: UploadIcon,
      errors: {
        "max-file-size": "File size should be less than 10MB",
      },
    };
  },

  methods: {
    /**
     * description: this method helps to close the modal
     */
    closeModal() {
      this.$emit("closeModal", "upload");
    },
    /**
     * description: this method shows an error bar when file doesnot pass any of the validation check
     */
    uploadRejected(e) {
      e.forEach((element) => {
        this.error(this.errors[element.failedPropValidation]);
      });
    },
    /**
     * description: this method shows an error bar when file is not uploaded
     */
    uploadFailed(e) {
      let res = JSON.parse(e.xhr.response);
      this.error(res.response ? res.response.data : res.data);
    },

    /**
     * description: this method shows an success bar when file is uploaded
     */
    fileUploaded() {
      this.success("File imported successfully");
      this.closeModal();
    },
  },
};
</script>
<style lang="scss">
.custom-uploader {
  width: unset !important;
}
.custom-uploader .q-uploader__header {
  background-color: transparent !important;
}
.custom-uploader .q-uploader__header .row {
  border: 1.3px dashed #e1dfe2;
}
.custom-uploader .q-uploader__dnd {
  outline: none !important;
}
.custom-uploader .q-list {
  background: #fcfbfa !important;
  margin-top: 16px !important;
}
.custom-uploader .q-list,
.custom-uploader .q-uploader__header .row {
  border-radius: 8px;
}
</style>
