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
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

// Get Instance for connection
import { request } from '@/utils/ADempiere/request'

import { camelizeObjectKeys } from '@/utils/ADempiere/transformObject.js'

/**
 * Exists Window Dashboards
 */
export function requestExistsWindowDashboards({
  tabId,
  windowId
}) {
  return request({
    url: `/dashboarding/dashboards/windows/${windowId}/exists`,
    method: 'get',
    params: {
      tab_id: tabId
    }
  })
}

export function requestListWindowDashboards({
  tabId,
  windowId,
  pageSize,
  pageToken
}) {
  return request({
    url: `/dashboarding/dashboards/windows/${windowId}`,
    method: 'get',
    params: {
      tab_id: tabId,
      //  DSL Query
      page_size: pageSize,
      page_token: pageToken
    }
  })
    .then(response => {
      return camelizeObjectKeys(response)
    })
}

export function requestGetWindowMetrics({
  id,
  tableName,
  recordId,
  contextAttributes,
  filters
}) {
  return request({
    url: `/dashboarding/dashboards/windows/metrics/${id}/${tableName}/${recordId}`,
    method: 'get',
    params: {
      //  DSL Query
      context_attributes: contextAttributes,
      filters
    }
  })
    .then(response => {
      return camelizeObjectKeys(response)
    })
}
