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
export function createCustomerRequest({
  additionalAttributes,
  addresses,
  description,
  duns,
  name,
  naics,
  posId,
  value,
  taxId,
  lastName
}) {
  return request({
    url: `/point-of-sales/customers`,
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
export function requestUpdateCustomer({
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
    url: `/point-of-sales/customers/${id}`,
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
export function requestListCustomers({
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
    url: `/point-of-sales/customers`,
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
 * Get Customers
 */
export function getCustomerRequest({
  posId,
  searchValue,
  value,
  name,
  contactName,
  eMail,
  phone,
  postalCode
}) {
  return request({
    url: `/point-of-sales/customers/${searchValue}`,
    method: 'get',
    params: {
      pos_id: posId,
      value,
      name,
      contact_name: contactName,
      e_mail: eMail,
      phone,
      postal_code: postalCode
    }
  })
}

/**
 * List Bank Accounts
 */
export function listCustomerBankAccountsRequest({
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
