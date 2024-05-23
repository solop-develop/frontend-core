/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 * Contributor(s): Elsio Sanchez elsiosanches@gmail.com.com https://github.com/ElsioSanchez
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

// Constants
import { ROWS_OF_RECORDS_BY_PAGE } from '@/utils/ADempiere/tableUtils'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

export function requestListBusinessPartners({
  filters,
  sort_by,
  group_columns,
  select_columns,
  page_size,
  page_token,
  search_value,
  context_attributes,
  is_only_active_records,
  is_sales_transaction
}) {
  return request({
    url: '/field/payments/business-partners',
    method: 'get',
    params: {
      filters,
      sort_by,
      group_columns,
      select_columns,
      page_size,
      page_token,
      search_value,
      context_attributes,
      is_only_active_records,
      is_sales_transaction
    }
  })
}

export function requesListBankAccount({
  filters,
  sort_by,
  group_columns,
  select_columns,
  page_size,
  page_token,
  search_value,
  context_attributes,
  is_only_active_records,
  is_sales_transaction
}) {
  return request({
    url: '/field/payments/bank-account',
    method: 'get',
    params: {
      filters,
      sort_by,
      group_columns,
      select_columns,
      page_size,
      page_token,
      search_value,
      context_attributes,
      is_only_active_records,
      is_sales_transaction
    }
  })
}

export function requestListPaymentsInfo({
  // Page Data
  pageSize = ROWS_OF_RECORDS_BY_PAGE,
  pageToken,
  searchValue,
  contextAttributes,
  // references
  processParameterId,
  browseFieldId,
  referenceId,
  tableName,
  fieldId,
  columnId,
  columnName,
  // Custom Filter
  businessPartnerId,
  grandTotalFrom,
  bankAccountId,
  paymentDateFrom,
  paymentDateTo,
  grandTotalTo,
  description,
  documentNo,
  isPayments,
  isReceipt,
  orderId
}) {
  let url = '/field/payments'
  switch (true) {
    case !isEmptyValue(fieldId):
      url = `/field/payments/field/${fieldId}`
      break
    case !isEmptyValue(processParameterId):
      url = `/field/payments/parameter/${processParameterId}`
      break
    case !isEmptyValue(browseFieldId):
      url = `/field/payments/query-criteria/${browseFieldId}`
      break
    case (!isEmptyValue(tableName) && !isEmptyValue(columnName)):
      url = `/field/payments/table/${tableName}/${columnName}`
      break
    case !isEmptyValue(columnId):
      url = `/field/payments/column/${columnId}`
      break
    default:
      url = `/field/payments`
      break
  }

  return request({
    url,
    method: 'get',
    params: {
      // Page Data
      page_size: pageSize,
      page_token: pageToken,
      search_value: searchValue,
      context_attributes: contextAttributes,
      // References
      process_parameter_id: processParameterId,
      field_id: fieldId,
      browse_field_id: browseFieldId,
      reference_id: referenceId,
      column_id: columnId,
      column_name: columnName,
      // Custom Filter
      document_no: documentNo,
      business_partner_id: businessPartnerId,
      bank_account_id: bankAccountId,
      is_receipt: isReceipt,
      is_payment: isPayments,
      description,
      payment_date_from: paymentDateFrom,
      payment_date_to: paymentDateTo,
      order_id: orderId,
      grand_total_from: grandTotalFrom,
      grand_total_to: grandTotalTo
    }
  })
}

export function requestGetOrderInfo({
  id
}) {
  return request({
    url: `/field/payments/${id}`,
    method: 'get'
  })
}
