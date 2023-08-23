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
import { tableSearchFields, requestGridGeneralInfo } from '@/api/ADempiere/field/search'

// Constants
import { CHAR, SEARCH, TABLE, TABLE_DIRECT } from '@/utils/ADempiere/references'
import { TABLE_NAME as TABLE_NAME_BPartner } from '@/utils/ADempiere/dictionary/field/businessPartner.js'
import { ROWS_OF_RECORDS_BY_PAGE } from '@/utils/ADempiere/tableUtils'

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
    isLoaded: false,
    show: false,
    list: [],
    pageSize: ROWS_OF_RECORDS_BY_PAGE,
    pageNumber: 1
  },
  generalInfoSearch: {},
  tableHeaderList: {},
  fileListIdentifier: [],
  generalInfoShow: {},
  filtersList: {}
}

const generalInfoSearch = {
  state: initState,

  mutations: {
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
    searchInfoList({ dispatch }, {
      parentUuid,
      containerUuid,
      contextColumnNames = [],
      //
      fieldUuid,
      processParameterUuid,
      browseFieldUuid,
      columnUuid,
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
            fieldUuid,
            processParameterUuid,
            browseFieldUuid,
            columnUuid,
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
        return dispatch('findGeneralInfo', {
          containerUuid,
          parentUuid,
          contextColumnNames,
          filters,
          //
          fieldUuid,
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

    findGeneralInfo({ commit, getters, dispatch }, {
      containerUuid,
      parentUuid,
      contextColumnNames = [],
      filters,
      //
      fieldUuid,
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
      return new Promise(resolve => {
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

        return requestGridGeneralInfo({
          contextAttributesList,
          filters,
          fieldUuid,
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
            dispatch('searchTableHeader', {
              containerUuid,
              tableName
            })
            let recordsList = []
            if (response.recordsList) {
              recordsList = response.recordsList.map(list => {
                return {
                  ...list.attributes,
                  IdentifierTable: list.tableName
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
              nextPageToken: response.nextPageToken,
              pageNumber,
              isLoaded: true,
              recordCount: response.recordCount,
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
          })
      })
    },

    searchTableHeader({ commit, getters }, {
      containerUuid,
      tableName
    }) {
      return new Promise(resolve => {
        const storedFieldsList = getters.getTableHeader({ containerUuid })
        if (!isEmptyValue(storedFieldsList)) {
          resolve(storedFieldsList)
          return
        }

        tableSearchFields({
          tableName
        })
          .then(response => {
            const fieldsList = response.fieldsList
              .filter(field => {
                // https://github.com/adempiere/adempiere/blob/develop/client/src/org/compiere/apps/search/InfoGeneral.java#L388-L389
                // without search, table, and table direct references
                return ![SEARCH.id, TABLE.id, TABLE_DIRECT.id].includes(field.displayType) &&
                  // key is used to seleccion column, unnused on vue client
                  !field.isKey && field.isDisplayed
              })
              .sort((fieldA, fieldB) => {
                // https://github.com/adempiere/adempiere/blob/develop/client/src/org/compiere/apps/search/InfoGeneral.java#L332
                return fieldA.seqNo < fieldB.seqNo
              })
              .map(field => {
                const fieldGenerated = generateField({
                  fieldToGenerate: field,
                  moreAttributes: {
                    isFromDictionary: false,
                    isMandatory: false,
                    isMandatoryLogic: '',
                    containerUuid,
                    // app attributes
                    isShowedFromUser: true,
                    isReadOnlyFromForm: false
                  }
                })
                return fieldGenerated
              })

            commit('setIdentifier', {
              containerUuid,
              fieldsList
            })
            commit('setTableHeader', {
              containerUuid,
              fieldsList
            })

            resolve(fieldsList)
          })
          .catch(error => {
            console.warn(error.message)
            showMessage({
              type: 'info',
              message: error.message
            })
          })
      })
    }
  },
  getters: {
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
    getTableHeader: (state) => ({ containerUuid }) => {
      return state.tableHeaderList[containerUuid] || []
    },
    getQueryFieldsList: (state, getters) => ({ containerUuid }) => {
      const fieldsList = getters.getTableHeader({ containerUuid })
      return fieldsList.filter(field => {
        return CHAR.id === field.displayType
      })
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
