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

import router from '@/router'
import store from '@/store'

// Components and Mixins
import ActionMenu from '@/components/ADempiere/ActionMenu/index.vue'
import LoadingView from '@/components/ADempiere/LoadingView/index.vue'
import mixinReport from '@/views/ADempiere/Report/mixinReport.js'
import PanelDefinition from '@/components/ADempiere/PanelDefinition/index.vue'
import OptionsReport from '@/components/ADempiere/ReportManager/Setup/optionsReport.vue'
import TitleAndHelp from '@/components/ADempiere/TitleAndHelp/index.vue'
import PanelFooter from '@/components/ADempiere/PanelFooter/index.vue'

// Utils and Helper Methods
import { closeTagView } from '@/utils/ADempiere/componentUtils'

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

  setup() {
    const isLoadedMetadata = ref(false)
    const reportMetadata = ref({})

    const currentRoute = router.app._route
    const reportId = currentRoute.meta.id
    const reportUuid = currentRoute.meta.uuid

    const {
      containerManager, actionsManager, storedReportDefinition
    } = mixinReport({
      reportId,
      reportUuid
    })

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
      const report = storedReportDefinition.value
      if (report) {
        reportMetadata.value = report
        isLoadedMetadata.value = true
        return
      }

      // // metadata props use for test
      // if (!isEmptyValue(props.metadata)) {
      //   // from server response
      //   report = convertReport(props.metadata)
      //   // add apps properties
      //   report = generateReport(report)
      //   // add into store
      //   return store.dispatch('addReport', report)
      //     .then(reportResponse => {
      //       // to obtain the load effect
      //       setTimeout(() => {
      //         reportMetadata.value = reportResponse
      //         isLoadedMetadata.value = true
      //       }, 1000)
      //     })
      // }

      store.dispatch('getReportDefinitionFromServer', {
        id: reportId
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
      reportId,
      reportUuid,
      isLoadedMetadata,
      reportMetadata,
      containerManager,
      actionsManager,
      // Computeds
      isMobile,
      showContextMenu,
      isShowPanelConfig,
      // Methods
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
