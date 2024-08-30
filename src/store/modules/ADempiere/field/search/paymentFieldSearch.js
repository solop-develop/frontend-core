/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 * Contributor(s): Elsio Sanchez elsiosanches@gmail.com https://github.com/elsiosanchez
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
  requesListBankAccount,
  requestListPaymentsInfo,
  requestListBusinessPartners
} from '@/api/ADempiere/fields/search/payment.ts'

// Constants
import { ROW_ATTRIBUTES } from '@/utils/ADempiere/tableUtils'
import { ROWS_OF_RECORDS_BY_PAGE } from '@/utils/ADempiere/tableUtils'
import { COLUMN_NAME } from '@/utils/ADempiere/dictionary/field/search/businessPartner.ts'

// Utils and Helper Methods
import { isSalesTransaction } from '@/utils/ADempiere/contextUtils'
import { getContextAttributes } from '@/utils/ADempiere/contextUtils/contextAttributes'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { showMessage } from '@/utils/ADempiere/notification'

const initState = {
  paymentDataPopoverList: false,
  emtpyPaymentData: {
    parentUuid: undefined,
    containerUuid: undefined,
    contextKey: '',
    searchValue: '',
    currentRecordUuid: undefined,
    currentRow: {},
    recordsList: [],
    selectionsList: [],
    nextPageToken: undefined,
    recordCount: 0,
    isLoaded: false,
    isLoading: false,
    isSalesTransaction: undefined,
    show: false,
    pageSize: ROWS_OF_RECORDS_BY_PAGE,
    pageNumber: 1,
    showQueryFields: true,
    queryFilters: {
      documentNo: undefined,
      isPayments: undefined,
      businessPartnerId: undefined,
      bankAccountId: undefined,
      isReceipt: undefined,
      description: undefined,
      paymentDateFrom: undefined,
      paymentDateTo: undefined,
      orderId: undefined,
      grandTotalFrom: undefined,
      grandTotalTo: undefined
    }
  },
  paymentData: {},
  optionsListBussines: [],
  optionsListBankAccount: [],
  paymentShow: {}
}

