/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 * Contributor(s):  Yamel Senih ysenih@erpya.com
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

// List Point of sales
export function saveCommandShortcut({
  posId,
  command,
  shortcut
}) {
  return request({
    url: `point-of-sales/terminals/${posId}/shortcuts`,
    method: 'post',
    data: {
      command,
      shortcut
    }
  })
    .then(posResponse => {
      return camelizeObjectKeys(posResponse)
    })
}

export function listCommandShortcut({
  posId,
  searchValue
}) {
  return request({
    url: `point-of-sales/terminals/${posId}/shortcuts`,
    method: 'get',
    params: {
      search_value: searchValue
    }
  })
    .then(posResponse => {
      return camelizeObjectKeys(posResponse)
    })
}

export function deleteCommandShortcut({
  posId,
  id,
  uuid
}) {
  return request({
    url: `point-of-sales/terminals/${posId}/shortcuts/${id}`,
    method: 'delete',
    params: {
      id,
      uuid
    }
  })
    .then(posResponse => {
      return posResponse
    })
}
