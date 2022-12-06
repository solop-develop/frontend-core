/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 * Contributor(s): Yamel Senih ysenih@erpya.com www.erpya.com
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
import { config } from '@/utils/ADempiere/config'

import { camelizeObjectKeys } from '@/utils/ADempiere/transformObject.js'

/**
 * Attachment Existents on Record
 * @param {string}  tableName
 * @param {number}  recordId
 * @param {string}  recordUuid
 */
export function requestExistsAttachment({
  tableName,
  recordId,
  recordUuid
}) {
  return request({
    url: '/user-interface/component/resource/exists-attachment',
    method: 'get',
    params: {
      table_name: tableName,
      record_id: recordId,
      record_uuid: recordUuid
    }
  })
    .then(response => {
      return response
    })
}

// Download a resource from file name
export function requestResource({ resourceUuid, resourceName }, callBack = {
  onData: () => {},
  onStatus: () => {},
  onEnd: () => {}
}) {
  const { getResoursePath } = require('@/utils/ADempiere/resource.js')
  const { urn } = getResoursePath({
    resourceUuid,
    resourceName
  })
  return request({
    url: urn,
    method: 'get',
    responseType: 'arraybuffer',
    baseURL: config.adempiere.resource.url
  })
}

/**
 * Get image with uri request
 * @param {string} file
 * @param {number} width
 * @param {number} height
 * @param {string} operation fit, resize
 * @returns {promise} with array buffer in response
 */
export function requestImage({
  file,
  width,
  height,
  operation = 'fit'
}) {
  const { getImagePath } = require('@/utils/ADempiere/resource.js')

  const { urn } = getImagePath({
    file,
    width,
    height,
    operation
  })
  return request({
    url: urn,
    method: 'get',
    responseType: 'arraybuffer',
    baseURL: config.adempiere.images.url
  })
}
/**
 * Get Attachment
 * @param {number}  resourceId
 * @param {string}  resourceUuid // TODO: Add suppport to resource uuid on backend
 */
export function getResourceReference({
  resourceId,
  resourceUuid
}) {
  return request({
    url: '/user-interface/component/resource/resource-reference',
    method: 'get',
    params: {
      resource_id: resourceId,
      resource_uuid: resourceUuid
    }
  })
    .then(response => {
      return camelizeObjectKeys(response)
    })
}

/**
 * Get Attachment
 * @param {string}  tableName
 * @param {number}  recordId
 * @param {string}  recordUuid
 */
export function requestAttachment({
  tableName,
  recordId,
  recordUuid
}) {
  return request({
    url: '/user-interface/component/resource/attachment',
    method: 'get',
    params: {
      table_name: tableName,
      id: recordId,
      uuid: recordUuid
    }
  })
    .then(response => {
      return camelizeObjectKeys(response)
    })
}

export function uploadAttachment({
  tableName,
  recordId,
  recordUuid,
  list
}) {
  console.info(`Upload Files array ${list}, recordId ${recordId}, recordUuid ${recordUuid}, tableName ${tableName}`)
}

/**
 * Delete resource and file
 * @param {number} resourceId
 * @param {string} recordUuid
 * @param {string} resourceName as fileName
 * @returns {promise}
 */
export function deleteResourceReference({
  resourceId,
  resourceUuid,
  resourceName
}) {
  return request({
    url: '/user-interface/component/resource/delete-resource-reference',
    method: 'get',
    params: {
      resource_id: resourceId,
      resource_uuid: resourceUuid,
      resource_name: resourceName
    }
  })
}
