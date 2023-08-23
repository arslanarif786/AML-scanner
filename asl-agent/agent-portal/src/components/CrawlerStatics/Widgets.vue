<template>
  <div class="row justify-between flex q-ml-lg q-mr-lg">

    <div class="col-2 text-center q-pb-md">
      <q-card flat bordered class="my-card bg-grey-1 q-pt-md q-pb-md q-py-lg">
        <q-card-section>
          <div class="row items-center no-wrap q-px-md justify-between">
            <div class="col-3">
              <q-btn round color="primary" icon="checklist" />
            </div>
            <div class="col-6">
              <div class="text-h5">
                <b class="text-primary"> {{ resData.total_urls }}</b>
              </div>
              <div class="text-subtitle2">Total <br>Sources</div>
            </div>

            <div class="col-auto"></div>
          </div>
        </q-card-section>
      </q-card>
    </div>
    <div class="col-2 text-center q-pb-md">
      <q-card flat bordered class="my-card bg-grey-1 q-pt-md q-pb-md q-py-lg">
        <q-card-section>
          <div class="row items-center no-wrap q-px-md justify-between">
            <div class="col-3">
              <q-btn round color="green" icon="task_alt" />
            </div>
            <div class="col-6">
              <div class="text-h5">
                <b class="text-primary"> {{ resData.crawled }}</b>
              </div>
              <div class="text-subtitle2">Crawled Sources</div>
            </div>

            <div class="col-auto"></div>
          </div>
        </q-card-section>
      </q-card>
    </div>
    <div class="col-2 text-center q-pb-md">
      <q-card flat bordered class="my-card bg-grey-1 q-pt-md q-pb-md q-py-lg">
        <q-card-section>
          <div class="row items-center no-wrap q-px-md justify-between">
            <div class="col-3">
              <q-btn round color="orange" icon="settings_backup_restore" />
            </div>
            <div class="col-6">
              <div class="text-h5">
                <b class="text-primary"> {{ resData.in_progress }}</b>
              </div>
              <div class="text-subtitle2">Pending Sources</div>
            </div>

            <div class="col-auto"></div>
          </div>
        </q-card-section>
      </q-card>
    </div>
        <div class="col-2 text-center q-pb-md">
      <q-card flat bordered class="my-card bg-grey-1 q-pt-md q-pb-md q-py-lg">
        <q-card-section>
          <div class="row items-center no-wrap q-px-md justify-between">
            <div class="col-3">
              <q-btn round color="pink" icon="published_with_changes" />
            </div>
            <div class="col-9">
              <div class="text-h5">
                <b class="text-primary"> {{ resData.total_links??0 }}</b>
              </div>
              <div class="text-subtitle2">Total Crawled URLS</div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
    
  </div>
</template>

<script>
export default {
  props: {
    resData: {
      type: Array,
    },
  },
  setup() {},
};
</script>
<style scoped>

</style>