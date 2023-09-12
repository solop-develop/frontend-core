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

import { isEmptyValue } from '@/utils/ADempiere'
import { request } from '@/utils/ADempiere/request'
import { camelizeObjectKeys } from '@/utils/ADempiere/transformObject.js'

export function services() {
  return request({
    url: '/user/open-id/services',
    method: 'get'
  })
    .then(response => {
      if (isEmptyValue(response)) {
        return []
      }
      return response.map(list => camelizeObjectKeys(list))
    })
    .catch(error => {
      console.info(error)
    })
}

export function loginAuthentication({
  code,
  state
}) {
  return request({
    url: '/user/open-id/login',
    method: 'post',
    data: {
      code,
      state
    }
  })
    .then(response => {
      return response
    })
}
