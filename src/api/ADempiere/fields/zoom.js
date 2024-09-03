/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 * Contributor(s): Ricardo Fenomeno ricardofenomeno13@gmail.com https://github.com/Ricargame
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

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

/**
 * Windows To Zoom from field
 * @param {number} process_parameter_id
 * @param {number} field_id
 * @param {number} browse_field_id
 * @param {number} reference_id
 * @param {number} column_id
 * @param {string} table_name
 * @param {string} column_name
 */

export function listZoomWindowsRequest({
  process_parameter_id,
  field_id,
  browse_field_id,
  reference_id,
  column_id,
  table_name,
  column_name
}) {
  let url
  switch (true) {
    case (!isEmptyValue(field_id)):
      url = `/fields/zooms/field/${field_id}`
      break
    case (!isEmptyValue(process_parameter_id)):
      url = `/fields/zooms/parameter/${process_parameter_id}`
      break
    case (!isEmptyValue(browse_field_id)):
      url = `/fields/zooms/query-criteria/${browse_field_id}`
      break
    case (!isEmptyValue(table_name) && !isEmptyValue(column_name)):
      url = `/fields/zooms/${table_name}/${column_name}`
      break
    case !isEmptyValue(column_id):
      url = `/fields/zooms/column/${column_id}`
      break
  }
  return request({
    url: url,
    method: 'get'
  })
}

export function getZoomParentRecord({
  window_id,
  tab_id,
  value
}) {
  return request({
    url: `/fields/zooms/record/${window_id}/${tab_id}`,
    method: 'get',
    params: {
      value
    }
  })
}
