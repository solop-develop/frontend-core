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
  generateReportRequest,
  getReportOutputRequest,
  listNotificationsTypes,
  listUsers,
  sendNotification
} from '@/api/ADempiere/reportManagement/index.ts'
import { listPrintFormatsRequest, listPrintFormatsTableRequest } from '@/api/ADempiere/reportManagement/printFormat.ts'
import { listReportViewsRequest } from '@/api/ADempiere/reportManagement/reportView.ts'
import { listDrillTablesRequest } from '@/api/ADempiere/reportManagement/drillTable.ts'

// Constants
import {
  DEFAULT_REPORT_TYPE
} from '@/utils/ADempiere/dictionary/report.js'
import { config } from '@/utils/ADempiere/config'

// Utils and Helper Methods
import { getToken } from '@/utils/auth'
import {
  isEmptyValue,
  getOperatorAndValue
} from '@/utils/ADempiere/valueUtils.js'
import {
  buildLinkHref
} from '@/utils/ADempiere/resource.js'
import { showMessage, showNotification } from '@/utils/ADempiere/notification.js'
import {
  containerManager
} from '@/utils/ADempiere/dictionary/report.js'

const initState = {
  printFormatList: {},
  reportViewsList: {},
  drillTablesList: {},
  reportsOutput: {},
  reportsGenerated: {},
  isShowPanelConfig: {},
  pageSize: 15,
  isLoading: false,
  showDialog: false,
  expandedAll: false,
  exportReport: {},
  contactSend: '',
  typeNotify: '',
  defaultBody: ''
}
const reportManager = {
  state: initState,

  mutations: {
    setContactSend(state, contactSend) {
      state.contactSend = contactSend
    },
    setTypeNotify(state, typeNotify) {
      state.typeNotify = typeNotify
    },
    setExportReport(state, exportReport) {
      state.exportReport = exportReport
    },
    setShowDialog(state, showDialog) {
      state.showDialog = showDialog
    },
    setExpandedAll(state, expandedAll) {
      state.expandedAll = expandedAll
    },
    setReportIsLoading(state, isLoading) {
      state.isLoading = isLoading
    },
    setPrintFormatsList(state, { reportId, printFormatList }) {
      Vue.set(state.printFormatList, reportId, printFormatList)
    },
    setReportViewsList(state, { containerUuid, reportViewsList }) {
      Vue.set(state.reportViewsList, containerUuid, reportViewsList)
    },
    setDrillTablesList(state, { containerUuid, drillTablesList }) {
      Vue.set(state.drillTablesList, containerUuid, drillTablesList)
    },
    setReportOutput(state, reportOutput) {
      Vue.set(state.reportsOutput, reportOutput.instanceUuid, reportOutput)
    },
    setReportGenerated(state, { containerUuid, parametersList, reportType, printFormatId, reportViewId, isSummary }) {
      Vue.set(state.reportsGenerated, containerUuid, {
        containerUuid,
        parametersList,
        reportType,
        printFormatId,
        reportViewId,
        isSummary
      })
    },
    resetStateReportManager(state) {
      state = initState
    },
    setShowPanelConfig(state, { containerUuid, value }) {
      Vue.set(state.isShowPanelConfig, containerUuid, value)
    },
    setDefaultBody(state, message) {
      state.defaultBody = message
    }
  },
  actions: {
    reportActionPerformed({ dispatch, getters }, {
      containerUuid,
      field,
      value,
      valueTo
    }) {
      return new Promise(resolve => {
        const fieldsList = getters.getStoredFieldsFromReport(containerUuid)

        // change Dependents
        dispatch('changeDependentFieldsList', {
          field,
          fieldsList,
          containerManager
        })
      })
    },

    startReport({ commit, dispatch, rootGetters }, {
      containerUuid,
      reportType = DEFAULT_REPORT_TYPE,
      printFormatId,
      reportViewId,
      tableName,
      isSummary,
      recordUuid
    }) {
      return new Promise(resolve => {
        const reportDefinition = rootGetters.getStoredReport(containerUuid)
        const { fieldsList } = reportDefinition

        const fieldsEmpty = rootGetters.getReportParametersEmptyMandatory({
          containerUuid,
          fieldsList
        })
        if (!isEmptyValue(fieldsEmpty)) {
          showMessage({
            message: language.t('notifications.mandatoryFieldMissing') + fieldsEmpty,
            type: 'info'
          })
          return
        }

        const filters = getOperatorAndValue({
          format: 'array',
          containerUuid,
          fieldsList
        })

        if (isEmptyValue(recordUuid)) {
          // close current page
          const currentRoute = router.app._route
          const tabViewsVisited = rootGetters.visitedViews
          dispatch('tagsView/delView', currentRoute)
          // go to back page
          const oldRouter = tabViewsVisited[tabViewsVisited.length - 1]
          if (!isEmptyValue(oldRouter)) {
            router.push({
              path: oldRouter.path
            }, () => {})
          }
        }

        const recordId = rootGetters.getIdOfContainer({
          containerUuid,
          tableName
        })
        dispatch('generateReportViwer', {
          reportId: reportDefinition.id,
          reportUuid: reportDefinition.uuid,
          containerUuid,
          filters,
          printFormatId,
          reportViewId,
          isSummary,
          tableName,
          recordId
        })
      })
    },

    downloadReport({ commit, rootGetters }, {
      containerUuid,
      reportType = DEFAULT_REPORT_TYPE
    }) {
      return new Promise(resolve => {
        const reportDefinition = rootGetters.getStoredReport(containerUuid)

        const parametersList = rootGetters.getReportParameters({
          containerUuid
        })

        let reportingNotification = {
          close: () => false
        }
        const isSession = !isEmptyValue(getToken())
        if (isSession) {
          reportingNotification = showNotification({
            title: language.t('notifications.processing'),
            message: reportDefinition.name,
            summary: reportDefinition.description,
            type: 'info'
          })
        }

        generateReportRequest({
          id: reportDefinition.id,
          reportType,
          parametersList
        })
          .then(runReportRepsonse => {
            const { instanceUuid, output, is_error } = runReportRepsonse

            if (is_error) {
              showNotification({
                title: language.t('notifications.error'),
                message: reportDefinition.name,
                summary: runReportRepsonse.summary,
                type: 'error'
              })
              console.warn(`Error running the report. ${runReportRepsonse.summary}.`)
            }

            let link = {
              href: undefined,
              download: undefined
            }
            if (output && output.output_stream) {
              link = buildLinkHref({
                fileName: output.file_name,
                outputStream: output.output_stream,
                mimeType: output.mime_type
              })

              // donwload report file
              link.click()
            }

            commit('setReportOutput', {
              ...output,
              instanceUuid,
              reportUuid: containerUuid,
              link,
              parametersList,
              url: link.href,
              download: link.download
            })

            resolve(runReportRepsonse)
          })
          .catch(error => {
            console.warn(`Error getting print formats: ${error.message}. Code: ${error.code}.`)
          })
          .finally(() => {
            // close runing report notification
            if (!isEmptyValue(reportingNotification)) {
              setTimeout(() => {
                reportingNotification.close()
              }, 1000)
            }
          })
      })
    },

    /**
     * Get list prints formats
     * @param {number} id report identifier
     * @returns
     */
    listPrintFormatsFromServer({ commit, dispatch, getters }, {
      reportId
    }) {
      return new Promise(resolve => {
        const currentListPrintFormat = getters.getPrintFormatList(reportId)
        if (!isEmptyValue(currentListPrintFormat)) {
          resolve(currentListPrintFormat)
          return
        }
        listPrintFormatsRequest({ reportId })
          .then(async printFormatResponse => {
            const printFormatList = await Promise.all(
              printFormatResponse.print_formats.map(async printFormatItem => {
                await Promise.allSettled([
                  dispatch('getReportViewsFromServer', {
                    reportId,
                    // TODO: Verify if table name is required
                    tableName: printFormatItem.table_name
                  }),
                  dispatch('getDrillTablesFromServer', {
                    reportId,
                    tableName: printFormatItem.table_name
                  })
                ])

                return {
                  ...printFormatItem,
                  // reportUuid: reportDefinition.uuid,
                  reportId: reportId
                }
              })
            )

            commit('setPrintFormatsList', {
              reportId,
              printFormatList
            })

            resolve(printFormatList)
          })
          .catch(error => {
            console.warn(`Error getting print formats: ${error.message}. Code: ${error.code}.`)
          })
      })
    },

    /**
     * Get list prints Windows formats
     * @param {number} id report identifier
     * @returns
     */
    listPrintFormatWindow({ commit, dispatch, getters }, {
      tableName,
      reportId
    }) {
      return new Promise(resolve => {
        const currentListPrintFormat = getters.getPrintFormatList(reportId)
        if (!isEmptyValue(currentListPrintFormat)) {
          resolve(currentListPrintFormat)
          return
        }
        listPrintFormatsTableRequest({ tableName })
          .then(async printFormatResponse => {
            const printFormatList = await Promise.all(
              printFormatResponse.print_formats.map(async printFormatItem => {
                await Promise.allSettled([
                  dispatch('getReportViewsFromServer', {
                    reportId,
                    // TODO: Verify if table name is required
                    tableName: printFormatItem.table_name
                  }),
                  dispatch('getDrillTablesFromServer', {
                    reportId,
                    tableName: printFormatItem.table_name
                  })
                ])

                return {
                  ...printFormatItem,
                  // reportUuid: reportDefinition.uuid,
                  reportId: reportId
                }
              })
            )

            commit('setPrintFormatsList', {
              reportId,
              printFormatList
            })

            resolve(printFormatList)
          })
          .catch(error => {
            console.warn(`Error getting print formats: ${error.message}. Code: ${error.code}.`)
          })
      })
    },

    /**
     * Get list report views
     * @param {number} id report identifier
     * @param {string} uuid report universal unique identifier
     * @returns
     */
    getReportViewsFromServer({ commit }, {
      reportId,
      tableName
    }) {
      return new Promise(resolve => {
        listReportViewsRequest({ reportId, tableName })
          .then(reportViewResponse => {
            const reportViewsList = reportViewResponse.report_views.map(reportViewItem => {
              return {
                ...reportViewItem,
                // reportUuid: uuid,
                reportId: reportId
              }
            })

            commit('setReportViewsList', {
              containerUuid: reportId,
              reportViewsList
            })

            resolve(reportViewsList)
          })
          .catch(error => {
            console.warn(`Error getting report views: ${error.message}. Code: ${error.code}.`)
          })
      })
    },

    /**
     * Get list drill tables
     * @param {number} id report identifier
     * @param {string} uuid report universal unique identifier
     * @returns
     */
    getDrillTablesFromServer({ commit }, {
      reportId,
      tableName
    }) {
      return new Promise(resolve => {
        listDrillTablesRequest({ tableName })
          .then(responseDrillTables => {
            const drillTablesList = responseDrillTables.drill_tables.map(drillTableItem => {
              return {
                ...drillTableItem,
                name: drillTableItem.print_name,
                // type: 'updateReport',
                // option: 'drillTable',
                // reportUuid: uuid,
                reportId: reportId
              }
            })

            commit('setDrillTablesList', {
              containerUuid: reportId,
              drillTablesList
            })

            resolve(drillTablesList)
          })
          .catch(error => {
            console.warn(`Error getting drill tables: ${error.message}. Code: ${error.code}.`)
          })
      })
    },

    /**
     * Get report output
     * @param {number} id report identifier
     * @param {string} uuid report universal unique identifier
     * @returns
     */
    getReportOutputFromServer({ commit, getters, rootGetters }, {
      uuid,
      id,
      containerUuid,
      instanceUuid,
      tableName,
      printFormatId,
      reportViewId,
      isSummary,
      reportName,
      reportType,
      parametersList = []
    }) {
      return new Promise(resolve => {
        if (isEmptyValue(printFormatId) || printFormatId <= 0) {
          const printFormat = getters.getDefaultPrintFormat(uuid)
          if (!isEmptyValue(printFormat)) {
            printFormatId = printFormat.printFormatId
          }
        }

        if (isEmptyValue(parametersList)) {
          parametersList = rootGetters.getParametersToServer({
            containerUuid: uuid
          })
        }
        getReportOutputRequest({
          processUuid: uuid,
          parametersList,
          printFormatId,
          reportViewId,
          isSummary,
          reportName,
          reportType,
          tableName
        })
          .then(response => {
            let link = {
              href: undefined,
              download: undefined
            }
            if (response && response.output_stream) {
              link = buildLinkHref({
                fileName: response.file_name,
                outputStream: response.output_stream,
                type: response.mime_type
              })
            }

            const reportOutput = {
              ...response,
              reportId: id,
              reportUuid: uuid,
              isError: false,
              instanceUuid,
              isReport: true,
              link,
              parametersList,
              url: link.href,
              download: link.download
            }

            commit('setReportOutput', reportOutput)

            resolve(reportOutput)
          })
          .catch(error => {
            console.warn(`Error getting report output: ${error.message}. Code: ${error.code}.`)
          })
      })
    },

    buildReport({ commit, dispatch, getters }, {
      containerUuid,
      instanceUuid,
      uuid,
      tableName,
      printFormatId,
      reportViewId,
      reportName,
      reportType,
      isSummary,
      action,
      pageToken,
      pageSize,
      sortBy,
      parametersList = []
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

      const storedReportGenerated = getters.getReportGenerated(containerUuid)

      if (!isEmptyValue(storedReportGenerated)) {
        if (isEmptyValue(reportType)) {
          reportType = storedReportGenerated.reportType
        }
        if (isEmptyValue(parametersList)) {
          parametersList = storedReportGenerated.parametersList
        }
        if (isEmptyValue(uuid) && !isEmptyValue(action)) {
          uuid = action.reportUuid
        }
        if (isEmptyValue(printFormatId) || printFormatId <= 0) {
          printFormatId = storedReportGenerated.printFormatId
        }
        if (isEmptyValue(reportViewId) || reportViewId <= 0) {
          reportViewId = storedReportGenerated.reportViewId
        }
      }

      if (isEmptyValue(tableName) && !isEmptyValue(action)) {
        tableName = action.tableName
      }
      if (isEmptyValue(reportName) && !isEmptyValue(action)) {
        reportName = action.name
      }

      showNotification({
        title: language.t('notifications.processing'),
        message: name,
        summary: description,
        type: 'info'
      })

      commit('setReportIsLoading', true)
      if (isEmptyValue(instanceUuid)) {
        dispatch('startReport', {
          containerUuid,
          reportType,
          printFormatId,
          reportViewId,
          isSummary
        })
        return
      }

      return new Promise((resolve, reject) => {
        const filters = getOperatorAndValue({
          format: 'array',
          containerUuid,
          fieldsList
        })

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
          .then(reportResponse => {
            commit('setReportOutput', {
              ...reportResponse,
              containerUuid,
              rowCells: reportResponse.rows,
              instanceUuid: id,
              pageSize,
              pageToken
            })
            showNotification({
              title: language.t('notifications.succesful'),
              message: name,
              type: 'success'
            })
            resolve(reportResponse)
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
    /**
     * Get report output
     * @param {number} id report identifier
     * @param {string} uuid report universal unique identifier
     * @returns
     */
    generateReportViwer({ commit, getters, rootGetters }, {
      reportId,
      reportType,
      filters,
      sortBy,
      pageSize = 15,
      pageToken = 1,
      containerUuid,
      printFormatId,
      reportViewId,
      reportUuid,
      isSummary,
      // window
      tableName,
      recordId,
      isView
    }) {
      return new Promise(resolve => {
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
          .then(reportResponse => {
            const {
              // id,
              name,
              instance_id,
              report_view_id
            } = reportResponse
            if (!isView) {
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
            }
            commit('setReportOutput', {
              ...reportResponse,
              containerUuid,
              rowCells: reportResponse.rows,
              instanceUuid: reportId,
              pageSize,
              pageToken
            })
            showNotification({
              title: language.t('notifications.succesful'),
              message: name,
              type: 'success'
            })
            resolve(reportResponse)
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
    /**
     * Export Report
     * @param {number} recordId
     * @param {string} format
     * @returns {files}
     */
    exportReport({
      commit,
      rootGetters
    }, {
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
            commit('setShowDialog', true)
            console.warn(`Error exporting report: ${error.message}. Code: ${error.code}.`)
            resolve(error)
          })
      })
    },
    ListNotifications() {
      return new Promise(resolve => {
        listNotificationsTypes()
          .then(response => {
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
    },
    ListUser() {
      return new Promise(resolve => {
        listUsers()
          .then(response => {
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
    },
    sendNotification({ commit }, {
      user_id,
      title,
      recipients,
      notification_type,
      attachments,
      subject
    }) {
      return new Promise(resolve => {
        sendNotification({
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
    getContactSend: (state) => {
      return state.contactSend
    },
    getTypeNotify: (state) => {
      return state.typeNotify
    },
    getExportReport: (state) => {
      return state.exportReport
    },
    getExpandedAll: (state) => {
      return state.expandedAll
    },
    getReportGenerated: (state) => (containerUuid) => {
      return state.reportsGenerated[containerUuid]
    },
    getReportShowDialog: (state) => {
      return state.showDialog
    },
    getReportOutput: (state) => (instanceUuid) => {
      return state.reportsOutput[instanceUuid]
    },
    getReportIsLoading: (state) => {
      return state.isLoading
    },
    getPrintFormatList: (state) => (reportId) => {
      return state.printFormatList[reportId] || []
    },
    getPrintFormat: (state, getters) => ({ reportId, printFormatId }) => {
      return getters.getPrintFormatList(reportId).find(printFormat => {
        return printFormat.id === printFormatId
      })
    },
    getDefaultPrintFormat: (state, getters) => (reportId) => {
      const printFormatsList = getters.getPrintFormatList(reportId)

      if (isEmptyValue(printFormatsList)) {
        return undefined
      }
      const defaultPrintFormat = printFormatsList.find(printFormat => {
        return printFormat.is_default
      })
      return defaultPrintFormat || printFormatsList.at()
    },

    getReportViewList: (state) => (reportId) => {
      return state.reportViewsList[reportId] || []
    },
    getReportView: (state, getters) => ({ reportId, reportViewId }) => {
      return getters.getReportViewList(reportId).find(reportView => {
        return reportView.id === reportViewId
      })
    },
    getDefaultReportView: (state, getters) => (reportId) => {
      const reportViewsList = getters.getReportViewList(reportId)

      if (isEmptyValue(reportViewsList)) {
        return undefined
      }
      const defaultReportView = reportViewsList.find(reportView => reportView.is_default)
      return defaultReportView || reportViewsList.at()
    },

    getDrillTablesList: (state) => (containerUuid) => {
      return state.drillTablesList[containerUuid] || []
    },

    getShowPanelConfig: (state) => ({ containerUuid }) => {
      return state.isShowPanelConfig[containerUuid]
    },
    getDefaultBody: (state) => {
      return state.defaultBody
    }
  }
}

export default reportManager
