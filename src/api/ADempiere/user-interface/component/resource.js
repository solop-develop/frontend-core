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
