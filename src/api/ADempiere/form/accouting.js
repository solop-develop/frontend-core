/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 * Contributor(s): Elsio Sanchez elsiosanches@gmail.com https://github.com/elsiosanchez
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
import { camelizeObjectKeys } from '@/utils/ADempiere/transformObject.js'

// Constants
import { ROWS_OF_RECORDS_BY_PAGE } from '@/utils/ADempiere/tableUtils'
import { RECORD_ROWS_BY_LIST } from '@/utils/ADempiere/dictionary/field/lookups'
import { isEmptyValue } from '@/utils/ADempiere'

export function requestListAccoutingSchemas({
  searchValue,
  pageToken,
  pageSize = RECORD_ROWS_BY_LIST
}) {
  return request({
    url: '/general-ledger/accounts/schemas',
    method: 'get',
    params: {
      page_size: pageSize,
      page_token: pageToken,
      //  DSL Query
      search_value: searchValue
    }
  })
    .then(response => {
      return camelizeObjectKeys(response)
    })
}

export function requestListOrganizations({
  searchValue,
  pageToken,
  pageSize = RECORD_ROWS_BY_LIST
}) {
  return request({
    url: '/general-ledger/organizations',
    method: 'get',
    params: {
      page_size: pageSize,
      page_token: pageToken,
      //  DSL Query
      search_value: searchValue
    }
  })
    .then(response => {
      return camelizeObjectKeys(response)
    })
}

export function requestPostingTypesList({
  searchValue,
  pageToken,
  pageSize = RECORD_ROWS_BY_LIST
}) {
  return request({
    url: '/general-ledger/accounts/posting-types',
    method: 'get',
    params: {
      page_size: pageSize,
      page_token: pageToken,
      //  DSL Query
      search_value: searchValue
    }
  })
    .then(response => {
      return camelizeObjectKeys(response)
    })
}

export function requestAccountingFacts({
  tableName,
  recordId,
  recordUuid,
  organizationId,
  accoutingSchemaId,
  postingType,
  filters = [],
  pageSize = ROWS_OF_RECORDS_BY_PAGE,
  pageToken
}) {
  filters = filters.map(attribute => {
    return {
      column_name: attribute.columnName,
      operator: attribute.operator,
      value: attribute.value
    }
  })
  let url = `/general-ledger/accounts/facts/${accoutingSchemaId}`
  if (!isEmptyValue(tableName) && !isEmptyValue(recordId)) {
    url = `/general-ledger/accounts/facts/${accoutingSchemaId}/document/${tableName}/${recordId}`
  }
  return request({
    url: url,
    method: 'get',
    params: {
      //  DSL Query
      table_name: tableName,
      record_id: recordId,
      record_uuid: recordUuid,
      posting_type: postingType,
      organization_id: organizationId,
      //  Page Data
      page_size: pageSize,
      page_token: pageToken
    },
    data: {
      // filters
      filters
    }
  })
}

export function requestStartRePost({
  tableName,
  recordId,
  recordUuid,
  isForce
}) {
  return request({
    url: `/general-ledger/accounts/facts/${tableName}/${recordId}`,
    method: 'post',
    data: {
      //  DSL Query
      record_uuid: recordUuid,
      is_force: isForce
    }
  })
}
