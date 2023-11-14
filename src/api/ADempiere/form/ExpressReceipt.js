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
import { config } from '@/utils/ADempiere/config'
import { camelizeObjectKeys } from '@/utils/ADempiere/transformObject.js'

export function listBusinessPartnersReceipt({
  searchValue,
  pageToken,
  pageSize
}) {
  return request({
    url: `${config.express.receipt}/business-partners`,
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
    url: `${config.express.receipt}/orders`,
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
  receiptId
}) {
  return request({
    url: `${config.express.receipt}/products`,
    method: 'get',
    params: {
      page_size: pageSize,
      namue,
      upc,
      sku,
      value,
      search_value: searchValue,
      order_id: receiptId
    }
  })
    .then(response => {
      return camelizeObjectKeys(response)
    })
}
// Shipment
export function createReceiptRequest({
  id,
  uuid
}) {
  return request({
    url: `${config.express.receipt}/receipts`,
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

export function processReceiptRequest({
  id,
  uuid
}) {
  return request({
    url: `${config.express.receipt}/receipts/${id}/process`,
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
    url: `${config.express.receipt}/receipts/${id}`,
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
export function createReceiptLineRequest({
  receiptId,
  receiptUuid,
  productId,
  productUuid,
  isQuantityFromOrderLine,
  description,
  quantity
}) {
  return request({
    url: `${config.express.receipt}/receipts/${receiptId}/lines`,
    method: 'post',
    data: {
      receipt_id: receiptId,
      receipt_uuid: receiptUuid,
      product_id: productId,
      product_uuid: productUuid,
      is_quantity_from_order_line: isQuantityFromOrderLine,
      description,
      quantity: quantity.toString()
    }
  })
    .then(response => {
      return camelizeObjectKeys(response)
    })
}
export function deleteReceiptLineRequest({
  id,
  uuid,
  receiptId
}) {
  return request({
    url: `${config.express.receipt}/receipts/${receiptId}/lines/${id}`,
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
export function updateReceiptLineRequest({
  id,
  uuid,
  receiptId,
  description,
  quantity
}) {
  return request({
    url: `${config.express.receipt}/receipts/${receiptId}/lines/${id}`,
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

export function listReceiptLinesRequest({
  receiptId
}) {
  return request({
    url: `${config.express.receipt}/receipts/${receiptId}/lines`,
    method: 'get'
  })
    .then(response => {
      return camelizeObjectKeys(response)
    })
}
