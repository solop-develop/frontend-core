/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 * Contributor(s): Elsio Sanchez elsiosanchez15@outlook.com https://github.com/elsiosanchez
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

import { request } from '@/utils/ADempiere/request'
import { camelizeObjectKeys } from '@/utils/ADempiere/transformObject.js'

export function listMatchesTypes({
  searchValue,
  pageToken,
  pageSize
}) {
  return request({
    url: '/form/addons/v-match/list-matches-types-from',
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

export function listMatchesTypesTo({
  matchFromType,
  searchValue,
  pageToken,
  pageSize
}) {
  return request({
    url: '/form/addons/v-match/list-matches-types-to',
    method: 'get',
    params: {
      page_size: pageSize,
      page_token: pageToken,
      //  DSL Query
      search_value: searchValue,
      match_from_type: matchFromType
    }
  })
    .then(response => {
      return camelizeObjectKeys(response)
    })
}

export function listSearchModes({
  searchValue,
  pageToken,
  pageSize
}) {
  return request({
    url: '/form/addons/v-match/list-search-modes',
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

export function listVendors({
  searchValue,
  pageToken,
  pageSize = 100
}) {
  return request({
    url: '/form/addons/v-match/list-vendors',
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

export function listProduct({
  searchValue,
  pageToken,
  pageSize = 500
}) {
  return request({
    url: '/form/addons/v-match/list-products',
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

export function ListMatchedFrom({
  matchMode,
  searchValue,
  matchFromType,
  matchToType,
  vendorId,
  productId,
  dateFrom,
  dateto,
  pageToken,
  pageSize
}) {
  return request({
    url: '/form/addons/v-match/list-match-from',
    method: 'get',
    params: {
      page_size: pageSize,
      page_token: pageToken,
      //  DSL Query
      match_mode: matchMode,
      search_value: searchValue,
      match_from_type: matchFromType,
      match_to_type: matchToType,
      vendor_id: vendorId,
      product_id: productId,
      date_from: dateFrom,
      date_to: dateto
    }
  })
    .then(response => {
      return camelizeObjectKeys(response)
    })
}

export function ListMatchedTo({
  matchMode,
  searchValue,
  matchFromType,
  matchToType,
  vendorId,
  productId,
  dateFrom,
  dateto,
  pageToken,
  pageSize,
  isSameQuantity,
  matchFromSelectedId
}) {
  return request({
    url: '/form/addons/v-match/list-match-to',
    method: 'get',
    params: {
      page_size: pageSize,
      page_token: pageToken,
      //  DSL Query
      match_mode: matchMode,
      search_value: searchValue,
      match_from_type: matchFromType,
      match_to_type: matchToType,
      vendor_id: vendorId,
      product_id: productId,
      date_from: dateFrom,
      date_to: dateto,
      is_same_quantity: isSameQuantity,
      match_from_selected_id: matchFromSelectedId
    }
  })
    .then(response => {
      return camelizeObjectKeys(response)
    })
}

export function process({
  matchMode,
  matchFromType,
  matchToType,
  matchFromSelectedId,
  matchedToSelections,
  quantity
}) {
  return request({
    url: '/form/addons/v-match/process',
    method: 'post',
    data: {
      //  DSL Query
      match_mode: matchMode,
      match_from_type: matchFromType,
      match_to_type: matchToType,
      match_from_selected_id: matchFromSelectedId,
      matched_to_selections: matchedToSelections,
      quantity
    }
  })
    .then(response => {
      return camelizeObjectKeys(response)
    })
}

