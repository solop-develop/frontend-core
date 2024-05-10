/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 * Contributor(s): Edwin Betancourt EdwinBetanc0urt@outlook.com https://github.com/EdwinBetanc0urt
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

export function requestListOrders({
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
    url: '/field/invoices/orders',
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
    url: '/field/invoices/business-partners',
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

export function requestListInvoicesInfo({
  // Page Data
  pageSize,
  pageToken,
  searchValue,
  contextAttributes,
  // references
  processParameterId,
  fieldId,
  browseFieldId,
  referenceId,
  columnId,
  columnName,
  // Custom Filter
  documentNo,
  businessPartnerId,
  isSalesTransaction,
  isPaid,
  description,
  invoiceDateFrom,
  invoiceDateTo,
  orderId,
  grandTotalFrom,
  grandTotalTo
}) {
  return request({
    url: '/field/invoices',
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
      is_sales_transaction: isSalesTransaction,
      is_paid: isPaid,
      description,
      invoice_date_from: invoiceDateFrom,
      invoice_date_to: invoiceDateTo,
      order_id: orderId,
      grand_total_from: grandTotalFrom,
      grand_total_to: grandTotalTo
    }
  })
}
