// ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
// Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
// Contributor(s): Yamel Senih ysenih@erpya.com www.erpya.com
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

// Get Instance for connection
import { request } from '@/utils/ADempiere/request'

/**
 * Request workflow definition
 * @param {string} uuid universally unique identifier
 * @param {number} id, identifier
 */
export function requestWorkflowMetadata({
  uuid,
  id
}) {
  return request({
    url: '/workflow/workflow',
    method: 'get',
    params: {
      uuid,
      id
    }
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
  recordUuid,
  documentStatus,
  pageSize,
  pageToken
}) {
  return request({
    url: '/workflow/document-statuses',
    method: 'get',
    params: {
      id: recordId,
      uuid: recordUuid,
      table_name: tableName,
      document_status: documentStatus,
      // Page Data
      pageToken,
      pageSize
    }
  })
    .then(listDocumentsActionsResponse => {
      return {
        nextPageToken: listDocumentsActionsResponse.next_page_token,
        recordCount: listDocumentsActionsResponse.record_count,
        documentStatusesList: listDocumentsActionsResponse.records
      }
    })
}

// Request a document action list from current status of document
export function requestListDocumentActions({
  tableName,
  recordId,
  recordUuid,
  documentStatus,
  documentAction,
  pageSize,
  pageToken
}) {
  return request({
    url: '/workflow/document-actions',
    method: 'get',
    params: {
      id: recordId,
      uuid: recordUuid,
      table_name: tableName,
      document_action: documentAction,
      document_status: documentStatus,
      // Page Data
      pageToken,
      pageSize
    }
  })
    .then(listDocumentsActionsResponse => {
      return {
        nextPageToken: listDocumentsActionsResponse.next_page_token,
        recordCount: listDocumentsActionsResponse.record_count,
        defaultDocumentAction: {
          ...listDocumentsActionsResponse.default_document_action
        },
        documentActionsList: listDocumentsActionsResponse.records
      }
    })
}

// Request a list of Activities from the user's Workflows
export function workflowActivities({
  userUuid,
  pageSize,
  pageToken
}) {
  return request({
    url: '/workflow/workflow-activities',
    method: 'get',
    params: {
      user_uuid: userUuid,
      // Page Data
      page_token: pageToken,
      pageSize
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
// GET Workflows
/**
 * Request Document Status List
 * @param {string} tableName
 * @param {number} pageSize
 * @param {string} pageToken
 */
export function getWorkflow({
  tableName,
  pageSize,
  pageToken
}) {
  return request({
    url: '/workflow/workflows',
    method: 'get',
    params: {
      table_name: tableName,
      // Page Data
      pageToken,
      pageSize
    }
  })
    .then(listWorkflowActivities => {
      return listWorkflowActivities
    })
}
