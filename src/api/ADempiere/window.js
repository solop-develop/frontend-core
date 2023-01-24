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
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

// Get Instance for connection
import { request } from '@/utils/ADempiere/request'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
/**
 * Request a Lookup list data from Reference
 * The main attributes that function hope are:
 * @param {string} fieldUuid
 * @param {string} browseFieldUuid
 * @param {string} processParameterUuid
 * @param {array}  contextAttributesList
 * @param {string} pageToken
 * @param {number} pageSize
 */
export function requestLookupList({
  contextAttributesList,
  fieldUuid,
  processParameterUuid,
  browseFieldUuid,
  id,
  //
  referenceUuid,
  searchValue,
  //
  tableName,
  columnName,
  columnUuid,
  //
  pageToken,
  pageSize
}) {
  let contextAttributes = []
  if (!isEmptyValue(contextAttributesList)) {
    contextAttributes = contextAttributesList.map(attribute => {
      return {
        key: attribute.columnName,
        value: attribute.value
      }
    })
  }

  return request({
    url: '/user-interface/window/lookup-items',
    method: 'get',
    params: {
      context_attributes: contextAttributes,
      field_uuid: fieldUuid,
      process_parameter_uuid: processParameterUuid,
      browse_field_uuid: browseFieldUuid,
      id,
      //
      reference_uuid: referenceUuid,
      search_value: searchValue,
      //
      table_name: tableName,
      column_name: columnName,
      column_uuid: columnUuid,
      // Page Data
      page_token: pageToken,
      page_size: pageSize
    }
  })
    .then(lookupListResponse => {
      return {
        nextPageToken: lookupListResponse.next_page_token,
        recordCount: lookupListResponse.record_count,
        recordsList: lookupListResponse.records
      }
    })
}

/**
 * Reference List from Window
 * @param {string}  tableName
 * @param {string}  windowUuid
 * @param {string}  recordUuid
 * @param {number}  recordId
 */
export function requestReferencesList({
  windowUuid,
  tableName,
  recordId,
  recordUuid,
  pageToken,
  pageSize
}) {
  return request({
    url: '/user-interface/window/references',
    method: 'get',
    params: {
      id: recordId,
      uuid: recordUuid,
      window_uuid: windowUuid,
      table_name: tableName,
      // Page Data
      pageToken,
      pageSize
    }
  })
    .then(referencesListResposnse => {
      const { convertReferencesList } = require('@/utils/ADempiere/apiConverts/values.js')

      return convertReferencesList(referencesListResposnse)
    })
}

/**
 * Reference List from Window
 * @param {number}  tabId
 * @param {string}  tabUuid
 * @param {number}  recordId
 * @param {string}  recordUuid
 */
export function requestExistsReferences({
  tabId,
  tabUuid,
  recordId,
  recordUuid
}) {
  return request({
    url: '/user-interface/window/exists-references',
    method: 'get',
    params: {
      record_id: recordId,
      record_uuid: recordUuid,
      tab_id: tabId,
      tab_uuid: tabUuid
    }
  })
    .then(referencesListResposnse => {
      return referencesListResposnse
    })
}

/**
 * Get context information for a window, tab or field
 * @param {string} query
 * @param {string} uuid
 * @param {number} id
 */
export function requestGetContextInfoValue({
  uuid,
  id,
  query
}) {
  return request({
    url: '/user-interface/window/context-info-value',
    method: 'get',
    params: {
      query,
      uuid,
      id
    }
  })
    .then(contextInfoValueResponse => {
      return {
        messageText: contextInfoValueResponse.message_text,
        messageTip: contextInfoValueResponse.message_tip
      }
    })
}

/**
 * Run callout request
 * @param {string}  windowUuid
 * @param {number}  windowNo
 * @param {string}  tabUuid
 * @param {string}  tableName
 * @param {string}  columnName
 * @param {mixed}   value
 * @param {mixed}   oldValue
 * @param {string}  callout
 * @param {array}   attributesList
 * @returns {Map} Entity
 */
