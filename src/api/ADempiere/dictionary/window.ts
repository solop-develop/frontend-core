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

/**
 * Request dictionary Window metadata
 * @param {number} id, identifier
 * @param {string} language
 */
export function requestWindowMetadata({
  id: uuid,
  language,
  dictionaryCode
}) {
  return request({
    url: `/dictionary/windows/${uuid}`,
    method: 'get',
    params: {
      language,
      dictionary_code: dictionaryCode
    }
  })
}

/**
 * Request Get Tabs
 * @param {number} id
 */
export function requestTabMetadata({
  id: uuid,
  windowId,
  language,
  dictionaryCode
}) {
  return request({
    url: `/dictionary/windows/${windowId}/tabs/${uuid}`,
    method: 'get',
    params: {
      language,
      dictionary_code: dictionaryCode
    }
  })
}
