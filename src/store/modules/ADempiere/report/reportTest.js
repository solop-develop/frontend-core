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
  testStore: {}
}
const test = {
  state: initState,

  mutations: {
    scrollByetTest(state, contactSend) {
      state.testStore = contactSend
    }
  },
  actions: {
    runReport({ commit, getters }, {
      containerUuid,
      reportFormat = DEFAULT_REPORT_TYPE,
      recordId,
      reportId,
      printFormatId,
      reportViewId,
      tableName
    }) {
      return new Promise(resolve => {
        const reportDefinition = getters.getStoredReport(containerUuid)
        console.log({
          reportDefinition,
          containerUuid,
          printFormatId,
          reportFormat,
          reportViewId,
          tableName,
          reportId,
          recordId
        })
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
    getTest: (state) => {
      return state.testStore
    }
  }
}

export default test
