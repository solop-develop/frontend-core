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
  page_size,
  page_token,
  document_no,
  is_sales_transaction,
  business_partner_id,
  is_paid,
  description,
  invoice_date_from,
  invoice_date_to,
  order_id,
  grand_total_from,
  grand_total_to
}) {
  return request({
    url: '/field/invoices',
    method: 'get',
    params: {
      page_size,
      page_token,
      document_no,
      is_sales_transaction,
      business_partner_id,
      is_paid,
      description,
      invoice_date_from,
      invoice_date_to,
      order_id,
      grand_total_from,
      grand_total_to
    }
  })
}
