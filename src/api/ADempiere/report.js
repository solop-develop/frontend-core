/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
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

// Constants
import { ROWS_OF_RECORDS_BY_PAGE } from '@/utils/ADempiere/tableUtils'

/**
 * Request a Generate Report
 * This function allows follow structure:
 * @param {string}  uuid, uuid from report to run
 * @param {string}  reportType, format to output report (pdf, html, csv, ...)
 * @param {string}  tableName, table name of tab, used only window
 * @param {number}  recordId, record identifier, used only window
 * @param {string}  recordUuid, record universal unique identifier, used only window
 * @param {array}   parametersList, parameters from process [{ columnName, value }]
 * @param {string}  printFormatUuid
 * @param {boolean} isSummary
 * @param {string}  reportViewUuid
 */
export function requestGenerateReport({
  id,
  uuid,
  reportType,
  tableName,
  recordId,
  recordUuid,
  parametersList = [],
  isSummary,
  printFormatId,
  printFormatUuid,
  reportViewId,
  reportViewUuid
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
      record_uuid: recordUuid,
      // report
      is_summary: isSummary,
      report_type: reportType,
      report_view_id: reportViewId,
      report_view_uuid: reportViewUuid,
      parameters: parametersList,
      print_format_id: printFormatId,
      print_format_uuid: printFormatUuid
    }
  })
    .then(reportGeneratedResponse => {
      const { convertProcessLog } = require('@/utils/ADempiere/apiConverts/process.js')

      return convertProcessLog(reportGeneratedResponse)
    })
}

/**
 * Request Pending Documents List
 * @param {string} tableName
 * @param {string} uuid report universally unique identifier
 * @param {string} pageToken token of pagination to number page
 * @param {number} pageSize limit of records to return
 * @returns {promise}
 */
export function requestListReportsViews({
  tableName,
  uuid,
  pageToken,
  pageSize = ROWS_OF_RECORDS_BY_PAGE
}) {
  return request({
    url: '/user-interface/process/report-views',
    method: 'get',
    params: {
      table_name: tableName,
      process_uuid: uuid,
      page_token: pageToken,
      page_size: pageSize
    }
  })
    .then(reportViewResponse => {
      const { convertReportView } = require('@/utils/ADempiere/apiConverts/report.js')

      return {
        nextPageToken: reportViewResponse.next_page_token,
        recordCount: reportViewResponse.record_count,
        reportViewsList: reportViewResponse.records.map(drill => {
          return convertReportView(drill)
        })
      }
    })
}

/**
 * Get print formats from table name, report view uuid or process uuid
 * @param {string} reportViewUuid report view universally unique identifier
 * @param {string} tableName
 * @param {string} uuid report universally unique identifier
 * @param {string} pageToken token of pagination to number page
 * @param {number} pageSize limit of records to return
 * @returns {promise}
 */
export function requestListPrintFormats({
  tableName,
  reportViewUuid,
  uuid,
  pageToken,
  pageSize = ROWS_OF_RECORDS_BY_PAGE
}) {
  return request({
    url: '/user-interface/process/print-formats',
    method: 'get',
    params: {
      table_name: tableName,
      report_view_uuid: reportViewUuid,
      process_uuid: uuid,
      page_token: pageToken,
      page_size: pageSize
    }
  })
    .then(responseListPrintFormats => {
      const { convertListPrintFormats } = require('@/utils/ADempiere/apiConverts/report.js')

      return convertListPrintFormats(responseListPrintFormats)
    })
}

/**
 * Get drill tables for a report
 * @param {string} tableName
 * @param {string} pageToken token of pagination to number page
 * @param {number} pageSize limit of records to return
 * @returns {promise}
 */
export function requestListDrillTables({
  tableName,
  pageToken,
  pageSize = ROWS_OF_RECORDS_BY_PAGE
}) {
  return request({
    url: '/user-interface/process/drill-tables',
    method: 'get',
    params: {
      table_name: tableName,
      page_token: pageToken,
      page_size: pageSize
    }
  })
    .then(drillTablesResponse => {
      const { convertDrillTables } = require('@/utils/ADempiere/apiConverts/report.js')

      return {
        drillTablesList: drillTablesResponse.records.map(drill => {
          return convertDrillTables(drill)
        }),
        nextPageToken: drillTablesResponse.next_page_token,
        recordCount: drillTablesResponse.record_count
      }
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
