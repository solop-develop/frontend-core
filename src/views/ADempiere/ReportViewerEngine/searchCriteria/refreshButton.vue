<template>
  <div class="select-container" style="margin-top: 10px; margin-left: 10px; display: flex; align-items: center;">
    <el-button
      plain
      size="mini"
      type="primary"
      class="custom-button"
      @click="runReport"
    >
      {{ $t('report.reportEnginer.refreshRecord') }}
    </el-button>
  </div>
</template>

<script>
import store from '@/store'
import lang from '@/lang'
import { defineComponent, ref } from '@vue/composition-api'
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
    console.log(props)
    const timeOutRecords = ref(null)
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
      runReport
    }
  }
})
</script>

<style scoped>
.select-label {
  margin-bottom: 5px;
  font-weight: bold;
}
</style>
