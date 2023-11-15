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
}

/**
 * List of Available Sellers
 * @param {int32} posId
 * @returns {array} ListAvailableSellersResponse
 */

export function listAvailableSellers({
  posId,
  searchValue
}) {
  return request({
    url: `/point-of-sales/${posId}/sellers`,
    method: 'get',
    params: {
      search_value: searchValue
    }
  })
}

/**
 * List Campaigns
 * @param {int32} posId
 * @returns {array} ListCampaignsResponse
 */

export function listCampaigns({
  posId
}) {
  return request({
    url: `/point-of-sales/terminals/${posId}/campaigns`,
    method: 'get'
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
}

/**
 * UpdateOrder
 * @param {int32} posId
 * @param {int32} orderId
 */
export function updateOrder({
  posId,
  orderId,
  customer_id,
  document_type_id,
  price_list_id,
  warehouse_id,
  campaign_id,
  discount_rate,
  discount_rate_off,
  discount_amount_off,
  sales_representative_id
}) {
  return request({
    url: `point-of-sales/${posId}/orders/${orderId}`,
    method: 'put',
    params: {
      customer_id,
      document_type_id,
      price_list_id,
      warehouse_id,
      campaign_id,
      discount_rate,
      discount_rate_off,
      discount_amount_off,
      sales_representative_id
    }
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
}

/**
 * List Orders
 * @param {int32} posId
 */

export function listOrders({
  posId,
  pageSize,
  pageToken,
  search_value,
  document_no,
  document_status,
  business_partner_id,
  grand_total,
  open_amount,
  is_waiting_for_pay,
  is_only_processed,
  is_only_aisle_seller,
  is_waiting_for_invoice,
  is_waiting_for_shipment,
  is_binding_offer,
  is_closed,
  is_nullified,
  is_only_rma,
  date_ordered_from,
  date_ordered_to,
  sales_representative_id
}) {
  return request({
    url: `point-of-sales/${posId}/orders`,
    method: 'get',
    params: {
      page_size: pageSize,
      page_token: pageToken,
      search_value,
      document_no,
      document_status,
      business_partner_id,
      grand_total,
      open_amount,
      is_waiting_for_pay,
      is_only_processed,
      is_only_aisle_seller,
      is_waiting_for_invoice,
      is_waiting_for_shipment,
      is_binding_offer,
      is_closed,
      is_nullified,
      is_only_rma,
      date_ordered_from,
      date_ordered_to,
      sales_representative_id
    }
  })
}

/**
 * Release Order
 * @param {int32} posId
 * @param {int32} orderId
 */

export function releaseOrder({
  posId,
  orderId
}) {
  return request({
    url: `point-of-sales/${posId}/orders/${orderId}/release`,
    method: 'put'
  })
}

/**
 * Hold Order
 * @param {int32} posId
 * @param {int32} orderId
 */

export function holdOrder({
  posId,
  orderId
}) {
  return request({
    url: `point-of-sales/${posId}/orders/${orderId}/hold`,
    method: 'put'
  })
}

/** _________________________
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
}

/**
 * Update Order Line
 * @param {int32} posId
 * @param {int32} orderId
 * @param {int32} lineId
 * @param {int32} uom_id
 * @param {int32} price
 * @param {int32} quantity
 * @param {int32} warehouse_id
 */
export function updateOrderLine({
  posId,
  orderId,
  lineId,
  uom_id,
  price,
  quantity,
  discount_rate,
  warehouse_id
}) {
  return request({
    url: `point-of-sales/${posId}/orders/${orderId}/lines/${lineId}`,
    method: 'put',
    params: {
      uom_id,
      price,
      quantity,
      discount_rate,
      warehouse_id
    }
  })
}

/**
 * Delete Order Line
 * @param {int32} posId
 * @param {int32} orderId
 * @param {int32} lineId
 */
export function deleteOrderLine({
  posId,
  orderId,
  lineId
}) {
  return request({
    url: `point-of-sales/${posId}/orders/${orderId}/lines/${lineId}`,
    method: 'delete'
  })
}

/** _________________________
 * |                         |
 * |   Customers Services    |
 * |_________________________|
 */

/**
 * List Customers
 * @param {string} filters
 * @param {string} sortBy
 * @param {repeated string} groupColumns
 * @param {repeated string} selectColumns
 * @param {int32} filters
 * @param {int32} pageSize
 * @param {string} pageToken
 * @param {string} searchValue
 * @param {string} name
 * @param {string} value
 * @param {string} email
 * @param {int32} posId
 */

export function listCustomers({
  name,
  email,
  value,
  posId,
  sortBy,
  filters,
  pageToken,
  searchValue,
  groupColumns,
  selectColumns,
  pageSize = 15
}) {
  return request({
    url: `point-of-sales/customers`,
    method: 'get',
    params: {
      filters,
      pos_id: posId,
      sort_by: sortBy,
      group_columns: groupColumns,
      select_columns: selectColumns,
      page_size: pageSize,
      page_token: pageToken,
      search_value: searchValue,
      name,
      email,
      value
    }
  })
}

/**
 * Create Customer
 * @param {string} value
 * @param {string} tax_id
 * @param {string} duns
 * @param {string} naics
 * @param {string} name
 * @param {string} last_name
 * @param {string} description
 * @param {array} addresses
 * @param {google.protobuf.Struct} additional_attributes
 * @param {int32} pos_id
 */

export function createCustomer({
  additionalAttributes,
  addresses,
  description,
  duns,
  id,
  name,
  naics,
  posId,
  value,
  taxId,
  lastName
}) {
  return request({
    url: `point-of-sales/customers/${id}`,
    method: 'post',
    data: {
      duns,
      name,
      naics,
      pos_id: posId,
      value,
      tax_id: taxId,
      last_name: lastName,
      addresses,
      description,
      additional_attributes: additionalAttributes
    }
  })
}

/**
 * Update Customer
 * @param {int32} id
 * @param {string} value
 * @param {string} tax_id
 * @param {string} duns
 * @param {string} naics
 * @param {string} name
 * @param {string} last_name
 * @param {string} description
 * @param {array} addresses
 * @param {google.protobuf.Struct} additional_attributes
 * @param {int32} pos_id
 */

export function UpdateCustomer({
  additionalAttributes,
  addresses,
  description,
  duns,
  id,
  name,
  naics,
  posId,
  value,
  taxId,
  lastName
}) {
  return request({
    url: `point-of-sales/customers/${id}`,
    method: 'put',
    data: {
      id,
      duns,
      name,
      naics,
      pos_id: posId,
      value,
      tax_id: taxId,
      last_name: lastName,
      addresses,
      description,
      additional_attributes: additionalAttributes
    }
  })
}

/** ____________________________________
 * |                                    |
 * |  Payments Point of Sale Services   |
 * |____________________________________|
 */

/**
 * Create Payment
 */

export function createPayment({
  posId,
  order_id,
  invoice_id,
  bank_id,
  reference_no,
  description,
  amount,
  payment_date,
  tender_type_code,
  currency_id,
  payment_method_id,
  payment_account_date,
  is_refund,
  charge_id,
  collecting_agent_id,
  reference_bank_account_id,
  customer_bank_account_id,
  invoice_reference_id
}) {
  return request({
    url: `point-of-sales/${posId}/payments`,
    method: 'post',
    data: {
      order_id,
      invoice_id,
      bank_id,
      reference_no,
      description,
      amount,
      payment_date,
      tender_type_code,
      currency_id,
      payment_method_id,
      payment_account_date,
      is_refund,
      charge_id,
      collecting_agent_id,
      reference_bank_account_id,
      customer_bank_account_id,
      invoice_reference_id
    }
  })
}

/**
 * Update Payment
 */

export function updatePayment({
  posId,
  payment_id,
  order_id,
  invoice_id,
  bank_id,
  reference_no,
  description,
  amount,
  payment_date,
  tender_type_code,
  currency_id,
  payment_method_id,
  payment_account_date,
  is_refund,
  charge_id,
  collecting_agent_id,
  reference_bank_account_id,
  customer_bank_account_id,
  invoice_reference_id
}) {
  return request({
    url: `point-of-sales/${posId}/payments/${payment_id}`,
    method: 'put',
    data: {
      order_id,
      invoice_id,
      bank_id,
      reference_no,
      description,
      amount,
      payment_date,
      tender_type_code,
      currency_id,
      payment_method_id,
      payment_account_date,
      is_refund,
      charge_id,
      collecting_agent_id,
      reference_bank_account_id,
      customer_bank_account_id,
      invoice_reference_id
    }
  })
}

/**
 * Delete Payment
 */

export function deletePayment({
  posId,
  payment_id
}) {
  return request({
    url: `point-of-sales/${posId}/payments/${payment_id}`,
    method: 'delete'
  })
}

/**
 * List Payments
 */

export function listPayments({
  posId,
  orderId,
  isOnlyRefund,
  isOnlyReceipt
}) {
  return request({
    url: `point-of-sales/${posId}/payments`,
    method: 'get',
    params: {
      order_id: orderId,
      is_only_refund: isOnlyRefund,
      is_only_receipt: isOnlyReceipt
    }
  })
}

/**
 * Process Order
 */

export function processOrder({
  posId,
  orderId,
  createPayments,
  isOpenRefund,
  payments
}) {
  return request({
    url: `point-of-sales/${posId}/orders/${orderId}/process`,
    method: 'put',
    data: {
      create_payments: createPayments,
      is_open_refund: isOpenRefund,
      payments
    }
  })
}

/** ______________________________________
 * |                                      |
 * |  Additional Point of Sale Services   |
 * |______________________________________|
 */

/**
 * List Product Conversion UOM
 */

export function listProductConversion({
  id
}) {
  return request({
    url: `common/product-conversions/${id}`,
    method: 'get'
  })
}

/**
 * List Stock: GET /api/stocks
 * @param {int32} posId
 * @param {string} value
 * @param {string} sku
 */
export function listStocks({
  posId,
  value,
  sku
}) {
  return request({
    url: `point-of-sales/terminals/${posId}/stocks`,
    method: 'get',
    params: {
      value,
      sku
    }
  })
}

/**
 * Get Currency Rate
 * @param {int32} conversion_type_id
 * @param {int32} currency_from_id
 * @param {int32} currency_to_id
 * @param {google.protobuf.Timestamp} conversion_date
 */

export function getConversionRate({
  conversionTypeId,
  currencyFromId,
  currencyToId,
  conversionDate
}) {
  return request({
    url: 'common/conversion-rates',
    method: 'get',
    params: {
      conversion_type_id: conversionTypeId,
      currency_from_id: currencyFromId,
      currency_to_id: currencyToId,
      conversion_date: conversionDate
    }
  })
}

/**
 * List Banks
 */
export function listBanks({
  posId
}) {
  return request({
    url: `point-of-sales/${posId}/banks`,
    method: 'get',
    params: {
      page_size: 100
    }
  })
}

/**
 * List Bank Accounts
 */
export function listBankAccounts({
  posId,
  customerId,
  bankId
}) {
  return request({
    url: `point-of-sales/${posId}/customers/${customerId}/bank-accounts`,
    method: 'get',
    params: {
      page_size: 100,
      bank_id: bankId
    }
  })
}

/**
 * Create Customer Account
 */
export function createCustomerBankAccount({
  posId,
  customerId,
  accountNo,
  driverLicense,
  bankId,
  bankAccountType = 'C',
  isAch = true
}) {
  return request({
    url: `point-of-sales/${posId}/customers/${customerId}/bank-accounts`,
    method: 'post',
    data: {
      account_no: accountNo,
      driver_license: driverLicense,
      bank_id: bankId,
      bank_account_type: bankAccountType,
      social_security_number: driverLicense,
      is_ach: isAch
    }
  })
}

/**
 * Credit Memo as Payment Method
 */
export function listCustomerCredits({
  posId,
  customerId,
  documentTypeId
}) {
  return request({
    url: `point-of-sales/${posId}/customers/${customerId}/credits`,
    method: 'get',
    params: {
      page_size: 100,
      document_type_id: documentTypeId
    }
  })
}

/**
 * Validate PIN
 */
export function validatePIN({
  pin,
  posId,
  orderId,
  requestedAccess,
  requestedAmount
}) {
  return request({
    url: `point-of-sales/${posId}/validate-pin`,
    method: 'post',
    data: {
      pin,
      order_id: orderId,
      requested_access: requestedAccess,
      requested_amount: requestedAmount
    }
  })
}
/** ___________________________________
 * |                                   |
 * |  Options Point of Sale Services   |
 * |___________________________________|
 */

/**
 * Print Ticket
 */
export function printTicket({
  posId,
  orderId,
  invoiceId,
  shipmentId,
  recordId,
  tableName
}) {
  return request({
    url: `point-of-sales/${posId}/print-ticket`,
    method: 'post',
    data: {
      order_id: orderId,
      invoice_id: invoiceId,
      shipment_id: shipmentId,
      record_id: recordId,
      table_name: tableName
    }
  })
}

/**
 * Reverse Sales
 */
export function reverseSales({
  posId,
  orderId,
  description
}) {
  return request({
    url: `point-of-sales/${posId}/orders/${orderId}/reverse`,
    method: 'put',
    data: {
      description
    }
  })
}

/**
 * Print Preview
 * @param {int32} posId
 * @param {int32} orderId
 * @param {string} reportType
 * @returns
 */

export function printPreview({
  posId,
  orderId,
  reportType
}) {
  return request({
    url: `point-of-sales/${posId}/print-preview`,
    method: 'post',
    data: {
      order_id: orderId,
      report_type: reportType
    }
  })
}

/**
 * Copy Order
 * @param {int32} posId
 * @param {int32} orderId
 * @param {string} reportType
 * @returns
 */

export function copyOrder({
  posId,
  sourceOrderId,
  salesRepresentativeId
}) {
  return request({
    url: `point-of-sales/orders/${sourceOrderId}/copy`,
    method: 'post',
    data: {
      sales_representative_id: salesRepresentativeId,
      pos_id: posId
    }
  })
}

/**
 * Shipment
 * Create Shipment
 */

export function createShipment({
  posId,
  orderId,
  salesRepresentativeId,
  isCreateLinesFromOrder
}) {
  return request({
    url: `point-of-sales/${posId}/shipments`,
    method: 'post',
    data: {
      order_id: orderId,
      sales_representative_id: salesRepresentativeId,
      is_create_lines_from_order: isCreateLinesFromOrder
    }
  })
}

/**
 * Create Shipment Line
 */
export function createShipmentLine({
  posId,
  quantity,
  shipmentId,
  description,
  orderLineId
}) {
  return request({
    url: `point-of-sales/${posId}/shipments/${shipmentId}/lines`,
    method: 'post',
    data: {
      order_line_id: orderLineId,
      description,
      quantity
    }
  })
}

/**
 * Update Order Line
 */
export function updateShipmentLine({
  posId,
  lineId,
  quantity,
  shipmentId,
  description
}) {
  return request({
    url: `point-of-sales/${posId}/shipments/${shipmentId}/lines/${lineId}`,
    method: 'put',
    data: {
      description,
      quantity
    }
  })
}

/**
 * Delete Shipment Line
 */
export function deleteShipmentLine({
  posId,
  lineId,
  shipmentId
}) {
  return request({
    url: `point-of-sales/${posId}/shipments/${shipmentId}/lines/${lineId}`,
    method: 'delete'
  })
}

/**
 * List Shipment Line
 */
export function listShipmentLines({
  posId,
  shipmentId
}) {
  return request({
    url: `point-of-sales/${posId}/shipments/${shipmentId}/lines`,
    method: 'get',
    params: {
      page_size: 100
    }
  })
}

/**
 * Process Shipment
 */
export function processShipment({
  id,
  posId,
  description,
  documentAction = 'CO'
}) {
  return request({
    url: `point-of-sales/${posId}/shipments/${id}/process`,
    method: 'put',
    data: {
      document_action: documentAction,
      description
    }
  })
}

/**
 * Print Preview for Shipment
 */
export function printShipmentPreview({
  posId,
  shipmentId,
  reportType = 'application/pdf'
}) {
  return request({
    url: `point-of-sales/${posId}/shipments/${shipmentId}/print-preview`,
    method: 'post',
    data: {
      report_type: reportType
    }
  })
}

/**
 * Create Return
 */
export function createRMA({
  posId,
  sourceOrderId,
  salesRepresentativeId,
  isCreateLinesFromOrder
}) {
  return request({
    url: 'point-of-sales/returns',
    method: 'post',
    data: {
      pos_id: posId,
      source_order_id: sourceOrderId,
      sales_representative_id: salesRepresentativeId,
      is_create_lines_from_order: isCreateLinesFromOrder
    }
  })
}

/**
 * Create Return Line
 */
export function createRMALine({
  posId,
  rmaId,
  sourceOrderLineId,
  description,
  quantity
}) {
  return request({
    url: `point-of-sales/returns/${rmaId}/lines`,
    method: 'post',
    data: {
      pos_id: posId,
      source_order_line_id: sourceOrderLineId,
      description,
      quantity
    }
  })
}

/**
 * Delete Return Line
 */
export function deleteRMALine({
  posId,
  rmaId,
  lineId
}) {
  return request({
    url: `point-of-sales/returns/${rmaId}/lines/${lineId}`,
    method: 'delete',
    data: {
      pos_id: posId
    }
  })
}

/**
 * Update RMA Line
 */
export function updateRMALine({
  posId,
  rmaId,
  lineId,
  description,
  quantity
}) {
  return request({
    url: `point-of-sales/returns/${rmaId}/lines/${lineId}`,
    method: 'put',
    data: {
      pos_id: posId,
      description,
      quantity
    }
  })
}

/**
 * List Return Line
 */
export function listRMALine({
  posId,
  rmaId
}) {
  return request({
    url: `point-of-sales/returns/${rmaId}/lines`,
    method: 'get',
    params: {
      pos_id: posId,
      rma_id: rmaId
    }
  })
}

/**
 * Process Return
 */
export function processRMA({
  posId,
  rmaId,
  documentAction = 'CO'
}) {
  return request({
    url: `point-of-sales/returns/${rmaId}/process`,
    method: 'put',
    params: {
      pos_id: posId,
      rma_id: rmaId,
      document_action: documentAction
    }
  })
}

/**
 * Create Order from RMA
 */

export function createOrderFromRMA({
  posId,
  salesRepresentativeId,
  sourceRmaId
}) {
  return request({
    url: `point-of-sales/returns/${sourceRmaId}/create-order`,
    method: 'post',
    params: {
      pos_id: posId,
      sales_representative_id: salesRepresentativeId
    }
  })
}

/**
 * Cash Management (Opening Process)
 */
export function cashOpening({
  posId,
  payments,
  description,
  collectingAgentId
}) {
  return request({
    url: `point-of-sales/${posId}/cash/process-opening`,
    method: 'put',
    data: {
      collecting_agent_id: collectingAgentId,
      description,
      payments
    }
  })
}

/**
 * Cash Withdrawal
 */
export function processCashWithdrawal({
  posId,
  payments,
  description,
  collectingAgentId
}) {
  return request({
    url: `point-of-sales/cash/process-withdrawal`,
    method: 'put',
    data: {
      collecting_agent_id: collectingAgentId,
      pos_id: posId,
      description,
      payments
    }
  })
}

/**
 * Cash Closing
 */
export function processCashClosing({
  id,
  posId,
  description,
  collectingAgentId
}) {
  return request({
    url: `point-of-sales/cash/closings/{id}/process`,
    method: 'put',
    data: {
      collecting_agent_id: collectingAgentId,
      pos_id: posId,
      description,
      id
    }
  })
}

/**
 * List Cash Summary
 */
export function listCashSummaryMovements({
  posId,
  isOnlyProcessed,
  isOnlyRefund
}) {
  return request({
    url: `point-of-sales/cash/summary-movements`,
    method: 'get',
    params: {
      pos_id: posId,
      is_only_processed: isOnlyProcessed,
      is_only_refund: isOnlyRefund
    }
  })
}

/**
 * List all cash movements
 */
export function listCashMovements({
  posId,
  isOnlyProcessed,
  isOnlyRefund
}) {
  return request({
    url: `point-of-sales/cash/movements`,
    method: 'get',
    params: {
      pos_id: posId,
      is_only_processed: isOnlyProcessed,
      is_only_refund: isOnlyRefund
    }
  })
}

/**
 * List Available Cash
 * @param {int32} posId
 */
export function listAvailableCash({
  posId
}) {
  return request({
    url: `/point-of-sales/terminals/${posId}/cashs`,
    method: 'get'
  })
}

/**
 * Allocate Seller
 */
export function allocateSeller({
  posId,
  salesRepresentativeId
}) {
  return request({
    url: `/point-of-sales/terminals/${posId}/allocate-seller`,
    method: 'put',
    data: {
      sales_representative_id: salesRepresentativeId
    }
  })
}
