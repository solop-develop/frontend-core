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

// API Request Methods
import { requestListResources } from '@/api/ADempiere/file-management/resource-reference.ts'
// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

const initStateAttachment = {
  attachment: {},
  resourceReference: '',
  listAttachment: [],
  isLoaded: false
}

const attachment = {
  state: initStateAttachment,

  mutations: {
    setAttachment(state, payload) {
      state.attachment = payload
    },
    setListAttachment(state, payload) {
      state.listAttachment = payload
    },
    setResourceReference(state, payload) {
      state.resourceReference = payload
    },
    setIsLoadListAttachment(state, loading) {
      state.isLoaded = loading
    }
  },

  actions: {
    getAttachmentFromServer({ commit, getters }, {
      recordId,
      tableName,
      clientId,
      containerId,
      containerType
    }) {
      // if (isEmptyValue(tableName) && (isEmptyValue(recordId))) {
      //   return
      // }
      const { client } = getters['user/getRole']
      if (isEmptyValue(clientId)) {
        clientId = getters.getSessionContextClientId
      }
      commit('setIsLoadListAttachment', true)
      return requestListResources({
        recordId,
        tableName,
        clientId: client.uuid,
        containerId,
        containerType
      })
        .then(response => {
          commit('setIsLoadListAttachment', false)
          const resourceReferencesList = response.parent_folder
          const listAttachment = response.resources.map(list => {
            const fullName = list.name
            const fileName = list.name.replace(response.parent_folder + '/', '')
            return {
              ...list,
              fullName,
              name: fileName,
              file_name: fileName
            }
          })

          commit('setListAttachment', listAttachment)
          commit('setAttachment', {
            ...response,
            tableName,
            recordId
          })
          const currentResource = getters.getResourceReference
          if (!isEmptyValue(currentResource)) {
            const isExistst = resourceReferencesList.some(resourceReference => {
              return resourceReference.id === currentResource.id
            })
            if (!isExistst) {
              // clear current selected
              commit('setResourceReference', {})
            }
          }
          return response
        })
        .catch(error => {
          commit('setIsLoadListAttachment', false)
          console.warn(`Error getting List Record Logs: ${error.message}. Code: ${error.code}.`)
        })
    }
  },

  getters: {
    getAttachment: (state) => {
      return state.attachment
    },
    getResourceReference: (state) => {
      return state.resourceReference
    },
    getListAttachment: (state) => {
      return state.listAttachment
    },
    getIsLoadListAttachment: (state) => {
      return state.isLoaded
    }
  }
}

export default attachment
