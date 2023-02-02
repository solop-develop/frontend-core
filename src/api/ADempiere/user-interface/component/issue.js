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
export function requestListIssues({
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
 * New Issue
 * @param {string}  tableName
 * @param {number}  recordId
 * @param {string}  recordUuid
 */
export function createIssue({
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
      priority_value: priorityValue,
      date_next_action: dateNextAction
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
  priorityValue,
  dateNextAction
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
      priority_value: priorityValue,
      date_next_action: dateNextAction
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
 * POST Create Issue Comment
 *
 * req.query.token - user token
 * req.query.language - login language
 * req.body.issue_id - id of record parent issue
 * req.body.issue_uuid - uuid of record parent issued
 * req.body.result - result
 */
export function createIssueComment({
  issueId,
  issueUuid,
  result
}) {
  return request({
    url: '/user-interface/component/issue/create-issue-comment',
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
  * POST Update Issue Comment
  *
  * req.query.token - user token
  * req.query.language - login language
  * req.body.id - id of record
  * req.body.uuid - uuid of record
  * req.body.result - result
 */
export function updateIssueComment({
  issueId,
  issueUuid,
  result
}) {
  return request({
    url: '/user-interface/component/issue/update-issue-comment',
    method: 'post',
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
