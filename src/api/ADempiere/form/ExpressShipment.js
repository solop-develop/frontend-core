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
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

import { request } from '@/utils/ADempiere/request'
import { camelizeObjectKeys } from '@/utils/ADempiere/transformObject.js'

export function listBusinessPartnersShipment({
  searchValue,
  pageToken,
  pageSize
}) {
  return request({
    url: '/form/addons/express-shipment/business-partners',
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

export function listOrders({
  searchValue,
  businessPartnerId,
  pageToken,
  pageSize
}) {
  return request({
    url: '/form/addons/express-shipment/sales-orders',
    method: 'get',
    params: {
      page_size: pageSize,
      page_token: pageToken,
      //  DSL Query
      business_partner_id: businessPartnerId,
      search_value: searchValue
    }
  })
    .then(response => {
      return camelizeObjectKeys(response)
    })
}

export function listProductRequest({
  namue,
  upc,
  searchValue,
  sku,
  value,
  pageToken,
  pageSize,
  shipmentId
}) {
  return request({
    url: '/form/addons/express-shipment/product',
    method: 'get',
    params: {
      page_size: pageSize,
      namue,
      upc,
      sku,
      value,
      search_value: searchValue,
      order_id: shipmentId
    }
  })
    .then(response => {
      return camelizeObjectKeys(response)
    })
}
// Shipment
export function createShipmentRequest({
  id,
  uuid
}) {
  return request({
    url: '/form/addons/express-shipment/shipment',
    method: 'post',
    data: {
      order_id: id,
      order_uuid: uuid
    }
  })
    .then(response => {
      return camelizeObjectKeys(response)
    })
}

export function processShipmentRequest({
  id,
  uuid
}) {
  return request({
    url: '/form/addons/express-shipment/process-shipment',
    method: 'post',
    data: {
      // order_id: id,
      // order_uuid: uuid
      id,
      uuid
    }
  })
    .then(response => {
      return camelizeObjectKeys(response)
    })
}

export function deleteShipmentRequest({
  id,
  uuid
}) {
  return request({
    url: '/form/addons/express-shipment/shipment',
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
//	Shipment Line
export function createShipmentLineRequest({
  shipmentId,
  shipmentUuid,
  productId,
  productUuid,
  isQuantityFromOrderLine,
  description,
  quantity
}) {
  return request({
    url: '/form/addons/express-shipment/shipment-line',
    method: 'post',
    data: {
      shipment_id: shipmentId,
      shipment_uuid: shipmentUuid,
      product_id: productId,
      product_uuid: productUuid,
      is_quantity_from_order_line: isQuantityFromOrderLine,
      description,
      quantity
    }
  })
    .then(response => {
      return camelizeObjectKeys(response)
    })
}
export function deleteShipmentLineRequest({
  id,
  uuid
}) {
  return request({
    url: '/form/addons/express-shipment/shipment-line',
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
export function updateShipmentLineRequest({
  id,
  uuid,
  description,
  quantity
}) {
  return request({
    url: '/form/addons/express-shipment/shipment-line',
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

export function listShipmentLinesRequest({
  shipmentId,
  shipmentUuid
}) {
  return request({
    url: '/form/addons/express-shipment/shipment-line',
    method: 'get',
    params: {
      shipment_id: shipmentId,
      shipment_uuid: shipmentUuid
    }
  })
    .then(response => {
      return camelizeObjectKeys(response)
    })
}
