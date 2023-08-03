/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 * Contributor(s): Yamel Senih ysenih@erpya.com
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
import { config } from '@/utils/ADempiere/config'
import { RESOURCE_TYPE_ATTACHMENT } from '@/utils/ADempiere/resource'

// Utils and Helper Methods
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
    // responseType: 'arraybuffer',
    baseURL: config.adempiere.resource.url
  })
}

export function requestDownloadResource({ resourceUuid, resourceName }) {
  return request({
    url: '/user-interface/component/resource/download',
    method: 'get',
    // responseType: 'arraybuffer',
    params: {
      resource_uuid: resourceUuid,
      resource_name: resourceName
    }
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
export function requestGetResourceReference({
  id,
  uuid,
  resourceName,
  imageId,
  imageUuid,
  archiveId,
  archiveUuid
}) {
  return request({
    url: '/user-interface/component/resource/resource-reference',
    method: 'get',
    params: {
      id,
      uuid,
      resource_name: resourceName,
      image_id: imageId,
      image_uuid: imageUuid,
      archive_id: archiveId,
      archive_uud: archiveUuid
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

/**
 * Set resource reference
 * @param {number} resourceId
 * @param {string} recordUuid
 * @param {string} resourceName as fileName
 * @returns {promise}
 */
export function setResourceReference({
  id,
  uuid,
  //
  resourceType = RESOURCE_TYPE_ATTACHMENT,
  resourceId,
  //
  tableName,
  recordId,
  recordUuid,
  //
  textMessage,
  fileName,
  fileSize
}) {
  return request({
    url: '/user-interface/component/resource/set-resource-reference',
    method: 'post',
    data: {
      id,
      uuid,
      // parent values (attachment, image, archive)
      resource_type: resourceType,
      resource_id: resourceId,
      // attachment values
      table_name: tableName,
      record_id: recordId,
      record_uuid: recordUuid,
      // attachment reference values
      text_message: textMessage,
      file_name: fileName,
      file_size: fileSize
    }
  })
}

export function requestUploadAttachment({
  resourceId,
  resourceUuid,
  fileName,
  file
}) {
  return request({
    url: '/user-interface/component/resource/save-attachment',
    method: 'post',
    data: {
      resource_id: resourceId,
      resource_uuid: resourceUuid,
      file_name: fileName,
      file
    }
  })
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
    method: 'delete',
    params: {
      resource_id: resourceId,
      resource_uuid: resourceUuid,
      resource_name: resourceName
    }
  })
}

/**
 * Save Attachment Information
 */
export function sendAttachmentDescription({
  id,
  uuid,
  description,
  textMessage
}) {
  return request({
    url: '/user-interface/component/resource/set-resource-reference-description',
    method: 'put',
    data: {
      id,
      uuid,
      description,
      text_message: textMessage
    }
  })
}

/**
 * Add Description in Header
 * id - id of attachment
 * uuid - uuid of attachment
 * text_message - message or description
 */
export function sendAttachmentDescriptionHeader({
  id,
  uuid,
  textMessage
}) {
  return request({
    url: '/user-interface/component/resource/attachment-description',
    method: 'put',
    data: {
      id,
      uuid,
      text_message: textMessage
    }
  })
}
