<template>
  <el-card>
    <el-row :gutter="24" align="middle">
      <el-col :span="14">
        <PrintOptions
          :container-uuid="containerUuid"
          :report-output="reportOutput"
        />
      </el-col>
      <el-col :span="6">
        <reportSumary />
      </el-col>
      <el-col :span="4">
        <el-button
          plain
          size="mini"
          type="primary"
          style="font-weight: bold; height: 40px;"
          @click="viewShowDialog"
        >
          {{ $t('report.reportEnginer.share') }}
        </el-button>
      </el-col>
    </el-row>
  </el-card>
</template>
<script>
import store from '@/store'
import { defineComponent } from '@vue/composition-api'
import PrintOptions from './printFormatReport.vue'
import reportSumary from './reportSumary.vue'
export default defineComponent({
  name: 'reportSearchCriteria',
  components: {
    PrintOptions,
    reportSumary
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
  setup() {
    function viewShowDialog() {
      store.commit('setShowDialog', true)
    }
    return {
      viewShowDialog
    }
  }
})
</script>
