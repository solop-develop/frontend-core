<template>
  <div class="PrimtFormatcontainer">
    <label for="report-format-select" class="select-label">{{ $t('report.reportEnginer.printFormat') }}</label>
    <el-select
      id="report-format-select"
      v-model="reportAsPrintFormatValue"
      class="selectReportFormat"
      :placeholder="$t('report.printFormats')"
      @visible-change="showListOptions"
      @change="runReport"
    >
      <el-option
        v-for="(item, key) in reportOptions.childs"
        :key="key"
        :label="item.name"
        :value="item.id"
      />
    </el-select>
    <label for="report-view-select" class="select-label">{{ $t('report.reportEnginer.viewReport') }}</label>
    <el-select
      id="report-view-select"
      v-model="reportAsPrintViewValue"
      :placeholder="$t('route.reportViews')"
      @visible-change="showListView"
      @change="runReport"
    >
      <el-option
        v-for="(item, key) in reportView.childs"
        :key="key"
        :label="item.name"
        :value="item.id"
      />
    </el-select>
  </div>
</template>

<script>
import store from '@/store'
import lang from '@/lang'

import { defineComponent, computed, ref, watch } from '@vue/composition-api'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { showNotification } from '@/utils/ADempiere/notification'
export default defineComponent({
  name: 'PrintOptions',
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
    const reportOptions = ref([])
    const reportView = ref([])
    const reportAsPrintFormatValue = ref(undefined)
    const reportAsPrintViewValue = ref(undefined)
    const timeOutRecords = ref(null)
    function reportAsPrintFormat() {
      const options = store.getters.getStoredActionsMenu({
        containerUuid: props.containerUuid
      }).find(repoortOptions => repoortOptions.actionName === 'runReportAsPrintFormat')
      if (isEmptyValue(options)) {
        return {
          childs: []
        }
      }
      reportOptions.value = options
    }
    function reportAsView() {
      const options = store.getters.getStoredActionsMenu({
        containerUuid: props.containerUuid
      }).find(repoortOptions => repoortOptions.actionName === 'runReportAsView')
      if (isEmptyValue(options)) {
        return {
          childs: []
        }
      }
      reportView.value = options
    }
    function showListOptions(isShow) {
      if (isShow && isEmptyValue(reportOptions.value)) reportAsPrintFormat()
    }
    function showListView(isShow) {
      if (isShow && isEmptyValue(reportView.value)) reportAsView()
    }
    const defaultParams = computed(() => {
      return props.reportOutput
    })
    function defaultReport() {
      reportAsView()
      reportAsPrintFormat()
      const { print_format_id, report_view_id } = defaultParams.value
      reportAsPrintFormatValue.value = print_format_id
      reportAsPrintViewValue.value = report_view_id
    }
    const tableName = computed(() => {
      const { tableName } = store.getters.getReportOutput(root.$route.params.reportId)
      if (!isEmptyValue(tableName)) {
        return tableName
      }
      const currentPrintFormat = reportOptions.value.childs.find(printFormat => {
        return printFormat.id === reportAsPrintFormatValue.value
      })
      if (isEmptyValue(currentPrintFormat)) {
        return ''
      }
      return currentPrintFormat.tableName
    })
    const findTagViwer = computed(() => {
      return store.getters.visitedViews.find(tag => tag.instanceUuid === root.$route.params.instanceUuid)
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
          printFormatId: reportAsPrintFormatValue.value,
          reportId: reportDefinition.id,
          instanceUuid: defaultParams.value.instance_id,
          reportViewId: defaultParams.value.report_view_id,
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
    watch(reportAsPrintFormatValue, (newValue) => {
      updatePrintFormat(newValue)
    })

    function updatePrintFormat(value) {
      store.commit('setReportGenerated', {
        containerUuid: props.containerUuid,
        printFormatId: value,
        reportViewId: reportAsPrintViewValue.value
      })
    }
    defaultReport()
    return {
      reportOptions,
      reportAsPrintFormatValue,
      defaultParams,
      reportView,
      reportAsPrintViewValue,
      tableName,
      findTagViwer,
      timeOutRecords,
      reportAsPrintFormat,
      showListOptions,
      defaultReport,
      showListView,
      runReport,
      updatePrintFormat
    }
  }
})
</script>
<style>
.PrimtFormatcontainer {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 0 auto;
}

@media screen and (min-width: 800px) {
  .PrimtFormatcontainer {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}
@media screen and (max-width:1000px) {
  #report-format-select, #report-view-select  {
    width: 120px;
  }
}
@media screen and (max-width:920px) {
  #report-format-select, #report-view-select  {
    width: 60px;
  }
}
</style>
