/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
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

export function requestListTransactionTypes() {
  return request({
    url: '/payment-allocation/transaction-types',
    method: 'get'
  })
}

export function listBusinessPartners({
  searchValue,
  pageToken,
  pageSize
}) {
  return request({
    url: '/payment-allocation/business-partners',
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
  pageSize = 250
}) {
  return request({
    url: '/payment-allocation/organizations',
    method: 'get',
    params: {
      page_size: pageSize,
      page_token: pageToken,
      //  DSL Query
      search_value: searchValue
    }
  })
}

export function requestListCurrencies({
  searchValue,
  pageToken,
  pageSize = 250
}) {
  return request({
    url: '/payment-allocation/currencies',
    method: 'get',
    params: {
      page_size: pageSize,
      page_token: pageToken,
      //  DSL Query
      search_value: searchValue
    }
  })
}

export function requestListPayments({
  // DSL Query
  searchValue,
  businessPartnerId,
  date,
  organizationId,
  currencyId,
  isMultiCurrency,
  transactionType,
  isAutomaticWriteOff,
  // Page Data
  pageSize,
  pageToken
}) {
  return request({
    url: `/payment-allocation/payments/${businessPartnerId}`,
    method: 'get',
    params: {
      search_value: searchValue,
      date,
      organization_id: organizationId,
      currency_id: currencyId,
      is_multi_currency: isMultiCurrency,
      transaction_type: transactionType,
      is_automatic_write_off: isAutomaticWriteOff,
      // Page Data
      page_size: pageSize,
      page_token: pageToken
    }
  })
    .then(response => {
      return camelizeObjectKeys(response)
    })
}

export function requestListInvoices({
  // DSL Query
  searchValue,
  businessPartnerId,
  date,
  organizationId,
  currencyId,
  isMultiCurrency,
  transactionType,
  isAutomaticWriteOff,
  // Page Data
  pageSize,
  pageToken
}) {
  return request({
    url: `/payment-allocation/invoices/${businessPartnerId}`,
    method: 'get',
    params: {
      search_value: searchValue,
      date,
      organization_id: organizationId,
      currency_id: currencyId,
      is_multi_currency: isMultiCurrency,
      transaction_type: transactionType,
      is_automatic_write_off: isAutomaticWriteOff,
      // Page Data
      page_size: pageSize,
      page_token: pageToken
    }
  })
    .then(response => {
      return camelizeObjectKeys(response)
    })
}

export function requestListCharges({
  searchValue,
  pageToken,
  pageSize
}) {
  return request({
    url: '/payment-allocation/charges',
    method: 'get',
    params: {
      page_size: pageSize,
      page_token: pageToken,
      //  DSL Query
      search_value: searchValue
    }
  })
}

// List Transaction Organizations
export function requestListTransactionOrganizations({
  searchValue,
  pageToken,
  pageSize
}) {
  return request({
    url: '/payment-allocation/organizations/transactions',
    method: 'get',
    params: {
      page_size: pageSize,
      page_token: pageToken,
      //  DSL Query
      search_value: searchValue
    }
  })
}

// process
export function requestProcess({
  date,
  chargeId,
  currencyId,
  description,
  totalDifference,
  businessPartnerId,
  invoiceSelectionList,
  paymentSelectionsList,
  transactionOrganizationId
}) {
  return request({
    url: '/payment-allocation/process',
    method: 'post',
    data: {
      //  DSL Query
      date,
      description,
      business_partner_id: businessPartnerId,
      currency_id: currencyId,
      charge_id: chargeId,
      total_difference: totalDifference,
      transaction_organization_id: transactionOrganizationId,
      payment_selections: paymentSelectionsList,
      invoice_selections: invoiceSelectionList
    }
  })
}