const fieldPayment = {
  state: initState,

  mutations: {
    setPaymentFieldData(state, {
      containerUuid,
      currentRow = {},
      recordsList = [],
      nextPageToken,
      recordCount = 0,
      isLoaded = true,
      isLoading = false,
      isSalesTransaction = undefined,
      show = false,
      pageNumber = 1,
      pageSize = ROWS_OF_RECORDS_BY_PAGE,
      showQueryFields = false,
      queryFilters = {}
    }) {
      Vue.set(state.paymentData, containerUuid, {
        ...state.emtpyPaymentData,
        containerUuid,
        currentRow,
        recordsList,
        show,
        nextPageToken,
        recordCount,
        isLoaded,
        isLoading,
        isSalesTransaction,
        showQueryFields,
        queryFilters,
        pageNumber,
        pageSize
      })
    },
    setPaymentFieldSelectedRow(state, {
      containerUuid,
      currentRow = {}
    }) {
      if (isEmptyValue(state.paymentData[containerUuid])) {
        Vue.set(state.paymentData, containerUuid, {
          ...state.emtpyPaymentData,
          containerUuid
        })
      }
      Vue.set(state.paymentData[containerUuid], 'currentRow', currentRow)
    },

    setPaymentIsLoading(state, {
      containerUuid,
      isLoading = false
    }) {
      if (isEmptyValue(state.paymentData[containerUuid])) {
        Vue.set(state.paymentData, containerUuid, {
          ...state.emtpyPaymentData,
          containerUuid
        })
      }
      Vue.set(state.paymentData[containerUuid], 'isLoading', isLoading)
    },

    setPaymentFieldShow(state, {
      containerUuid,
      show = false
    }) {
      Vue.set(state.paymentShow, containerUuid, show)
    },

    setPaymentFieldShowQueryFields(state, {
      containerUuid,
      showQueryFields = false
    }) {
      Vue.set(state.paymentData[containerUuid], 'showQueryFields', showQueryFields)
    },

    setPaymentFieldQueryFilters(state, {
      containerUuid,
      queryFilters
    }) {
      Vue.set(state.paymentData[containerUuid], 'queryFilters', queryFilters)
    },
    setPaymentFieldQueryFilterByAttribute(state, {
      containerUuid,
      attributeKey,
      value
    }) {
      Vue.set(state.paymentData[containerUuid].queryFilters, attributeKey, value)
    },
    setOptionsListBusinessPartner(state, list) {
      state.optionsListBussines = list
    },
    setOptionsListBankAccount(state, list) {
      state.optionsListBankAccount = list
    }
  },

  actions: {
    gridPayments({ commit, getters }, {
      parentUuid,
      containerUuid,
      contextColumnNames = [],
      //
      processParameterId,
      browseFieldId,
      referenceId,
      columnName,
      columnId,
      fieldId,
      //
      searchValue,
      pageNumber,
      pageSize,
      isWithoutValidation = false
    }) {
      return new Promise(resolve => {
        let pageToken
        const storedPaymentData = getters.getPaymentData({
          containerUuid
        })

        if (isEmptyValue(pageNumber) || pageNumber < 1) {
          const {
            pageNumber: storedPageNumber
          } = storedPaymentData.pageNumber
          // refresh with same page
          pageNumber = storedPageNumber
        }
        if (!isEmptyValue(storedPaymentData.nextPageToken)) {
          pageToken = storedPaymentData.nextPageToken + pageNumber
        }

        commit('setPaymentIsLoading', {
          containerUuid,
          isLoading: true
        })

        const isSalesTransactionContext = isSalesTransaction({
          parentUuid: parentUuid,
          containerUuid: containerUuid
        })

        const { queryFilters } = storedPaymentData
        if (isSalesTransactionContext) {
          queryFilters.is_vendor = undefined
        } else {
          queryFilters.is_customer = undefined
        }
        commit('setPaymentFieldData', {
          ...storedPaymentData,
          containerUuid
        })

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

        requestListPaymentsInfo({
          contextAttributes: contextAttributes,
          // References
          processParameterId,
          browseFieldId,
          referenceId,
          columnName,
          columnId,
          fieldId,
          // Query
          searchValue,
          ...queryFilters,
          // Page Data
          pageToken,
          pageSize,
          isWithoutValidation
        })
          .then(responseOrderList => {
            const {
              records,
              record_count,
              next_page_token
            } = responseOrderList
            const recordsList = records.map((row, rowIndex) => {
              return {
                [COLUMN_NAME]: row.id,
                ...row,
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

            commit('setPaymentFieldData', {
              ...storedPaymentData,
              containerUuid,
              currentRow,
              recordsList,
              nextPageToken: !isEmptyValue(next_page_token) ? next_page_token.slice(0, -1) : '',
              pageNumber,
              pageSize,
              isSalesTransaction: isSalesTransactionContext,
              isLoaded: true,
              recordCount: Number(record_count)
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
          .finally(() => {
            setTimeout(() => {
              commit('setPaymentIsLoading', {
                containerUuid,
                isLoading: false
              })
            }, 500)
          })
      })
    },
    paymentBusinessPartnerList({ commit }, searchValue) {
      return new Promise(resolve => {
        let list
        requestListBusinessPartners({
          search_value: searchValue,
          page_size: 300
        })
          .then(response => {
            const { records } = response
            list = records
            commit('setOptionsListBusinessPartner', list)
            resolve(list)
          })
          .catch(error => {
            console.warn(`Error getting List Business Partner : ${error.message}. Code: ${error.code}.`)
            resolve(list)
          })
          .finally(() => {
            resolve(list)
          })
      })
    },
    paymentBankAccountList({ commit }, searchValue) {
      return new Promise(resolve => {
        let list
        requesListBankAccount({
          search_value: searchValue,
          page_size: 300
        })
          .then(response => {
            const { records } = response
            list = records
            commit('setOptionsListBankAccount', list)
            resolve(list)
          })
          .catch(error => {
            console.warn(`Error getting List Bank Account : ${error.message}. Code: ${error.code}.`)
            resolve(list)
          })
          .finally(() => {
            resolve(list)
          })
      })
    }
  },

  getters: {
    /**
     * Used by result in Business Partner List
     * @param {string} containerUuid
     */
    getPaymentData: (state) => ({ containerUuid }) => {
      return state.paymentData[containerUuid] || {
        ...state.emtpyPaymentData,
        containerUuid
      }
    },
    getPaymentQueryFilters: (state, getters) => ({ containerUuid }) => {
      const { queryFilters } = getters.getPaymentData({
        containerUuid
      })
      return queryFilters || {}
    },
    getPaymentQueryFilterByAttribute: (state, getters) => ({ containerUuid, attributeKey }) => {
      const queryFilters = getters.getPaymentQueryFilters({
        containerUuid
      })
      if (!isEmptyValue(queryFilters)) {
        const { [attributeKey]: valueFilter } = queryFilters
        return valueFilter
      }
      return undefined
    },
    getPaymentRecordsList: (state, getters) => ({ containerUuid }) => {
      return getters.getPaymentData({
        containerUuid
      }).recordsList
    },
    getPaymentRecordCount: (state, getters) => ({ containerUuid }) => {
      return getters.getPaymentData({
        containerUuid
      }).recordCount
    },
    getPaymentCurrentRow: (state, getters) => ({ containerUuid }) => {
      return getters.getPaymentData({
        containerUuid
      }).currentRow
    },
    getPaymentShowQueryFields: (state, getters) => ({ containerUuid }) => {
      return getters.getPaymentData({
        containerUuid
      }).showQueryFields
    },
    getFielPaymentShow: (state) => ({ containerUuid }) => {
      return state.paymentShow[containerUuid] || false
    },
    getPaymentBusinessPartnerList: (state) => {
      return state.optionsListBussines || []
    },
    getPaymentBankAccountList: (state) => {
      return state.optionsListBankAccount || []
    }
  }
}

export default fieldPayment
