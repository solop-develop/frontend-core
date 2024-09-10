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

// import Vue from 'vue'
import router from '@/router'
import language from '@/lang'
// API Request Methods
import {
  generateReportRequest,
  getReportOutputRequest
} from '@/api/ADempiere/reportManagement/index.ts'

// Constants
import {
  DEFAULT_REPORT_TYPE
} from '@/utils/ADempiere/dictionary/report.js'
import { REPORT_VIEWER_SUPPORTED_FORMATS } from '@/utils/ADempiere/dictionary/report.js'
import { REPORT_VIEWER_NAME } from '@/utils/ADempiere/constants/report'

// Utils
import { buildLinkHref } from '@/utils/ADempiere/resource.js'
import { isEmptyValue } from '@/utils/ADempiere'
import { showNotification } from '@/utils/ADempiere/notification.js'

const initState = {
  reportRun: {}
}
const reportRun = {
  state: initState,

  mutations: {
    scrollByetTest(state, contactSend) {
      state.reportRun = contactSend
    }
  },
  actions: {
    runReport({ commit, getters, rootGetters }, {
      containerUuid,
      reportFormat = DEFAULT_REPORT_TYPE,
      reportId,
      recordId,
      printFormatId,
      reportViewId,
      tableName
    }) {
      return new Promise(resolve => {
        const reportDefinition = getters.getStoredReport(containerUuid)
        showNotification({
          title: language.t('notifications.processing'),
          message: reportDefinition.name,
          summary: reportDefinition.description,
          type: 'info'
        })
        if (isEmptyValue(reportId)) {
          reportId = reportDefinition.id
        }
        if (isEmptyValue(printFormatId)) {
          printFormatId = reportDefinition.print_format_id
        }
        if (isEmptyValue(reportViewId)) {
          reportViewId = reportDefinition.report_view_id
        }
        if (isEmptyValue(recordId)) {
          recordId = rootGetters.getIdOfContainer({
            containerUuid,
            tableName
          })
        }
        generateReportRequest({
          reportFormat,
          id: reportId,
          printFormatId,
          reportViewId,
          tableName,
          recordId
        })
          .then(runReportRepsonse => {
            const { instance_id, output, is_error } = runReportRepsonse

            if (is_error) {
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
            if (output && output.output_stream) {
              link = buildLinkHref({
                fileName: output.file_name,
                outputStream: output.output_stream,
                mimeType: output.mime_type
              })

              // donwloaded not support render report
              if (!REPORT_VIEWER_SUPPORTED_FORMATS.includes(reportFormat)) {
                link.click()
              }

              router.push({
                path: `/report-viewer/${reportDefinition.id}/${instance_id}`,
                name: REPORT_VIEWER_NAME,
                params: {
                  reportId: reportDefinition.id,
                  reportUuid: reportDefinition.uuid,
                  instanceUuid: instance_id,
                  fileName: output.file_name + instance_id,
                  // menuParentUuid,
                  name: output.name + instance_id,
                  tableName: output.table_name
                }
              }, () => {})
              showNotification({
                title: language.t('notifications.succesful'),
                message: output.file_name,
                type: 'success'
              })
            }

            commit('setReportOutput', {
              ...output,
              reportId: reportDefinition.id,
              reportUuid: reportDefinition.uuid,
              instanceUuid: instance_id,
              link,
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
            console.warn(`Error getting Get Report: ${error.message}. Code: ${error.code}.`)
          })
      })
    },
    reportOutput({ dispatch, getters }, {
      reportId,
      recordId,
      tableName,
      reportFormat,
      printFormatId
    }) {
      return new Promise(resolve => {
        if (isEmptyValue(reportId) || isEmptyValue(tableName)) {
          // dispatch('generateReport')
          resolve(null)
          return
        }
        getReportOutputRequest({
          reportId,
          tableName,
          printFormatId,
          reportFormat,
          recordId
        })
      })
    }
  },

  getters: {
    getReportRun: (state) => {
      return state.reportRun
    }
  }
}

export default reportRun
