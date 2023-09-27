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

// API Request Methods
import {
  requestListAccoutingSchemas,
  requestPostingTypesList,
  requestListOrganizations,
  requestAccountingFacts
} from '@/api/ADempiere/form/accouting.js'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { formatDate } from '@/utils/ADempiere/formatValue/dateFormat'
import { formatQuantity } from '@/utils/ADempiere/formatValue/numberFormat'

const initState = {
  currentAccoutingSchemaId: -1,
  accountingShemasList: [],
  currentPostingTypeValue: '',
  postingTypesList: [],
  currentAccoutingOrganizationId: ' ',
  accountingOrganizationsList: [],
  isLoadingAccoutingRecords: false,
  accoutingRecordsList: [],
  // user interface
  isDisplayDocumentInfo: false,
  isDisplaySourceInfo: false,
  isDisplayQuantity: false
}

const acctViewer = {
  state: initState,

  mutations: {
    setAccountSchemaId(state, id) {
      state.currentAccoutingSchemaId = id
    },
    setAccountSchemasList(state, records = []) {
      state.accountingShemasList = records
    },
    setPostingTypeValue(state, value) {
      state.currentPostingTypeValue = value
    },
    setPostingTypesList(state, records = []) {
      state.postingTypesList = records
    },
    setAccountingOrganizationId(state, id) {
      state.currentAccoutingOrganizationId = id
    },
    setAccountingOrganizationsList(state, records = []) {
      state.accountingOrganizationsList = records
    },
    setIsLoadingAccoutingRecords(state, isLoading = false) {
      state.isLoadingAccoutingRecords = isLoading
    },
    setAccoutingRecordsList(state, records = []) {
      state.accoutingRecordsList = records
    },
    setIsDisplayDocumentInfo(state, isShow = false) {
      state.isDisplayDocumentInfo = isShow
    },
    setIsDisplaySourceInfo(state, isShow = false) {
      state.isDisplaySourceInfo = isShow
    },
    setIsDisplayQuantity(state, isShow = false) {
      state.isDisplayQuantity = isShow
    }
  },

  actions: {
    getAccoutingSchemasFromServer({ commit }, {
      searchValue
    }) {
      return new Promise(resolve => {
        requestListAccoutingSchemas({
          searchValue
        })
          .then(response => {
            const { records } = response
            // let list = records
            const recordsList = records.map(row => {
              const { KeyColumn, UUID, DisplayColumn } = row.values
              return {
                UUID,
                KeyColumn,
                DisplayColumn
              }
            })

            commit('setAccountSchemasList', recordsList)
            resolve(recordsList)
          })
      })
    },

    getPostingTypesFromServer({ commit }, {
      searchValue
    }) {
      return new Promise(resolve => {
        requestPostingTypesList({
          searchValue
        })
          .then(response => {
            const { records } = response
            // let list = records
            const recordsList = records.map(row => {
              const { KeyColumn, UUID, DisplayColumn } = row.values
              return {
                UUID,
                KeyColumn,
                DisplayColumn
              }
            })

            commit('setPostingTypesList', recordsList)
            resolve(recordsList)
          })
      })
    },

    getAccoutingOrganizationsFromServer({ commit }, {
      searchValue
    }) {
      return new Promise(resolve => {
        requestListOrganizations({
          searchValue
        })
          .then(response => {
            const { records } = response
            // let list = records
            const recordsList = records.map(row => {
              const { KeyColumn, UUID, DisplayColumn } = row.values
              return {
                UUID,
                KeyColumn,
                DisplayColumn
              }
            })

            commit('setAccountingOrganizationsList', recordsList)
            resolve(recordsList)
          })
      })
    },

    getAccoutingFactsFromServer({ commit, getters }, {
      searchValue,
      tableName,
      recordUuid,
      recordId
    }) {
      const accoutingSchemaId = getters.getCurrentStoredAccoutingSchemaId
      if (isEmptyValue(accoutingSchemaId)) {
        return
      }
      return new Promise(resolve => {
        commit('setIsLoadingAccoutingRecords', true)

        requestAccountingFacts({
          accoutingSchemaId,
          postingType: getters.getCurrentStoredPostingTypeValue,
          tableName,
          recordId,
          recordUuid,
          searchValue,
          filters: []
        })
          .then(response => {
            const recordsList = response.recordsList.map(row => {
              const { id, uuid, tableName, attributes } = row

              let rate = attributes.AmtSourceDr + attributes.AmtSourceCr
              if (rate !== 0) {
                rate = (attributes.AmtAcctDr + attributes.AmtAcctCr) / (attributes.AmtSourceDr + attributes.AmtSourceCr)
              }
              return {
                ...attributes,
                AmtAcctDr: formatQuantity({
                  value: attributes.AmtAcctDr
                }),
                AmtAcctCr: formatQuantity({
                  value: attributes.AmtAcctCr
                }),
                DateAcct: formatDate({
                  value: attributes.DateAcct
                }),
                DateTrx: formatDate({
                  value: attributes.DateTrx
                }),
                Qty: formatQuantity({
                  value: attributes.Qty
                }),
                Rate: formatQuantity({
                  value: rate
                }),
                id,
                uuid,
                tableName
              }
            })

            commit('setAccoutingRecordsList', recordsList)
            resolve(recordsList)
          })
          .finally(() => {
            commit('setIsLoadingAccoutingRecords', false)
          })
      })
    }
  },

  getters: {
    getCurrentStoredAccoutingSchemaId: (state) => {
      return state.currentAccoutingSchemaId
    },
    getStoredAccoutingShemasList: (state) => {
      return state.accountingShemasList
    },
    getCurrentStoredPostingTypeValue: (state) => {
      return state.currentPostingTypeValue
    },
    getStoredPostingTypesList: (state) => {
      return state.postingTypesList
    },
    getCurrentStoredAccoutingOrganizationId: (state) => {
      return state.currentAccoutingOrganizationId
    },
    getStoredAccoutingOrganizationsList: (state) => {
      return state.accountingOrganizationsList
    },
    getIsLoadingAccoutingRecords: (state) => {
      return state.isLoadingAccoutingRecords
    },
    getAccoutingRecordsList: (state) => {
      return state.accoutingRecordsList
    },

    getIsDisplayDocumentInfo: (state) => {
      return state.isDisplayDocumentInfo
    },
    getIsDisplaySourceInfo: (state) => {
      return state.isDisplaySourceInfo
    },
    getIsDisplayQuantity: (state) => {
      return state.isDisplayQuantity
    }
  }
}

export default acctViewer
