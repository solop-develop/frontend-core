<template>
  <el-card>
    <el-row :gutter="24" align="middle">
      <el-col :xs="24" :md="14" class="containerPrint">
        <PrintOptions
          :container-uuid="containerUuid"
          :report-output="reportOutput"
        />
      </el-col>
      <el-col :xs="24" :md="6" class="containerSumary">
        <reportSumary />
      </el-col>
      <el-col :xs="24" :md="4" class="containerButtom">
        <el-button
          plain
          size="mini"
          type="primary"
          style="font-weight: bold; height: 40px;"
          class="buttonReport"
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
<style>
@media screen and (min-width: 800px) {
  .containerPrint{
    width: 100%
  }
  .containerSumary {
    margin-top: 10px;
  }
  .containerButtom{
    margin-top: 10px
  }
  .containerButtom, .containerSumary{
    display: flex;
    justify-content: center
  }
}

@media screen and (min-width: 1050px) {
  .containerButtom{
    margin-left: -20px;
    margin-top: 1px
  }
}

</style>
