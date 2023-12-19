/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 * Contributor(s): Elsio Sanchez elsiosanchez15@outlook.com https://github.com/ElsioSanchez
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
import { config } from '@/utils/ADempiere/config'

/**
 * Apply customization to window
 * @param {number} tabId
 * @param {number} levelType
 * @param {number} levelValue
 * @param {array}
 * @returns
 */
export function requestListAccoutingElements({
  sortBy,
  filters,
  pageSize,
  pageToken,
  searchValue,
  groupColumns,
  selectColumns,
  contextAttributes,
  accoutingSchemaId
}) {
  return request({
    url: `${config.generalGedger.accounts}/schemas/${accoutingSchemaId}/elements`,
    method: 'get',
    params: {
      filters,
      sort_by: sortBy,
      page_size: pageSize,
      page_token: pageToken,
      search_value: searchValue,
      group_columns: groupColumns,
      select_columns: selectColumns,
      context_attributes: contextAttributes
    }
  })
}
