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

// Get Instance for connection
import { request } from '@/utils/ADempiere/request'

// Constants
import { RESOURCE_TYPE_ATTACHMENT } from '@/utils/ADempiere/resource'

/**
 * Exists Window Attachment
 */
export function requestExistsAttachment({
  tableName,
  recordId
}) {
  return request({
    url: `/file-management/attachments/${tableName}/${recordId}/exists`,
    method: 'get'
  })
}

/**
 * Get List Window Attachment
 */
export function requestAttachment({
  tableName,
  recordId
}) {
  return request({
    url: `/file-management/attachments/${tableName}/${recordId}`,
    method: 'get'
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
  return request({
    url: `/file-management/references/attachment/${tableName}/${recordId}`,
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
