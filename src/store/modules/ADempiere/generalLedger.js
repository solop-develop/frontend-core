/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 * Contributor(s): Elsio Sanchez elsiosanchez15@outlook.com https://github.com/ElsioSanchez
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
import { requestListAccoutingElements } from '@/api/ADempiere/generalLedger'

// Utils and Helpers Methods
import { showMessage } from '@/utils/ADempiere/notification'
import { isEmptyValue } from '@/utils/ADempiere'

const initStateGeneralLedger = {
  fileList: [],
  attributes: {},
  filters: {},
  isLoadeTables: false
}

export default {
  state: initStateGeneralLedger,

  mutations: {
    setFieldsListAccount(state, fieldsListAccount) {
      state.fileList = fieldsListAccount
    },
    setFieldsValue(state, {
      columnName,
      value
    }) {
      if (isEmptyValue(columnName)) return
      const currentField = state.fileList.find(field => field.column_name === columnName)
      const index = state.fileList.findIndex(field => field.column_name === columnName)
      if (isEmptyValue(currentField)) return
      state.fileList[index].fieldValue = value
    },
    setAttributes(state, {
      columnName,
      value
    }) {
      state.attributes[columnName] = value
    },
    setFiltersAccount(state, filters) {
      state.filters = filters
    },
    cleanAccountData(state) {
      state.fileList = []
      state.attributes = {}
      state.filters = {}
    },
    setIsLoadeTables(state, isLoadeTables) {
      state.isLoadeTables = isLoadeTables
    }
  },

  actions: {
    listAccoutingElementsFromServer({ commit, getters }) {
      return new Promise(resolve => {
        const sessionContext = getters.getAllSessionContext
        if (isEmptyValue(sessionContext)) {
          return resolve()
        }
        const isShowAcct = sessionContext['#ShowAcct']
        if (!isShowAcct) {
          return resolve()
        }
        const accoutingSchemaId = sessionContext['$C_AcctSchema_ID']
        if (isEmptyValue(accoutingSchemaId)) {
          return resolve()
        }
        const accoutingElements = getters.getFieldsListAccount
        if (!isEmptyValue(accoutingElements)) {
          return resolve()
        }
        requestListAccoutingElements({
          accoutingSchemaId: accoutingSchemaId
        })
          .then(response => {
            const { accouting_elements } = response
            let fieldsListAccount = []
            if (!isEmptyValue(accouting_elements)) {
              fieldsListAccount = accouting_elements.map(list => {
                return {
                  ...list,
                  value: ''
                }
              })
            }

            commit('setFieldsListAccount', fieldsListAccount)
            resolve(fieldsListAccount)
          })
          .catch(error => {
            console.warn(`List Accouting Elements: ${error.message}. Code: ${error.code}.`)
            let message = error.message
            if (!isEmptyValue(error.response) && !isEmptyValue(error.response.data.message)) {
              message = error.response.data.message
            }

            showMessage({
              type: 'error',
              message,
              showClose: true
            })
            return resolve()
          })
          .finally(() => {
            resolve()
          })
      })
    },
    changeAttributes({ commit, state }, {
      columnName,
      value
    }) {
      // if (columnName === 'AD_Org_ID') return
      if (isEmptyValue(value)) {
        delete state.attributes[columnName]
        return
      }
      commit('setAttributes', {
        columnName,
        value
      })
    },
    changeIsloaded({ commit }, value) {
      commit('setIsLoadeTables', value)
    }
  },

  getters: {
    getFieldsListAccount: (state) => {
      return state.fileList
    },
    getFieldsValue: (state) => (columnName) => {
      if (isEmptyValue(columnName)) return ''
      const currentField = state.fileList.find(field => field.column_name === columnName)
      if (isEmptyValue(currentField)) return ''
      return currentField.fieldValue
    },
    getAttributeValueAccount: (state) => {
      return state.attributes
    },
    getFiltersAccount: (state) => {
      return state.filters
    },
    getIsLoadeTables: (state) => {
      return state.isLoadeTables
    }
  }
}
