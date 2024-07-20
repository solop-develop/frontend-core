<template>
  <el-card>
    <el-row :gutter="24">
      <el-col :span="6">
        <PrintOptions :container-uuid="containerUuid" />
      </el-col>
      <el-col :span="6">
        <reportView :container-uuid="containerUuid" />
      </el-col>
      <el-col :span="6">
        <reportSumary />
      </el-col>
      <el-col :span="6" style="margin-top: 15px;">
        <el-button
          plain
          size="mini"
          type="primary"
          style="font-weight: bold; height: 40px; margin-left: 50px"
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
import reportView from './reportView.vue'
import reportSumary from './reportSumary.vue'
export default defineComponent({
  name: 'reportSearchCriteria',
  components: {
    PrintOptions,
    reportView,
    reportSumary
  },
  props: {
    containerUuid: {
      type: String,
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
