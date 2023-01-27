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
 * Apply customization to browser
 * @param {string} browseUuid
 * @param {number} level
 * @param {number} levelId
 * @param {string} levelUuid
 * @param {array}
 * @returns
 */
export function requestSaveBrowseCustomization({
  browseUuid,
  level,
  leveId,
  levelUuid,
  fieldAttributes
}) {
  return request({
    url: '/user-customization/browse/save-browse-customization',
    method: 'post',
    data: {
      browse_uuid: browseUuid,
      level,
      level_id: leveId,
      level_uuid: levelUuid,
      field_attributes: fieldAttributes
    }
  })
}
