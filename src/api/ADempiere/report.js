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

// Get Instance for connection
import { request } from '@/utils/ADempiere/request'

/**
 * Request a Generate Report
 * This function allows follow structure:
 * @param {string}  uuid, uuid from report to run
 * @param {string}  reportType, format to output report (pdf, html, csv, ...)
 * @param {string}  tableName, table name of tab, used only window
 * @param {number}  recordId, record identifier, used only window
 * @param {array}   parametersList, parameters from process [{ columnName, value }]
 * @param {string}  printFormatId
 * @param {boolean} isSummary
 * @param {string}  reportViewId
 */
export function requestGenerateReport({
  id,
  uuid,
  reportType,
  tableName,
  recordId,
  parametersList = [],
  isSummary,
  printFormatId,
  reportViewId
}) {
  parametersList = parametersList.map(parameter => {
    return {
      key: parameter.columnName,
      value: parameter.value
    }
  })

  return request({
    url: '/common/api/process',
    method: 'post',
    data: {
      id,
      uuid,
      // record
      table_name: tableName,
      record_id: recordId,
      // report
      is_summary: isSummary,
      report_type: reportType,
      report_view_id: reportViewId,
      parameters: parametersList,
      print_format_id: printFormatId
    }
  })
    .then(reportGeneratedResponse => {
      const { convertProcessLog } = require('@/utils/ADempiere/apiConverts/process.js')

      return convertProcessLog(reportGeneratedResponse)
    })
}

// Get report output from parameters
export function requestGetReportOutput({
  processId,
  processUuid,
  tableName,
  printFormatUuid,
  reportViewUuid,
  isSummary,
  reportName,
  reportType,
  parametersList = [],
  // query criteria
  query,
  whereClause,
  orderByClause
}) {
  const filters = parametersList.map(parameter => {
    return {
      column_name: parameter.columnName,
      value: parameter.value
    }
  })

  return request({
    url: '/user-interface/process/report-output',
    method: 'get',
    params: {
      process_id: processId,
      process_uuid: processUuid,
      table_name: tableName,
      // reference
      print_format_uuid: printFormatUuid,
      report_view_uuid: reportViewUuid,
      is_summary: isSummary,
      report_name: reportName,
      report_type: reportType,
      // DSL Query
      filters,
      criteria: filters,
      // Custom Query
      query,
      where_clause: whereClause,
      order_by_clause: orderByClause
    }
  })
    .then(reportOutpuResponse => {
      const { convertReportOutput } = require('@/utils/ADempiere/apiConverts/report.js')

      return convertReportOutput(reportOutpuResponse)
    })
}
