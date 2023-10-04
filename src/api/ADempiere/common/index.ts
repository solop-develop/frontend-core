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
import { camelizeObjectKeys } from '@/utils/ADempiere/transformObject.js'
// Constants
import { ROWS_OF_RECORDS_BY_PAGE } from '@/utils/ADempiere/tableUtils'

/**
 * Conversion Rate
 */
export function requestGetConversionRate() {
  return request({
    url: '/common/conversion-rates',
    method: 'get'
  })
    .then(response => {
      return camelizeObjectKeys(response)
    })
}

/**
 * Get System Info
 */
export function systemInfo() {
  return request({
    url: '/common/system-info',
    method: 'get'
  })
    .then(response => {
      return camelizeObjectKeys(response)
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
    url: `/common/countries/${id}`,
    method: 'get'
  })
    .then(countryResponse => {
      const { convertCountry } = require('@/utils/ADempiere/apiConverts/core.js')
      return convertCountry(countryResponse)
    })
}

/**
 * Get Organization list from role
 * @param param0
 * @returns
 */
export function requestOrganizationsList({
  roleId,
  pageToken,
  pageSize = 100
}) {
  return request({
    url: '/common/organizations',
    method: 'get',
    params: {
      role_id: roleId,
      page_token: pageToken,
      page_size: pageSize
    }
  })
    .then(organizationsListResponse => {
      return {
        nextPageToken: organizationsListResponse.next_page_token,
        recordCount: organizationsListResponse.record_count,
        organizationsList: organizationsListResponse.organizations.map(organization => {
          return camelizeObjectKeys(organization)
        })
      }
    })
}

/**
 * Get Warehouses of Organization
 * @param organizationId
 * @returns
 */
export function requestWarehousesList({
  organizationId,
  pageToken,
  pageSize = 100
}) {
  return request({
    url: '/common/warehouses',
    method: 'get',
    params: {
      organization_id: organizationId,
      // Page Data
      page_token: pageToken,
      page_size: pageSize
    }
  })
}

/**
 * Get Languages from Api
 */
export function requestLanguagesList({
  pageToken,
  pageSize = ROWS_OF_RECORDS_BY_PAGE
}) {
  return request({
    url: '/common/languages',
    method: 'get',
    params: {
      // Page Data
      page_token: pageToken,
      page_size: pageSize
    }
  })
    .then(languagesListResponse => {
      const { convertLanguage } = require('@/utils/ADempiere/apiConverts/core.js')

      return {
        nextPageToken: languagesListResponse.next_page_token,
        recordCount: languagesListResponse.record_count,
        languagesList: languagesListResponse.languages.map(language => {
          return convertLanguage(language)
        })
      }
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
    url: '/common/business-partners',
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
    .then(businessPartnerResponse => {
      const { convertBusinessPartner } = require('@/utils/ADempiere/apiConverts/core.js')

      return {
        nextPageToken: businessPartnerResponse.next_page_token,
        recordCount: businessPartnerResponse.record_count,
        businessPartnersList: businessPartnerResponse.business_partners.map(businessPartner => {
          return convertBusinessPartner(businessPartner)
        })
      }
    })
}

/**
 * GET Product Conversions
 */
export function productConversions({
  id
}) {
  return request({
    url: `/common/product-conversions/${id}`,
    method: 'get'
  })
    .then(responseProductConversions => {
      return {
        nextPageToken: responseProductConversions.next_page_token,
        recordCount: responseProductConversions.record_count,
        businessPartnersList: responseProductConversions.product_conversion.map(list => {
          return camelizeObjectKeys(list)
        })
      }
    })
}

/**
 * GET Business Partne
 */
export function businessPartner({
  searchValue
}) {
  return request({
    url: `/common/business-partners`,
    method: 'get',
    params: {
      search_value: searchValue
    }
  })
    .then(businessPartnerResponse => {
      return {
        nextPageToken: businessPartnerResponse.next_page_token,
        recordCount: businessPartnerResponse.record_count,
        businessPartnersList: businessPartnerResponse.business_partners.map(list => {
          return camelizeObjectKeys(list)
        })
      }
    })
}

/**
 * POST Business Partner
 */
export function requestCreateBusinessPartner({
  value,
  taxId,
  duns,
  naics,
  name,
  name2,
  description,
  contactName,
  eMail,
  phone,
  businessPartnerGroupUuid,
  // Location
  address1,
  address2,
  address3,
  address4,
  cityUuid,
  cityName,
  postalCode,
  regionUuid,
  regionName,
  countryUuid,
  posUuid
}) {
  return request({
    url: '/common/create-business-partner',
    method: 'post',
    data: {
      value,
      tax_id: taxId,
      duns,
      naics,
      name,
      last_name: name2,
      description,
      contact_name: contactName,
      e_mail: eMail,
      phone,
      business_partner_group_uid: businessPartnerGroupUuid,
      // Location
      address1,
      address2,
      address3,
      address4,
      city_uuid: cityUuid,
      city_name: cityName,
      postal_code: postalCode,
      region_uuid: regionUuid,
      region_name: regionName,
      country_uuid: countryUuid,
      pos_uuid: posUuid
    }
  })
    .then(businessPartnerResponse => {
      return camelizeObjectKeys(businessPartnerResponse)
    })
}
