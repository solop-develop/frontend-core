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

export function generateReport({
  reportId,
  reportType,
  filters,
  sortBy,
  pageSize,
  pageToken,
  printFormatId,
  reportViewId,
  isSummary,
  // window
  tableName,
  recordId
}) {
  return request({
    url: `/report-engine/reports/${reportId}`,
    method: 'get',
    params: {
      report_type: reportType,
      filters,
      sort_by: sortBy,
      page_size: pageSize,
      page_token: pageToken,
      print_format_id: printFormatId,
      report_view_id: reportViewId,
      is_summary: isSummary,
      table_name: tableName,
      record_id: recordId
    }
  })
}

export function getView({
  reportType,
  filters,
  sortBy,
  pageSize,
  pageToken,
  printFormatId,
  reportViewId,
  isSummary,
  // window
  tableName,
  recordId
}) {
  return request({
    url: `/report-engine/views/${printFormatId}`,
    method: 'get',
    params: {
      report_type: reportType,
      filters,
      sort_by: sortBy,
      page_size: pageSize,
      page_token: pageToken,
      print_format_id: printFormatId,
      report_view_id: reportViewId,
      is_summary: isSummary,
      table_name: tableName,
      record_id: recordId
    }
  })
}

export function runExport({
  format = 'xlsx',
  reportViewId,
  printFormatId,
  reportId,
  pageSize,
  pageToken,
  filters
}) {
  return request({
    url: `/report-engine/export/${reportId}/${format}`,
    method: 'post',
    data: {
      print_format_id: printFormatId,
      report_view_id: reportViewId,
      page_size: pageSize,
      page_token: `${pageToken}`,
      filters
    }
  })
}

export function ListNotificationsTypes() {
  return request({
    url: '/send_notifications/notifications_types',
    method: 'get'
  })
}

export function ListUsers() {
  return request({
    url: '/send_notifications/user',
    method: 'get'
  })
}

export function SendNotification({
  user_id,
  title,
  recipients,
  subject,
  notification_type,
  attachments
}) {
  let contacts = []
  if (Array.isArray(recipients)) {
    contacts = recipients.map(parameter => {
      if (typeof parameter === 'object') {
        return {
          account_name: parameter.label,
          contact_id: parameter.value
        }
      } else {
        return {
          account_name: parameter
        }
      }
    })
  } else {
    contacts = [{
      account_name: recipients
    }]
  }
  return request({
    url: '/send_notifications/notification',
    method: 'post',
    data: {
      user_id,
      title,
      body: subject,
      notification_type,
      attachments: [attachments],
      recipients: contacts
    }
  })
}
