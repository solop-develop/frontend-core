// ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
// Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
// Contributor(s): Elsio Sanchez elsiosanchez@gmail.com https://github.com/elsiosanchez
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>

// Get Instance for connection
import { request } from '@/utils/ADempiere/request'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

// constants

export function tableSearchFields({
  tableName
}) {
  return request({
    url: '/dictionary/table-search-fields',
    method: 'get',
    params: {
      table_name: tableName
    }
  })
    .then(response => {
      return response
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
      return response
    })
}

export function gridGeneralInfo({
  contextAttributesList,
  parametersList = [],
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
  pageSize
}) {
  const filters = parametersList.map(parameter => {
    return {
      column_name: parameter.columnName,
      value: parameter.value
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
      pageToken,
      pageSize
    }
  })
    .then(response => {
      const { convertEntityList } = require('@/utils/ADempiere/apiConverts/persistence.js')
      return convertEntityList(response)
    })
}
