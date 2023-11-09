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
 * but WITHOUT ANY WARRANTY without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

// Get Instance for connection
import { isEmptyValue } from '@/utils/ADempiere'
import { request } from '@/utils/ADempiere/request'

/**
 * Get default value for a field, parameter or query criteria
 * @param {array} contextAttributesList, key value
 * @param {string} fieldUuid, uuid of window field
 * @param {string} processParameterUuid, uuid of process/report field
 * @param {string} browseFieldUuid, uuid of browser field
 * @param {integer} id, identifier of field
 * @param {string} columnUuid, uuid of column
 * @param {mixed} value, value to overwrite default value on dictionary definition
 */
export function requestDefaultValue({
  columnName,
  tableName,
  columnId,
  id,
  processParameterId,
  processParameterToId,
  browseFieldId,
  browseFieldToId,
  contextAttributes,
  value
}) {
  const column_name = columnName
  const table_name = tableName
  const column_id = columnId
  const process_parameter_id = processParameterId
  const process_parameter_to_id = processParameterToId
  const browse_field_id = browseFieldId
  const browse_field_to_id = browseFieldToId

  let url
  switch (true) {
    case (!isEmptyValue(column_name) && isEmptyValue(table_name)):
      url = `/user-interface/default-value/${table_name}/${column_name}`
      break
    case !isEmptyValue(column_id):
      url = `/user-interface/default-value/column/${column_id}`
      break
    case !isEmptyValue(id):
      url = `/user-interface/default-value/field/${id}`
      break
    case !isEmptyValue(process_parameter_id):
      url = `/user-interface/default-value/parameter/${process_parameter_id}`
      break
    case !isEmptyValue(process_parameter_to_id):
      url = `/user-interface/default-value/parameter/${process_parameter_to_id}/to`
      break
    case !isEmptyValue(browse_field_id):
      url = `/user-interface/default-value/query-criteria/${browse_field_id}`
      break
    case !isEmptyValue(browse_field_to_id):
      url = `/user-interface/default-value/query-criteria/${browse_field_to_id}/to`
      break
    default:
      url = `/user-interface/default-value/`
      break
  }
  return request({
    url,
    method: 'get',
    params: {
      context_attributes: contextAttributes,
      value
    }
  })
    .then(valueResponse => {
      return valueResponse
    })
}

