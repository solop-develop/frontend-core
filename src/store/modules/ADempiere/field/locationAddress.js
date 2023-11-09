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

import Vue from 'vue'

// API Request Methods
import { requestGetCountryDefinition } from '@/api/ADempiere/common/index.ts'

// Utils and Helpers Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'

const initState = {
  countries: {},
  isShowedLocation: false,
  fieldsListLocation: [],
  fieldsListLocationAddress: {},
  fieldsListLocationShipping: [],
  fieldsListLocationBilling: []
}

const locationAddress = {
  state: initState,

  mutations: {
    setCountryDefinition(state, country) {
      Vue.set(state.countries, country.id, country)
    },
    setShowedLocation(state, isShowed) {
      state.isShowedLocation = isShowed
    },
    setFieldsListLocationAddress(state, { containerUuid, fieldsList }) {
      Vue.set(state.fieldsListLocationAddress, containerUuid, fieldsList)
    },
    setFieldsListLocation(state, fieldsListLocation) {
      state.fieldsListLocation = fieldsListLocation
    },
    setFieldsListLocationShipping(state, fieldsListLocationShipping) {
      state.fieldsListLocationShipping = fieldsListLocationShipping
    },
    setFieldsListLocationBilling(state, fieldsListLocationBilling) {
      state.fieldsListLocationBilling = fieldsListLocationBilling
    },
    resetStateLocation(state) {
      state = initState
    }
  },

  actions: {
    getCountryDefinition({ commit, getters, rootGetters }, {
      id,
      uuid
    }) {
      return new Promise(resolve => {
        if (isEmptyValue(uuid) && isEmptyValue(id)) {
          // get session country client
          id = rootGetters.getSessionContextCountrytId
        }
        const storedCountry = getters.getStoredCountryFromId({ id })
        if (!isEmptyValue(storedCountry)) {
          return resolve(storedCountry)
        }

        requestGetCountryDefinition({
          id,
          uuid
        })
          .then(responseCountry => {
            commit('setCountryDefinition', responseCountry)

            resolve(responseCountry)
          })
          .catch(error => {
            console.warn(`Error getting Country Definition: ${error.message}. Code: ${error.code}.`)
          })
      })
    },
    changeSequence({ commit }, params) {
      commit('setFieldsListLocation', params)
    },
    changeSequenceShipping({ commit }, params) {
      commit('setFieldsListLocationShipping', params)
    },
    changeSequenceBilling({ commit }, params) {
      commit('setFieldsListLocationBilling', params)
    }
  },

  getters: {
    getStoredCountryFromId: state => ({ id }) => {
      return state.countries[id]
    },
    getIsShowedLocation: (state) => {
      return state.isShowedLocation
    },
    getFieldLocation: (state) => {
      return state.fieldsListLocation
    },
    getFieldLocationAddress: (state) => ({ containerUuid }) => {
      return state.fieldsListLocationAddress[containerUuid] || []
    },
    getFieldsListLocationShipping: (state) => {
      return state.fieldsListLocationShipping
    },
    getFieldsListLocationBilling: (state) => {
      return state.fieldsListLocationBilling
    }
  }
}

export default locationAddress
