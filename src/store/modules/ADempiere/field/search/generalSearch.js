/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 * Contributor(s): Elsio Sanchez elsiosanchez@gmail.com https://github.com/elsiosanchez
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
import { requestGridGeneralInfo } from '@/api/ADempiere/field/search/index.ts'

// Constants
import { TABLE_NAME as TABLE_NAME_BPartner } from '@/utils/ADempiere/dictionary/field/businessPartner.js'
import { ROWS_OF_RECORDS_BY_PAGE } from '@/utils/ADempiere/tableUtils'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { showMessage } from '@/utils/ADempiere/notification'
import { OPERATOR_LIKE, generatePageToken } from '@/utils/ADempiere/dataUtils'
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
    isLoaded: false,
    show: false,
    list: [],
    pageSize: ROWS_OF_RECORDS_BY_PAGE,
    pageNumber: 1
  },

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
      tableName
    }) {
      return new Promise((resolve, reject) => {
        requestSearchFields({
          tableName
        })
          .then(response => {
            const { query_fields, table_columns } = response

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
              tableName,
              fieldsList: fieldsList
            })

            commit('setSearchTableFields', {
              tableName,
              fieldsList: table_columns
            })

            resolve({
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
     * @param {string} processParameterUuid
     * @param {string} browseFieldUuid
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
      processParameterUuid,
      browseFieldUuid,
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
        if (tableName === TABLE_NAME_BPartner) {
          return dispatch('gridBusinessPartners', {
            parentUuid,
            containerUuid,
            contextColumnNames,
            //
            columnId,
            fieldId,
            processParameterUuid,
            browseFieldUuid,
            //
            tableName,
            columnName,
            //
            isForm,
            filters,
            searchValue,
            pageNumber,
            pageSize
          }).then(response => {
            resolve(response)
          })
        }
        return dispatch('getGeneralSearchRecordsFromServer', {
          containerUuid,
          parentUuid,
          contextColumnNames,
          filters,
          //
          columnId,
          fieldId,
          processParameterUuid,
          browseFieldUuid,
          //
          searchValue,
          //
          tableName,
          columnName,
          //
          pageNumber,
          pageSize
        }).then(response => {
          resolve(response)
        })
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
      processParameterUuid,
      browseFieldUuid,
      //
      searchValue,
      //
      tableName,
      columnName,
      //
      pageNumber,
      pageSize
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
        const contextAttributesList = getContextAttributes({
          parentUuid,
          containerUuid,
          contextColumnNames,
          isBooleanToString: true
        })
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
          contextAttributesList,
          filters: filtersList,
          //
          columnId,
          fieldId,
          processParameterUuid,
          browseFieldUuid,
          //
          searchValue,
          //
          tableName,
          columnName,
          //
          pageToken,
          pageSize
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
