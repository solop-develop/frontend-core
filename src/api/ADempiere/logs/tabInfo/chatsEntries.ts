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

// Constants
import { ROWS_OF_RECORDS_BY_PAGE } from '@/utils/ADempiere/tableUtils'

/**
 * Is Chats Entries
 */
export function requestExistsChatsEntries({
  recordId,
  tableName
}) {
  return request({
    url: `logs/chat-entries/${tableName}/${recordId}/exists`,
    method: 'get'
  })
}

export function requestListEntityChats({
  recordId,
  tableName,
  pageToken,
  pageSize = ROWS_OF_RECORDS_BY_PAGE
}) {
  return request({
    url: `logs/chat-entities/${tableName}/${recordId}`,
    method: 'get',
    params: {
      page_token: pageToken,
      page_sise: pageSize
    }
  })
}

/**
 * Add Chat Entry
 * @param {string} tableName
 * @param {string} recordId
 * @param {string} recordUuid
 * @param {string} comment
 */
export function requestCreateChatEntry({
  tableName,
  recordId,
  comment
}) {
  return request({
    url: `/user-interface/chat-entry/${tableName}`,
    method: 'post',
    data: {
      id: recordId,
      comment: comment
    }
  })
    .then(chatEntryResponse => {
      const { convertChatEntry } = require('@/utils/ADempiere/apiConverts/window.js')

      return convertChatEntry(chatEntryResponse)
    })
}

/**
 * Record Chat List
 * @param {string} uuid
 * @param {string} pageToken
 * @param {string} pageSize
 */
export function requestListChatsEntries({
  id,
  // tableName,
  pageToken,
  pageSize = 100
}) {
  return request({
    url: `/logs/chat-entities/${id}`,
    method: 'get',
    params: {
      // Page Data
      page_token: pageToken,
      page_size: pageSize
    }
  })
    .then(chatEntriesListResponse => {
      const { convertChatEntry } = require('@/utils/ADempiere/apiConverts/window.js')

      return {
        nextPageToken: chatEntriesListResponse.next_page_token,
        recordCount: chatEntriesListResponse.record_count,
        chatEntriesList: chatEntriesListResponse.records.map(chatEntry => {
          return convertChatEntry(chatEntry)
        })
      }
    })
}
