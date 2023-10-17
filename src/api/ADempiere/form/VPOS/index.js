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

/** ______________________________________________
 * |                                              |
 * | POS Service used for ADempiere integration   |
 * |______________________________________________|
 */

/**
 * List Point of Sales
 * @returns {array} ListPointOfSalesResponse
 */
export function listPointOfSales() {
  return request({
    url: '/point-of-sales/terminals',
    method: 'get'
  })
    .then(response => {
      return response
    })
}

/**
 * Get POS Definition
 * @param {number} id
 * @returns {object} PointOfSales
 */
export function getPointOfSales({
  id
}) {
  return request({
    url: `/point-of-sales/terminals/${id}`,
    method: 'get'
  })
    .then(response => {
      return response
    })
}

/**
 * List of Available Warehouses
 * @param {int32} posId
 * @returns {array} ListAvailableWarehousesResponse
 */

export function listAvailableWarehouses({
  posId
}) {
  return request({
    url: `/point-of-sales/${posId}/warehouses`,
    method: 'get'
  })
    .then(response => {
      return response
    })
}

/**
 * List of Available Tender Types
 * @param {int32} posId
 * @returns {array} ListAvailablePaymentMethodsResponse
 */

export function listAvailablePaymentMethods({
  posId
}) {
  return request({
    url: `/point-of-sales/${posId}/payment-methods`,
    method: 'get'
  })
    .then(response => {
      return response
    })
}

/**
 * List of Available Price List
 * @param {int32} posId
 * @returns {array} ListAvailablePriceListResponse
 */

export function listAvailablePriceList({
  posId
}) {
  return request({
    url: `/point-of-sales/${posId}/price-lists`,
    method: 'get'
  })
    .then(response => {
      return response
    })
}

/**
 * List of Available Currencies
 * @param {int32} posId
 * @returns {array} ListAvailableCurrenciesResponse
 */

export function listAvailableCurrencies({
  posId
}) {
  return request({
    url: `/point-of-sales/${posId}/currencies`,
    method: 'get'
  })
    .then(response => {
      return response
    })
}

/**
 * List of Available Document Types
 * @param {int32} posId
 * @returns {array} ListAvailableDocumentTypesResponse
 */

export function listAvailableDocumentTypes({
  posId
}) {
  return request({
    url: `/point-of-sales/${posId}/document-types`,
    method: 'get'
  })
    .then(response => {
      return response
    })
}

/**
 * List of Available Discounts
 * @param {int32} posId
 * @returns {array} ListAvailableDiscountsResponse
 */

export function listAvailableDiscounts({
  posId
}) {
  return request({
    url: `/point-of-sales/${posId}/discounts`,
    method: 'get'
  })
    .then(response => {
      return response
    })
}

/**
 * List of Available Sellers
 * @param {int32} posId
 * @returns {array} ListAvailableSellersResponse
 */

export function listAvailableSellers({
  posId
}) {
  return request({
    url: `/point-of-sales/${posId}/sellers`,
    method: 'get'
  })
    .then(response => {
      return response
    })
}

/** __________________________________________
 * |                                          |
 * | List of Point of Sale Product Services   |
 * |__________________________________________|
 */

/**
 * Get Product Price from searchValue
 * @param {int32} posId
 * @param {string} searchValue
 * @param {int32} businessPartnerId
 * @param {string} validFrom
 * @param {int32} priceListId
 * @param {int32} warehouseId
 */

export function getProductPriceSearchValue({
  businessPartnerId,
  priceListId,
  warehouseId,
  searchValue,
  validFrom,
  posId
}) {
  return request({
    url: `point-of-sales/${posId}/product-prices/${searchValue}`,
    method: 'get',
    params: {
      business_partner_id: businessPartnerId,
      valid_from: validFrom,
      price_list_id: priceListId,
      warehouse_id: warehouseId
    }
  })
    .then(response => {
      return response
    })
}

/**
 * Get Product Price from UPC
 * @param {int32} posId
 * @param {string} upc
 * @param {int32} businessPartnerId
 * @param {string} validFrom
 * @param {int32} priceListId
 * @param {int32} warehouseId
 */

export function getProductPriceUPC({
  businessPartnerId,
  priceListId,
  warehouseId,
  validFrom,
  posId,
  upc
}) {
  return request({
    url: `point-of-sales/${posId}/product-prices/upc/${upc}`,
    method: 'get',
    params: {
      business_partner_id: businessPartnerId,
      valid_from: validFrom,
      price_list_id: priceListId,
      warehouse_id: warehouseId
    }
  })
    .then(response => {
      return response
    })
}

/**
 * Get Product Price from sku
 * @param {int32} posId
 * @param {string} sku
 * @param {int32} businessPartnerId
 * @param {string} validFrom
 * @param {int32} priceListId
 * @param {int32} warehouseId
 */

export function getProductPriceSKU({
  businessPartnerId,
  priceListId,
  warehouseId,
  validFrom,
  posId,
  sku
}) {
  return request({
    url: `point-of-sales/${posId}/product-prices/sku/${sku}`,
    method: 'get',
    params: {
      business_partner_id: businessPartnerId,
      valid_from: validFrom,
      price_list_id: priceListId,
      warehouse_id: warehouseId
    }
  })
    .then(response => {
      return response
    })
}

/**
 * Get Product Price from Code(value)
 * @param {int32} posId
 * @param {string} value
 * @param {int32} businessPartnerId
 * @param {string} validFrom
 * @param {int32} priceListId
 * @param {int32} warehouseId
 */

export function getProductPriceCode({
  businessPartnerId,
  priceListId,
  warehouseId,
  validFrom,
  posId,
  value
}) {
  return request({
    url: `point-of-sales/${posId}/product-prices/value/${value}`,
    method: 'get',
    params: {
      business_partner_id: businessPartnerId,
      valid_from: validFrom,
      price_list_id: priceListId,
      warehouse_id: warehouseId
    }
  })
    .then(response => {
      return response
    })
}

