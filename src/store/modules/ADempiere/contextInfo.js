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
import { requestGetContextInfoValue } from '@/api/ADempiere/window'

const initState = {
  contextInfo: []
}

const contextInfo = {
  state: initState,

  mutations: {
    setContextInfoField(state, payload) {
      state.contextInfo.push(payload)
    },
    resetStateContextInfo(state) {
      state = initState
    }
  },

  actions: {
    getContextInfoValueFromServer({ commit, getters }, {
      id,
      uuid,
      query
    }) {
      const contextInforField = getters.getContextInfoField(uuid, query)
      if (contextInforField) {
        return contextInforField
      }
      return requestGetContextInfoValue({
        id,
        uuid,
        query
      })
        .then(contextInfoResponse => {
          commit('setContextInfoField', {
            uuid,
            id,
            query,
            ...contextInfoResponse
          })
          return contextInfoResponse
        })
        .catch(error => {
          console.warn(`Error ${error.code} getting context info value for field ${error.message}.`)
        })
    }
  },

  getters: {
    getContextInfo: (state) => {
      return state.contextInfo
    },
    getContextInfoField: (state) => (uuid, query) => {
      return state.contextInfo.find(info => {
        if ((info.uuid === uuid) && (info.query === query)) {
          return info
        }
      })
    }
  }
}

export default contextInfo
