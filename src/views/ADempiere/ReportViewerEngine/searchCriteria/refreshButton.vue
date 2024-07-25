<template>
  <div class="select-container" style="margin-left: -40px; display: flex; align-items: center;">
    <el-button
      :loading="isLoading"
      type="success"
      class="button-base-icon"
      style="font-size:20px"
      @click="runReport"
    >
      {{ $t('report.reportEnginer.refreshRecord') }}
    </el-button>
  </div>
</template>

<script>
import store from '@/store'
import lang from '@/lang'
import { defineComponent, computed, ref } from '@vue/composition-api'
import { showNotification } from '@/utils/ADempiere/notification'
export default defineComponent({
  name: 'refreshButton',
  props: {
    containerUuid: {
      type: String,
      required: true
    },
    reportOutput: {
      type: Object,
      required: true
    }
  },
  setup(props, { root }) {
    const timeOutRecords = ref(null)
    const isLoading = computed(() => {
      return store.getters.getReportIsLoading
    })
    function runReport() {
      const reportDefinition = store.getters.getStoredReport(props.containerUuid)
      const reportOutputParams = store.getters.getReportParameters({
        containerUuid: props.containerUuid,
        fieldsList: reportDefinition.fieldsList
      })
      store.commit('setReportIsLoading', true)
      clearTimeout(timeOutRecords.value)
      timeOutRecords.value = setTimeout(() => {
        const { name, description } = store.getters.getReportOutput(root.$route.params.reportId)
        showNotification({
          title: lang.t('notifications.processing'),
          message: name,
          summary: description,
          type: 'info'
        })
        store.dispatch('buildReport', {
          containerUuid: props.containerUuid || root.$route.params.processUuid,
          isSummary: true,
          parametersList: reportOutputParams,
          printFormatId: props.reportOutput.print_format_id,
          reportId: reportDefinition.id,
          instanceUuid: props.reportOutput.instance_id,
          reportViewId: props.reportOutput.report_view_id,
          isView: true,
          pageSize: props.reportOutput.record_count,
          pageToken: props.reportOutput.next_page_token
        })
          .then(response => {
            showNotification({
              title: lang.t('notifications.succesful'),
              message: name,
              type: 'success'
            })
          })
          .catch(error => {
            showNotification({
              title: lang.t('notifications.error'),
              message: name,
              summary: error,
              type: 'error'
            })
          })
          .finally(() => {
            store.commit('setReportIsLoading', false)
          })
      }, 500)
    }
    return {
      runReport,
      isLoading
    }
  }
})
</script>

<style scoped>
.select-container {
  width: 80%;
}
</style>
