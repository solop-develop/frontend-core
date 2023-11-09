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
 * Conversion Rate
 */
export function lisDashboardsRequest({
  pageToken,
  pageSize = ROWS_OF_RECORDS_BY_PAGE
}) {
  return request({
    url: '/dashboard/dashboards',
    method: 'get',
    params: {
      // Page Data
      page_token: pageToken,
      page_size: pageSize
    }
  })
    .then(responseDashboard => {
      return {
        nextPageToken: responseDashboard.next_page_token,
        recordCount: responseDashboard.record_count,
        dashboardsList: responseDashboard.dashboards.map(list => {
          return camelizeObjectKeys(list)
        })
      }
    })
}

/**
 * Get Metrics for Charts
 */
export function getMetricRequest({
  id
}) {
  return request({
    url: `/dashboard/metrics/${id}`,
    method: 'get'
  })
    .then(chart => {
      return camelizeObjectKeys(chart)
    })
}

/**
 * Request Favorites List
 */
export function getFavoritesRequest({
  pageToken,
  pageSize
}) {
  return request({
    url: '/dashboard/favorites',
    method: 'get',
    params: {
      // Page Data
      page_token: pageToken,
      page_size: pageSize
    }
  })
    .then(favoritesListReponse => {
      const { convertFavorite } = require('@/utils/ADempiere/apiConverts/dashboard.js')

      return {
        recordCount: favoritesListReponse.record_count,
        favoritesList: favoritesListReponse.favorites.map(favorite => {
          return convertFavorite(favorite)
        }),
        nextPageToken: favoritesListReponse.next_page_token
      }
    })
}

/**
 * Get pending documents
 */
export function getPendingDocumentsRequest({
  pageToken,
  pageSize = ROWS_OF_RECORDS_BY_PAGE
}) {
  return request({
    url: '/dashboard/pending-documents',
    method: 'get',
    params: {
      // Page Data
      page_token: pageToken,
      page_size: pageSize
    }
  })
    .then(pendingDocumentsListResponse => {
      const { convertPendingDocument } = require('@/utils/ADempiere/apiConverts/dashboard.js')

      return {
        recordCount: pendingDocumentsListResponse.record_count,
        pendingDocumentsList: pendingDocumentsListResponse.pending_documents.map(pendingDocument => {
          return convertPendingDocument(pendingDocument)
        }),
        nextPageToken: pendingDocumentsListResponse.next_page_token
      }
    })
}

/**
 * GetNotifications
 */
export function listNotifiicationsRequest() {
  return request({
    url: '/dashboard/notifications',
    method: 'get'
  })
    .then(notificationsResponse => {
      return notificationsResponse
    })
}
