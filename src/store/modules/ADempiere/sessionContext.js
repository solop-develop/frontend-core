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

import Vue from 'vue'

// constants
import { CLIENT, COUNTRY, ORGANIZATION } from '@/utils/ADempiere/constants/systemColumns.js'
import { ACCOUNTING_CONTEXT_PREFIX, GLOBAL_CONTEXT_PREFIX } from '@/utils/ADempiere/contextUtils'

// utils and helper methods
import { isEmptyValue, getTypeOfValue } from '@/utils/ADempiere/valueUtils.js'

const sessionContext = {
  state: {
    preference: {}
  },
  mutations: {
    /**
     * Set context in state
     * @param {string} payload.parentUuid
     * @param {string} payload.containerUuid
     * @param {string} payload.columnName
     * @param {mixed} payload.value
     */
    setPreferenceContext(state, payload) {
      let key = ''
      if (payload.parentUuid) {
        key += payload.parentUuid + '|'

        // set context for window
        const keyParent = key + payload.columnName
        Vue.set(state.preference, keyParent, payload.value)
      }
      if (payload.containerUuid) {
        key += payload.containerUuid + '|'
      }
      key += payload.columnName
      // set property to object
      Vue.set(state.preference, key, payload.value)
    },
    setInitialContext(state, objectContext) {
      Object.keys(objectContext).forEach(key => {
        Vue.set(state.preference, key, objectContext[key])
      })
    },
    setMultiplePreference(state, preferenceToSet) {
      if (!isEmptyValue(state.preference)) {
        // join and overwrite old values
        preferenceToSet = {
          ...state.preference,
          ...preferenceToSet
        }
      }

      state.preference = preferenceToSet
    },
    dictionaryResetCacheContext(state) {
      state.preference = {}
    }
  },
  actions: {
    setPreferenceContext({ commit }, objectValue) {
      commit('setPreferenceContext', objectValue)
    },
    setMultiplePreference({ dispatch }, {
      parentUuid,
      containerUuid,
      values
    }) {
      const typeOfValue = getTypeOfValue(values)

      let actionToDispatch = 'setMultiplePreferenceObject'
      if (typeOfValue === 'MAP') {
        actionToDispatch = 'setMultiplePreferenceMap'
      } else if (typeOfValue === 'ARRAY') {
        actionToDispatch = 'setMultiplePreferenceArray'
      }

      return dispatch(actionToDispatch, {
        parentUuid,
        containerUuid,
        values
      })
    },
    setMultiplePreferenceArray({ commit }, {
      parentUuid,
      containerUuid,
      values
    }) {
      return new Promise(resolve => {
        values.forEach(element => {
          commit('setPreferenceContext', {
            parentUuid,
            containerUuid,
            columnName: element.key,
            value: element.value
          })
        })

        resolve()
      })
    },
    setMultiplePreferenceObject({ commit }, {
      parentUuid,
      containerUuid,
      values
    }) {
      return new Promise(resolve => {
        if (!isEmptyValue(containerUuid) || !isEmptyValue(parentUuid)) {
          Object.keys(values).forEach(key => {
            commit('setPreferenceContext', {
              parentUuid,
              containerUuid,
              columnName: key,
              value: values[key]
            })
          })
        } else {
          commit('setMultiplePreference', values)
        }

        resolve()
      })
    },
    setMultiplePreferenceMap({ commit }, {
      parentUuid,
      containerUuid,
      values
    }) {
      return new Promise(resolve => {
        if (!isEmptyValue(containerUuid) || !isEmptyValue(parentUuid)) {
          values.forEach((value, key) => {
            commit('setPreferenceContext', {
              parentUuid,
              containerUuid,
              columnName: key,
              value
            })
          })
        } else {
          commit('setMultiplePreference', Object.fromEntries(values))
        }
        resolve()
      })
    }
  },
  getters: {
    getAllSessionContext: (state) => {
      return state.preference
    },
    getGlobalContext: (state) => {
      const globalContext = {}
      Object.keys(state.preference).forEach(key => {
        if (key.startsWith(GLOBAL_CONTEXT_PREFIX)) {
          globalContext[key] = state.preference[key]
        }
      })
      return globalContext
    },
    getAccountingContext: (state) => {
      const accountingContext = {}
      Object.keys(state.preference).forEach(key => {
        if (key.startsWith(ACCOUNTING_CONTEXT_PREFIX)) {
          accountingContext[key] = state.preference[key]
        }
      })
      return accountingContext
    },
    /**
     * @param  {string} parentUuid
     * @param  {string} containerUuid
     * @param  {string} columnName
     */
    getSessionContext: (state) => ({
      parentUuid,
      containerUuid,
      columnName
    }) => {
      let key = ''
      let value

      if (parentUuid) {
        key += parentUuid + '|'

        // context for window
        const keyParent = key + columnName
        value = state.preference[keyParent]
        if (!isEmptyValue(value)) {
          return value
        }
      }

      if (containerUuid) {
        key += containerUuid + '|'
      }
      key += columnName
      value = state.preference[key]
      if (!isEmptyValue(value)) {
        return value
      }

      value = state.preference[columnName]
      return value
    },
    getSessionContextCountrytId: (state) => {
      return parseInt(state.preference[GLOBAL_CONTEXT_PREFIX + COUNTRY], 10)
    },
    getSessionContextClientId: (state) => {
      return parseInt(state.preference[GLOBAL_CONTEXT_PREFIX + CLIENT], 10)
    },
    getSessionContextOrgtId: (state) => {
      return parseInt(state.preference[GLOBAL_CONTEXT_PREFIX + ORGANIZATION], 10)
    }
  }
}

export default sessionContext
