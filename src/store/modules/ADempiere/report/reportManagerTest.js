/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 * Contributor(s): Elsio Sanchez elsiosanches@gmail.com https://github.com/elsiosanchez
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

import Vue from 'vue'

// Constants
import { ROWS_OF_RECORDS_BY_PAGE } from '@/utils/ADempiere/tableUtils'
// import { isEmptyValue } from '@/utils/ADempiere'

const initState = {
  isEmptyReport: {
    containerUuid: '',
    printFormatList: {},
    reportViewsList: {},
    drillTablesList: {},
    data: {},
    filters: {},
    pageSize: ROWS_OF_RECORDS_BY_PAGE,
    expandedAll: false,
    isLoading: false,
    parametersList: [],
    recordCount: 0
  },
  reportOutput: {}
}

const report = {
  state: initState,

  mutations: {
    setReportdData(state, {
      containerUuid,
      printFormatList = {},
      reportViewsList = {},
      drillTablesList = {},
      data = {},
      filters = {},
      pageSize = ROWS_OF_RECORDS_BY_PAGE,
      expandedAll = false,
      isLoading = false,
      parametersList = [],
      recordCount = 0
    }) {
      Vue.set(state.reportOutput, containerUuid, {
        ...state.isEmptyReport,
        printFormatList,
        reportViewsList,
        drillTablesList,
        parametersList,
        containerUuid,
        expandedAll,
        filters,
        recordCount,
        isLoading,
        pageSize,
        data
      })
    }
  },
  actions: {
    startReport({
      commit,
      getters,
      dispatch
    }, {
      containerUuid,
      reportType,
      printFormat,
      filters,
      recordId,
      reportViewUuid,
      isSummary,
      tableName
    }) {
      return new Promise((resolve, reject) => {
        const reportDefinition = getters.getStoredReport(containerUuid)
        // const { fieldsList } = reportDefinition

        // const fieldsEmpty = getters.getReportParametersEmptyMandatory({
        //   containerUuid,
        //   fieldsList
        // })

        // if (!isEmptyValue(fieldsEmpty)) {
        //   showMessage({
        //     message: language.t('notifications.mandatoryFieldMissing') + fieldsEmpty,
        //     type: 'info'
        //   })
        // }

        // const printFormatList = getters.getPrintFormatList(reportDefinition.id)

        // if (isEmptyValue(filters)) {
        //   filters = getOperatorAndValue({
        //     format: 'array',
        //     containerUuid,
        //     fieldsList
        //   })
        // }
        // console.log({
        //   containerUuid,
        //   reportType,
        //   printFormat,
        //   printFormatList,
        //   reportViewUuid,
        //   isSummary,
        //   tableName
        // })

        // dispatch('generateReportViwer', {
        //   reportId: reportDefinition.id,
        //   reportUuid: reportDefinition.uuid,
        //   containerUuid,
        //   filters,
        //   printFormatId,
        //   reportViewId,
        //   isSummary,
        //   tableName,
        //   recordId
        // })
        dispatch('setReportOutput', {
          reportId: reportDefinition.id,
          reportUuid: reportDefinition.uuid,
          containerUuid,
          // printFormatId,
          // reportViewId,
          isSummary,
          tableName,
          recordId,
          reportType,
          filters
        })
        resolve(reportDefinition)
      })
    },
    setReportOutput({
      commit,
      getters,
      dispatch
    }, {
      reportId,
      reportUuid,
      containerUuid,
      parametersList,
      printFormatId,
      reportViewId,
      isSummary,
      tableName,
      recordId,
      reportType,
      filters
    }) {
      return new Promise((resolve, reject) => {
        // const printFormatList = getters.getPrintFormatList(reportDefinition.id)
        commit('setReportdData', {
          containerUuid,
          filters,
          data: {
            reportId,
            reportUuid,
            printFormatId,
            reportViewId,
            isSummary,
            tableName,
            recordId,
            reportType
          },
          reportType,
          // printFormatList,
          parametersList
        })
        dispatch('reportBuilding')
        resolve()
      })
    },
    reportBuilding({
      commit,
      getters,
      dispatch
    }, {
      printFormatList,
      reportViewsList,
      drillTablesList,
      parametersList,
      containerUuid,
      expandedAll,
      recordCount,
      reportType,
      isLoading,
      pageSize,
      filters,
      data
    }) {
      return new Promise((resolve, reject) => {
        const reportDefinition = getters.getStoredReport(containerUuid)
        console.log({
          printFormatList,
          reportViewsList,
          drillTablesList,
          parametersList,
          reportDefinition,
          containerUuid,
          expandedAll,
          recordCount,
          reportType,
          isLoading,
          pageSize,
          data
        })
        dispatch('generateReportViwer', {
          reportId: reportDefinition.id,
          reportUuid: reportDefinition.uuid,
          containerUuid,
          filters
          // printFormatId,
          // reportViewId,
          // isSummary,
          // tableName,
          // recordId
        })
      })
    }
  },
  getters: {
    getReportOutputData: (state) => (containerUuid) => {
      return state.reportOutput[containerUuid] || {}
    }
  }
}

export default report
