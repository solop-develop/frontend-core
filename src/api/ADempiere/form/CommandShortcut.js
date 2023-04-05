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
import { config } from '@/utils/ADempiere/config'
import { camelizeObjectKeys } from '@/utils/ADempiere/transformObject.js'

// List Point of sales
export function saveCommandShortcut({
  posUuid,
  command,
  shortcut
}) {
  return request({
    url: `${config.pointOfSales.endpoint}/command-shortcut`,
    method: 'post',
    data: {
      pos_uuid: posUuid,
      command,
      shortcut
    }
  })
    .then(posResponse => {
      return camelizeObjectKeys(posResponse)
    })
}

export function listCommandShortcut({
  posUuid,
  searchValue
}) {
  return request({
    url: `${config.pointOfSales.endpoint}/command-shortcut`,
    method: 'get',
    params: {
      pos_uuid: posUuid,
      search_value: searchValue
    }
  })
    .then(posResponse => {
      return camelizeObjectKeys(posResponse)
    })
}

export function deleteCommandShortcut({
  posUuid,
  id,
  uuid
}) {
  return request({
    url: `${config.pointOfSales.endpoint}/command-shortcut`,
    method: 'delete',
    params: {
      pos_uuid: posUuid,
      id,
      uuid
    }
  })
    .then(posResponse => {
      return posResponse
    })
}
