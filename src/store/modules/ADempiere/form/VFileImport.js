/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 * Contributor(s): Elsio Sanchez elsiosanchez15@outlook.com https://github.com/elsiosanchez
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
  getImportFormats,
  getListImportTables
} from '@/api/ADempiere/form/VFileImport.js'

// Utils and Helper Methods
// import { isEmptyValue } from '@/utils/ADempiere'

const VFileImport = {
  attribute: {
    charsets: '',
    importFormats: '',
    tablaId: 0,
    isProcess: false,
    formatFields: []
  },
  options: {
    listCharsets: [],
    listImportFormats: [],
    listTables: []
  },
  file: {
    data: [],
    header: []
  },
  infoFormat: {},
  navigationLine: {}
}

export default {
  state: VFileImport,
  mutations: {
    /**
     * Update Attribute
     * Generic mutation that allows to change the state of the store
     * @param {string} attribute - Attribute and which one to update - Requires it to be an Object
     * @param {string} criteria - Object Criteria
     * @param {string} value - Value to Update
     */
    updateAttributeVFileImport(state, {
      attribute,
      criteria,
      value
    }) {
      state[attribute][criteria] = value
    },
    setFile(state, file) {
      state.file = file
    },
    setInfoFormat(state, formats) {
      state.infoFormat = formats
    },
    setNavigationLine(state, line) {
      console.log({ line })
      state.navigationLine = line
    }
  },
  actions: {
    importFormats({ commit }, {
      id
    }) {
      return new Promise(resolve => {
        getImportFormats({
          id
        })
          .then(response => {
            commit('updateAttributeVFileImport', {
              attribute: 'attribute',
              criteria: 'formatFields',
              value: response.formatFields
            })
            commit('setInfoFormat', response)
            resolve(response)
          })
          .catch(error => {
            console.warn(`Error getting Import Formats: ${error.message}. Code: ${error.code}.`)
            resolve([])
          })
      })
    },
    findListTable({ commit }) {
      getListImportTables()
        .then(response => {
          const { records } = response
          commit('updateAttributeVFileImport', {
            attribute: 'options',
            criteria: 'listTables',
            value: records
          })
        })
        .catch(error => {
          console.warn(`Error getting Import Table: ${error.message}. Code: ${error.code}.`)
          commit('updateAttributeVFileImport', {
            attribute: 'options',
            criteria: 'listTables',
            value: []
          })
        })
    },
    changeTable({ commit }, {
      id
    }) {
      commit('updateAttributeVFileImport', {
        attribute: 'attribute',
        criteria: 'tablaId',
        value: id
      })
    }
  },
  getters: {
    getAttribute(state) {
      return state.attribute
    },
    getOptions(state) {
      return state.options
    },
    getFile(state) {
      return state.file
    },
    getInfoFormat(state) {
      return state.infoFormat
    },
    getNavigationLine(state) {
      return state.navigationLine
    }
  }
}
