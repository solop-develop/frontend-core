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
import { DEFAULT_COLUMNS_PER_ROW } from '@/utils/ADempiere/componentUtils'

// API Request Methods
import { requestFieldMetadata } from '@/api/ADempiere/dictionary/field.ts'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere'

const initStateLookup = {
  isShowFieldOption: false,
  referenceList: [],
  fieldsList: [],
  validationRuleList: [],
  defaultSizeField: {},
  isShowNewSequence: false
}

const field = {
  state: initStateLookup,

  mutations: {
    addField(state, payload) {
      state.fieldsList.push(payload)
    },
    addReference(state, payload) {
      state.referenceList.push(payload)
    },
    addValidationRule(state, payload) {
      state.validationRuleList.push(payload)
    },
    resetStateLookup(state) {
      state = initStateLookup
    },
    setSizeField(state, {
      parentUuid,
      containerUuid,
      sizeField = DEFAULT_COLUMNS_PER_ROW
    }) {
      const defaultSizeField = {
        parentUuid,
        containerUuid,
        sizeField
      }
      Vue.set(state.defaultSizeField, containerUuid, defaultSizeField)
    },
    sizeField(state, size) {
      state.defaultSizeField = size
    },
    setShowFieldOption(state, isShowed = false) {
      state.isShowFieldOption = isShowed
    },
    setShowNewSequence(state, isShowed = false) {
      state.isShowNewSequence = isShowed
    }
  },

  actions: {
    // Get Reference from Server based on criteria
    getFieldFromServer({ commit }, {
      id,
      columnId,
      elementId,
      tableName,
      columnName,
      elementColumnName
    }) {
      return requestFieldMetadata({
        id,
        columnId,
        elementId,
        // TableName + ColumnName
        tableName,
        columnName,
        elementColumnName
      })
        .then(fieldResponse => {
          if (columnId) {
            fieldResponse.columnId = columnId
          } else if (elementId) {
            fieldResponse.elementId = elementId
          } else if (elementColumnName) {
            fieldResponse.elementColumnName = elementColumnName
          } else if (tableName && columnName) {
            fieldResponse.tableName = tableName
            fieldResponse.columnName = columnName
          }

          commit('addField', fieldResponse)

          return fieldResponse
        })
        .catch(error => {
          console.warn(`Get Field - Error ${error.code}: ${error.message}.`)
        })
    },
    /**
     * Change the columns of the panel
     * @param {string} parentUuid
     * @param {string} containerUuid
     * @param {number} sizeField
     */
    changeSizeField({ commit }, {
      parentUuid,
      containerUuid,
      sizeField
    }) {
      commit('setSizeField', {
        parentUuid,
        containerUuid,
        sizeField
      })
    }
  },

  getters: {
    getFieldFromId: (state) => (id) => {
      return state.fieldsList.find(fieldItem => {
        return fieldItem.id === id
      })
    },
    getFieldFromColumnId: (state) => (columnId) => {
      return state.fieldsList.find(fieldItem => {
        return fieldItem.columnId === columnId
      })
    },
    getFieldFromElementId: (state) => (elementId) => {
      return state.fieldsList.find(fieldItem => {
        return fieldItem.elementId === elementId
      })
    },
    getFieldFromElementColumnName: (state) => (elementColumnName) => {
      return state.fieldsList.find(fieldItem => {
        return fieldItem.elementName === elementColumnName
      })
    },
    getFieldFromTableNameAndColumnName: (state) => ({
      tableName,
      columnName
    }) => {
      return state.fieldsList.find(fieldItem => {
        return fieldItem.tableName === tableName &&
          fieldItem.columnName === columnName
      })
    },
    getSizeColumn: (state, getters) => ({ containerUuid }) => {
      if (!isEmptyValue(state.defaultSizeField[containerUuid])) {
        return state.defaultSizeField[containerUuid].sizeField || DEFAULT_COLUMNS_PER_ROW
      }
      return DEFAULT_COLUMNS_PER_ROW
    },
    getIsShowFieldOption(state) {
      return state.isShowFieldOption
    },
    getShowNewSequence(state) {
      return state.isShowNewSequence
    }
  }
}

export default field
