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

// constants
// import { ROWS_OF_RECORDS_BY_PAGE } from '@/utils/ADempiere/tableUtils'

export function requestCreateResource({
  resourceTypeId,
  resourceTypeUuid,
  name,
  description
}) {
  return request({
    url: '/form/addons/time-control/create-resource-assignment',
    method: 'get',
    params: {
      //  DSL Query
      resource_type_id: resourceTypeId,
      resource_type_uuid: resourceTypeUuid,
      name,
      description
    }
  })
    .then(response => {
      // const { convertEntityList } = require('@/utils/ADempiere/apiConverts/persistence.js')
      return camelizeObjectKeys(response)
    })
}
export function requestUpdateResource({
  id,
  uuid,
  name,
  description
}) {
  return request({
    url: '/form/addons/time-control/update-resource-assignment',
    method: 'get',
    params: {
      //  DSL Query
      id,
      uuid,
      name,
      description
    }
  })
    .then(response => {
      // const { convertEntityList } = require('@/utils/ADempiere/apiConverts/persistence.js')
      return camelizeObjectKeys(response)
    })
}
export function requestDeleteResource({
  id,
  uuid
}) {
  console.log(id, uuid)
  return request({
    url: '/form/addons/time-control/delete-resource-assignment',
    method: 'get',
    params: {
      //  DSL Query
      id,
      uuid
    }
  })
    .then(response => {
      // const { convertEntityList } = require('@/utils/ADempiere/apiConverts/persistence.js')
      return camelizeObjectKeys(response)
    })
}
export function requestListResource({
  resourceTypeId,
  resourceTypeUuid,
  name,
  description,
  isWaitingForOrdered
}) {
  return request({
    url: '/form/addons/time-control/list-resources-assignment',
    method: 'post',
    data: {
      //  DSL Query
      resource_type_id: resourceTypeId,
      resource_type_uuid: resourceTypeUuid,
      is_waiting_for_ordered: isWaitingForOrdered,
      name,
      description,
      page_size: 25
    }
  })
    .then(response => {
      // const { convertEntityList } = require('@/utils/ADempiere/apiConverts/persistence.js')
      return camelizeObjectKeys(response)
    })
}
export function requestConfirmResourceAssignnment({
  id,
  uuid
}) {
  return request({
    url: '/form/addons/time-control/confirm-resource-assignment',
    method: 'get',
    params: {
      //  DSL Query
      id,
      uuid
    }
  })
    .then(response => {
      // const { convertEntityList } = require('@/utils/ADempiere/apiConverts/persistence.js')
      return camelizeObjectKeys(response)
    })
}
