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
// import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

// Constants
import { ROWS_OF_RECORDS_BY_PAGE } from '@/utils/ADempiere/tableUtils'

export function requestListAccountingCombinations({
  accountId,
  searchValue,
  organizationId,
  filters = [],
  pageToken,
  pageSize = ROWS_OF_RECORDS_BY_PAGE
}) {
  return request({
    url: '/general-ledger/accounts/combinations',
    method: 'get',
    params: {
      organization_id: organizationId,
      search_value: searchValue,
      account_id: accountId,
      page_token: pageToken,
      page_size: pageSize,
      filters
    }
  })
    .then(response => {
      return response
    })
}

export function requestGetAccountingCombination({
  id
  // uuid,
  // value
}) {
  return request({
    // url: '/general-ledger/accouting-combination/accounting-combination',
    url: `/general-ledger/accounts/combinations/${id}`,
    method: 'get'
    // params: {
    //   id,
    //   uuid,
    //   value
    // }
  })
    .then(response => {
      const { convertEntity } = require('@/utils/ADempiere/apiConverts/persistence.js')
      return convertEntity(response)
    })
}

export function requestSaveAccountingCombination({
  id,
  attributes,
  accountId,
  organizationId,
  accountingSchemaId,
  contextAttributesList
}) {
  // let contextAttributes = []
  // if (!isEmptyValue(contextAttributesList)) {
  //   contextAttributes = contextAttributesList.map(attribute => {
  //     return {
  //       key: attribute.columnName,
  //       value: attribute.value
  //     }
  //   })
  // }

  return request({
    url: '/general-ledger/accounts/combinations',
    method: 'post',
    data: {
      id,
      attributes,
      organization_id: organizationId,
      account_id: accountId,
      accounting_schema_id: accountingSchemaId,
      context_attributes: contextAttributesList
    }
  })
}
