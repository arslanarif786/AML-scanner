<template>
  <section class="screen-bg default-height layout-padding">
    <div class="q-pt-md q-px-md">
      <h5 class="q-pa-sm q-pt-md font-16px text-bold global-font-color">
        Recent Documents
      </h5>
    </div>
    <!----- Add new Template BTN ----->
    <div class="row justify-end q-pr-lg">
      <q-btn
        no-caps
        flat
        @click="(mode = true), addTemp()"
        class="global-font-color bg-secondary-light radius"
      >
        <q-icon name="add" />
        Add New Template
      </q-btn>
    </div>

    <!----- loader component ----->
    <q-spinner-dots
      v-if="loading"
      color="primary"
      size="50px"
      class="d-block q-mx-auto q-my-lg"
    />

    <!--------------------     Multiple Template cards      ------------------->
    <div class="row q-ma-md justify-start items-center">
      <div v-for="(temp, index) in allTemplates" :key="index">
        <div class="col-lg-4 col-md-3 col-sm-3">
          <div class="q-pa-sm">
            <q-card flat class="my-card bg-white">
              <q-card-section>
                <div class="row items-start justify-between no-wrap q-pt-sm">
                  <div class="col q-pl-sm">
                    <div class="row justify-start">
                      <img
                        :src="
                          temp.logo
                            ? `https://dev-report.developers.studio/backend/${temp.logo}`
                            : `https://cdn.quasar.dev/img/avatar.png`
                        "
                        class="q-pl-sm icon-size"
                      />
                      <q-badge
                        v-if="temp.is_default == 'true'"
                        color="green"
                        outline
                        class="q-ml-sm"
                        style="padding-top: 5px; border-radius: 7px"
                        >Default</q-badge
                      >
                    </div>
                    <div class="q-pl-sm q-pt-sm color-secondary font-12px">
                      <b> Main Page Content: </b>
                      {{ temp.main_page_content.substr(0, 20)
                      }}{{ temp.main_page_content.length > 20 ? ".." : "" }}
                    </div>
                    <div class="q-pl-sm color-secondary font-12px">
                      <b> Header: </b> {{ temp.header_content.substr(0, 25)
                      }}{{ temp.header_content.length > 25 ? ".." : "" }}
                    </div>
                    <div class="q-pl-sm color-secondary font-12px">
                      <b> Footer: </b> {{ temp.footer_content.substr(0, 25)
                      }}{{ temp.footer_content.length > 25 ? ".." : "" }}
                    </div>
                  </div>

                  <!------- Dropdown Menu ------->
                  <div class="col-auto column">
                    <q-btn-dropdown
                      dense
                      unelevated
                      color="grey-7"
                      class="q-pl-sm action-report font-12px q-mr-xs"
                      flat
                      icon="more_vert"
                    >
                      <q-list class="bg-white">
                        <q-item v-close-popup>
                          <q-item-section id="download-file">
                            <q-item-label
                              clickable
                              class="q-pb-sm cursor-pointer"
                              @click="(mode = true), editTemp(temp)"
                              >Edit Template</q-item-label
                            >
                            <q-item-label
                              v-if="temp.is_default == 'false'"
                              clickable
                              class="q-pb-sm cursor-pointer"
                              v-on:click="makeDefault(temp._id)"
                              >Make Default</q-item-label
                            >
                            <q-item-label
                              clickable
                              class="cursor-pointer"
                              v-on:click="deleteTemplate(temp._id)"
                              >Delete Template</q-item-label
                            >
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </q-btn-dropdown>
                  </div>
                </div>
              </q-card-section>

              <q-card-section>
                <div class="d-flex justify-between align-center q-py-sm">
                  <div class="q-px-md color-secondary font-12px">
                    Created at: {{ temp.created_at.substr(0, 10) }}
                  </div>
                  <div class="q-pr-sm">
                    <div
                      class="color-field"
                      :style="`background-color:${temp.color}`"
                    ></div>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-------------------- Add New Template DIALOG -------------------->
  <q-dialog v-model="mode" persistent>
    <q-card style="min-width: 450px">
      <q-card-section>
        <!-- color picker -->
        <div class="row justify-between">
          <div class="text-h6 global-font-color font-15px">
            Choose Your Color Preset
          </div>
          <div>
            <q-btn
              v-if="!changeColor"
              :label="`${ !changeColor ? 'Change Color' : 'Close Color' }`"
              color="primary"
              class="q-px-sm"
              unelevated
              no-caps
              dense
              @click="atChangeColor"
            />
            <q-btn
              v-else
              label="Close Color"
              color="primary"
              class="q-px-sm"
              unelevated
              no-caps
              dense
              @click="atChangeColor"
            />
          </div>
        </div>
        <div class="row justify-between q-pt-md q-pl-sm">
          <div class="color-field" :style="`background-color:${color}`"></div>
          <q-color
            v-if="changeColor"
            v-model="color"
            no-footer
            class="my-picker"
          />
        </div>
      </q-card-section>

      <!---- Add pdf section ---->
      <q-card-section>
        <div class="text-h6 global-font-color font-15px">{{ modePdf }} Pdf</div>
      </q-card-section>

      <!---- Header and Footer section ---->
      <q-card-section class="q-pt-none global-font-color font-13px">
        <span> Main Page Content </span>
        <q-input
          outlined
          v-model="mainPageContent"
          dense
          label="Page Content"
          class="q-py-sm"
        />
        <span> Header Content </span>
        <q-input
          outlined
          v-model="headerContent"
          dense
          label="Header"
          class="q-py-sm"
        />
        <span> Footer Content </span>
        <q-input
          outlined
          v-model="footerContent"
          dense
          label="Footer"
          class="q-py-sm"
        />
      </q-card-section>

      <!---- Upload Logo section ---->
      <q-card-section>
        <div class="text-h6 global-font-color font-15px">Upload Logo</div>
        <div class="row justify-center border q-pa-md q-mt-md">
          <label v-if="logo.name" for="logo-picker" class="cursor-pointer">
            {{ logo.name ? `${logo.name}` : "Select a file to upload" }}
          </label>
          <label v-else for="logo-picker" class="cursor-pointer">
            {{ logo ? `${logo}` : "Select a file to upload" }}
          </label>
          <input
            class="d-none"
            type="file"
            @change="handleLogo($event)"
            id="logo-picker"
            name="logo-picker"
          />
        </div>
      </q-card-section>

      <!---- Cancel And Save BTN section ---->
      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancel" color="primary" @click="closePicker" no-caps v-close-popup />
        <q-btn
          v-if="add == true"
          label="Save"
          color="primary"
          @click="handleRequestAddTemplate"
          unelevated
          no-caps
          v-close-popup
          class="q-ma-sm"
        />
        <q-btn
          v-else-if="edit == true"
          label="Save"
          color="primary"
          @click="handleRequestEditTemplate"
          unelevated
          no-caps
          v-close-popup
          class="q-ma-sm"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    return {
      loading: ref(false),
      color: ref(""),
      logo: ref(""),
      data: ref(""),
      mode: ref(false),
      add: ref(false),
      edit: ref(false),
      modePdf: ref("Add"),
      headerContent: ref(""),
      footerContent: ref(""),
      mainPageContent: ref(""),
      changeColor: ref(false),
      request: ref(""),
      allTemplates: ref([]),
      user: JSON.parse(localStorage.getItem("user")),
    };
  },
  methods: {
    /**
     * This Method gets the reactive logo from upper HTML
     * it sets logo variable to selected logo
     * @param {object} request
     */
    handleLogo(request) {
      this.logo = request.target.files[0];
    },

    /**
     * This Method used to change color
     * handles as toggle true/false
     * returns color
     */
    atChangeColor() {
      this.changeColor == true
        ? (this.changeColor = false)
        : (this.changeColor = true);
    },

    /**
     * This Method used to close the color picker
     * handles like toggle option
     */
    closePicker(){
      this.changeColor = false;
    },

    /**
     * This Method used to fetch all templates with their complete details,
     * 1) if request successful ,response will be ok
     * 2) if request fail, error snackbar will be shown
     */
    getAllBrands() {
      this.apiRequest(`search/brandings`, "report", "GET")
        .then((res) => {
          this.allTemplates = res.data.data;
        })
        .catch((err) => {
          console.log(err.response.data);
        })
        .finally(() => {
          this.loading = false;
        });
    },

    /**
     * This Method is used in Add Template Btn
     */
    addTemp() {
      if (this.add == false) {
        this.add = true;
        this.edit = false;
        this.modePdf = "Add";
      }
      this.color = "";
      this.logo = "";
      this.headerContent = "";
      this.footerContent = "";
      this.mainPageContent = "";
    },

    /**
     * This Method is used to add New template
     * it takes all parameters including color, header, footer, logo
     * 1) if request successful, successful snackbar will be shown
     * 2) if request fail, error snackbar will be shown
     */
    handleRequestAddTemplate() {
      let data = new FormData();
      data.append("logo", this.logo);
      data.append("user_id", this.user._id);
      data.append("color", this.color);
      data.append("header_content", this.headerContent);
      data.append("footer_content", this.footerContent);
      data.append("main_page_content", this.mainPageContent);

      this.apiRequest(`search/add_report_branding`, "report", "POST", data)
        .then(() => {
          this.getAllBrands();
          setTimeout(() => {
            this.success("Your template added successfully!");
          }, 1000);
        })
        .catch((err) => {
          console.log(err.response.data);
        })
        .finally(()=> {
          this.changeColor = false;
        })
    },

    /**
     * This Method is used in Edit Template Btn
     * it edits all parameters including color, header, footer, logo, logo
     * @param {object} request
     */
    editTemp(request) {
      if (this.edit == false) {
        this.edit = true;
        this.add = false;
        this.modePdf = "Edit";
      }
      this.brandId = request._id;
      this.color = request.color;
      this.logo = request.logo;
      this.headerContent = request.header_content;
      this.footerContent = request.footer_content;
      this.mainPageContent = request.main_page_content;
    },

    /**
     * This Method is used to edit the template
     * it takes all parameters including color, header, footer, logo
     * 1) if request successful, successful snackbar will be shown
     * 2) if request fail, error snackbar will be shown
     */
    handleRequestEditTemplate() {
      let data = new FormData();
      data.append("user_id", this.user._id);
      data.append("logo", this.logo);
      data.append("color", this.color);
      data.append("header_content", this.headerContent);
      data.append("footer_content", this.footerContent);
      data.append("main_page_content", this.mainPageContent);

      this.apiRequest(
        `search/update_branding/${this.brandId}`,
        "report",
        "POST",
        data
      )
        .then(() => {
          this.getAllBrands();
          setTimeout(() => {
            this.success("Your template updated successfully!");
          }, 1000);
        })
        .catch((err) => {
          console.log(err.response.data);
        })
        .finally(()=> {
          this.changeColor = false;
        })
    },

    /**
     * This Method is used to make single template as default template,
     * 1) if request successful, successful snackbar will be shown
     * 2) if request fail, error snackbar will be shown
     * @param {object} id
     */
    handleRequestMakeDefault(id) {
      this.apiRequest(`search/make_default_branding/${id}`, "report", "POST")
        .then(() => {
          this.getAllBrands();
          setTimeout(() => {
            this.success("Your template becomes default!");
          }, 1000);
        })
        .catch((err) => {
          console.log(err.response.data);
        });
    },

    /**
     * Sweet alert used to make the template as default tempate
     * handleRequestMakeDefault function calls inside it
     * @param {object} id
     */
    makeDefault(id) {
      this.$swal({
        text: "Are you sure that you want to make it default?",
        icon: "warning",
        showCancelButton: true,
        cancelButtonColor: "#d3d3d3",
        confirmButtonColor: "#5D5FEC",
        cancelButtonText: "No",
        confirmButtonText: "Yes",
      }).then((result) => {
        if (result.isConfirmed) {
          this.handleRequestMakeDefault(id);
        }
      });
    },

    /**
     * This Method is used to delete a template,
     * The function takes only user id
     * 1) if request successful, successful snackbar will be shown
     * 2) if request fail, error snackbar will be shown
     * @param {object} id
     */
    handleRequestDelete(id) {
      this.apiRequest(`search/branding/${id}`, "report", "DELETE")
        .then(() => {
          this.getAllBrands();
          setTimeout(() => {
            this.success("Your template successfully deleted!");
          }, 1000);
        })
        .catch((err) => {
          console.log(err.response.data);
        });
    },

    /**
     * Sweet alert used to delete a template
     * handleRequestDelete function calls inside it
     * @param {object} id
     */
    deleteTemplate(id) {
      this.$swal({
        text: "Are you sure that you want to delete it?",
        icon: "warning",
        showCancelButton: true,
        cancelButtonColor: "#d3d3d3",
        confirmButtonColor: "#5D5FEC",
        cancelButtonText: "No",
        confirmButtonText: "Yes",
      }).then((result) => {
        if (result.isConfirmed) {
          this.handleRequestDelete(id);
        }
      });
    },
  },

  /**
   * The Mounted' lifecycle gets all the Brands
   */
  mounted() {
    this.loading = true;
    this.getAllBrands();
  },
};
</script>

<style scoped>
.my-card {
  min-width: 280px;
}
.color-field {
  height: 1.4rem;
  width: 1.4rem;
  border-radius: 8px;
}
.radius {
  border-radius: 4px;
}
.no-border {
  border: none;
}
.border {
  border: 1px dashed;
  border-color: rgb(199, 196, 196);
  border-radius: 5px;
}
.my-picker {
  max-width: 250px;
}
.icon-size {
  height: 1.5rem;
  width: 1.5rem;
}
</style>
