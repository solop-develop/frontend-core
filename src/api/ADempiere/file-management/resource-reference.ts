/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 * Contributor(s): Elsio Sanchez elsiosanchez15@outlook.com https://github.com/elsiosanchez
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
import { config } from '@/utils/ADempiere/config'

// Get Instance for connection
import { request } from '@/utils/ADempiere/request'

// Constants
import {
  RESOURCE_TYPE_ATTACHMENT, RESOURCE_TYPE_FILE, RESOURCE_TYPE_IMAGE
} from '@/utils/ADempiere/resource'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

/**
 * Presigned Url
 * @param {Object} options
 */
export function requestPresignedUrl(options) {
  const { containerType, containerId, columnName, clientId, tableName, recordId, fileName } = options
  const baseURL = `${config.adempiere.api.url}resources` // remove trailing slash
  const path = [baseURL, 'presigned-url']

  // Add parameters to the route only if they exist
  if (clientId) path.push(clientId)
  if (containerId) path.push(containerId)
  if (fileName) path.push(fileName)

  const params = {
    table_name: tableName,
    record_id: recordId,
    column_name: columnName,
    container_type: containerType
  }

  return request({
    url: path.join('/'),
    method: 'get',
    isWithoutAuthorization: true,
    params
  })
}

/**
 * Upload File
 * @param {string} url
 */

export function requestUploadFile({
  url,
  file
}) {
  return request({
    baseURL: `${url}`,
    method: 'put',
    isWithoutAuthorization: true,
    body: {
      file
    }
  })
}

/**
 * Get Resources
 */
export function requestGetResource({
  fileName
}) {
  return request({
    url: `${config.adempiere.api.url}resources/${fileName}`,
    method: 'get',
    isWithoutAuthorization: true,
    params: {
      file_name: fileName
    }
  })
}

/**
 * Get List Resources (Container)
 */
export function requestListResources({
  recordId,
  tableName,
  clientId,
  containerId,
  containerType
}) {
  return request({
    url: `${config.adempiere.api.url}resources/`,
    method: 'get',
    isWithoutAuthorization: true,
    params: {
      record_id: recordId,
      client_id: clientId,
      table_name: tableName,
      container_id: containerId,
      container_type: containerType
    }
  })
}

/**
 * Delete Resources
 */
export function requestDeleteResources({
  fileName
}) {
  return request({
    url: `${config.adempiere.api.url}resources/${fileName}`,
    method: 'delete',
    isWithoutAuthorization: true
  })
}

/**
 * Share Resoucer
 */

export function requestShareResources({
  fileName,
  seconds
}) {
  return request({
    baseURL: `${config.adempiere.api.url}resources/download-url/${fileName}`,
    isWithoutAuthorization: true,
    method: 'get',
    params: {
      seconds
    }
  })
}

/**
 * Set resource reference
 * @param {number} resourceId
 * @param {string} recordUuid
 * @param {string} resourceName as fileName
 * @returns {promise}
 */
export function requestSetResourceReference({
  id,
  //
  resourceType = RESOURCE_TYPE_ATTACHMENT,
  //
  tableName,
  recordId,
  //
  textMessage,
  fileName,
  fileSize
}) {
  let path = `/file-management/references/attachment/${tableName}/${recordId}`
  if (resourceType === RESOURCE_TYPE_IMAGE) {
    path = `/file-management/references/image/${id}`
  } else if (resourceType === RESOURCE_TYPE_FILE) {
    path = `/file-management/references/archive/${id}`
  }
  return request({
    url: path,
    method: 'put',
    data: {
      // parent values (attachment, image, archive)
      resource_type: resourceType,
      id,
      // attachment reference values
      text_message: textMessage,
      file_name: fileName,
      file_size: fileSize
    }
  })
}

/**
 * Get Resource Reference
 * @param {number}  resourceId
 */
export function requestGetResourceReference({
  id,
  attachmenId,
  resourceName,
  imageId,
  archiveId
}) {
  let path = `/file-management/references/${id}`
  if (!isEmptyValue(resourceName)) {
    path = `/file-management/references/file-name/${resourceName}`
    if (!isEmptyValue(attachmenId)) {
      path = `/file-management/references/attachment/${attachmenId}/${resourceName}`
    }
  } else if (!isEmptyValue(imageId)) {
    path = `/file-management/references/image/${imageId}`
  } else if (!isEmptyValue(archiveId)) {
    path = `/file-management/references/archive/${archiveId}`
  }
  return request({
    url: path,
    method: 'get'
  })
}

/**
 * Delete resource and file
 * @param {number} resourceId
 * @param {string} resourceName as fileName
 * @returns {promise}
 */
export function requestDeleteResourceReference({
  id,
  resourceName,
  attachmenId,
  imageId,
  archiveId
}) {
  let path = `/file-management/references/${id}`
  if (!isEmptyValue(resourceName)) {
    path = `/file-management/references/file-name/${resourceName}`
    if (!isEmptyValue(attachmenId)) {
      path = `/file-management/references/attachment/${attachmenId}/${resourceName}`
    }
  } else if (!isEmptyValue(imageId)) {
    path = `/file-management/references/image/${imageId}`
  } else if (!isEmptyValue(archiveId)) {
    path = `/file-management/references/archive/${archiveId}`
  }
  return request({
    url: path,
    method: 'delete'
  })
}
