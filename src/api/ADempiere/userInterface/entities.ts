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
import { RECORD_ROWS_BY_LIST } from '@/utils/ADempiere/references.js'
// import { isEmptyValue } from '@/utils/ADempiere'
/**
 * Request Entities
 * @param {string} uuid universally unique identifier
 * @param {number} id, identifier
 */
export function requestGetEntities({
  id,
  tabId,
  filters,
  pageToken,
  searchValue,
  contextAttributes,
  pageSize = RECORD_ROWS_BY_LIST
}) {
  const tab_id = tabId
  return request({
    url: `/user-interface/entities/${tab_id}`,
    method: 'get',
    params: {
      filters,
      search_value: searchValue,
      context_attributes: contextAttributes,
      page_token: pageToken,
      page_size: pageSize
    }
  })
    .then(response => {
      // const { convertEntityList } = require('@/utils/ADempiere/apiConverts/persistence.js')
      return {
        nextPageToken: response.next_page_token,
        recordCount: response.record_count,
        records: response.records
      }
    })
}