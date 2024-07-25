/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 * Contributor(s): Elsio Sanchez elsiosanchez@gmail.com https://github.com/elsiosanchez
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
import {
  requestIdentifierColumns,
  requestSearchFields
} from '@/api/ADempiere/dictionary/field.ts'
import { requestGridGeneralInfo } from '@/api/ADempiere/field/search/index.js'

// Constants
import { CUSTOMIZED_SEARCH_TABLES } from '@/utils/ADempiere/dictionary/field/search/index.ts'
import { TABLE_NAME as TABLE_NAME_BPartner } from '@/utils/ADempiere/dictionary/field/search/businessPartner.ts'
import { TABLE_NAME as TABLE_NAME_PRODUCT } from '@/utils/ADempiere/dictionary/field/search/product.ts'
import { TABLE_NAME as TABLE_NAME_ORDER } from '@/utils/ADempiere/dictionary/field/search/order'
import { TABLE_NAME as TABLE_NAME_INVOICE } from '@/utils/ADempiere/dictionary/field/search/invoice'
import { TABLE_NAME as TABLE_NAME_PAYMENT } from '@/utils/ADempiere/dictionary/field/search/payment'
import { ROWS_OF_RECORDS_BY_PAGE } from '@/utils/ADempiere/tableUtils'
import { OPERATOR_LIKE } from '@/utils/ADempiere/dataUtils'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { showMessage } from '@/utils/ADempiere/notification'
import { generatePageToken } from '@/utils/ADempiere/dataUtils'
import { generateField } from '@/utils/ADempiere/dictionaryUtils'
import { getContextAttributes } from '@/utils/ADempiere/contextUtils/contextAttributes'
import { isSameSize } from '@/utils/ADempiere/formatValue/iterableFormat'

const initState = {
  businessPartnerPopoverList: false,
  // container uuid: record uuid
  emtpyBusinessPartnerData: {
    parentUuid: undefined,
    containerUuid: undefined,
    contextKey: '',
    searchValue: '',
    currentRecordUuid: undefined,
    recordsList: [],
    selectionsList: [],
    nextPageToken: undefined,
    recordCount: 0,
    isLoading: false,
    isLoaded: false,
    show: false,
    list: [],
    pageSize: ROWS_OF_RECORDS_BY_PAGE,
    pageNumber: 1
  },

  tableNameField: {},
  setIdentifierColumns: {},
  searchQueryFields: {},
  searchTableFields: {},

  generalInfoSearch: {},
  tableHeaderList: {},
  fileListIdentifier: [],
  generalInfoShow: {},
  filtersList: {}
}

