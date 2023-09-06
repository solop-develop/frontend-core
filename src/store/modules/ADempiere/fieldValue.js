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

// Constants
import {
  ACTIVE, PROCESSING, PROCESSED, UUID, ID
} from '@/utils/ADempiere/constants/systemColumns'
import {
  DISPLAY_COLUMN_PREFIX, UNIVERSALLY_UNIQUE_IDENTIFIER_COLUMN_SUFFIX
} from '@/utils/ADempiere/dictionaryUtils'

// Utils and Helpers Methods
import { convertObjectToKeyValue } from '@/utils/ADempiere/formatValue/iterableFormat'
import { isEmptyValue, getTypeOfValue } from '@/utils/ADempiere/valueUtils.js'
import { convertStringToBoolean } from '@/utils/ADempiere/formatValue/booleanFormat.js'

const value = {
  state: {
    field: {}
  },

  mutations: {
    resetStatevalue(state) {
      state = {
        field: {}
      }
    },

    /**
     * Set value into column names
     * @param {string}  parentUuid
     * @param {string}  containerUuid
     * @param {string}  columnName
     * @param {mixed}   value
     * @param {boolean} isOverWriteParent // overwite parent context values
     */
    updateValueOfField(state, {
      parentUuid,
      containerUuid,
      columnName,
      value,
      isOverWriteParent = true
    }) {
      // Only Parent
      if (parentUuid) {
        const keyParent = parentUuid + '_' + columnName
        if (isOverWriteParent) {
          Vue.set(state.field, keyParent, value)
        } else {
          if (!isEmptyValue(value)) {
            // tab child no replace parent context with empty
            Vue.set(state.field, keyParent, value)
          }
        }
      }

      // Only Container
      if (containerUuid) {
        const keyContainer = containerUuid + '_' + columnName
        Vue.set(state.field, keyContainer, value)
      }
    },

    /**
     * Set values into container column names
     * @param {string}  parentUuid
     * @param {string}  containerUuid
     * @param {string}  columnName
     * @param {mixed}   value
     * @param {boolean} isOverWriteParent // overwite parent context values
     */
    updateValuesOfContainer(state, {
      parentUuid,
      containerUuid,
      attributes = [],
      isOverWriteParent = false
    }) {
      if (getTypeOfValue(attributes) === 'OBJECT') {
        attributes = convertObjectToKeyValue({
          object: attributes
        })
      }

      attributes.forEach(attribute => {
        const { value, columnName } = attribute

        // Only Parent
        if (parentUuid) {
          const keyParent = parentUuid + '_' + columnName
          if (isOverWriteParent) {
            Vue.set(state.field, keyParent, value)
          } else {
            const parentValue = state.field[keyParent]
            // const parentValue = state[keyParent]
            if (isEmptyValue(parentValue) && !isEmptyValue(value)) {
              // tab child no replace parent context with empty
              Vue.set(state.field, keyParent, value)
            }
            // if ((isIdentifierEmpty({ columnName, value: parentValue }))) {
            //   Vue.set(state.field, keyParent, value)
            // }
          }
        }

        // Only Container
        if (containerUuid) {
          const keyContainer = containerUuid + '_' + columnName
          Vue.set(state.field, keyContainer, value)
        }
      })
    }
  },

  actions: {
    updateValuesOfContainer({ commit }, {
      parentUuid,
      containerUuid,
      isOverWriteParent,
      attributes = []
    }) {
      commit('updateValuesOfContainer', {
        parentUuid,
        containerUuid,
        isOverWriteParent,
        attributes
      })
    },

    clearValuesOnParent({ commit, getters }, {
      parentUuid,
      isOverWriteParent = false
    }) {
      return new Promise(resolve => {
        const attributesList = getters.getValuesView({
          parentUuid
        }).map(attribute => {
          const { columnName } = attribute
          return {
            columnName,
            value: undefined
          }
        })

        commit('updateValuesOfContainer', {
          parentUuid,
          attributes: attributesList,
          isOverWriteParent
        })
        resolve()
      })
    },

    clearValuesOnContainer({ commit, getters }, {
      containerUuid,
      isOverWriteParent = false
    }) {
      return new Promise(resolve => {
        const attributesList = getters.getValuesView({
          containerUuid
        }).map(attribute => {
          const { columnName } = attribute
          return {
            columnName,
            value: undefined
          }
        })

        commit('updateValuesOfContainer', {
          containerUuid,
          attributes: attributesList,
          isOverWriteParent
        })
        resolve()
      })
    }
  },

  getters: {
    getValueOfField: (state, getters) => ({
      parentUuid,
      containerUuid,
      columnName
    }) => {
      let value
      if (isEmptyValue(columnName)) {
        return value
      }
      if (containerUuid) {
        // get in tab level
        value = getters.getValueOfFieldOnContainer({
          containerUuid,
          columnName
        })
        if (!isEmptyValue(value)) {
          return value
        }
      }

      if (parentUuid) {
        // get in window level
        value = getters.getValueOfFieldOnParent({
          parentUuid,
          columnName
        })
      }

      return value
    },

    getValueOfFieldOnContainer: (state) => ({
      containerUuid,
      columnName
    }) => {
      let key = ''
      if (containerUuid) {
        // get in tab level
        key += containerUuid + '_'
      }
      key += columnName

      const value = state.field[key]

      return value
    },

    getValueOfFieldOnParent: (state) => ({
      parentUuid,
      columnName
    }) => {
      let key = ''
      if (parentUuid) {
        // get in window level
        key = parentUuid + '_'
      }
      key += columnName

      const value = state.field[key]

      return value
    },

    /**
     * Get values and column's name as key (without parent uuid or container
     * uuid), from a view (container)
     * @param {string} parentUuid
     * @param {string} containerUuid
     * @param {string} format array|object|pairs|map
     * @returns {object|array}
     */
    getValuesView: (state) => ({
      parentUuid,
      containerUuid,
      isOnlyColumns = false,
      isOnlyWithValue = false,
      format = 'array'
    }) => {
      // generate context with parent uuid or container uuid associated
      const contextAllContainers = {}
      Object.keys(state.field).forEach(key => {
        if (key.includes(parentUuid) || key.includes(containerUuid)) {
          contextAllContainers[key] = state.field[key]
        }
      })

      // generate context only columnName
      const objectValues = {}
      const pairsValues = []
      const mapValues = new Map()
      Object.keys(contextAllContainers).map(key => {
        const value = contextAllContainers[key]
        if (isOnlyWithValue && isEmptyValue(value)) {
          return
        }

        key = key
          .replace(`${parentUuid}_`, '')
          .replace(`${containerUuid}_`, '')
        // TODO: Verify if overwrite key with empty value
        const columnName = key
        if (isOnlyColumns) {
          if (
            columnName.startsWith(DISPLAY_COLUMN_PREFIX) ||
            columnName.endsWith(UNIVERSALLY_UNIQUE_IDENTIFIER_COLUMN_SUFFIX)
          ) {
            return
          }
        }

        // set container context (smart browser, process/report, form)
        objectValues[columnName] = value
        pairsValues.push([key, value])
        mapValues.set(key, value)
        return {
          columnName,
          value
        }
      })

      if (format === 'array') {
        // not to duplicate the value
        return convertObjectToKeyValue({
          object: objectValues
        })
      }
      if (format === 'pairs') {
        return pairsValues
      }
      if (format === 'map') {
        return mapValues
      }
      return objectValues
    },

    /**
     * Get values and column's name as key (without parent uuid or container
     * uuid), from a view (container)
     * @param {string} parentUuid
     * @param {string} containerUuid
     * @returns {object|array}
     */
    getValuesViewType: (state) => ({
      parentUuid,
      containerUuid
    }) => {
      // generate context with parent uuid or container uuid associated
      const contextAllContainers = {}
      Object.keys(state.field).forEach(key => {
        if (key.includes(parentUuid) || key.includes(containerUuid)) {
          contextAllContainers[key] = state.field[key]
        }
      })

      // generate context only columnName
      const hashMap = new Map()
      Object.keys(contextAllContainers).forEach(key => {
        const value = contextAllContainers[key]
        const columnName = key
          .replace(`${parentUuid}_`, '')
          .replace(`${containerUuid}_`, '')

        // set container context (smart browser, process/report, form)
        const type = getTypeOfValue(value)
        hashMap.set(columnName, [
          columnName, type, value
        ])
      })
      // const pairsValues = hashMap.values()

      return hashMap
    },

    getUuidOfContainer: (state) => (containerUuid) => {
      return state.field[`${containerUuid}_${UUID}`]
    },

    getIdOfContainer: (state) => ({ containerUuid, tableName }) => {
      return state.field[`${containerUuid}_${tableName}_${ID}`]
    },

    // Using to read only in data tables in Window
    getContainerIsActive: (state) => (parentUuid) => {
      const valueIsActive = state.field[`${parentUuid}_${ACTIVE}`]

      return convertStringToBoolean(valueIsActive)
    },
    getContainerProcessing: (state) => (parentUuid) => {
      const valueProcessing = state.field[`${parentUuid}_${PROCESSING}`]

      return convertStringToBoolean(valueProcessing)
    },
    getContainerProcessed: (state) => (parentUuid) => {
      const valueProcessed = state.field[`${parentUuid}_${PROCESSED}`]

      return convertStringToBoolean(valueProcessed)
    }
  }
}

export default value
