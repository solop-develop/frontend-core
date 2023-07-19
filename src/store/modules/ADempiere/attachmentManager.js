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

// api request methods
import { requestAttachment } from '@/api/ADempiere/user-interface/component/resource'

// utils and helper methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

const initStateAttachment = {
  listAttachment: [],
  isLoaded: false
}

const attachment = {
  state: initStateAttachment,

  mutations: {
    setListAttachment(state, payload) {
      state.listAttachment = payload
    },
    setIsLoadListAttachment(state, loading) {
      state.isLoaded = loading
    }
  },

  actions: {
    findAttachment({ commit }, {
      tableName,
      recordId,
      recordUuid
    }) {
      const pageSize = 0
      const pageToken = 0
      if (isEmptyValue(tableName) && (isEmptyValue(recordId) || isEmptyValue(recordUuid))) {
        return
      }
      commit('setIsLoadListAttachment', true)
      return requestAttachment({
        tableName,
        recordId,
        recordUuid,
        pageSize,
        pageToken
      })
        .then(response => {
          commit('setIsLoadListAttachment', false)
          const resourceReferencesList = response.resourceReferencesList.map(element => {
            return {
              ...element
              // url: getSource({
              //   resourceUuid: element.uuid,
              //   resourceName: element.file_name,
              //   resourceType: element.content_type
              // })
            }
          })
          commit('setListAttachment', resourceReferencesList)

          return response
        })
        .catch(error => {
          commit('setIsLoadListAttachment', false)
          console.warn(`Error getting List Record Logs: ${error.message}. Code: ${error.code}.`)
        })
    }
  },

  getters: {
    getListAttachment: (state) => {
      return state.listAttachment
    },
    getIsLoadListAttachment: (state) => {
      return state.isLoaded
    }
  }
}

export default attachment
