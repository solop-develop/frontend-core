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
  requestGenerateReport,
  requestListPrintFormats,
  requestListReportsViews,
  requestListDrillTables,
  requestGetReportOutput
} from '@/api/ADempiere/report'

// Constants
import { REPORT_VIEWER_NAME } from '@/utils/ADempiere/constants/report'
import { REPORT_VIEWER_SUPPORTED_FORMATS, DEFAULT_REPORT_TYPE } from '@/utils/ADempiere/dictionary/report.js'

// Utils and Helper Methods
import { getToken } from '@/utils/auth'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
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
  isShowPanelConfig: {}
}

const reportManager = {
  state: initState,

  mutations: {
    setPrintFormatsList(state, { containerUuid, printFormatList }) {
      Vue.set(state.printFormatList, containerUuid, printFormatList)
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
    setReportGenerated(state, { containerUuid, parametersList, reportType, printFormatUuid, reportViewUuid, isSummary }) {
      Vue.set(state.reportsGenerated, containerUuid, {
        containerUuid,
        parametersList,
        reportType,
        printFormatUuid,
        reportViewUuid,
        isSummary
      })
    },
    resetStateReportManager(state) {
      state = initState
    },
    setShowPanelConfig(state, { containerUuid, value }) {
      Vue.set(state.isShowPanelConfig, containerUuid, value)
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
      printFormatUuid,
      reportViewUuid,
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

        const parametersList = rootGetters.getReportParameters({
          containerUuid,
          fieldsList
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

        requestGenerateReport({
          uuid: containerUuid,
          reportType,
          parametersList,
          printFormatUuid,
          reportViewUuid,
          tableName,
          isSummary,
          recordUuid
        })
          .then(runReportRepsonse => {
            const { instanceUuid, output, isError } = runReportRepsonse

            if (isError) {
              showNotification({
                title: language.t('notifications.error'),
                message: reportDefinition.name,
                summary: runReportRepsonse.summary,
                type: 'error'
              })
              console.warn(`Error running the process. ${runReportRepsonse.summary}.`)
            }

            let link = {
              href: undefined,
              download: undefined
            }
            if (output && output.outputStream) {
              link = buildLinkHref({
                fileName: output.fileName,
                outputStream: output.outputStream,
                mimeType: output.mimeType
              })

              // donwloaded not support render report
              if (!REPORT_VIEWER_SUPPORTED_FORMATS.includes(reportType)) {
                link.click()
              }

              router.push({
                name: REPORT_VIEWER_NAME,
                params: {
                  reportUuid: reportDefinition.uuid,
                  instanceUuid,
                  fileName: output.fileName,
                  // menuParentUuid,
                  name: output.name,
                  tableName: output.tableName
                }
              }, () => {})
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
            showNotification({
              title: language.t('notifications.error'),
              message: error.message,
              type: 'error'
            })
            console.warn(`Error getting print formats: ${error.message}. Code: ${error.code}.`)
          })
          .finally(() => {
            // close runing report notification
            if (!isEmptyValue(reportingNotification)) {
              setTimeout(() => {
                reportingNotification.close()
              }, 1000)
            }
            commit('setReportGenerated', {
              containerUuid,
              parametersList,
              reportType,
              printFormatUuid,
              reportViewUuid
            })
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

        requestGenerateReport({
          uuid: containerUuid,
          reportType,
          parametersList
        })
          .then(runReportRepsonse => {
            const { instanceUuid, output, isError } = runReportRepsonse

            if (isError) {
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
            if (output && output.outputStream) {
              link = buildLinkHref({
                fileName: output.fileName,
                outputStream: output.outputStream,
                type: output.mimeType
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
     * @param {string} uuid report universal unique identifier
     * @returns
     */
    getListPrintFormats({ commit, dispatch }, {
      id,
      uuid
    }) {
      return new Promise(resolve => {
        requestListPrintFormats({ uuid })
          .then(async printFormatResponse => {
            const printFormatList = await Promise.all(
              printFormatResponse.records.map(async printFormatItem => {
                await dispatch('getReportViewsFromServer', {
                  uuid,
                  id,
                  // TODO: Verify if table name is required
                  tableName: printFormatItem.tableName
                })
                dispatch('getDrillTablesFromServer', {
                  uuid,
                  id,
                  tableName: printFormatItem.tableName
                })

                return {
                  ...printFormatItem,
                  reportUuid: uuid,
                  reportId: id
                }
              })
            )

            commit('setPrintFormatsList', {
              containerUuid: uuid,
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
      id,
      uuid,
      tableName
    }) {
      return new Promise(resolve => {
        requestListReportsViews({ uuid, tableName })
          .then(reportViewResponse => {
            const reportViewsList = reportViewResponse.reportViewsList.map(reportViewItem => {
              return {
                ...reportViewItem,
                reportUuid: uuid,
                reportId: id
              }
            })

            commit('setReportViewsList', {
              containerUuid: uuid,
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
      id,
      uuid,
      tableName
    }) {
      return new Promise(resolve => {
        requestListDrillTables({ tableName })
          .then(responseDrillTables => {
            const drillTablesList = responseDrillTables.drillTablesList.map(drillTableItem => {
              return {
                ...drillTableItem,
                name: drillTableItem.printName,
                // type: 'updateReport',
                // option: 'drillTable',
                reportUuid: uuid,
                reportId: id
              }
            })

            commit('setDrillTablesList', {
              containerUuid: uuid,
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
      instanceUuid,
      tableName,
      printFormatUuid,
      reportViewUuid,
      isSummary,
      reportName,
      reportType,
      parametersList = []
    }) {
      return new Promise(resolve => {
        if (isEmptyValue(printFormatUuid)) {
          const printFormat = getters.getDefaultPrintFormat(uuid)
          if (!isEmptyValue(printFormat)) {
            printFormatUuid = printFormat.printFormatUuid
          }
        }

        if (isEmptyValue(parametersList)) {
          parametersList = rootGetters.getParametersToServer({
            containerUuid: uuid
          })
        }
        requestGetReportOutput({
          processUuid: uuid,
          parametersList,
          printFormatUuid,
          reportViewUuid,
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
            if (response && response.outputStream) {
              link = buildLinkHref({
                fileName: response.fileName,
                outputStream: response.outputStream,
                type: response.mimeType
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
      printFormatUuid,
      reportViewUuid,
      reportName,
      reportType,
      isSummary,
      action,
      parametersList = []
    }) {
      const currentRoute = router.app._route
      // generated with refresh web browser
      if (isEmptyValue(containerUuid)) {
        if (currentRoute.params && currentRoute.params.reportUuid) {
          containerUuid = currentRoute.params.reportUuid
        }
      }

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
        if (isEmptyValue(printFormatUuid)) {
          printFormatUuid = storedReportGenerated.printFormatUuid
        }
        if (isEmptyValue(reportViewUuid)) {
          reportViewUuid = storedReportGenerated.reportViewUuid
        }
      }

      if (isEmptyValue(tableName) && !isEmptyValue(action)) {
        tableName = action.tableName
      }
      if (isEmptyValue(reportName) && !isEmptyValue(action)) {
        reportName = action.name
      }

      if (isEmptyValue(instanceUuid)) {
        dispatch('startReport', {
          containerUuid,
          reportType,
          printFormatUuid,
          reportViewUuid,
          isSummary
        })
        return
      }

      return new Promise((resolve) => {
        dispatch('getReportOutputFromServer', {
          uuid: uuid || containerUuid,
          reportType,
          reportName,
          tableName,
          printFormatUuid,
          parametersList,
          instanceUuid,
          reportViewUuid,
          isSummary
        })
          .then(reportOutput => {
            dispatch('tagsView/updateVisitedView', {
              processUuid: uuid,
              instanceUuid,
              ...currentRoute,
              title: `${language.t('route.reportViewer')}: ${reportOutput.name}`
            })

            if (!isEmptyValue(reportOutput)) {
              if (isEmptyValue(parametersList)) {
                parametersList = reportOutput.parametersList
              }
              if (isEmptyValue(tableName)) {
                tableName = reportOutput.tableName
              }
              if (isEmptyValue(printFormatUuid)) {
                printFormatUuid = reportOutput.printFormatUuid
              }
              if (isEmptyValue(reportViewUuid)) {
                reportViewUuid = reportOutput.reportViewUuid
              }
            }

            resolve(reportOutput)
          })
          .finally(() => {
            commit('setReportGenerated', {
              containerUuid,
              parametersList,
              reportType,
              printFormatUuid,
              reportViewUuid
            })
          })
      })
    }
  },

  getters: {
    getReportGenerated: (state) => (containerUuid) => {
      return state.reportsGenerated[containerUuid]
    },

    getReportOutput: (state) => (instanceUuid) => {
      return state.reportsOutput[instanceUuid]
    },

    getPrintFormatList: (state) => (containerUuid) => {
      return state.printFormatList[containerUuid] || []
    },

    getDefaultPrintFormat: (state, getters) => (containerUuid) => {
      const printFormatsList = getters.getPrintFormatList(containerUuid)

      if (isEmptyValue(printFormatsList)) {
        return undefined
      }
      const defaultPrintFormat = printFormatsList.find(printFormat => printFormat.isDefault)
      return defaultPrintFormat || printFormatsList.at()
    },

    getReportViewList: (state) => (containerUuid) => {
      return state.reportViewsList[containerUuid] || []
    },

    getReportView: (state, getters) => ({ containerUuid, reportViewUuid }) => {
      return getters.getReportViewList(containerUuid).find(reportView => {
        return reportView.reportViewUuid === reportViewUuid
      })
    },

    getDefaultReportView: (state, getters) => (containerUuid) => {
      const reportViewsList = getters.getReportViewList(containerUuid)

      if (isEmptyValue(reportViewsList)) {
        return undefined
      }
      const defaultReportView = reportViewsList.find(reportView => reportView.isDefault)
      return defaultReportView || reportViewsList.at()
    },

    getDrillTablesList: (state) => (containerUuid) => {
      return state.drillTablesList[containerUuid] || []
    },

    getShowPanelConfig: (state) => ({ containerUuid }) => {
      return state.isShowPanelConfig[containerUuid]
    }
  }
}

export default reportManager
