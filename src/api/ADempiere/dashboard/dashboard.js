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

// This file is for get all information for dashboard of ADempiere client,
// please if you want to implement a custom dashboard create a new fielwith api definition

// Get Instance for connection
import { request } from '@/utils/ADempiere/request'

// Constants
import { ROWS_OF_RECORDS_BY_PAGE } from '@/utils/ADempiere/tableUtils'

// List all dashboard for role
export function requestLisDashboards({
  roleId,
  roleUuid,
  pageToken,
  pageSize = ROWS_OF_RECORDS_BY_PAGE
}) {
  return request({
    url: '/dashboard/dashboards',
    method: 'get',
    params: {
      role_id: roleId,
      role_uuid: roleUuid,
      // Page Data
      page_token: pageToken,
      page_size: pageSize
    }
  })
    .then(dashboardsListResponse => {
      const { convertDashboard } = require('@/utils/ADempiere/apiConverts/dashboard.js')

      return {
        recordCount: dashboardsListResponse.record_count,
        dashboardsList: dashboardsListResponse.records.map(dashboard => {
          return convertDashboard(dashboard)
        }),
        nextPageToken: dashboardsListResponse.next_page_token
      }
    })
}

export function listNotifiications() {
  return request({
    url: '/dashboard/list-notifications',
    method: 'get'
  })
    .then(notificationsResponse => {
      return notificationsResponse
    })
}
