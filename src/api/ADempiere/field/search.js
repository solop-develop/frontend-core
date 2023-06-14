/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 * Contributor(s):  Yamel Senih ysenih@erpya.com
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
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

// constants
import { ROWS_OF_RECORDS_BY_PAGE } from '@/utils/ADempiere/tableUtils'

export function tableSearchFields({
  tableName
}) {
  return request({
    url: '/dictionary/search-info/fields',
    method: 'get',
    params: {
      table_name: tableName
    }
  })
    .then(response => {
      const { camelizeObjectKeys } = require('@/utils/ADempiere/transformObject.js')
      return {
        recordCount: response.record_count,
        fieldsList: response.records.map(field => {
          return camelizeObjectKeys(field)
        }),
        nextPageToken: response.next_page_token
      }
    })
}

export function identifierFields({
  tableName
}) {
  return request({
    url: '/dictionary/identifiers-fields',
    method: 'get',
    params: {
      table_name: tableName
    }
  })
    .then(response => {
      const { convertField } = require('@/utils/ADempiere/apiConverts/field.js')

      return {
        recordCount: response.record_count,
        fieldsList: response.records.map(field => {
          return convertField(field)
        }),
        nextPageToken: response.next_page_token
      }
    })
}

export function requestGridGeneralInfo({
  contextAttributesList,
  filters = [],
  fieldUuid,
  processParameterUuid,
  browseFieldUuid,
  id,
  //
  referenceUuid,
  searchValue,
  //
  tableName,
  columnName,
  columnUuid,
  //
  pageToken,
  pageSize = ROWS_OF_RECORDS_BY_PAGE
}) {
  filters = filters.map(attribute => {
    return {
      column_name: attribute.columnName,
      operator: attribute.operator,
      value: attribute.value
    }
  })

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
    url: '/grid/general-info',
    method: 'get',
    params: {
      context_attributes: contextAttributes,
      field_uuid: fieldUuid,
      process_parameter_uuid: processParameterUuid,
      browse_field_uuid: browseFieldUuid,
      filters,
      id,
      //
      reference_uuid: referenceUuid,
      search_value: searchValue,
      //
      table_name: tableName,
      column_name: columnName,
      column_uuid: columnUuid,
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
