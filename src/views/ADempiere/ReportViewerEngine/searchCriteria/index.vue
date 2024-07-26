<template>
  <el-row :gutter="24" align="middle" class="containerReport">
    <el-col :xs="24" :md="12" class="containerPrint">
      <PrintOptions
        :container-uuid="containerUuid"
        :report-output="reportOutput"
      />
    </el-col>
    <el-col :xs="24" :md="5" class="containerSummary">
      <reportSummary />
    </el-col>
    <el-col :xs="24" :md="3" class="containerRefreshButton">
      <refreshButton
        :container-uuid="containerUuid"
        :report-output="reportOutput"
      />
    </el-col>
    <el-col :xs="24" :md="2" class="containerButton">
      <el-button
        plain
        size="mini"
        type="primary"
        class="custom-button"
        @click="viewShowDialog"
      >
        {{ $t('report.reportEnginer.share') }}
      </el-button>
    </el-col>
  </el-row>
</template>

<script>
import store from '@/store'
import language from '@/lang'
import { defineComponent, computed } from '@vue/composition-api'

import PrintOptions from './printFormatReport.vue'
import reportSummary from './reportSumary.vue'
import refreshButton from './refreshButton.vue'

import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

export default defineComponent({
  name: 'reportSearchCriteria',
  components: {
    PrintOptions,
    reportSummary,
    refreshButton
  },
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
    const storedMailTemplatesList = computed(() => {
      return store.getters.getListMailTemplates
    })
    function viewShowDialog() {
      if (!isEmptyValue(storedMailTemplatesList.value) && !isEmptyValue(storedMailTemplatesList.value.menus)) {
        const link = language.t('report.reportEnginer.urlPublic')
        store.commit('setDefaultBody', storedMailTemplatesList.value.menus[0].mail_text + `\n\n\n[${link}](www.123892138.com)`)
      }
      store.commit('setShowDialog', true)
    }
    return {
      storedMailTemplatesList,
      viewShowDialog
    }
  }
})
</script>

<style scoped>
.containerReport {
  display: flex !important;
  align-items: center !important;
  margin-bottom: 1% !important;
}
@media screen and (max-width:1150px) {
  .containerReport, .custom-button {
    font-size: 12px;
  }
}
@media screen and (max-width:1100px) {
  .containerReport {
    margin-bottom: 22px;
  }
}
</style>
