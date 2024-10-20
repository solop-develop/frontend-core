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

// Constants
import { RECORD_ROWS_BY_LIST } from '@/utils/ADempiere/dictionary/field/lookups.js'
import { ROWS_OF_RECORDS_BY_PAGE } from '@/utils/ADempiere/tableUtils'

/**
 * Request workflow definition
 * @param {string} uuid universally unique identifier
 * @param {number} id, identifier
 */
export function requestWorkflowMetadata({
  id
}) {
  return request({
    url: `/workflow/workflows/${id}`,
    method: 'get'
  })
}

/**
 * Request Document Status List
 * @param {string} tableName
 * @param {number} recordId
 * @param {string} recordUuid
 * @param {string} documentStatus
 * @param {string} documentAction
 * @param {number} pageSize
 * @param {string} pageToken
 */
export function requestListDocumentStatuses({
  tableName,
  recordId,
  searchValue,
  pageSize = RECORD_ROWS_BY_LIST,
  pageToken
}) {
  return request({
    url: `/workflow/statuses/${tableName}/${recordId}`,
    method: 'get',
    params: {
      search_value: searchValue,
      // Page Data
      page_token: pageToken,
      page_size: pageSize
    }
  })
}

// Request a document action list from current status of document
export function requestListDocumentActions({
  tableName,
  recordId,
  searchValue,
  pageSize = RECORD_ROWS_BY_LIST,
  pageToken
}) {
  return request({
    url: `/workflow/actions/${tableName}/${recordId}`,
    method: 'get',
    params: {
      search_value: searchValue,
      // Page Data
      page_token: pageToken,
      page_size: pageSize
    }
  })
}

// Request a list of Activities from the user's Workflows
export function workflowActivities({
  id,
  pageSize = ROWS_OF_RECORDS_BY_PAGE,
  pageToken
}) {
  return request({
    url: `/workflow/workflows/${id}/activities`,
    method: 'get',
    params: {
      user_id: id,
      // Page Data
      page_token: pageToken,
      page_size: pageSize
    }
  })
    .then(listWorkflowActivities => {
      return {
        nextPageToken: listWorkflowActivities.next_page_token,
        recordCount: listWorkflowActivities.record_count,
        listWorkflowActivities: listWorkflowActivities.records
      }
    })
}

/**
 * Request Document Status List
 * @param {string} tableName
 * @param {number} pageSize
 * @param {string} pageToken
 */
export function getWorkflow({
  tableName,
  pageSize = ROWS_OF_RECORDS_BY_PAGE,
  pageToken
}) {
  return request({
    url: '/workflow/workflows',
    method: 'get',
    params: {
      table_name: tableName,
      // Page Data
      page_token: pageToken,
      page_size: pageSize
    }
  })
    .then(listWorkflowActivities => {
      return listWorkflowActivities
    })
}

/**
 * Request Document Status List
 * @param {string} tableName
 * @param {number} recordId record identifier
 * @param {string} docAction
 */
export function requestRunDocumentAction({
  tableName,
  recordId,
  docAction
}) {
  return request({
    url: `/workflow/workflows/run-action/${tableName}/${recordId}/${docAction}`,
    method: 'post'
  })
}

/**
 * Process Workflow Activity
 * @param {number} id
 * @param {string} uuid
 * @param {string} message
 * @param {boolean} isApproved
 */
export function processWorkflowActivity({
  id,
  uuid,
  message,
  isApproved
}) {
  return request({
    url: `/workflow/workflows/${id}/process`,
    method: 'post',
    data: {
      id,
      uuid,
      message,
      is_approved: isApproved
    }
  })
}

/**
 * Forward Workflow Activity
 * @param {number} id
 * @param {string} uuid
 * @param {string} message
 * @param {number} userId
 * @param {string} userUuid
 */
export function forwardWorkflowActivity({
  id,
  uuid,
  message,
  userId,
  userUuid
}) {
  return request({
    url: `/workflow/workflows/${id}/forward`,
    method: 'post',
    data: {
      id,
      uuid,
      message,
      user_id: userId,
      user_uuid: userUuid
    }
  })
}
