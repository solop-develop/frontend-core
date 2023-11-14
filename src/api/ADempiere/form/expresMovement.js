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
import { config } from '@/utils/ADempiere/config'
import { camelizeObjectKeys } from '@/utils/ADempiere/transformObject.js'

export function listWarehouses({
  searchValue,
  pageToken,
  pageSize
}) {
  return request({
    url: `${config.express.movement}/warehouses`,
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
    url: `${config.express.movement}/products`,
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

// Create Movement
export function createMovementRequest() {
  return request({
    url: `${config.express.movement}/movements`,
    method: 'post'
  })
    .then(response => {
      return camelizeObjectKeys(response)
    })
}

export function processMovementRequest({
  id
}) {
  return request({
    url: `${config.express.movement}/movements/${id}/process`,
    method: 'post'
  })
}

export function deleteMovementRequest({
  id
}) {
  return request({
    url: `${config.express.movement}/movements/${id}`,
    method: 'delete'
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
    url: `${config.express.movement}/movements/${movementId}/lines`,
    method: 'post',
    data: {
      movement_id: movementId,
      movement_uuid: movementUuid,
      product_id: productId,
      product_uuid: productUuid,
      warehouse_id: warehouseId,
      warehouse_to_id: warehouseToId,
      description,
      quantity: quantity.toString()
    }
  })
    .then(response => {
      return camelizeObjectKeys(response)
    })
}

export function deleteMovementLineRequest({
  id,
  movementId
}) {
  return request({
    url: `${config.express.movement}/movement/${movementId}/lines/${id}`,
    method: 'delete'
  })
    .then(response => {
      return camelizeObjectKeys(response)
    })
}

export function updateMovementLineRequest({
  id,
  uuid,
  movementId,
  description,
  quantity
}) {
  return request({
    url: `${config.express.movement}/movement/${movementId}/lines/${id}`,
    method: 'patch',
    data: {
      id,
      uuid,
      description,
      quantity: quantity.toString()
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
    url: `${config.express.movement}/${movementId}/movements/lines`,
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
