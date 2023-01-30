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

// Utils and Helper Methods
import { camelizeObjectKeys } from '@/utils/ADempiere/transformObject.js'

// Constants
import { ROWS_OF_RECORDS_BY_PAGE } from '@/utils/ADempiere/tableUtils'

// Get Metrics for Charts
export function getMetrics({
  id,
  uuid,
  pageToken,
  pageSize = ROWS_OF_RECORDS_BY_PAGE
}) {
  return request({
    url: '/dashboard/addons/charts/metrics',
    method: 'get',
    params: {
      id,
      uuid,
      // Page Data
      page_token: pageToken,
      page_size: pageSize
    }
  })
    .then(chart => {
      return camelizeObjectKeys(chart)
    })
}