export function runCallOutRequest({
  windowUuid,
  windowNo,
  tabUuid,
  tableName,
  contextAttributesList = [],
  columnName,
  callout,
  valueType,
  value,
  oldValue
}) {
  return request({
    url: '/user-interface/window/run-callout',
    method: 'post',
    data: {
      window_uuid: windowUuid,
      window_no: windowNo,
      tab_uuid: tabUuid,
      table_name: tableName,
      context_attributes: contextAttributesList,
      column_name: columnName,
      callout,
      value_type: valueType,
      value,
      old_value: oldValue
    }
  })
    .then(response => {
      return response
    })
}

// Get list of log for a records
export function requestListEntityLogs({
  tableName,
  recordId,
  recordUuid,
  pageToken,
  pageSize
}) {
  return request({
    url: '/user/log/entity-logs',
    method: 'get',
    params: {
      table_name: tableName,
      id: recordId,
      uuid: recordUuid,
      // Page Data
      pageToken,
      pageSize
    }
  })
    .then(entityLogsListResponse => {
      const { convertEntityLog } = require('@/utils/ADempiere/apiConverts/window.js')

      return {
        nextPageToken: entityLogsListResponse.next_page_token,
        recordCount: entityLogsListResponse.record_count,
        entityLogsList: entityLogsListResponse.records.map(entityLog => {
          return convertEntityLog(entityLog)
        })
      }
    })
}

// Get workflow log for a record
export function requestListWorkflowsLogs({
  tableName,
  recordId,
  recordUuid,
  pageToken,
  pageSize
}) {
  return request({
    url: '/user/log/workflow-logs',
    method: 'get',
    params: {
      table_name: tableName,
      id: recordId,
      uuid: recordUuid,
      // Page Data
      pageToken,
      pageSize
    }
  })
    .then(workflowLogsListResponse => {
      const { convertWorkflowProcess } = require('@/utils/ADempiere/apiConverts/window.js')

      return {
        nextPageToken: workflowLogsListResponse.next_page_token,
        recordCount: workflowLogsListResponse.record_count,
        workflowLogsList: workflowLogsListResponse.records.map(workflowLog => {
          return convertWorkflowProcess(workflowLog)
        })
      }
    })
}

// Get workflow list for a document
export function requestListWorkflows({
  tableName,
  pageToken,
  pageSize
}) {
  return request({
    url: '/user/log/workflow-logs',
    method: 'get',
    params: {
      table_name: tableName,
      // Page Data
      pageToken,
      pageSize
    }
  })
    .then(workflowListResponse => {
      const { convertWorkflowDefinition } = require('@/utils/ADempiere/apiConverts/window.js')

      return {
        nextPageToken: workflowListResponse.next_page_token,
        recordCount: workflowListResponse.record_count,
        workflowsList: workflowListResponse.records.map(workflowDefinition => {
          return convertWorkflowDefinition(workflowDefinition)
        })
      }
    })
}

/**
 * @param {string}  tableName
 * @param {integer} recordId
 * @param {string}  pageToken
 * @param {string}  pageSize
 */
export function requestListEntityChats({
  tableName,
  recordId,
  recordUuid,
  pageToken,
  pageSize
}) {
  return request({
    url: '/user/log/entity-chats',
    method: 'get',
    params: {
      table_name: tableName,
      id: recordId,
      uuid: recordUuid,
      // Page Data
      pageToken,
      pageSize
    }
  })
    .then(entityChatListResponse => {
      const { convertEntityChat } = require('@/utils/ADempiere/apiConverts/window.js')

      return {
        nextPageToken: entityChatListResponse.next_page_token,
        recordCount: entityChatListResponse.record_count,
        entityChatsList: entityChatListResponse.records.map(entityChat => {
          return convertEntityChat(entityChat)
        })
      }
    })
}

/**
 * @param {string} uuid
 * @param {string} pageToken
 * @param {string} pageSize
 */
export function requestListChatsEntries({
  id,
  uuid,
  pageToken,
  pageSize
}) {
  return request({
    url: '/user/log/chat-entries',
    method: 'get',
    params: {
      id,
      uuid,
      // Page Data
      pageToken,
      pageSize
    }
  })
    .then(chatEntriesListResponse => {
      const { convertChatEntry } = require('@/utils/ADempiere/apiConverts/window.js')

      return {
        nextPageToken: chatEntriesListResponse.next_page_token,
        recordCount: chatEntriesListResponse.record_count,
        chatEntriesList: chatEntriesListResponse.records.map(chatEntry => {
          return convertChatEntry(chatEntry)
        })
      }
    })
}

