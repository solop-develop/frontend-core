/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
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
import { camelizeObjectKeys } from '@/utils/ADempiere/transformObject.js'

// Constants
// import { ROWS_OF_RECORDS_BY_PAGE } from '@/utils/ADempiere/tableUtils'

export function requestCreateResource({
  requestId,
  projectId,
  name,
  description,
  quantity,
  date
}) {
  return request({
    url: '/form/addons/time-record',
    method: 'post',
    data: {
      //  DSL Query
      quantity,
      name,
      description,
      date,
      project_id: projectId,
      request_id: requestId
    }
  })
    .then(response => {
      // const { convertEntityList } = require('@/utils/ADempiere/apiConverts/persistence.js')
      return camelizeObjectKeys(response)
    })
}

export function requestListTimeRecord() {
  return request({
    url: '/form/addons/time-record',
    method: 'get'
  })
    .then(response => {
      return camelizeObjectKeys(response)
    })
}

export function requestlistProject() {
  return request({
    url: '/form/addons/time-record/projects',
    method: 'get'
  })
    .then(response => {
      return camelizeObjectKeys(response)
    })
}

export function requestlistIssues() {
  return request({
    url: '/form/addons/time-record/issues',
    method: 'get'
  })
    .then(response => {
      return camelizeObjectKeys(response)
    })
}
