<!--
  ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
  Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
  Contributor(s): Elsio Sanchez elsiosanches@gmail.com https://github.com/ElsioSanchez
  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program. If not, see <https:www.gnu.org/licenses/>.
-->
<template>
  <el-card class="containerReportEnginer">
    <options-report
      :container-uuid="reportOutput.containerUuid"
      :container-manager="containerManager"
      :report-output="reportOutput"
      :is-show-title="false"
      :is-report-enginer="false"
      :is-loading-report="isLoadingReport"
    />
    <el-dialog
      v-shortkey="shortsKey"
      :visible.sync="showDialog"
      :title="$t('report.reportEnginer.optionsImport.title')"
      top="2vh"
      @shortkey.native="keyAction"
      @close="viewShowDialog"
    >
      <dialogShareReport
        :report-output="reportOutput"
        :container-uuid="containerUuid"
      />
    </el-dialog>
    <data-report
      :container-manager="containerManager"
      :instance-uuid="instanceUuid"
      :container-uuid="containerUuid"
      :report-output="reportOutput"
    />
  </el-card>
</template>
<script>
import {
  defineComponent,
  computed
} from '@vue/composition-api'
import store from '@/store'
// Components
import CustomPagination from '@/components/ADempiere/DataTable/Components/CustomPagination.vue'
import InfoReport from '@/views/ADempiere/ReportViewerEngine/infoReport.vue'
import dialogShareReport from '@/views/ADempiere/ReportViewerEngine/dialog'
import DataReport from '@/components/ADempiere/Report/Data/DataReport.vue'
import OptionsReport from '@/components/ADempiere/ReportManager/Setup/optionsReportViewer.vue'

export default defineComponent({
  name: 'reportPanel',
  components: {
    CustomPagination,
    InfoReport,
    DataReport,
    dialogShareReport,
    OptionsReport
  },
  props: {
    containerManager: {
      type: Object,
      default: () => []
    },
    instanceUuid: {
      type: Number,
      default: 0
    },
    containerUuid: {
      type: String,
      required: true
    },
    reportOutput: {
      type: Object,
      required: false
    }
  },
  setup() {
    // Computed
    const shortsKey = computed(() => {
      return {
        close: ['esc']
      }
    })

    const showDialog = computed(() => {
      return store.getters.getReportShowDialog
    })
    // Methods
    function keyAction(event) {
      switch (event.srcKey) {
        case 'close':
          viewShowDialog()
      }
    }

    function viewShowDialog() {
      store.commit('setShowDialog', false)
    }
    const isLoadingReport = computed(() => {
      return store.getters.getReportIsLoading
    })
    return {
      // Computed
      showDialog,
      shortsKey,
      isLoadingReport,
      // Methods
      keyAction,
      viewShowDialog
    }
  }
})
</script>

<style lang="scss" scoped>
	.content {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0%;
  }
  .el-table__body-wrapper {
    position: relative;
    height: 100%;
    overflow-y: 'auto';
  }
  .p {
    margin: 0px;
    .column-right {
      text-align: right;
    }
  }
</style>
