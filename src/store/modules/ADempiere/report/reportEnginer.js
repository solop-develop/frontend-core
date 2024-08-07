/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 * Contributor(s): Edwin Betancourt EdwinBetanc0urt@outlook.com https://github.com/EdwinBetanc0urt
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
import router from '@/router'
import language from '@/lang'
// API Request Methods
import {
  getView,
  runExport,
  generateReport,
  SendNotification
} from '@/api/ADempiere/reportManagement/index.ts'

// Utils
import {
  isEmptyValue,
  getOperatorAndValue
} from '@/utils/ADempiere/valueUtils.js'
import { showNotification } from '@/utils/ADempiere/notification.js'
import { config } from '@/utils/ADempiere/config'

const initState = {
  reportManager: {}
}
const reportManager = {
  state: initState,

  mutations: {
    setReportManager(state, reportManager) {
      Vue.set(state.reportManager, reportManager.instanceUuid, reportManager)
    }
  },
  actions: {
    buildReport({ commit, getters, dispatch }, {
      containerUuid,
      instanceUuid,
      tableName,
      printFormatId,
      reportViewId,
      reportType,
      isSummary,
      pageToken,
      pageSize,
      sortBy
    }) {
      const currentRoute = router.app._route
      if (isEmptyValue(containerUuid)) {
        if (currentRoute.params && currentRoute.params.reportUuid) {
          containerUuid = currentRoute.params.reportUuid
        }
      }
      const reportDefinition = getters.getStoredReport(containerUuid)
      const {
        id,
        name,
        description,
        fieldsList
      } = reportDefinition
      showNotification({
        title: language.t('notifications.processing'),
        message: name,
        summary: description,
        type: 'info'
      })
      commit('setReportIsLoading', true)
      return new Promise((resolve) => {
        const filters = getOperatorAndValue({
          format: 'array',
          containerUuid,
          fieldsList
        })
        if (isEmptyValue(instanceUuid)) {
          dispatch('generateReportViwer', {
            reportId: reportDefinition.id,
            reportUuid: reportDefinition.uuid,
            containerUuid,
            filters,
            printFormatId,
            reportViewId,
            isSummary,
            tableName
          })
        }
        getView({
          printFormatId,
          reportViewId,
          reportType,
          pageToken,
          isSummary,
          tableName,
          pageSize,
          filters,
          sortBy
        })
          .then(response => {
            commit('setReportManager', {
              containerUuid,
              rowCells: response.rows,
              instanceUuid: id,
              pageSize,
              pageToken
            })
            showNotification({
              title: language.t('notifications.succesful'),
              message: name,
              type: 'success'
            })
            resolve(response)
          })
          .catch(error => {
            showNotification({
              title: language.t('notifications.succesful'),
              message: name,
              type: 'success'
            })
            console.warn(`Error getting Get Report: ${error.message}. Code: ${error.code}.`)
          })
          .finally(() => {
            commit('setReportIsLoading', false)
          })
      })
    },
    generateReportViwer({ commit, rootGetters }, {
      containerUuid,
      reportUuid,
      reportId,
      filters,
      printFormatId,
      reportViewId,
      isSummary,
      tableName,
      pageSize,
      pageToken,
      sortBy,
      reportType
    }) {
      return new Promise(resolve => {
        const recordId = rootGetters.getIdOfContainer({
          containerUuid,
          tableName
        })
        generateReport({
          reportId,
          reportType,
          filters,
          sortBy,
          pageSize,
          pageToken,
          printFormatId,
          reportViewId,
          isSummary,
          tableName,
          recordId
        })
          .then(response => {
            const {
              name,
              instance_id,
              report_view_id
            } = response
            router.push({
              path: `report-viewer-engine/${reportId}/${instance_id}/${report_view_id}`,
              name: 'Report Viewer Engine',
              params: {
                reportId,
                instanceUuid: instance_id,
                fileName: name,
                reportUuid,
                // menuParentUuid,
                name: name + instance_id,
                tableName
              }
            }, () => {})
            showNotification({
              title: language.t('notifications.succesful'),
              message: name,
              type: 'success'
            })
            commit('setReportManager', {
              ...response,
              containerUuid,
              rowCells: response.rows,
              instanceUuid: reportId,
              pageSize,
              pageToken
            })
            resolve(response)
          })
          .catch(error => {
            showNotification({
              title: language.t('notifications.error'),
              message: error.message,
              type: 'error'
            })
            console.warn(`Error getting Get Report: ${error.message}. Code: ${error.code}.`)
          })
          .finally(() => {
            commit('setReportIsLoading', false)
          })
      })
    },
    exportReport({ commit, rootGetters }, {
      containerUuid,
      reportId,
      reportName,
      printFormatId,
      reportViewId,
      pageSize,
      pageToken,
      isDownload = true
    }) {
      const reportDefinition = rootGetters.getStoredReport(containerUuid)
      const { fieldsList } = reportDefinition
      const filters = getOperatorAndValue({
        format: 'array',
        containerUuid,
        fieldsList
      })
      return new Promise(resolve => {
        runExport({
          reportId,
          printFormatId,
          reportViewId,
          pageSize,
          pageToken,
          filters
        })
          .then(response => {
            const { file_name } = response
            if (!isEmptyValue(file_name)) {
              if (isDownload) {
                const file = document.createElement('a')
                file.href = `${config.adempiere.resource.url}${file_name}`
                file.download = `${reportName}`
                file.target = '_blank'
                file.click()
              }
              resolve(file_name)
            }
          })
          .catch(error => {
            showNotification({
              title: language.t('notifications.error'),
              message: `Error exporting report: ${error.message}. Code: ${error.code}.`,
              type: 'error'
            })
            console.warn(`Error exporting report: ${error.message}. Code: ${error.code}.`)
            resolve(error)
          })
      })
    },
    notifyReport({ commit }, {
      user_id,
      title,
      recipients,
      notification_type,
      attachments,
      subject
    }) {
      return new Promise(resolve => {
        SendNotification({
          user_id,
          title,
          recipients,
          notification_type,
          attachments,
          subject
        })
          .then(response => {
            showNotification({
              title: language.t('notifications.succesful'),
              message: title,
              type: 'success'
            })
            resolve(response)
          })
          .catch(error => {
            showNotification({
              title: language.t('notifications.error'),
              message: error.message,
              type: 'error'
            })
            console.warn(`Error exporting report: ${error.message}. Code: ${error.code}.`)
          })
      })
    }
  },
  getters: {
    getReportManager: (state) => (instanceUuid) => {
      return state.reportManager[instanceUuid]
    }
  }
}

export default reportManager
