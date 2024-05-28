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
import { isEmptyValue } from '@/utils/ADempiere'
import { request } from '@/utils/ADempiere/request'

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
      url = `/field/zooms/field/${field_id}`
      break
    case (!isEmptyValue(process_parameter_id)):
      url = `/field/zooms/parameter/${process_parameter_id}`
      break
    case (!isEmptyValue(browse_field_id)):
      url = `/field/zooms/query-criteria/${browse_field_id}`
      break
    case (!isEmptyValue(table_name) && !isEmptyValue(column_name)):
      url = `/field/zooms/${table_name}/${column_name}`
      break
    case !isEmptyValue(column_id):
      url = `/field/zooms/column/${column_id}`
      break
    default:
      break
  }
  return request({
    url: url,
    method: 'get'
  })
}
