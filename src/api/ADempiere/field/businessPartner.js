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
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'

// Constants
import { ROWS_OF_RECORDS_BY_PAGE } from '@/utils/ADempiere/tableUtils'

export function requestListBusinessPartner({
  fieldUuid,
  processParameterUuid,
  browseFieldUuid,
  //
  referenceUuid,
  //
  tableName,
  columnName,
  columnUuid,
  // dsl query
  contextAttributesList,
  searchValue,
  filters,
  // Page Data
  pageSize = ROWS_OF_RECORDS_BY_PAGE,
  pageToken
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

  return request({
    url: '/business-partner/grid',
    method: 'get',
    params: {
      field_uuid: fieldUuid,
      process_parameter_uuid: processParameterUuid,
      browse_field_uuid: browseFieldUuid,
      reference_uuid: referenceUuid,
      //
      table_name: tableName,
      column_name: columnName,
      column_uuid: columnUuid,
      //
      context_attributes: contextAttributes,
      search_value: searchValue,
      filters,
      //
      page_size: pageSize,
      page_token: pageToken
    }
  })
    .then(businessPartnersResponse => {
      const { convertEntityList } = require('@/utils/ADempiere/apiConverts/persistence.js')
      return convertEntityList(businessPartnersResponse)
    })
}
