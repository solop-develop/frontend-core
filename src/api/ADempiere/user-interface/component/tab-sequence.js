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
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

// Get Instance for connection
import { request } from '@/utils/ADempiere/request'

/**
 * Save tab sequences changes
 * @param {string} tabUuid
 * @param {array} contextAttributesList
 * @param {number} pageSize
 * @param {string} pageToken
 * @returns {promise}
 */
export function requestListTabSequences({
  tabUuid,
  // dsl query
  contextAttributesList,
  // Page Data
  pageSize = 999,
  pageToken
}) {
  return request({
    url: '/user-interface/component/tab-sequence/list-tab-sequences',
    method: 'post',
    params: {
      //
      page_size: pageSize,
      page_token: pageToken
    },
    data: {
      tab_uuid: tabUuid,
      context_attributes: contextAttributesList
    }
  })
    .then(response => {
      const { convertEntityList } = require('@/utils/ADempiere/apiConverts/persistence.js')
      return convertEntityList(response)
    })
}

/**
 * Save tab sequences changes
 * @param {string} tabUuid
 * @param {array} contextAttributesList
 * @param {array} entitiesList
 * @returns {promise}
 */
export function requestSaveTabSequences({
  tabUuid,
  // dsl query
  contextAttributesList,
  entitiesList
}) {
  return request({
    url: '/user-interface/component/tab-sequence/save-tab-sequences',
    method: 'post',
    data: {
      tab_uuid: tabUuid,
      context_attributes: contextAttributesList,
      entities_list: entitiesList
    }
  })
    .then(response => {
      const { convertEntityList } = require('@/utils/ADempiere/apiConverts/persistence.js')
      return convertEntityList(response)
    })
}
