/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
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

// Get Instance for connection
import { request } from '@/utils/ADempiere/request'

/**
 * Run callout request
 * @param {Number}  tabId
 * @param {string}  tableName
 * @param {string}  columnName
 * @param {mixed}   value
 * @param {mixed}   oldValue
 * @param {string}  callout
 * @param {array}   attributesList
 * @returns {Map} Entity
 */
export function runCallOutRequest({
  tabId,
  tableName,
  contextAttributesList = [],
  columnName,
  callout,
  value,
  oldValue
}) {
  return request({
    url: `/user-interface/run-callout/${tabId}/${columnName}/${callout}`,
    method: 'post',
    data: {
      // window_uuid: windowUuid,
      // window_no: windowNo,
      tab_id: tabId,
      table_name: tableName,
      context_attributes: contextAttributesList,
      column_name: columnName,
      callout,
      value,
      old_value: oldValue
    }
  })
}
