/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
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
  requestListCharsets,
  requestImportFormatsList,
  requestListImportTables,
  requestListImportProcesses,
  saveRecordImport,
  requestListFilePreview
} from '@/api/ADempiere/form/VFileImport.js'

// Utils and Helper Methods
import { setIconsTableName } from '@/utils/ADempiere/valueUtils'
import { showMessage } from '@/utils/ADempiere/notification'

const VFileImport = {
  tableName: null,
  importTablesList: [],

  importFormatId: -1,
  importFormatsList: [],
  charsetsList: [],
  attribute: {
    charsets: 'UTF-8',
    importFormatId: '',
    isProcess: false,
    formatFields: [],
    processDefinition: {},
    currentStep: 1
  },
  options: {
    listCharsets: [],
    listImportFormats: [],
    listTables: [],
    listProcess: []
  },
  file: {
    data: [],
    header: [],
    resource: {},
    isLoading: false
  },
  infoFormat: {},
  navigationLine: {}
}

export default {
  state: VFileImport,

  mutations: {
    setTableName(state, tableName) {
      state.tableName = tableName
    },
    setImportTablesList(state, list = []) {
      state.importTablesList = list
    },
    setCharsetsList(state, list = []) {
      state.charsetsList = list
    },
    setImportFromatsList(state, list = []) {
      state.importFormatsList = list
    },
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
      state.navigationLine = line
    }
  },

  actions: {

    getCharsetsListFromServer({ commit }, searchValue = null) {
      return new Promise(resolve => {
        requestListCharsets({
          searchValue
        })
          .then(response => {
            const { records: charsetsList } = response
            // const importTablesList = records.map(list => {
            //   const { DisplayColumn, ValueColumn } = list.values
            //   return {
            //     value: ValueColumn,
            //     label: DisplayColumn
            //   }
            // })

            commit('setCharsetsList', charsetsList)
            resolve(charsetsList)
          })
          .catch(error => {
            console.warn(`Error getting Charsets List: ${error.message}. Code: ${error.code}.`)
          })
      })
    },

    getImportFormatsListFromServer({ commit }, {
      tableName
    }) {
      return new Promise(resolve => {
        requestImportFormatsList({
          tableName
        })
          .then(response => {
            const { records } = response
            commit('setImportFromatsList', records)
            // commit('setInfoFormat', response)
            resolve(response)
          })
          .catch(error => {
            console.warn(`Error getting Import Formats: ${error.message}. Code: ${error.code}.`)
            resolve([])
          })
      })
    },

    getImportTablesListFromServer({ commit }) {
      return new Promise(resolve => {
        requestListImportTables()
          .then(response => {
            const { records } = response
            const importTablesList = records.map(tableImport => {
              return {
                ...tableImport,
                icon: setIconsTableName({
                  tableName: tableImport.table_name
                })
              }
            })

            commit('setImportTablesList', importTablesList)
            resolve(importTablesList)
          })
          .catch(error => {
            console.warn(`Error getting Import Table: ${error.message}. Code: ${error.code}.`)
          })
      })
    },

    getProcessesListFromServer({ commit }, tableName) {
      return new Promise(resolve => {
        requestListImportProcesses({
          tableName
        })
          .then(response => {
            const { records } = response
            const list = records.map(list => {
              return {
                ...list,
                ...list.values
              }
            })
            commit('updateAttributeVFileImport', {
              attribute: 'options',
              criteria: 'listProcess',
              value: list
            })
            resolve(response)
          })
          .catch(error => {
            console.warn(`Error getting List Process Import: ${error.message}. Code: ${error.code}.`)
            resolve([])
          })
      })
    },
    saveRecords({ getters }) {
      return new Promise(resolve => {
        const {
          charsets,
          isProcess,
          importFormats,
          processDefinition
        } = getters.getAttribute
        const { id } = getters.getFile
        const { containerUuid, fieldsList } = processDefinition
        const parametersList = getters.getProcessParameters({
          containerUuid,
          fieldsList
        })
        saveRecordImport({
          id,
          isProcess,
          parameters: parametersList,
          processId: processDefinition.id,
          charset: charsets,
          importFormatId: importFormats
        })
          .then(response => {
            const { message } = response
            showMessage({
              type: 'success',
              message: message
            })
            resolve(true)
          })
          .catch(error => {
            showMessage({
              type: 'error',
              message: error.message
            })
            resolve(true)
          })
      })
    },
    listFilePreview({ commit, getters }, resource) {
      return new Promise(resolve => {
        const {
          charsets,
          importFormats
        } = getters.getAttribute
        const { resource } = getters.getFile
        commit('updateAttributeVFileImport', {
          attribute: 'file',
          criteria: 'isLoading',
          value: true
        })
        requestListFilePreview({
          resourceId: resource.id,
          charset: charsets,
          importFormatId: importFormats
        })
          .then(response => {
            const { records } = response
            const attributesList = records.map(list => list.attributes)
            const dataTable = attributesList.map(list => {
              const dataLine = {}
              list.forEach(element => {
                dataLine[element.key] = element.value
              })
              return dataLine
            })
            commit('updateAttributeVFileImport', {
              attribute: 'file',
              criteria: 'data',
              value: dataTable
            })
            commit('updateAttributeVFileImport', {
              attribute: 'file',
              criteria: 'header',
              value: attributesList[0]
            })
            commit('updateAttributeVFileImport', {
              attribute: 'file',
              criteria: 'isLoading',
              value: false
            })
            resolve(dataTable)
          })
          .catch(error => {
            showMessage({
              type: 'error',
              message: error.message
            })
            commit('updateAttributeVFileImport', {
              attribute: 'file',
              criteria: 'isLoading',
              value: false
            })
            resolve([])
          })
      })
    }
  },

  getters: {
    getStoredCurrentTableName(state) {
      return state.tableName
    },
    getStoredImportTablesList(state) {
      return state.importTablesList || []
    },

    getStoredCharsetsList(state) {
      return state.charsetsList || []
    },

    getStoredImportFormatsList(state) {
      return state.importFormatsList || []
    },

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
