/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 * Contributor(s): Elsio Sanchez elsiosanches@gmail.com https://github.com/elsiosanchez
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
import { camelizeObjectKeys } from '@/utils/ADempiere/transformObject.js'

export function requestListProductAttributesSetInstances({
  id,
  uuid,
  productId,
  productUuid,
  productAttributeSetInstanceId,
  productAttributeSetInstanceUuid,
  searchValue,
  pageToken,
  pageSize = ROWS_OF_RECORDS_BY_PAGE
}) {
  return request({
    url: '/material-management/product-attribute/list-product-attribute-set-instances',
    method: 'post',
    params: {
      search_value: searchValue,
      page_token: pageToken,
      page_size: pageSize
    },
    data: {
      //  DSL Query
      id,
      uuid,
      product_id: productId,
      product_uuid: productUuid,
      product_attribute_set_instance_id: productAttributeSetInstanceId,
      product_attribute_set_instance_uuid: productAttributeSetInstanceUuid
    }
  })
    .then(response => {
      return camelizeObjectKeys(response)
    })
}

export function requestGetProductAttributeSet({
  id,
  uuid,
  productId,
  productUuid,
  productAttributeSetInstanceId,
  productAttributeSetInstanceUuid
}) {
  return request({
    url: '/material-management/product-attribute/get-product-attribute-set',
    method: 'post',
    data: {
      //  DSL Query
      id,
      uuid,
      product_id: productId,
      product_uuid: productUuid,
      product_attribute_set_instance_id: productAttributeSetInstanceId,
      product_attribute_set_instance_uuid: productAttributeSetInstanceUuid
    }
  })
    .then(response => {
      return camelizeObjectKeys(response)
    })
}

export function requestSaveAttributeSetInstance({
  id,
  uuid,
  guaranteeDate,
  lot,
  serial,
  attributes,
  productId,
  productUuid,
  productAttributeSetId,
  productAttributeSetUuid
}) {
  return request({
    url: '/material-management/product-attribute/save-product-attribute-set-instance',
    method: 'post',
    data: {
      //  DSL Query
      id,
      uuid,
      guarantee_date: guaranteeDate,
      lot,
      serial,
      attributes,
      product_id: productId,
      product_uuid: productUuid,
      product_attribute_set_id: productAttributeSetId,
      product_attribute_set_uuid: productAttributeSetUuid
    }
  })
    .then(response => {
      return camelizeObjectKeys(response)
    })
}

export function requestGetProductAttributeSetInstace({
  id,
  uuid,
  productId,
  productUuid
}) {
  return request({
    url: '/material-management/product-attribute/get-product-attribute-set-instance',
    method: 'post',
    data: {
      //  DSL Query
      id,
      uuid,
      product_id: productId,
      product_uuid: productUuid
    }
  })
    .then(response => {
      return camelizeObjectKeys(response)
    })
}