/**
 * @param {string} tableName
 * @param {string} recordId
 * @param {string} recordUuid
 * @param {string} comment
 */
export function requestCreateChatEntry({
  tableName,
  recordId,
  recordUuid,
  comment
}) {
  return request({
    url: '/user-interface/component/notes/create-chat-entry',
    method: 'post',
    data: {
      table_name: tableName,
      id: recordId,
      uuid: recordUuid,
      comment: comment
    }
  })
    .then(chatEntryResponse => {
      const { convertChatEntry } = require('@/utils/ADempiere/apiConverts/window.js')

      return convertChatEntry(chatEntryResponse)
    })
}

/**
 * Issues exist
 * @param {string}  tableName
 * @param {number}  recordId
 * @param {string}  recordUuid
 */
export function requestExistsIssues({
  tableName,
  recordId,
  recordUuid
}) {
  return request({
    url: '/user-interface/component/issue/exists-issues',
    method: 'get',
    params: {
      record_id: recordId,
      record_uuid: recordUuid,
      table_name: tableName
    }
  })
    .then(existsIssues => {
      return existsIssues
    })
}
/**
 * Issues List from Window
 * @param {string}  tableName
 * @param {number}  recordId
 * @param {string}  recordUuid
 */
export function requestListExists({
  tableName,
  recordId,
  recordUuid
}) {
  return request({
    url: '/user-interface/component/issue/list-issues',
    method: 'post',
    data: {
      record_id: recordId,
      record_uuid: recordUuid,
      table_name: tableName
    }
  })
    .then(listExists => {
      return listExists
    })
}

/**
 * List Sales Representatives
 */
export function listSalesRepresentatives() {
  return request({
    url: '/user-interface/component/issue/list-sales-representatives',
    method: 'post',
    data: {}
  })
    .then(salesRepresentatives => {
      return salesRepresentatives
    })
}

/**
 * List Request Types
 */
export function listRequestTypes() {
  return request({
    url: '/user-interface/component/issue/list-request-types',
    method: 'post',
    data: {}
  })
    .then(requestTypes => {
      return requestTypes
    })
}

/**
 * List Statuses
 */
export function listStatus({
  requestTypeId
}) {
  return request({
    url: '/user-interface/component/issue/list-statuses',
    method: 'post',
    data: {
      request_type_id: requestTypeId
    }
  })
    .then(listStatus => {
      return listStatus
    })
}

/**
 * List Priorities
 */
export function listPriorities() {
  return request({
    url: '/user-interface/component/issue/list-priorities',
    method: 'post',
    data: {}
  })
    .then(listPriorities => {
      return listPriorities
    })
}

/**
 * New Issues
 * @param {string}  tableName
 * @param {number}  recordId
 * @param {string}  recordUuid
 */
export function createIssues({
  tableName,
  recordId,
  recordUuid,
  subject,
  summary,
  requestTypeId,
  requestTypeUuid,
  salesRepresentativeId,
  salesRepresentativeUuid,
  statusId,
  statusUuid,
  priorityValue
}) {
  return request({
    url: '/user-interface/component/issue/create-issue',
    method: 'post',
    data: {
      record_id: recordId,
      record_uuid: recordUuid,
      table_name: tableName,
      subject,
      summary,
      request_type_id: requestTypeId,
      request_type_uuid: requestTypeUuid,
      sales_representative_id: salesRepresentativeId,
      sales_representative_uuid: salesRepresentativeUuid,
      status_id: statusId,
      status_uuid: statusUuid,
      priority_value: priorityValue
    }
  })
    .then(listExists => {
      return listExists
    })
}

/**
 * POST Update Issue
 *
 * req.query.token - user token
 * req.query.language - login language
 * req.body.id - id of record
 * req.body.uuid - uuid of record
 * req.body.subject - subject
 * req.body.summary - summary
 * req.body.requestTypeId - request type id
 * req.body.requestTypeUuid - request type uuid
 */
export function updateIssues({
  tableName,
  id,
  uuid,
  subject,
  summary,
  requestTypeId,
  requestTypeUuid,
  salesRepresentativeId,
  salesRepresentativeUuid,
  statusId,
  statusUuid,
  priorityValue
}) {
  return request({
    url: '/user-interface/component/issue/update-issue',
    method: 'post',
    data: {
      id,
      uuid,
      table_name: tableName,
      subject,
      summary,
      request_type_id: requestTypeId,
      request_type_uuid: requestTypeUuid,
      sales_representative_id: salesRepresentativeId,
      sales_representative_uuid: salesRepresentativeUuid,
      status_id: statusId,
      status_uuid: statusUuid,
      priority_value: priorityValue
    }
  })
    .then(listExists => {
      return listExists
    })
}

