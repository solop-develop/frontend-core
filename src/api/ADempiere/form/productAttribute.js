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
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

// Get Instance for connection
import { request } from '@/utils/ADempiere/request'
import { camelizeObjectKeys } from '@/utils/ADempiere/transformObject.js'

export function listProductAttributesSetInstances({
  id,
  uuid,
  productId,
  productUuid,
  productAttributeSetInstanceId,
  productAttributeSetInstanceUuid
}) {
  return request({
    url: '/material-management/list-product-attribute-set-instances',
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
      // const { convertEntityList } = require('@/utils/ADempiere/apiConverts/persistence.js')
      return camelizeObjectKeys(response)
    })
}

export function getProductAttribute({
  id,
  uuid,
  productId,
  productUuid,
  productAttributeSetInstanceId,
  productAttributeSetInstanceUuid
}) {
  return request({
    url: '/material-management/get-product-attribute-set',
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
      // const { convertEntityList } = require('@/utils/ADempiere/apiConverts/persistence.js')
      return camelizeObjectKeys(response)
    })
}
