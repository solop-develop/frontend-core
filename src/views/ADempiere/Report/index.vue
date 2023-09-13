<!--
  ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
  Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
  Contributor(s): Edwin Betancourt EdwinBetanc0urt@outlook.com https://github.com/EdwinBetanc0urt
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
  <!-- <el-container
    v-if="isLoadedMetadata"
    key="report-loaded"
    class="view-base report-view"
  >
    <el-main> -->
  <div
    v-if="isLoadedMetadata"
    id="report-loaded"
  >
    <el-card class="content-collapse card-report" style="overflow: auto;">
      <title-and-help
        :name="reportMetadata.name"
        :help="reportMetadata.help"
      />
      <div id="report-view">
        <action-menu
          :container-manager="containerManager"
          :parent-uuid="reportUuid"
          :container-uuid="reportUuid"
          :actions-manager="actionsManager"
          style="float: right;padding-left: 1%;"
        />
        <br><br>

        <panel-definition
          :container-uuid="reportUuid"
          :panel-metadata="reportMetadata"
          :container-manager="containerManager"
          :is-tab-panel="true"
        />
        <br>
      </div>
    </el-card>

    <el-drawer
      :visible.sync="isShowPanelConfig"
      :with-header="true"
      :before-close="handleClose"
      :show-close="true"
      :title="$t('report.reportSettings')"
      :size="isMobile ? '100%' : '50%'"
    >
      <options-report
        :container-uuid="reportUuid"
        :container-manager="containerManager"
        :is-show-title="false"
      />
    </el-drawer>

    <el-button
      type="primary"
      icon="el-icon-arrow-left"
      circle
      style="top: 50%; right: 0%; position: absolute;"
      @click="handleOpem()"
    />
    <panel-footer
      :container-uuid="reportUuid"
      :is-button-run="true"
      :is-button-clear="true"
      :is-button-close="true"
      :action-run="runReport"
      :action-clear="clearParameters"
    />
  </div>

  <loading-view
    v-else
    key="report-loading"
  />
</template>

<script>
import { defineComponent, computed, ref } from '@vue/composition-api'

import store from '@/store'
import router from '@/router'

// components and mixins
import ActionMenu from '@/components/ADempiere/ActionMenu/index.vue'
import LoadingView from '@/components/ADempiere/LoadingView/index.vue'
import mixinReport from '@/views/ADempiere/Report/mixinReport.js'
import PanelDefinition from '@/components/ADempiere/PanelDefinition/index.vue'
import OptionsReport from '@/components/ADempiere/ReportManager/Setup/optionsReport.vue'
import TitleAndHelp from '@/components/ADempiere/TitleAndHelp/index.vue'
import PanelFooter from '@/components/ADempiere/PanelFooter/index.vue'

// utils and helper methods
import { isEmptyValue, closeTagView } from '@/utils/ADempiere/valueUtils'
import { convertProcess as convertReport } from '@/utils/ADempiere/apiConverts/dictionary.js'
import { generateProcess as generateReport } from '@/utils/ADempiere/dictionary/process.js'

export default defineComponent({
  name: 'ReportView',

  components: {
    ActionMenu,
    LoadingView,
    PanelDefinition,
    TitleAndHelp,
    OptionsReport,
    PanelFooter
  },

  props: {
    // implement by test view
    uuid: {
      type: String,
      default: ''
    }
  },

  setup(props, { root }) {
    const isLoadedMetadata = ref(false)
    const reportMetadata = ref({})

    let reportUuid = root.$route.meta.uuid
    // set uuid from test
    if (!isEmptyValue(props.uuid)) {
      reportUuid = props.uuid
    }

    const { containerManager, actionsManager, storedReportDefinition } = mixinReport(reportUuid)

    const showContextMenu = computed(() => {
      return store.state.settings.showContextMenu
    })

    const isMobile = computed(() => {
      return store.state.app.device === 'mobile'
    })

    const isShowPanelConfig = computed(() => {
      return store.getters.getShowPanelConfig({
        containerUuid: reportUuid
      })
    })

    function showPanelConfigReport(value) {
      store.commit('setShowPanelConfig', {
        containerUuid: reportUuid,
        value
      })
    }

    store.dispatch('settings/changeSetting', {
      key: 'showContextMenu',
      value: true
    })

    // get report from vuex store or request from server
    const getReport = async() => {
      let report = storedReportDefinition.value
      if (report) {
        reportMetadata.value = report
        isLoadedMetadata.value = true
        return
      }

      // metadata props use for test
      if (!isEmptyValue(props.metadata)) {
        // from server response
        report = convertReport(props.metadata)
        // add apps properties
        report = generateReport(report)
        // add into store
        return store.dispatch('addReport', report)
          .then(reportResponse => {
            // to obtain the load effect
            setTimeout(() => {
              reportMetadata.value = reportResponse
              isLoadedMetadata.value = true
            }, 1000)
          })
      }

      store.dispatch('getReportDefinitionFromServer', {
        uuid: reportUuid
      })
        .then(reportResponse => {
          reportMetadata.value = reportResponse
        }).catch(error => {
          console.warn(error)
        }).finally(() => {
          isLoadedMetadata.value = true
        })
    }

    function handleClose() {
      showPanelConfigReport(false)
    }

    function handleOpem() {
      showPanelConfigReport(!isShowPanelConfig.value)
    }

    function closeReport() {
      const currentRoute = router.app._route
      closeTagView(currentRoute)
    }

    function runReport(params) {
      store.dispatch('buildReport', {
        containerUuid: reportUuid,
        isSummary: true
      })
    }

    function clearParameters() {
      store.dispatch('setReportDefaultValues', {
        containerUuid: reportUuid
      })
    }

    getReport()

    return {
      reportUuid,
      isLoadedMetadata,
      reportMetadata,
      containerManager,
      actionsManager,
      // computeds
      isMobile,
      showContextMenu,
      isShowPanelConfig,
      // methodos
      showPanelConfigReport,
      clearParameters,
      closeTagView,
      handleClose,
      closeReport,
      handleOpem,
      runReport
    }
  }
})
</script>

<style lang="scss">
.report-view {
  .card-report {
    >.el-card__body {
      padding-top: 0px;
      padding-right: 20px;
      padding-bottom: 20px;
      padding-left: 20px;
      height: 100%;
    }
  }
}
</style>
<style scoped >
  .el-card {
    width: 100% !important;
    height: 100% !important;
  }
  .scroll-tab-report {
    width: 100% !important;
    height: 95%!important;
    max-height: 120%!important;
  }
</style>
