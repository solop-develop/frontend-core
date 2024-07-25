<template>
  <el-row :gutter="24" align="middle" class="containerReport">
    <el-col :xs="24" :md="14" class="containerPrint">
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
import { defineComponent } from '@vue/composition-api'
import PrintOptions from './printFormatReport.vue'
import reportSummary from './reportSumary.vue'
import refreshButton from './refreshButton.vue'

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
    function viewShowDialog() {
      store.commit('setShowDialog', true)
    }
    return {
      viewShowDialog
    }
  }
})
</script>

<style>
.containerReport {
  margin-bottom: 20px;
  margin-right: 90px !important
}
.containerRefreshButton {
  padding-right: 5px;
}
.containerReport .el-col {
  display: flex;
  align-items: center;
}

@media screen and (max-width: 800px) {
  .containerSummary, .containerButton {
    margin-top: 25px;
    display: flex;
    justify-content: center;
  }
}

@media screen and (max-width: 1080px) {
  .containerSummary, .containerButton {
    margin-top: 10px;
    display: flex;
    justify-content: center;
  }
  .containerSummary {
    font-size: 12px;
  }
}

@media screen and (max-width: 1200px) {
  .containerSummary, .containerButton {
    margin-top: 10px;
    display: flex;
    justify-content: center;
  }
  .containerSummary {
    font-size: 12px;
  }
}
</style>
