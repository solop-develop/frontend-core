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

export function listWarehouses({
  searchValue,
  pageToken,
  pageSize
}) {
  return request({
    url: '/form/addons/express-movement/warehouses',
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

// Product
export function listProductRequest({
  namue,
  upc,
  searchValue,
  sku,
  value,
  pageToken,
  pageSize,
  orderId
}) {
  return request({
    url: '/form/addons/express-movement/product',
    method: 'get',
    params: {
      page_size: pageSize,
      namue,
      upc,
      sku,
      value,
      search_value: searchValue,
      order_id: orderId
    }
  })
    .then(response => {
      return camelizeObjectKeys(response)
    })
}

// Movement
export function createMovementRequest() {
  return request({
    url: '/form/addons/express-movement/movement',
    method: 'post'
  })
    .then(response => {
      return camelizeObjectKeys(response)
    })
}

export function processMovementRequest({
  id,
  uuid
}) {
  return request({
    url: '/form/addons/express-movement/process-movement',
    method: 'post',
    data: {
      id,
      uuid
    }
  })
    .then(response => {
      return camelizeObjectKeys(response)
    })
}

export function deleteMovementRequest({
  id,
  uuid
}) {
  return request({
    url: '/form/addons/express-movement/movement',
    method: 'delete',
    params: {
      order_id: id,
      order_uuid: uuid
    }
  })
    .then(response => {
      return camelizeObjectKeys(response)
    })
}

// Movement Line
export function createMovementLineRequest({
  movementId,
  movementUuid,
  productId,
  productUuid,
  warehouseId,
  warehouseToId,
  description,
  quantity
}) {
  return request({
    url: '/form/addons/express-movement/movement-line',
    method: 'post',
    data: {
      movement_id: movementId,
      movement_uuid: movementUuid,
      product_id: productId,
      product_uuid: productUuid,
      warehouse_id: warehouseId,
      warehouse_to_id: warehouseToId,
      description,
      quantity
    }
  })
    .then(response => {
      return camelizeObjectKeys(response)
    })
}

export function deleteMovementLineRequest({
  id,
  uuid
}) {
  return request({
    url: '/form/addons/express-movement/movement-line',
    method: 'delete',
    params: {
      id,
      uuid
    }
  })
    .then(response => {
      return camelizeObjectKeys(response)
    })
}

export function updateMovementLineRequest({
  id,
  uuid,
  description,
  quantity
}) {
  return request({
    url: '/form/addons/express-movement/movement-line',
    method: 'put',
    data: {
      id,
      uuid,
      description,
      quantity
    }
  })
    .then(response => {
      return camelizeObjectKeys(response)
    })
}

export function listMovementLinesRequest({
  movementId,
  movementUuid
}) {
  return request({
    url: '/form/addons/express-movement/movement-lines',
    method: 'get',
    params: {
      movement_id: movementId,
      movement_uuid: movementUuid
    }
  })
    .then(response => {
      return camelizeObjectKeys(response)
    })
}
