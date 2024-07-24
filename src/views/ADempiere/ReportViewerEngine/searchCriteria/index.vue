<template>
  <el-row :gutter="24" align="middle" class="containerReport">
    <el-col :xs="24" :md="14" class="containerPrint">
      <PrintOptions
        :container-uuid="containerUuid"
        :report-output="reportOutput"
      />
    </el-col>
    <el-col :xs="24" :md="6" :offset-md="2" class="containerSumary">
      <reportSumary />
    </el-col>
    <el-col :xs="24" :md="2" class="containerButtom">
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
  setup(props, { root }) {
    function viewShowDialog() {
      store.commit('setShowDialog', true)
      store.dispatch('exportReport', {
        reportId: root.$route.params.reportId,
        reportName: props.reportOutput.name
      })
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
}
.containerReport .el-col {
  vertical-align: middle;
  display: inline-block;
}
@media screen and (max-width: 800px) {
  .containerSumary, .containerButtom {
    margin-top: 20px;
    display: inline-block;
    vertical-align: top;
  }
  .containerPrint{
    margin-left: 25px;
  }
  .containerSumary {
    margin-left:100px;
    width: 70%;
  }
  .containerButtom {
    width: 20%;
  }
}
@media screen and (max-width: 1080px) {
  .containerSumary, .containerButtom {
    margin-top: 10px;
    display: inline-block;
    vertical-align: top;
  }
  .containerPrint{
    margin-left: 25px;
  }
  .containerSumary {
    margin-left: -30px;
    font-size: 12px;
  }
}
@media screen and (max-width: 1200px) {
  .containerSumary, .containerButtom {
    margin-top: 10px;
    display: inline-block;
    vertical-align: top;
  }
  .containerPrint{
    margin-left: 25px;
  }
  .containerSumary {
    margin-left: -50px;
    font-size: 12px;
  }
}
</style>