/**
 * Get Product Price from Name
 * @param {int32} posId
 * @param {string} name
 * @param {int32} businessPartnerId
 * @param {string} validFrom
 * @param {int32} priceListId
 * @param {int32} warehouseId
 */

export function getProductPriceName({
  businessPartnerId,
  priceListId,
  warehouseId,
  validFrom,
  posId,
  name
}) {
  return request({
    url: `point-of-sales/${posId}/product-prices/name/${name}`,
    method: 'get',
    params: {
      business_partner_id: businessPartnerId,
      valid_from: validFrom,
      price_list_id: priceListId,
      warehouse_id: warehouseId
    }
  })
    .then(response => {
      return response
    })
}

/**
 * List Product Price
 * @param {int32} posId
 * @param {string} filters
 * @param {string} searchValue
 * @param {string} sortBy
 * @param {repeated string} groupColumns
 * @param {repeated string} selectColumns
 * @param {int32} pageSize
 * @param {string} pageToken
 * @param {int32} businessPartnerId
 * @param {string} validFrom
 * @param {int32} priceListId
 * @param {int32} warehouseId
 */

export function listProductPrice({
  posId,
  pageSize = 15,
  pageToken,
  validFrom,
  searchValue,
  priceListId,
  warehouseId,
  businessPartnerId
}) {
  return request({
    url: `point-of-sales/${posId}/product-prices`,
    method: 'get',
    params: {
      business_partner_id: businessPartnerId,
      valid_from: validFrom,
      price_list_id: priceListId,
      search_value: searchValue,
      warehouse_id: warehouseId,
      page_size: pageSize,
      page_token: pageToken
    }
  })
    .then(response => {
      return response
    })
}

/** ___________________
 * |                   |
 * | Orders Services   |
 * |___________________|
 */

/**
 * Create Order
 * @param {int32} posId7
 * @param {int32} customerId
 * @param {int32} documentTypeId
 * @param {int32} priceListId
 * @param {int32} warehouseId
 * @param {int32} salesRepresentativeId
 * @param {int32} campaignId
 */
export function createOrder({
  posId,
  customerId,
  documentTypeId,
  priceListId,
  warehouseId,
  salesRepresentativeId,
  campaignId
}) {
  return request({
    url: `point-of-sales/${posId}/orders`,
    method: 'post',
    data: {
      customer_id: customerId,
      document_type_id: documentTypeId,
      price_list_id: priceListId,
      warehouse_id: warehouseId,
      sales_representative_id: salesRepresentativeId,
      campaign_id: campaignId
    }
  })
    .then(response => {
      return response
    })
}

/**
 * Get a Order
 * @param {int32} posId
 * @param {int32} orderId
 */
export function getOrder({
  posId,
  orderId
}) {
  return request({
    url: `point-of-sales/${posId}/orders/${orderId}`,
    method: 'get'
  })
    .then(response => {
      return response
    })
}

/**
 * Delete Order
 * @param {int32} posId
 * @param {int32} orderId
 */
export function deleteOrder({
  posId,
  orderId
}) {
  return request({
    url: `point-of-sales/${posId}/orders/${orderId}`,
    method: 'delete'
  })
    .then(response => {
      return response
    })
}

/**
 * List Orders
 * @param {int32} posId
 */

export function listOrders({
  posId
}) {
  return request({
    url: `point-of-sales/${posId}/orders`,
    method: 'get'
  })
    .then(response => {
      return response
    })
}

/** _________________________

export function listOrders({
  posId
}) {
  return request({
    url: `point-of-sales/${posId}/orders`,
    method: 'get'
  })
    .then(response => {
      return response
    })
}
 * |                         |
 * |   Order Line Services   |
 * |_________________________|
 */

/**
 * Create Order
 * @param {int32} posId
 * @param {int32} orderId
 * @param {int32} chargeId
 * @param {string} description
 * @param {google.protobuf.Value} quantity
 * @param {google.protobuf.Value} price
 * @param {google.protobuf.Value} discountRate
 * @param {int32} warehouseId
 * @param {int32} resourceAssignmentId
 */
export function createOrderLine({
  posId,
  orderId,
  chargeId,
  productId,
  description,
  quantity,
  price,
  discountRate,
  warehouseId,
  resourceAssignmentId
}) {
  return request({
    url: `point-of-sales/${posId}/orders/${orderId}/lines`,
    method: 'post',
    data: {
      product_id: productId,
      charge_id: chargeId,
      description,
      quantity,
      price,
      discount_rate: discountRate,
      warehouse_id: warehouseId,
      resource_assignment_id: resourceAssignmentId
    }
  })
    .then(response => {
      return response
    })
}

/**
 * List Order Lines
 * @param {string} filters
 * @param {string} sortBy
 * @param {repeated string} groupColumns
 * @param {repeated string} selectColumns
 * @param {int32} filters
 * @param {int32} pageSize
 * @param {string} pageToken
 * @param {string} searchValue
 * @param {int32} posId
 * @param {int32} orderId
 */
export function listOrderLines({
  posId,
  sortBy,
  orderId,
  filters,
  pageSize = 15,
  pageToken,
  searchValue,
  groupColumns,
  selectColumns
}) {
  return request({
    url: `point-of-sales/${posId}/orders/${orderId}/lines`,
    method: 'get',
    params: {
      filters,
      sort_by: sortBy,
      group_columns: groupColumns,
      select_columns: selectColumns,
      page_size: pageSize,
      page_token: pageToken,
      search_value: searchValue
    }
  })
    .then(response => {
      return response
    })
}
