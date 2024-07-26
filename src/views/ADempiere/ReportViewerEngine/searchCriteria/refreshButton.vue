<template>
  <div style="margin-left: -10px; display: flex; align-items: center;">
    <el-button
      :loading="isLoading"
      type="success"
      class="button-base-icon"
      icon="el-icon-refresh-right"
      style="font-size:16px"
      @click="runReport"
    >
      {{ $t('report.reportEnginer.refreshRecord') }}
    </el-button>
  </div>
</template>

<script>
import store from '@/store'
import { defineComponent, computed, ref } from '@vue/composition-api'
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
      clearTimeout(timeOutRecords.value)
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
    }
    return {
      runReport,
      isLoading
    }
  }
})
</script>

<style scoped>
@media screen and (max-width:1150px) {
  .button-base-icon {
    font-size: 12px;
  }
}
</style>
