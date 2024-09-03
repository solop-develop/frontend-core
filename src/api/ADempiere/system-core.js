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

// Constants
import { ROWS_OF_RECORDS_BY_PAGE } from '@/utils/ADempiere/tableUtils'

/**
 * Get Country definition from server using id or uuid for record
 * @param {string} uuid
 * @param {number} id
 */
export function requestGetCountryDefinition({
  id,
  uuid
}) {
  return request({
    url: '/security/country',
    method: 'get',
    params: {
      id,
      uuid
    }
  })
    .then(countryResponse => {
      const { convertCountry } = require('@/utils/ADempiere/apiConverts/core.js')

      return convertCountry(countryResponse)
    })
}

// Get languages from api
export function requestLanguagesList({
  pageToken,
  pageSize = ROWS_OF_RECORDS_BY_PAGE
}) {
  return request({
    url: '/core-functionality/languages',
    method: 'get',
    params: {
      // Page Data
      page_token: pageToken,
      page_size: pageSize
    }
  })
}

/**
 * Get System Info
 */
export function systemInfo() {
  return request({
    url: '/core/system-info',
    method: 'get'
  })
    .then(response => {
      return response
    })
    .catch(error => {
      console.info(error)
    })
}

/**
 * Get Currency Rate
 * @param {int32} conversion_type_id
 * @param {int32} currency_from_id
 * @param {int32} currency_to_id
 * @param {google.protobuf.Timestamp} conversion_date
 */
export function getConversionRateRequest({
  conversionTypeId,
  currencyFromId,
  currencyToId,
  conversionDate
}) {
  return request({
    url: '/core-functionality/conversion-rates',
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
 * List Product Conversion UOM
 */
export function listProductConversionsRequest({
  id
}) {
  return request({
    url: `core-functionality/product-conversions/${id}`,
    method: 'get'
  })
}
