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
  reportFormat,
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
      report_type: reportFormat,
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
  reportId,
  tableName,
  printFormatId,
  reportViewId,
  isSummary,
  reportName,
  reportType,
  filters = ''
}) {
  return request({
    url: `/report-management/report-output/${reportId}/${tableName}`,
    method: 'get',
    params: {
      // reference
      print_format_id: printFormatId,
      report_view_id: reportViewId,
      is_summary: isSummary,
      report_name: reportName,
      report_type: reportType,
      // DSL Query
      filters
    }
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
  instanceId,
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
      record_id: recordId,
      AD_PInstance_ID: instanceId
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
  filters,
  isSummary
}) {
  return request({
    url: `/report-engine/export/${reportId}/${format}`,
    method: 'post',
    data: {
      print_format_id: printFormatId,
      report_view_id: reportViewId,
      page_size: pageSize,
      page_token: `${pageToken}`,
      filters,
      is_summary: isSummary
    }
  })
}

export function listNotificationsTypes() {
  return request({
    url: '/send-notifications/notifications-types',
    method: 'get'
  })
}

export function listUsers() {
  return request({
    url: '/send-notifications/users',
    method: 'get'
  })
}

export function sendNotification({
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
    url: '/send-notifications/notifications',
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
