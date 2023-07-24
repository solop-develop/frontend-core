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
  requestListAccountingCombinations,
  requestGetAccountingCombination,
  requestSaveAccountingCombination
} from '@/api/ADempiere/field/accoutingCombination'

// Constants
import { ROW_ATTRIBUTES } from '@/utils/ADempiere/tableUtils'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { showMessage } from '@/utils/ADempiere/notification'
import { generatePageToken } from '@/utils/ADempiere/dataUtils'
import { getContextAttributes } from '@/utils/ADempiere/contextUtils/contextAttributes'

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
    pageNumber: 1
  },
  accountCombinations: {},
  tableHeaderList: {},
  fileListIdentifier: [],
  AccountCombinationsShow: {},
  rowAccountCombinations: {}
}

const AccountCombinations = {
  state: initState,

  mutations: {
    setAccountCombinationsData(state, {
      containerUuid,
      currentRow = {},
      recordsList = [],
      nextPageToken,
      recordCount = 0,
      isLoaded = true,
      show = false,
      pageNumber = 1
    }) {
      Vue.set(state.accountCombinations, containerUuid, {
        containerUuid,
        currentRow,
        recordsList,
        show,
        nextPageToken,
        recordCount,
        isLoaded,
        pageNumber
      })
    },
    setAccountCombinationsSelectedRow(state, {
      containerUuid,
      currentRow = {}
    }) {
      Vue.set(state.accountCombinations[containerUuid], 'currentRow', currentRow)
    },

    setAccountCombinationsShow(state, {
      containerUuid,
      show = false
    }) {
      Vue.set(state.AccountCombinationsShow, containerUuid, show)
    },

    setTableHeader(state, {
      containerUuid,
      fieldsList = []
    }) {
      Vue.set(state.tableHeaderList, containerUuid, fieldsList)
    },

    setIdentifier(state, {
      containerUuid,
      fieldsList = []
    }) {
      Vue.set(state.fileListIdentifier, containerUuid, fieldsList)
    }
  },

  actions: {
    saveAccountCombinations({ dispatch }, {
      parentUuid,
      containerUuid,
      id,
      uuid,
      attributes,
      contextColumnNames = [],
      contextAttributesList
    }) {
      return new Promise(resolve => {
        if (isEmptyValue(contextAttributesList)) {
          contextAttributesList = getContextAttributes({
            parentUuid,
            containerUuid,
            contextColumnNames,
            isBooleanToString: true
          })
        }

        return requestSaveAccountingCombination({
          id,
          uuid,
          attributes,
          contextAttributesList
        })
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            console.warn(`Save Account Combinations - Error ${error.code}: ${error.message}.`)
            showMessage({
              type: 'info',
              message: error.message
            })
          })
      })
    },

    getAccountingCombination({ dispatch }, {
      id,
      uuid,
      value // as combination
    }) {
      return new Promise(resolve => {
        return requestGetAccountingCombination({
          id,
          uuid,
          value
        })
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            console.warn(`Get Accounting Combinations - Error ${error.code}: ${error.message}.`)
            showMessage({
              type: 'info',
              message: error.message
            })
          })
      })
    },

    listAccountCombinations({ commit, getters, dispatch }, {
      containerUuid,
      parentUuid,
      filters,
      contextAttributesList,
      contextColumnNames = [],
      //
      pageNumber
    }) {
      return new Promise(resolve => {
        if (isEmptyValue(pageNumber) || pageNumber < 1) {
          const storedPage = getters.getAccountCombinationsPageNumber({
            containerUuid
          })
          // refresh with same page
          pageNumber = storedPage
        }
        const pageToken = generatePageToken({ pageNumber })
        if (isEmptyValue(contextAttributesList)) {
          contextAttributesList = getContextAttributes({
            parentUuid,
            containerUuid,
            contextColumnNames,
            isBooleanToString: true
          })
        }

        return requestListAccountingCombinations({
          contextAttributesList,
          filters,
          pageToken,
          pageNumber
        })
          .then(response => {
            const recordsList = response.recordsList.map((record, rowIndex) => {
              return {
                ...record.attributes,
                // datatables app attributes
                ...ROW_ATTRIBUTES,
                rowIndex
              }
            })

            let currentRow = {}
            // update current record
            if (!isEmptyValue(recordsList)) {
              // set first record
              currentRow = recordsList.at(0)
            }

            commit('setAccountCombinationsData', {
              containerUuid,
              currentRow,
              recordsList,
              nextPageToken: response.nextPageToken,
              pageNumber,
              isLoaded: true,
              recordCount: response.recordCount
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
    }
  },

  getters: {
    /**
   * Used by result in Business Partner List
   * @param {string} containerUuid
   */
    getAccountCombinationsData: (state) => ({ containerUuid }) => {
      return state.accountCombinations[containerUuid] || {
        ...state.emtpyBusinessPartnerData,
        containerUuid
      }
    },
    getIsLoadedAccountCombinationsRecords: (state, getters) => ({ containerUuid }) => {
      return getters.getAccountCombinationsData({
        containerUuid
      }).isLoaded
    },
    getAccountCombinationsRecordsList: (state, getters) => ({ containerUuid }) => {
      return getters.getAccountCombinationsData({
        containerUuid
      }).recordsList
    },
    getAccountCombinationsCount: (state, getters) => ({ containerUuid }) => {
      return getters.getAccountCombinationsData({
        containerUuid
      }).recordCount
    },
    getAccountCombinationsPageNumber: (state, getters) => ({ containerUuid }) => {
      return getters.getAccountCombinationsData({
        containerUuid
      }).pageNumber
    },
    getAccountCombinationsCurrentRow: (state, getters) => ({ containerUuid }) => {
      return getters.getAccountCombinationsData({
        containerUuid
      }).currentRow
    },
    getAccountCombinationsShow: (state) => ({ containerUuid }) => {
      return state.AccountCombinationsShow[containerUuid]
    // },
    // getTableHeader: (state) => ({ containerUuid }) => {
    //   return state.tableHeaderList[containerUuid] || []
    // },
    // getQueryFieldsList: (state, getters) => ({ containerUuid }) => {
    //   const fieldsList = getters.getTableHeader({ containerUuid })
    //   return fieldsList.filter(field => {
    //     return CHAR.id === field.displayType
    //   })
    // },
    // getIdentifier: (state) => ({ containerUuid }) => {
    //   return state.fileListIdentifier[containerUuid] || []
    }
  }
}

export default AccountCombinations
