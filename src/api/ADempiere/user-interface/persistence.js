// ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
// Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
// Contributor(s): Yamel Senih ysenih@erpya.com www.erpya.com
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

// Get Instance for connection
import { request } from '@/utils/ADempiere/request'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

// constants
import { ROWS_OF_RECORDS_BY_PAGE } from '@/utils/ADempiere/tableUtils'

/**
 * Get entity from tab uuid and record id or record uuid
 * @param {string} tabUuid
 * @param {number}  recordId
 * @param {string}  recordUuid
 */
export function getEntity({
  tabUuid,
  recordId,
  recordUuid
}) {
  return request({
    url: '/user-interface/window/entity',
    method: 'get',
    params: {
      tab_uuid: tabUuid,
      uuid: recordUuid,
      id: recordId
    }
  })
    .then(entityResponse => {
      const { convertEntity } = require('@/utils/ADempiere/apiConverts/persistence.js')

      return convertEntity(entityResponse)
    })
}

/**
 * Object List from window
 * @param {string} windowUuid
 * @param {string} tabUuid
 * @param {array} contextAttributesList { key, value }
 * @param {string} searchValue used to compare with selections columns
 * @param {array} filters used as where clause
 * @param {array}  columnsList // TODO: Add support on adempiere-vue
 * @param {string} orderByClause
 * @param {string} pageToken
 */
export function getEntities({
  windowUuid,
  tabUuid,
  columns = [],
  contextAttributesList = [],
  sorting = [],
  searchValue = '',
  filters = [],
  pageToken,
  pageSize = ROWS_OF_RECORDS_BY_PAGE
}) {
  // used as where clause
  if (!isEmptyValue(filters)) {
    filters = filters.map(condition => {
      const { value, operator, columnName, valueTo, values } = condition
      return {
        column_name: columnName,
        value,
        operator,
        value_to: valueTo,
        values
      }
    })
  }

  let sortingDefinition
  if (!isEmptyValue(sorting)) {
    sortingDefinition = sorting.map(sortValue => {
      return {
        column_name: sortValue.columnName,
        sorting: sortValue.sorting
      }
    })
  }

  return request({
    url: '/user-interface/window/entities',
    method: 'get',
    params: {
      window_uuid: windowUuid,
      tab_uuid: tabUuid,
      context_attributes: contextAttributesList,
      // DSL Query
      search_value: searchValue,
      filters,
      columns,
      // replace sql values
      sorting: sortingDefinition,
      // Page Data
      page_token: pageToken,
      page_size: pageSize
    }
  })
    .then(response => {
      const { convertEntityList } = require('@/utils/ADempiere/apiConverts/persistence.js')
      return convertEntityList(response)
    })
}

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
  contextAttributesList,
  fieldUuid,
  processParameterUuid,
  browseFieldUuid,
  id,
  columnUuid,
  value
}) {
  let contextAttributes = []
  if (!isEmptyValue(contextAttributesList)) {
    contextAttributes = contextAttributesList.map(attribute => {
      return {
        key: attribute.columnName,
        value: attribute.value
      }
    })
  }

  return request({
    url: '/user-interface/window/default-value',
    method: 'get',
    params: {
      context_attributes: contextAttributes,
      field_uuid: fieldUuid,
      process_parameter_uuid: processParameterUuid,
      browse_field_uuid: browseFieldUuid,
      id,
      column_uuid: columnUuid,
      value
    }
  })
    .then(valueResponse => {
      return valueResponse
    })
}
