// ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
// Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
// Contributor(s): Edwin Betancourt EdwinBetanc0urt@outlook.com www.erpya.com
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import Vue from 'vue'

// api request methods
import { requestLookupList } from '@/api/ADempiere/window.js'

// utils and helper methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import { getContextAttributes, generateContextKey } from '@/utils/ADempiere/contextUtils.js'

const initStateLookup = {
  lookupItem: {},
  lookupList: {}
}

const lookupManager = {

  state: initStateLookup,

  mutations: {
    setLookupList(state, {
      clientId,
      key,
      searchValue,
      contextAttributesList,
      optionsList
    }) {
      Vue.set(state.lookupList, key, {
        clientId,
        key,
        searchValue,
        contextAttributesList,
        optionsList
      })
    },

    deleteLookupList(state, {
      key
    }) {
      Vue.set(state.lookupList, key, undefined)
    },

    resetStateLookup(state) {
      state = initStateLookup
    }
  },

  actions: {

    /**
     * Get display column from lookup
     * @param {string} parentUuid
     * @param {string} containerUuid
     * @param {string} tableName
     * @param {string} directQuery
     * @param {string|number} value identifier or key
     * @param {boolean} isAddBlankValue add blanck value option in fist element on list
     * @param {string|number} blankValue value to add in empty option ("", -1, null, undefined)
     */
    getLookupListFromServer({ commit, rootGetters }, {
      isAddBlankValue = false,
      blankValue,
      parentUuid,
      containerUuid,
      contextColumnNames = [],
      fieldUuid,
      processParameterUuid,
      browseFieldUuid,
      id,
      //
      referenceUuid,
      searchValue,
      //
      tableName,
      columnName,
      columnUuid
    }) {
      return new Promise(resolve => {
        if (isEmptyValue(fieldUuid) && isEmptyValue(processParameterUuid) && isEmptyValue(browseFieldUuid)) {
          resolve([])
          return
        }

        const contextAttributesList = getContextAttributes({
          parentUuid,
          containerUuid,
          contextColumnNames,
          isBooleanToString: true
        })

        requestLookupList({
          contextAttributesList,
          fieldUuid,
          processParameterUuid,
          browseFieldUuid,
          id,
          //
          referenceUuid,
          searchValue,
          //
          tableName,
          columnName,
          columnUuid
        })
          .then(lookupListResponse => {
            const optionsList = []

            lookupListResponse.recordsList.forEach(itemLookup => {
              const {
                KeyColumn: value,
                DisplayColumn: displayedValue
              } = itemLookup.values

              if (!isEmptyValue(value)) {
                optionsList.push({
                  displayedValue,
                  value,
                  uuid: itemLookup.uuid
                })
              }
            })

            // add blanck value option in fist element on list
            if (isAddBlankValue) {
              optionsList.unshift({
                displayedValue: ' ',
                value: blankValue,
                uuid: undefined
              })
            }

            const clientId = rootGetters.getSessionContextClientId

            let key = clientId
            if (!isEmptyValue(fieldUuid)) {
              key += `|${fieldUuid}`
            } else if (!isEmptyValue(processParameterUuid)) {
              key += `|${processParameterUuid}`
            } else if (!isEmptyValue(browseFieldUuid)) {
              key += `|${browseFieldUuid}`
            }

            const contextKey = generateContextKey(contextAttributesList)
            key += contextKey

            commit('setLookupList', {
              clientId,
              parentUuid, // used by suscription filter
              containerUuid, // used by suscription filter
              contextAttributesList,
              optionsList,
              searchValue,
              key
            })

            resolve(optionsList)
          })
          .catch(error => {
            console.warn(`Get Lookup List, Select Base - Error ${error.code}: ${error.message}.`)
          })
      })
    },

    deleteLookup({ commit, dispatch, rootGetters }, {
      parentUuid,
      containerUuid,
      uuid,
      contextColumnNames = [],
      value
    }) {
      return new Promise(resolve => {
        dispatch('deleteDefaultValue', {
          parentUuid,
          containerUuid,
          uuid,
          contextColumnNames,
          value
        })

        const clientId = rootGetters.getSessionContextClientId

        const contextAttributesList = getContextAttributes({
          parentUuid,
          containerUuid,
          contextColumnNames,
          isBooleanToString: true
        })

        const contextKey = generateContextKey(contextAttributesList)

        let keyList = clientId
        if (!isEmptyValue(uuid)) {
          keyList += `|${uuid}`
        }

        keyList += contextKey

        commit('deleteLookupList', {
          key: keyList
        })

        resolve()
      })
    }
  },

  getters: {
    getStoredLookup: (state, getters, rootState, rootGetters) => ({
      parentUuid,
      containerUuid,
      contextColumnNames = [],
      contextAttributesList = [],
      uuid
    }) => {
      let key = rootGetters.getSessionContextClientId
      if (!isEmptyValue(uuid)) {
        key += `|${uuid}`
      }

      if (isEmptyValue(contextAttributesList) && !isEmptyValue(contextColumnNames)) {
        contextAttributesList = getContextAttributes({
          parentUuid,
          containerUuid,
          contextColumnNames,
          isBooleanToString: true
        })
      }
      const contextKey = generateContextKey(contextAttributesList)
      key += contextKey

      const lookupList = state.lookupList[key]
      if (lookupList) {
        return lookupList
      }
      return {}
    },

    getStoredSearchValueLookup: (state, getters) => ({
      parentUuid,
      containerUuid,
      contextColumnNames = [],
      contextAttributesList = [],
      uuid
    }) => {
      const lookup = getters.getStoredLookup({
        parentUuid,
        containerUuid,
        contextColumnNames,
        contextAttributesList,
        uuid
      })

      if (lookup) {
        return lookup.searchValue
      }
      return ''
    },

    getStoredLookupList: (state, getters, rootState, rootGetters) => ({
      parentUuid,
      containerUuid,
      contextColumnNames = [],
      contextAttributesList = [],
      uuid
    }) => {
      const lookupList = getters.getStoredLookup({
        parentUuid,
        containerUuid,
        contextColumnNames,
        contextAttributesList,
        uuid
      })
      if (!isEmptyValue(lookupList)) {
        return lookupList.optionsList
      }
      return []
    },

    /**
     * Get all lookups, item and list joined
     */
    getStoredLookupAll: (state, getters, rootState, rootGetters) => ({
      parentUuid,
      containerUuid,
      contextColumnNames,
      contextColumnNamesByDefaultValue = [],
      uuid
    }) => {
      const contextAttributesList = getContextAttributes({
        parentUuid,
        containerUuid,
        contextColumnNames,
        isBooleanToString: true
      })

      const optionsList = getters.getStoredLookupList({
        parentUuid,
        containerUuid,
        uuid,
        contextColumnNames,
        contextAttributesList
      })

      // get of stored default value
      if (isEmptyValue(optionsList)) {
        const contextAttributesListByDefaultValue = getContextAttributes({
          parentUuid,
          containerUuid,
          contextColumnNames: contextColumnNamesByDefaultValue,
          isBooleanToString: true
        })
        const option = rootGetters.getStoredDefaultValue({
          parentUuid,
          containerUuid,
          contextColumnNames,
          contextAttributesList: contextAttributesListByDefaultValue,
          uuid
        })

        // add a item option
        if (!isEmptyValue(option)) {
          optionsList.push(option)
        }
      }

      return optionsList
    }
  }
}

export default lookupManager
