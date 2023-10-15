<!--
  ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
  Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
  Contributor(s): Elsio Sanchez elsiosanches@gmail.com https://github.com/elsiosanchez
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
  <el-card class="box-card">
    <div v-if="isShowTitle" slot="header" class="clearfix">
      <b>
        {{ $t('report.reportSettings') }}
      </b>
    </div>

    <div class="text item">
      <el-form
        label-position="top"
        label-width="10px"
        @submit.native.prevent="notSubmitForm"
      >
        <el-row class="report-setup-preferences-fields" :gutter="20">
          <el-col :span="8">
            <el-form-item
              :label="$t('report.printFormats')"
              style="display: grid;"
            >
              <el-select
                v-model="reportAsPrintFormatValue"
                style="display: contents;"
              >
                <el-option
                  v-for="(item, key) in reportAsPrintFormat.childs"
                  :key="key"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item
              :label="$t('report.reportViews')"
              style="display: grid;"
            >
              <el-select
                v-model="reportAsViewValue"
                style="display: contents;"
              >
                <el-option
                  v-for="(item, key) in reportAsView.childs"
                  :key="key"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item
              :label="$t('report.typeReport')"
              style="display: grid;"
            >
              <el-select
                v-model="reportTypeFormatValue"
                style="display: contents;"
              >
                <el-option
                  v-for="(item, key) in reportTypeFormat.childs"
                  :key="key"
                  :label="item.name"
                  :value="item.type"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <el-row
      style="
        position: absolute;
        bottom: 1%;
        right: 2%;
      "
    >
      <el-col :span="24">
        <samp class="report-setup-footer">
          <el-button
            plain
            type="info"
            class="button-base-icon"
            style="font-size: 25px;"
            @click="actionClear()"
          >
            <svg-icon icon-class="layers-clear" />
          </el-button>
          <el-button
            type="danger"
            class="button-base-icon"
            icon="el-icon-close"
            @click="handleClose()"
          />
          <el-button
            type="primary"
            class="button-base-icon"
            icon="el-icon-check"
            @click="runReport()"
          />
        </samp>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import { defineComponent, computed, ref, watch } from '@vue/composition-api'

import store from '@/store'

// Components and Mixins
import CollapseCriteria from '@/components/ADempiere/CollapseCriteria/index.vue'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'

export default defineComponent({
  name: 'OptionsReport',

  components: {
    CollapseCriteria
  },

  props: {
    containerUuid: {
      type: String,
      required: true
    },
    containerManager: {
      type: Object,
      required: true
    },
    isShowTitle: {
      type: Boolean,
      default: true
    }
  },

  setup(props) {
    /**
     * Ref
     */
    const reportAsViewValue = ref(undefined)
    const reportAsPrintFormatValue = ref(undefined)
    const reportTypeFormatValue = ref('')

    const attributes = computed(() => {
      return store.getters.getConfigReport({
        containerUuid: props.containerUuid,
        columnName: 'reportType'
      })
    })
    const reportAsView = computed(() => {
      const options = store.getters.getStoredActionsMenu({
        containerUuid: props.containerUuid
      }).find(repoortOptions => repoortOptions.actionName === 'runReportAsView')
      if (isEmptyValue(options)) {
        return {
          childs: []
        }
      }
      return options
    })

    const reportAsPrintFormat = computed(() => {
      const options = store.getters.getStoredActionsMenu({
        containerUuid: props.containerUuid
      }).find(repoortOptions => repoortOptions.actionName === 'runReportAsPrintFormat')
      if (isEmptyValue(options)) {
        return {
          childs: []
        }
      }
      return options
    })

    const reportTypeFormat = computed(() => {
      const options = store.getters.getStoredActionsMenu({
        containerUuid: props.containerUuid
      }).find(repoortOptions => repoortOptions.actionName === 'runReportAs')
      if (isEmptyValue(options)) {
        return {
          childs: []
        }
      }
      return options
    })

    const icon = computed(() => {
      if (isShowSetupReport.value) {
        return 'el-icon-arrow-down'
      }
      return 'el-icon-arrow-right'
    })

    const isShowSetupReport = computed(() => {
      return store.getters.getShowPanelConfig({
        containerUuid: props.containerUuid
      })
    })

    function updatePrintFormat(value) {
      store.commit('setReportGenerated', {
        containerUuid: props.containerUuid,
        printFormatId: value,
        reportType: reportTypeFormatValue.value,
        reportViewId: reportAsViewValue.value
      })
    }

    function updateReportView(value) {
      store.commit('setReportGenerated', {
        containerUuid: props.containerUuid,
        printFormatId: reportAsPrintFormatValue.value,
        reportType: reportTypeFormatValue.value,
        reportViewId: value
      })
    }

    function updateReportType(value) {
      store.commit('setReportGenerated', {
        containerUuid: props.containerUuid,
        reportViewId: reportAsViewValue.value,
        printFormatId: reportAsPrintFormatValue.value,
        reportType: value
      })
    }

    function handleClose() {
      store.commit('setShowPanelConfig', {
        containerUuid: props.containerUuid,
        value: false
      })
      actionClear()
    }

    function runReport() {
      store.dispatch('buildReport', {
        containerUuid: props.containerUuid,
        isSummary: true
      })
      store.commit('setShowPanelConfig', {
        containerUuid: props.containerUuid,
        value: false
      })
    }

    function actionClear(params) {
      reportAsViewValue.value = undefined
      reportAsPrintFormatValue.value = undefined
      reportTypeFormatValue.value = ''
    }

    watch(reportAsViewValue, (newValue) => {
      updateReportView(newValue)
    })

    watch(reportAsPrintFormatValue, (newValue) => {
      updatePrintFormat(newValue)
    })

    watch(reportTypeFormatValue, (newValue) => {
      updateReportType(newValue)
    })

    updatePrintFormat(reportTypeFormatValue.value)

    updateReportView(reportAsViewValue.value)

    updateReportType(reportTypeFormatValue.value)

    return {
      // Ref
      reportAsViewValue,
      reportAsPrintFormatValue,
      reportTypeFormatValue,
      attributes,
      icon,
      reportAsView,
      reportAsPrintFormat,
      reportTypeFormat,
      updatePrintFormat,
      isShowSetupReport,
      // methods
      handleClose,
      actionClear,
      runReport
    }
  }
})
</script>

<style lang="scss">
.report-setup-preferences-fields {
  /**
   * Reduce the spacing between the form element and its label
   */
   .el-form-item__label {
    padding-bottom: 0px;
  }
}
</style>
