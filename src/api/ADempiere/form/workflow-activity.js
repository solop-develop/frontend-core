/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 * Contributor(s): Elsio Sanchez elsiosanchez@gmail.com https://github.com/elsiosanchez
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

// Get Instance for connectionimport {
import { request } from '@/utils/ADempiere/request'

// List Activity
export function listActivity({
  formUuid
}) {
  return request({
    url: '/form/addons/activitys',
    method: 'get',
    params: {
      form_uuid: formUuid
    }
  })
    .then(listActivityResponse => {
      return listActivityResponse
    })
}

// Send Activity
export function sendActivity({
  formUuid,
  activity,
  message,
  forward
}) {
  return request({
    url: '/form/addons/send-activity',
    method: 'post',
    data: {
      form_uuid: formUuid,
      activity,
      message,
      forward
    }
  })
    .then(listActivityResponse => {
      return listActivityResponse
    })
}
