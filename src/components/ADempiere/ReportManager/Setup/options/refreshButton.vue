<template>
  <div style="margin-left: -10px; display: flex; align-items: center;">
    <el-button
      :disabled="isLoadingReport"
      :loading="isLoadingReport"
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
import { defineComponent, ref } from '@vue/composition-api'
export default defineComponent({
  name: 'refreshButton',
  props: {
    containerUuid: {
      type: String,
      required: false
    },
    reportOutput: {
      type: Object,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    isLoadingReport: {
      type: Boolean,
      required: true
    }
  },
  setup(props, { root }) {
    const timeOutRecords = ref(null)
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
        reportId: reportDefinition.internal_id,
        instanceUuid: props.reportOutput.instance_id,
        reportViewId: props.reportOutput.report_view_id,
        pageSize: props.reportOutput.pageSize,
        pageToken: props.reportOutput.pageToken,
        isChangePanel: true
      })
    }
    return {
      runReport
    }
  }
})
</script>

