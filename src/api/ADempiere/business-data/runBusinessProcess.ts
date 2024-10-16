/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
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

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

/**
 * Get default value for a field, parameter or query criteria
 * @param {integer} id, identifier of field
 */
export function requestRunBusinessProcess({
  id,
  parameters
}) {
  return request({
    url: `/business-data/process/${id}`,
    method: 'post',
    data: {
      parameters
    }
  })
}

/**
 * Get default value for a field, parameter or query criteria
 * @param {integer} id, identifier of field
 */
export function requestRunBusinessProcessAsBrowser({
  id,
  parametersList,
  browserId,
  recordId,
  selectionsList,
  isAllSelection,
  browserContextAttributes,
  browserCriteriaFilters
}) {
  return request({
    url: `/business-data/process/${id}/smart-browse/${browserId}`,
    method: 'post',
    data: {
      record_id: recordId,
      parameters: parametersList,
      selections: selectionsList,
      is_all_selection: isAllSelection,
      browser_context_attributes: browserContextAttributes,
      criteria_filters: browserCriteriaFilters
    }
  })
}

/**
 * Get default value for a field, parameter or query criteria
 * @param {integer} id, identifier of field
 */
export function requestRunBusinessProcessAsWindow({
  id,
  parametersList,
  tableName,
  recordId,
  selectionsList
}) {
  let url = `/business-data/process/${id}/window/${tableName}`
  if (isEmptyValue(selectionsList) || (!isEmptyValue(selectionsList) && selectionsList.length === 1)) {
    url += `/${recordId}`
  }
  return request({
    url: url,
    method: 'post',
    data: {
      parameters: parametersList,
      selections: selectionsList
    }
  })
}
