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
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.services
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

import { request } from '@/utils/ADempiere/request'

// Constants
import { ROWS_OF_RECORDS_BY_PAGE } from '@/utils/ADempiere/tableUtils'

// Utils and Helper Methods
import { camelizeObjectKeys } from '@/utils/ADempiere/transformObject.js'

/**
 * Get System Info
 */
export function systemInfo() {
  return request({
    url: '/core-functionality/system-info',
    method: 'get'
  })
    .then(response => {
      return camelizeObjectKeys(response)
    })
}

export function systemInfoDictionary() {
  return request({
    url: '/dictionary/system-info',
    method: 'get'
  })
}

export function systemInfoS3() {
  return request({
    url: '/resources/system-info',
    method: 'get'
  })
}

/**
 * Get Country definition from server using id or uuid for record
 * @param {number} id
 */
export function requestGetCountryDefinition({
  id
}) {
  return request({
    url: `/core-functionality/countries/${id}`,
    method: 'get'
  })
    .then(countryResponse => {
      const { convertCountry } = require('@/utils/ADempiere/apiConverts/core.js')
      return convertCountry(countryResponse)
    })
}

/**
 * GET Business Partners
 */
export function requestListBusinessPartner({
  posUuid,
  searchValue,
  value,
  name,
  contactName,
  eMail,
  postalCode,
  phone,
  // Query
  // criteria,
  pageSize = ROWS_OF_RECORDS_BY_PAGE,
  pageToken
}) {
  return request({
    url: '/core-functionality/business-partners',
    method: 'get',
    params: {
      pos_uuid: posUuid,
      search_value: searchValue,
      value,
      name,
      contact_name: contactName,
      e_mail: eMail,
      phone,
      // Location
      postal_code: postalCode,
      page_size: pageSize,
      page_token: pageToken
    }
  })
}
