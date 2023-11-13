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
// CONST
import { config } from '@/utils/ADempiere/config'

// Get Instance for connection
import { request } from '@/utils/ADempiere/request'

/**
 * Issues exist
 * @param {string} tableName
 * @param {number} recordId
 */
export function requestExistsIssues({
  tableName,
  recordId
}) {
  return request({
    url: `${config.issuesManagement.endpoint}/issues/${tableName}/${recordId}/exists`,
    // url: `/issue-management/issues/${tableName}/${recordId}/exists`,
    method: 'get',
    params: {
      record_id: recordId,
      table_name: tableName
    }
  })
    .then(existsIssues => {
      return existsIssues
    })
}

/**
 * Issues List from Window
 * @param {string} tableName
 * @param {number} recordId
 * @param {string} searchValue
 */
export function requestListIssues({
  tableName,
  recordId,
  searchValue
}) {
  return request({
    url: `${config.issuesManagement.endpoint}/issues`,
    method: 'get',
    params: {
      record_id: recordId,
      table_name: tableName,
      search_value: searchValue
    }
  })
}

/**
 * List Sales Representatives
 */
export function requestListSalesRepresentatives({
  searchValue
}) {
  return request({
    url: `${config.issuesManagement.endpoint}/sales-representatives`,
    // url: '/issue-management/sales-representatives',
    method: 'get',
    params: {
      search_value: searchValue
    }
  })
    .then(salesRepresentatives => {
      return salesRepresentatives
    })
}

/**
 * List Request Types
 */
export function requestListRequestTypes({
  searchValue
}) {
  return request({
    // url: '/issue-management/request-types',
    url: `${config.issuesManagement.endpoint}/request-types`,
    method: 'get',
    params: {
      search_value: searchValue
    }
  })
    .then(requestTypes => {
      return requestTypes
    })
}

/**
 * List Statuses
 */
export function requestListStatuses({
  requestTypeId,
  searchValue
}) {
  return request({
    // url: '/issue-management/statuses',
    url: `${config.issuesManagement.endpoint}/statuses`,
    method: 'get',
    params: {
      request_type_id: requestTypeId,
      search_value: searchValue
    }
  })
    .then(listStatus => {
      return listStatus
    })
}

/**
 * List Priorities
 */
export function requestListPriorities({
  searchValue
}) {
  return request({
    // url: '/issue-management/priorities',
    url: `${config.issuesManagement.endpoint}/priorities`,
    method: 'get',
    params: {
      search_value: searchValue
    }
  })
    .then(listPriorities => {
      return listPriorities
    })
}

/**
 * New Issue
 * @param {string}  tableName
 * @param {number}  recordId
 * @param {string}  recordUuid
 */
export function requestCreateIssue({
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
  priorityValue,
  dateNextAction
}) {
  return request({
    // url: '/issue-management/issues',
    url: `${config.issuesManagement.endpoint}/issues`,
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
      priority_value: priorityValue,
      date_next_action: dateNextAction
    }
  })
    .then(listExists => {
      return listExists
    })
}

/**
 * PUT Update Issue
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
export function requestUpdateIssue({
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
  priorityValue,
  dateNextAction
}) {
  return request({
    url: `${config.issuesManagement.endpoint}/issues/${id}`,
    method: 'put',
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
      priority_value: priorityValue,
      date_next_action: dateNextAction
    }
  })
    .then(listComments => {
      return listComments
    })
}

/**
 * DELETE Delete Issue
 *
 * req.query.token - user token
 * req.query.language - login language
 * req.body.id - id of record
 * req.body.uuid - uuid of record
 */
export function requestDeleteIssue({
  id,
  uuid
}) {
  return request({
    url: `${config.issuesManagement.endpoint}/issues/${id}`,
    method: 'delete',
    params: {
      id,
      uuid
    }
  })
    .then(listComments => {
      return listComments
    })
}

/**
 * GET List Issue Comments
 *
 * req.query.token - user token
 * req.query.language - login language
 * req.query.issue_id - id of record parent issue
 * req.query.issue_uuid - uuid of record parent issued
 * req.query.page_size - size of page (customized)
 * req.query.page_token - token of page (optional for get a specific page)
 */
export function requestListIssueComments({
  issueId,
  issueUuid,
  searchValue
}) {
  return request({
    // url: `/issue-management/issues/${issueId}/comments`,
    url: `${config.issuesManagement.endpoint}/issues/${issueId}/comments`,
    method: 'get',
    params: {
      issue_id: issueId,
      issue_uuid: issueUuid,
      search_value: searchValue
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
 */
export function requestCreateIssueComment({
  issueId,
  issueUuid,
  result
}) {
  return request({
    url: `${config.issuesManagement.endpoint}/issues/${issueId}/comments`,
    method: 'post',
    data: {
      issue_id: issueId,
      issue_uuid: issueUuid,
      result
    }
  })
    .then(listComments => {
      return listComments
    })
}

/**
  * PUT Update Issue Comment
  *
  * req.query.token - user token
  * req.query.language - login language
  * req.body.id - id of record
  * req.body.uuid - uuid of record
  * req.body.result - result
 */
export function requestUpdateIssueComment({
  issueId,
  issueUuid,
  result
}) {
  return request({
    url: `${config.issuesManagement.endpoint}/issues/${issueId}/comments`,
    method: 'put',
    data: {
      id: issueId,
      uuid: issueUuid,
      result
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
export function requestDeleteIssueComment({
  issueId,
  issueUuid
}) {
  return request({
    url: `${config.issuesManagement.endpoint}/issues/${issueId}/comments`,
    method: 'delete',
    params: {
      id: issueId,
      uuid: issueUuid
    }
  })
    .then(listComments => {
      return listComments
    })
}
