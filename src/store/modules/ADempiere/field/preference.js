/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 * Contributor(s): Ricardo Fenomeno ricardofenomeno13@gmail.com https://github.com/ricargame
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

import {
  requestGetPreference,
  requestSetPreference,
  requestDeletePreference
} from '@/api/ADempiere/fields/preference'
import { isEmptyValue } from '@/utils/ADempiere'

const initState = {
  listPreference: {}
}

const Preferences = {
  state: initState,

  mutations: {
    setPreference(state, preference) {
      state.listPreference = preference
    }
  },

  actions: {
    searchPreference({ commit }, {
      type,
      columnName,
      containerId
    }) {
      return new Promise(resolve => {
        requestGetPreference({
          type,
          columnName,
          containerId
        })
          .then(preference => {
            commit('setPreference', preference)
            resolve(preference)
          })
      })
    },
    savePreference({ commit }, {
      type,
      columnName,
      containerId,
      value
    }) {
      return new Promise(resolve => {
        let newValue = value
        if (typeof value !== 'string') {
          newValue = value.toString()
        }
        requestSetPreference({
          type,
          columnName,
          containerId,
          value: newValue
        })
          .then(response => {
            if (!isEmptyValue(response)) {
              commit('setPreference', response)
            }
            resolve(response)
          })
      })
    },
    deletePreference({ commit }, {
      type,
      columnName,
      containerId
    }) {
      return new Promise(resolve => {
        requestDeletePreference({
          type,
          columnName,
          containerId
        })
          .then(response => {
            resolve(response)
          })
      })
    }
  },

  getters: {
    getPreference: (state) => {
      return state.listPreference
    },
    getValuePreference: (state) => {
      return state.listPreference.value
    }
  }
}

export default Preferences
