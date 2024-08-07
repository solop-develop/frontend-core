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

// Api Reqest Methods
import {
  getReportOutputRequest
} from '@/api/ADempiere/reportManagement/index.ts'

// Utils and Helper Methods
import {
  buildLinkHref
} from '@/utils/ADempiere/resource.js'
import { isEmptyValue } from '@/utils/ADempiere'
const initState = {
  reportsGenerated: {},
  reportsOutput: {}
}

const reportManager = {
  state: initState,
  mutations: {
    setReportOutput(state, reportOutput) {
      Vue.set(state.reportsOutput, reportOutput.instanceUuid, reportOutput)
    }
  },
  actions: {
    getReportOutputFromServer({ commit, getters, rootGetters }, {
      uuid,
      id,
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
    }
  },
  getters: {
    getReportOutput: (state) => (instanceUuid) => {
      return state.reportsOutput[instanceUuid]
    }
  }
}

export default reportManager