/**
 * POST List Issue Comments
 *
 * req.query.token - user token
 * req.query.language - login language
 * req.body.issue_id - id of record parent issue
 * req.body.issue_uuid - uuid of record parent issued
 * req.query.page_size - size of page (customized)
 * req.query.page_token - token of page (optional for get a specific page)
 */

export function listIssueComments({
  issueId,
  issueUuid
}) {
  return request({
    url: '/user-interface/component/issue/list-issue-comments',
    method: 'post',
    data: {
      issue_id: issueId,
      issue_uuid: issueUuid
    }
  })
    .then(listComments => {
      return listComments
    })
}

/**
 * POST Update Issue
 *
 * req.query.token - user token
 * req.query.language - login language
 * req.body.id - id of record
 * req.body.uuid - uuid of record
 * req.body.subject - subject
 * req.body.summary - summary
 * req.body.requestTypeId - request type id
 * req.body.requestTypeUuid - request type uuid
 */

export function updateIssue({
  id,
  uuid,
  subject,
  summary,
  requestTypeId,
  requestTypeUuid,
  salesRepresentativeId,
  salesRepresentativeUuid,
  statusId,
  statusUuid,
  priorityValue
}) {
  return request({
    url: '/user-interface/component/issue/update-issue',
    method: 'post',
    data: {
      id,
      uuid,
      subject,
      summary,
      request_type_id: requestTypeId,
      request_type_uuid: requestTypeUuid,
      sales_representative_id: salesRepresentativeId,
      sales_representative_uuid: salesRepresentativeUuid,
      status_id: statusId,
      status_uuid: statusUuid,
      priority_value: priorityValue
    }
  })
    .then(listComments => {
      return listComments
    })
}

/**
 * POST Delete Issue
 *
 * req.query.token - user token
 * req.query.language - login language
 * req.body.id - id of record
 * req.body.uuid - uuid of record
 */

export function deleteIssue({
  id,
  uuid
}) {
  return request({
    url: '/user-interface/component/issue/delete-issue',
    method: 'post',
    data: {
      id,
      uuid
    }
  })
    .then(listComments => {
      return listComments
    })
}

/**
 * POST Create Issue Comment
 *
 * req.query.token - user token
 * req.query.language - login language
 * req.body.issue_id - id of record parent issue
 * req.body.issue_uuid - uuid of record parent issued
 * req.body.result - result
 * req.body.dateNextAction - date to next action
 */

export function createIssueComment({
  issueId,
  issueUuid,
  result,
  dateNextAction
}) {
  return request({
    url: '/user-interface/component/issue/create-issue-comment',
    method: 'post',
    data: {
      issue_id: issueId,
      issue_uuid: issueUuid,
      result,
      date_next_action: dateNextAction
    }
  })
    .then(listComments => {
      return listComments
    })
}

/**
  * POST Update Issue Comment
  *
  * req.query.token - user token
  * req.query.language - login language
  * req.body.id - id of record
  * req.body.uuid - uuid of record
  * req.body.result - result
  * req.body.dateNextAction - date to next action
 */

export function updateIssueComment({
  issueId,
  issueUuid,
  result,
  dateNextAction
}) {
  return request({
    url: '/user-interface/component/issue/update-issue-comment',
    method: 'post',
    data: {
      id: issueId,
      uuid: issueUuid,
      result,
      date_next_action: dateNextAction
    }
  })
    .then(listComments => {
      return listComments
    })
}

/**
  * POST Delete Issue Comments
  *
  * req.query.token - user token
  * req.query.language - login language
  * req.body.id - id of record
  * req.body.uuid - uuid of record
 */

export function deleteIssueComment({
  issueId,
  issueUuid
}) {
  return request({
    url: '/user-interface/component/issue/delete-issue-comment',
    method: 'post',
    data: {
      id: issueId,
      uuid: issueUuid
    }
  })
    .then(listComments => {
      return listComments
    })
}
