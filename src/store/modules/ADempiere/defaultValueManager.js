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

// API Request Methods
import { requestDefaultValue } from '@/api/ADempiere/userInterface/defaultValue.ts'

// Constants
import {
  DISPLAY_COLUMN_PREFIX, UNIVERSALLY_UNIQUE_IDENTIFIER_COLUMN_SUFFIX
} from '@/utils/ADempiere/dictionaryUtils'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import { isSameSize } from '@/utils/ADempiere/formatValue/iterableFormat'
import { generateContextKey, getContextAttributes } from '@/utils/ADempiere/contextUtils/contextAttributes'

const initState = {
  inRequest: new Map(),
  storedDefaultValue: {}
}

const defaultValueManager = {
  state: initState,

  mutations: {
    setDefaultValue(state, { key, clientId, contextAttributesList, uuid, displayedValue, value }) {
      Vue.set(state.storedDefaultValue, key, {
        clientId,
        contextAttributesList,
        uuid,
        displayedValue,
        value
      })
    },

    deleteDefaultValue(state, {
      key
    }) {
      Vue.set(state.storedDefaultValue, key, undefined)
    },

    resetStateDefaultValue(state) {
      state = initState
    }
  },

  actions: {
    /**
     * @param {string} parentUuid
     * @param {string} containerUuid
     * @param {string} columnName
     * @param {array} contextColumnNames
     * @param {string} fieldUuid|processParameterUuid|columnUuid|browseFieldUuid
     * @param {mixed} value overwrite default value on dictionary definition
     */
    getDefaultValueFromServer({ state, commit, rootGetters }, {
      parentUuid,
      containerUuid,
      contextColumnNames,
      //
      id,
      uuid,
      fieldUuid,
      browseFieldId,
      processParameterId,
      processParameterUuid,
      browseFieldUuid,
      columnUuid,
      columnName,
      value
    }) {
      const defaultEmptyResponse = {
        uuid: undefined,
        displayedValue: undefined,
        value: undefined
      }
      return new Promise(resolve => {
        if (isEmptyValue(id) && isEmptyValue(uuid) && isEmptyValue(processParameterId) && isEmptyValue(browseFieldId)) {
          resolve(defaultEmptyResponse)
          return
        }

        let contextAttributesList = getContextAttributes({
          parentUuid,
          containerUuid,
          contextColumnNames,
          isBooleanToString: true,
          format: 'object'
        })

        // fill context value to continue
        if (!isSameSize(contextColumnNames, Object.values(contextAttributesList))) {
          resolve(defaultEmptyResponse)
          return
        }

        // const isWithoutValues = contextAttributesList.find(attribute => isEmptyValue(attribute.value))
        // if (isWithoutValues) {
        //   console.warn(`Default value without response, fill the ${isWithoutValues.columnName} field.`)
        //   resolve(defaultEmptyResponse)
        //   return
        // }

        const clientId = rootGetters.getSessionContextClientId

        let key = clientId
        // TODO: generate with your fieldUuid, processParameterUuid, browseFieldUuid
        // if (!isEmptyValue(uuid)) {
        //   key += `|${uuid}`
        // }
        if (!isEmptyValue(fieldUuid)) {
          key += `|${fieldUuid}`
        } else if (!isEmptyValue(processParameterUuid)) {
          key += `|${processParameterUuid}`
        } else if (!isEmptyValue(browseFieldUuid)) {
          key += `|${browseFieldUuid}`
        }

        const contextKey = generateContextKey(contextAttributesList)
        key += contextKey
        key += `|${value}`

        // if it is the same request, it is not made
        if (state.inRequest.get(key)) {
          resolve(defaultEmptyResponse)
          return
        }
        state.inRequest.set(key, true)

        let contextAttributes
        if (!isEmptyValue(contextAttributesList)) {
          contextAttributesList = JSON.stringify(contextAttributesList)
        }

        requestDefaultValue({
          contextAttributes,
          id,
          fieldUuid,
          browseFieldId,
          processParameterId,
          processParameterUuid,
          browseFieldUuid,
          columnUuid,
          value
        })
          .then(valueResponse => {
            const { values } = valueResponse
            // const values = {
            //   KeyColumn: undefined,
            //   DisplayColumn: undefined,
            //   UUID: undefined
            // }

            // do not use the convertArrayKeyValueToObject method to avoid losing a key with an empty value
            // if (valueResponse.attributes.length === 1) {
            //   // number values (Line for example)
            //   values.KeyColumn = valueResponse.attributes.at(0).value
            // } else {
            //   valueResponse.attributes.forEach(attribute => {
            //     const { key: column, value: attributeValue } = attribute
            //     values[column] = attributeValue
            //   })
            // }

            const valueOfServer = values.KeyColumn
            const displayedValue = values.DisplayColumn

            commit('setDefaultValue', {
              key,
              clientId,
              contextAttributesList,
              id,
              displayedValue,
              // set value of server to parsed if is number as string "101" -> 101
              value: valueOfServer,
              uuid: values.UUID
            })

            commit('updateValueOfField', {
              parentUuid,
              containerUuid,
              columnName,
              value: valueOfServer
            })
            if (!isEmptyValue(values.DisplayColumn)) {
              commit('updateValueOfField', {
                parentUuid,
                containerUuid,
                columnName: DISPLAY_COLUMN_PREFIX + columnName,
                value: displayedValue
              })
            }
            if (!isEmptyValue(values.UUID)) {
              commit('updateValueOfField', {
                parentUuid,
                containerUuid,
                columnName: columnName + UNIVERSALLY_UNIQUE_IDENTIFIER_COLUMN_SUFFIX,
                value: values.UUID
              })
            }

            resolve({
              displayedValue,
              value: valueOfServer,
              uuid: values.UUID
            })
          })
          .catch(error => {
            // clear default value if error
            commit('updateValueOfField', {
              parentUuid,
              containerUuid,
              columnName,
              value: undefined
            })
            commit('updateValueOfField', {
              parentUuid,
              containerUuid,
              columnName: DISPLAY_COLUMN_PREFIX + columnName,
              value: undefined
            })
            commit('updateValueOfField', {
              parentUuid,
              containerUuid,
              columnName: columnName + UNIVERSALLY_UNIQUE_IDENTIFIER_COLUMN_SUFFIX,
              value: undefined
            })
            console.warn(`Error getting default value (${columnName}) from server. Error code ${error.code}: ${error.message}.`)
          })
          .finally(() => {
            // current request finalized
            state.inRequest.set(key, false)
          })
      })
    },

    deleteDefaultValue({ commit, rootGetters }, {
      parentUuid,
      containerUuid,
      uuid,
      contextColumnNames = [],
      value
    }) {
      return new Promise(resolve => {
        const clientId = rootGetters.getSessionContextClientId
        let key = `${clientId}|${uuid}`

        const contextAttributesList = getContextAttributes({
          parentUuid,
          containerUuid,
          contextColumnNames,
          isBooleanToString: true
        })

        const contextKey = generateContextKey(contextAttributesList)

        key += contextKey
        key += `|${value}`

        commit('deleteDefaultValue', {
          key
        })

        resolve()
      })
    }
  },

  getters: {
    getStoredDefaultValue: (state, getters, rootState, rootGetters) => ({
      parentUuid,
      containerUuid,
      contextColumnNames = [],
      contextAttributesList = [],
      value,
      uuid
    }) => {
      if (isEmptyValue(contextAttributesList) && !isEmptyValue(contextColumnNames)) {
        contextAttributesList = getContextAttributes({
          parentUuid,
          containerUuid,
          contextColumnNames,
          isBooleanToString: true
        })
      }

      const clientId = rootGetters.getSessionContextClientId
      let key = `${clientId}|${uuid}`
      const contextKey = generateContextKey(contextAttributesList)
      key += contextKey
      key += `|${value}`

      const values = state.storedDefaultValue[key]

      return values
    }
  }
}

export default defaultValueManager
