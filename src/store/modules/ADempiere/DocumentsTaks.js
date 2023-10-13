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
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

// API Request Methods
import {
  getPendingDocumentsRequest
} from '@/api/ADempiere/dashboard/index.ts'

// Utils and Helper Methods
import { showMessage } from '@/utils/ADempiere/notification'

const initStateChatEntries = {
  listTaks: []
}

export default {
  state: initStateChatEntries,
  mutations: {
    setListTaks(state, list) {
      state.listTaks = list
    }
  },
  actions: {
    listPendingDocuments({ commit, getters }) {
      return new Promise(resolve => {
        getPendingDocumentsRequest({})
          .then((response) => {
            const { pendingDocumentsList } = response
            const listTaks = pendingDocumentsList.map(documentItem => {
              return {
                ...documentItem,
                name: documentItem.documentName,
                description: documentItem.documentDescription
              }
            })
            commit('setListTaks', listTaks)
            resolve(listTaks)
          })
          .catch(error => {
            console.warn(`Error in Add New Note: ${error.message}. Code: ${error.code}.`)
            showMessage({
              type: 'error',
              message: error.message
            })
            resolve([])
          })
      })
    }
  },
  getters: {
    getListTaks: (state) => {
      return state.listTaks
    }
  }
}
