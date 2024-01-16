/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 201-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
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
 * Get entity from table name and record id or record uuid
 */
export function requestGetEntity({
  tableName,
  recordId
}) {
  return request({
    url: `/business-data/entities/${tableName}/${recordId}`,
    method: 'get'
  })
    .then(entityResponse => {
      const { convertEntity } = require('@/utils/ADempiere/apiConverts/persistence.js')

      return convertEntity(entityResponse)
    })
}

/**
 * Create entity
 * @param {string}  tableName
 * @param {array}   attributesList
 */
export function requestCreateEntity({
  tableName,
  attributesList
}) {
  attributesList = attributesList.map(parameter => {
    return {
      key: parameter.columnName,
      value: parameter.value
    }
  })

  return request({
    url: `/business-data/entities/${tableName}`,
    method: 'post',
    data: {
      attributes: attributesList
    }
  })
    .then(entityCreateResponse => {
      const { convertEntity } = require('@/utils/ADempiere/apiConverts/persistence.js')

      return convertEntity(entityCreateResponse)
    })
}

/**
 * Update entity
 * @param {string}  tableName
 * @param {number}  recordId
 * @param {array}   attributesList
 */
export function requestUpdateEntity({
  tableName,
  recordId,
  attributesList
}) {
  attributesList = attributesList.map(parameter => {
    return {
      key: parameter.columnName,
      value: parameter.value
    }
  })

  return request({
    url: `/business-data/entities/${tableName}/${recordId}`,
    method: 'patch',
    data: {
      attributes: attributesList
    }
  })
    .then(entityUpdateResponse => {
      const { convertEntity } = require('@/utils/ADempiere/apiConverts/persistence.js')

      return convertEntity(entityUpdateResponse)
    })
}

/**
 * Delete entity
 * @param {string}  tableName
 * @param {number}  recordId
 */
export function requestDeleteEntity({
  tableName,
  recordId,
  listRecordId
}) {
  return request({
    url: `/business-data/entities/${tableName}/${recordId}`,
    method: 'delete',
    params: {
      ids: listRecordId
    }
  }).then(response => {
    return response
  })
}

/**
 * Delete entity
 * @param {string}  tableName
 * @param {array}  listRecordId
 */
export function requestDeleteEntities({
  tableName,
  listRecordId
}) {
  return request({
    url: `/business-data/entities/batch-delete/${tableName}`,
    method: 'body',
    data: {
      ids: listRecordId
    }
  }).then(response => {
    return response
  })
}

// /**
//  * Rollback entity (Create, Update, Delete)
//  * @param {string} tableName
//  * @param {number} recordId
//  * @param {string} eventType
//  */
// export function rollbackEntity({
//   tableName,
//   recordId,
//   recordUuid,
//   eventType
// }) {
//   return request({
//     url: '/common/api/rollback-entity',
//     method: 'post',
//     data: {
//       table_name: tableName,
//       id: recordId,
//       uuid: recordUuid,
//       event_type: eventType
//     }
//   })
//     .then(entityResponse => {
//       const { convertEntity } = require('@/utils/ADempiere/apiConverts/persistence.js')

//       return convertEntity(entityResponse)
//     })
// }
