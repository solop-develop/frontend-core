<template>
  <div>
    <label for="report-format-select" class="select-label">{{ $t('report.printFormats') }} </label>
    <el-select
      id="report-format-select"
      v-model="reportAsPrintFormatValue"
      class="selectReportFormat"
      :placeholder="$t('report.printFormats')"
      @visible-change="showList"
      @change="updatePrintFormat"
    >
      <el-option
        v-for="(item, key) in reportOptions.childs"
        :key="key"
        :label="item.name"
        :value="item.id"
      />
    </el-select>
  </div>
</template>
<script>
import store from '@/store'
import { defineComponent, ref } from '@vue/composition-api'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
export default defineComponent({
  name: 'PrintOptions',
  props: {
    containerUuid: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const reportOptions = ref([])
    const reportAsPrintFormatValue = ref(undefined)
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
    function showList(isShow) {
      if (isShow && isEmptyValue(reportOptions.value)) reportAsPrintFormat()
    }
    return {
      reportOptions,
      reportAsPrintFormatValue,
      reportAsPrintFormat,
      showList
    }
  }
})
</script>
<style>
  .selectReportFormat {
    width: 300px
  }
</style>
