/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
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
import { config } from '@/utils/ADempiere/config'
import { request } from '@/utils/ADempiere/request'

// Constants
import { ROWS_OF_RECORDS_BY_PAGE } from '@/utils/ADempiere/tableUtils'

// ListProductPrice
export function requestProductsList({
  searchValue,
  businessPartnerUuid,
  posUuid,
  pageSize = ROWS_OF_RECORDS_BY_PAGE,
  priceListUuid,
  warehouseUuid,
  pageToken
}) {
  return request({
    url: `${config.pointOfSales.endpoint}/product-prices`,
    method: 'get',
    params: {
      pos_uuid: posUuid,
      search_value: searchValue,
      business_partner_uuid: businessPartnerUuid,
      price_list_uuid: priceListUuid,
      warehouse_uuid: warehouseUuid,
      page_size: pageSize,
      page_token: pageToken
    }
  })
    .then(productPriceListResponse => {
      const { convertProductPrice } = require('@/utils/ADempiere/apiConverts/core.js')

      return {
        nextPageToken: productPriceListResponse.next_page_token,
        recordCount: productPriceListResponse.record_count,
        productPricesList: productPriceListResponse.records.map(productPrice => {
          return convertProductPrice(productPrice)
        })
      }
    })
}