const generalInfoSearch = {
  state: initState,

  mutations: {
    setTableNameByField(state, { uuid, tableName }) {
      Vue.set(state.tableNameField, uuid, tableName)
    },

    setSearchIdentifierFields(state, {
      tableName,
      fieldsList
    }) {
      Vue.set(state.setIdentifierColumns, tableName, fieldsList)
    },
    setSearchQueryFields(state, {
      tableName,
      fieldsList
    }) {
      Vue.set(state.searchQueryFields, tableName, fieldsList)
    },
    setSearchTableFields(state, {
      tableName,
      fieldsList
    }) {
      Vue.set(state.searchTableFields, tableName, fieldsList)
    },

    setGeneralInfoData(state, {
      containerUuid,
      currentRow = {},
      recordsList = [],
      nextPageToken,
      recordCount = 0,
      isLoaded = true,
      show = false,
      pageNumber = 1,
      pageSize = ROWS_OF_RECORDS_BY_PAGE
    }) {
      Vue.set(state.generalInfoSearch, containerUuid, {
        containerUuid,
        currentRow,
        recordsList,
        show,
        nextPageToken,
        recordCount,
        isLoaded,
        pageNumber,
        pageSize
      })
    },
    setGeneralInfoSelectedRow(state, {
      containerUuid,
      currentRow = {}
    }) {
      Vue.set(state.generalInfoSearch[containerUuid], 'currentRow', currentRow)
    },

    setGeneralInfoShow(state, {
      containerUuid,
      show = false
    }) {
      Vue.set(state.generalInfoShow, containerUuid, show)
    },

    setTableHeader(state, {
      containerUuid,
      fieldsList = []
    }) {
      Vue.set(state.tableHeaderList, containerUuid, fieldsList)
    },

    setFiltersList(state, {
      containerUuid,
      isSOTrx = false
    }) {
      Vue.set(state.filtersList, containerUuid, isSOTrx)
    },

    setIdentifier(state, {
      containerUuid,
      fieldsList = []
    }) {
      Vue.set(state.fileListIdentifier, containerUuid, fieldsList)
    }
  },

  actions: {

    /**
     * Load identifiers to build display column by rows
     * @param {String} tableName
     * @returns
     */
    getIdentifierColumnsFromServer({ commit }, {
      tableName
    }) {
      return new Promise((resolve, reject) => {
        requestIdentifierColumns({
          tableName
        })
          .then(response => {
            const { identifier_fields } = response

            commit('setIdentifierColumns', {
              tableName,
              fieldsList: identifier_fields
            })

            resolve(identifier_fields)
          })
      })
    },

    /**
     * Load fields to search
     * @param {String} tableName
     * @returns
     */
    getSearchFieldsFromServer({ commit }, {
      uuid,
      //
      columnId,
      fieldId,
      processParameterId,
      browseFieldId,
      //
      tableName,
      columnName
    }) {
      return new Promise((resolve, reject) => {
        requestSearchFields({
          columnId,
          fieldId,
          processParameterId,
          browseFieldId,
          //
          tableName,
          columnName
        })
          .then(response => {
            const { query_fields, table_columns, table_name } = response

            commit('setTableNameByField', {
              uuid: uuid,
              tableName: table_name
            })

            if (CUSTOMIZED_SEARCH_TABLES.includes(table_name)) {
              resolve({
                table_name,
                query_fields: [],
                table_columns: []
              })
              return
            }

            const fieldsList = query_fields.map(queryField => {
              const field = generateField({
                fieldToGenerate: queryField,
                moreAttributes: {
                  containerUuid: tableName
                }
              })

              return {
                ...field
                // isCustomField: true
              }
            })
            commit('setSearchQueryFields', {
              tableName: table_name,
              fieldsList: fieldsList
            })

            commit('setSearchTableFields', {
              tableName: table_name,
              fieldsList: table_columns
            })

            resolve({
              table_name,
              query_fields: fieldsList,
              table_columns
            })
          })
      })
    },

    /**
     * Generic action to call specific action
     * @param {string} parentUuid
     * @param {string} containerUuid
     * @param {array} contextColumnNames
     * @param {string} fieldUuid
     * @param {string} processParameterId
     * @param {string} browseFieldId
     * @param {string} columnUuid
     * @param {string} columnUuid
     * @param {array} filters
     * @param {string} searchValue
     * @param {number} pageNumber
     * @returns {promise}
     */
    getSearchRecordsFromServer({ dispatch }, {
      parentUuid,
      containerUuid,
      contextColumnNames = [],
      //
      columnId,
      fieldId,
      processParameterId,
      browseFieldId,
      //
      tableName,
      columnName,
      //
      isForm = false,
      filters,
      searchValue,
      pageNumber,
      pageSize
    }) {
      return new Promise(resolve => {
        const queryField = {
          parentUuid,
          containerUuid,
          contextColumnNames,
          // References
          columnId,
          fieldId,
          processParameterId,
          browseFieldId,
          // Query
          tableName,
          columnName,
          isForm,
          filters,
          searchValue,
          // Page Data
          pageNumber,
          pageSize
        }

        // Load the Service indicated in the received attributes.
        switch (tableName) {
          case TABLE_NAME_BPartner:
            dispatch('gridBusinessPartners', queryField)
              .then(response => {
                resolve(response)
              })
            break
          case TABLE_NAME_PRODUCT:
            dispatch('gridProducts', queryField)
              .then(response => {
                resolve(response)
              })
            break
          case TABLE_NAME_INVOICE:
            dispatch('gridInvoices', queryField)
              .then(response => {
                resolve(response)
              })
            break
          case TABLE_NAME_ORDER:
            dispatch('gridOrders', queryField)
              .then(response => {
                resolve(response)
              })
            break
          case TABLE_NAME_PAYMENT:
            dispatch('gridPayments', queryField)
              .then(response => {
                resolve(response)
              })
            break
          default:
            dispatch('getGeneralSearchRecordsFromServer', queryField)
              .then(response => {
                resolve(response)
              })
            break
        }
      })
    },

    getGeneralSearchRecordsFromServer({ commit, getters, dispatch }, {
      containerUuid,
      parentUuid,
      contextColumnNames = [],
      filters,
      //
      columnId,
      fieldId,
      processParameterId,
      browseFieldId,
      //
      searchValue,
      //
      tableName,
      columnName,
      //
      pageNumber,
      pageSize,
      isWithoutValidation = false
    }) {
      return new Promise((resolve, reject) => {
        if (isEmptyValue(pageNumber) || pageNumber < 1) {
          const storedPage = getters.getGeneralInfoPageNumber({
            containerUuid
          })
          // refresh with same page
          pageNumber = storedPage
        }
        const pageToken = generatePageToken({ pageNumber })

        let originContainerUuid = containerUuid
        if (containerUuid.includes('_')) {
          const containers = containerUuid.split('_')
          originContainerUuid = containers.pop()
        }
        const contextAttributesList = getContextAttributes({
          parentUuid,
          containerUuid: originContainerUuid,
          contextColumnNames,
          isBooleanToString: true
        })
        let contextAttributes = '{}'
        if (!isEmptyValue(contextAttributesList)) {
          contextAttributes = JSON.stringify(contextAttributesList)
        }
        // fill context value to continue
        if (!isSameSize(contextColumnNames, contextAttributesList)) {
          resolve([])
          return
        }

        let filtersList
        if (!isEmptyValue(filters)) {
          filtersList = '[' + filters.map(parameter => {
            const {
              columnName,
              value
            } = parameter

            return JSON.stringify({
              name: columnName,
              operator: OPERATOR_LIKE.operator,
              values: value
            })
          }).toString() + ']'
        }
        return requestGridGeneralInfo({
          contextAttributes: contextAttributes,
          filters: filtersList,
          //
          columnId,
          fieldId,
          processParameterId,
          browseFieldId,
          //
          searchValue,
          //
          tableName,
          columnName,
          //
          pageToken,
          pageSize,
          isWithoutValidation
        })
          .then(response => {
            let recordsList = []
            if (response.records) {
              recordsList = response.records.map(row => {
                return {
                  ...row.values,
                  IdentifierTable: row.tableName
                }
              })
            }

            let currentRow = {}
            // update current record
            if (!isEmptyValue(recordsList)) {
              // set first record
              currentRow = recordsList.at(0)
            }

            commit('setGeneralInfoData', {
              containerUuid,
              currentRow,
              recordsList,
              nextPageToken: response.next_page_token,
              pageNumber,
              isLoaded: true,
              recordCount: Number(response.record_count),
              pageSize
            })

            resolve(recordsList)
          })
          .catch(error => {
            console.warn(error)
            showMessage({
              type: 'info',
              message: error.message
            })
            reject(error)
          })
      })
    }

  },

  getters: {
    getTableNameByField: (state) => ({ uuid }) => {
      return state.tableNameField[uuid]
    },
    getIdentifierColumns: (state) => ({ tableName }) => {
      return state.setIdentifierColumns[tableName] || []
    },
    getSearchQueryFields: (state) => ({ tableName }) => {
      return state.searchQueryFields[tableName] || []
    },
    getSearchTableFields: (state) => ({ tableName }) => {
      return state.searchTableFields[tableName] || []
    },

    /**
    * Used by result in Business Partner List
    * @param {string} containerUuid
    */
    getGeneralInfoData: (state) => ({ containerUuid }) => {
      return state.generalInfoSearch[containerUuid] || {
        ...state.emtpyBusinessPartnerData,
        containerUuid
      }
    },
    getIsLoadedGeneralInfoRecords: (state, getters) => ({ containerUuid }) => {
      return getters.getGeneralInfoData({
        containerUuid
      }).isLoaded
    },
    getGeneralInfoRecordsList: (state, getters) => ({ containerUuid }) => {
      return getters.getGeneralInfoData({
        containerUuid
      }).recordsList
    },
    getGeneralInfoCount: (state, getters) => ({ containerUuid }) => {
      return getters.getGeneralInfoData({
        containerUuid
      }).recordCount
    },
    getGeneralInfoPageNumber: (state, getters) => ({ containerUuid }) => {
      return getters.getGeneralInfoData({
        containerUuid
      }).pageNumber
    },
    getGeneralInfoCurrentRow: (state, getters) => ({ containerUuid }) => {
      return getters.getGeneralInfoData({
        containerUuid
      }).currentRow
    },
    getGeneralInfoShow: (state) => ({ containerUuid }) => {
      return state.generalInfoShow[containerUuid] || false
    },
    getIdentifier: (state) => ({ containerUuid }) => {
      return state.fileListIdentifier[containerUuid] || []
    },
    getFilterList: (state) => ({ containerUuid }) => {
      return state.filtersList[containerUuid] || false
    }
  }
}

export default generalInfoSearch
