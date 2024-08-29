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
import { request } from '@/utils/ADempiere/request'

// Constants
import { RECORD_ROWS_BY_LIST } from '@/utils/ADempiere/dictionary/field/lookups.js'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'

/**
 * Request a Lookup list data from Reference
 * The main attributes that function hope are:
 * @param {string} fieldUuid
 * @param {string} browseFieldUuid
 * @param {string} processParameterUuid
 * @param {array}  contextAttributesList
 * @param {string} pageToken
 * @param {number} pageSize
 */
export function requestLookupList({
  contextAttributesList,
  processParameterId,
  browseFieldId,
  fieldId,
  //
  referenceUuid,
  searchValue,
  //
  tableName,
  columnName,
  columnId,
  //
  pageToken,
  pageSize = RECORD_ROWS_BY_LIST,
  isWithoutValidation
}) {
  let url
  switch (true) {
    case (!isEmptyValue(columnId)):
      url = `/fields/lookups/column/${columnId}`
      break
    case !isEmptyValue(fieldId):
      url = `/fields/lookups/field/${fieldId}`
      break
    case !isEmptyValue(processParameterId):
      url = `/fields/lookups/parameter/${processParameterId}`
      break
    case !isEmptyValue(browseFieldId):
      url = `/fields/lookups/query-criteria/${browseFieldId}`
      break
    default:
      url = `/fields/lookups/${tableName}/${columnName}`
      break
  }

  return request({
    url,
    method: 'get',
    params: {
      context_attributes: contextAttributesList,
      is_without_validation: isWithoutValidation,
      is_only_active_records: true,
      //
      reference_uuid: referenceUuid,
      search_value: searchValue,
      //
      table_name: tableName,
      column_name: columnName,
      column_id: columnId,
      // Page Data
      page_token: pageToken,
      page_size: pageSize
    }
  })
}
