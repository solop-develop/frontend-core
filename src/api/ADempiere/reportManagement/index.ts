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
 * Generate report
 * @param {number} id, identifier of Report
 * @param {string} reportType, PDF, XLS, XML, TXT...
 * @param {array} parameters, filters
 * @param {number} printFormatId
 * @param {number} reportViewId
 * @param {boolean} isSummary, show as summary data
 * @param {string} tableName, table of window tab
 * @param {number} recordId, record of window tab
 */
export function generateReportRequest({
  id,
  reportType,
  parameters,
  printFormatId,
  reportViewId,
  isSummary,
  // window
  tableName,
  recordId
}) {
  return request({
    url: `/report-management/report/${id}`,
    method: 'post',
    data: {
      report_type: reportType,
      parameters,
      print_format_id: printFormatId,
      report_view_id: reportViewId,
      is_summary: isSummary,
      table_name: tableName,
      record_id: recordId
    }
  })
}

// Get report output from parameters
export function getReportOutputRequest({
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
