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
  requestListInvoicesInfo,
  requestListBusinessPartners
} from '@/api/ADempiere/field/search/invoice.ts'

// Constants
import { ROW_ATTRIBUTES } from '@/utils/ADempiere/tableUtils'
import { ROWS_OF_RECORDS_BY_PAGE } from '@/utils/ADempiere/tableUtils'
import { COLUMN_NAME } from '@/utils/ADempiere/dictionary/field/search/businessPartner.ts'

// Utils and Helper Methods
import { isSalesTransaction } from '@/utils/ADempiere/contextUtils'
import { getContextAttributes } from '@/utils/ADempiere/contextUtils/contextAttributes'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { showMessage } from '@/utils/ADempiere/notification'
import { generatePageToken } from '@/utils/ADempiere/dataUtils'

const initState = {
  invoiceDataPopoverList: false,
  // container uuid: record uuid
  emtpyInvoiceData: {
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
      isSalesTransaction: undefined,
      businessPartnerId: undefined,
      isPaid: undefined,
      description: undefined,
      invoiceDateFrom: undefined,
      invoiceDateTo: undefined,
      orderId: undefined,
      grandTotalFrom: undefined,
      grandTotalTo: undefined
    }
  },
  invoiceData: {},
  optionsListBussines: [],
  invoiceShow: {}
}

const fieldInvoice = {
  state: initState,

  mutations: {
    setInvoiceFieldData(state, {
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
      Vue.set(state.invoiceData, containerUuid, {
        ...state.emtpyInvoiceData,
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
    setInvoiceFieldSelectedRow(state, {
      containerUuid,
      currentRow = {}
    }) {
      if (isEmptyValue(state.invoiceData[containerUuid])) {
        Vue.set(state.invoiceData, containerUuid, {
          ...state.emtpyInvoiceData,
          containerUuid
        })
      }
      Vue.set(state.invoiceData[containerUuid], 'currentRow', currentRow)
    },

    setInvoiceFieldIsLoading(state, {
      containerUuid,
      isLoading = false
    }) {
      if (isEmptyValue(state.invoiceData[containerUuid])) {
        Vue.set(state.invoiceData, containerUuid, {
          ...state.emtpyInvoiceData,
          containerUuid
        })
      }
      Vue.set(state.invoiceData[containerUuid], 'isLoading', isLoading)
    },

    setInvoiceFieldShow(state, {
      containerUuid,
      show = false
    }) {
      Vue.set(state.invoiceShow, containerUuid, show)
    },

    setInvoiceFieldShowQueryFields(state, {
      containerUuid,
      showQueryFields = false
    }) {
      Vue.set(state.invoiceData[containerUuid], 'showQueryFields', showQueryFields)
    },

    setInvoiceFieldQueryFilters(state, {
      containerUuid,
      queryFilters
    }) {
      Vue.set(state.invoiceData[containerUuid], 'queryFilters', queryFilters)
    },
    setInvoiceFieldQueryFilterByAttribute(state, {
      containerUuid,
      attributeKey,
      value
    }) {
      Vue.set(state.invoiceData[containerUuid].queryFilters, attributeKey, value)
    },

    /**
     * Change showed list of business partner
     * TODO: Used only POS form
     * @param {object} state
     * @param {boolean} isShowed
     */
    changePopoverListInvoiceField(state, isShowed = false) {
      state.invoiceDataPopoverList = isShowed
    },
    setOptionsListBusinessPartner(state, list) {
      state.optionsListBussines = list
    }
  },

  actions: {
    gridInvoices({ commit, getters }, {
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
        const storedInvoiceData = getters.getInvoceData({
          containerUuid
        })

        if (isEmptyValue(pageNumber) || pageNumber < 1) {
          const {
            pageNumber: storedPageNumber
          } = storedInvoiceData.pageNumber
          // refresh with same page
          pageNumber = storedPageNumber
        }
        const pageToken = generatePageToken({ pageNumber })

        commit('setBusinessPartnerIsLoading', {
          containerUuid,
          isLoading: true
        })

        const isSalesTransactionContext = isSalesTransaction({
          parentUuid: parentUuid,
          containerUuid: containerUuid
        })

        const { queryFilters } = storedInvoiceData
        if (isSalesTransactionContext) {
          queryFilters.is_vendor = undefined
        } else {
          queryFilters.is_customer = undefined
        }
        commit('setInvoiceFieldData', {
          ...storedInvoiceData,
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

        requestListInvoicesInfo({
          contextAttributesList,
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
          .then(responseBusinessPartnerList => {
            const recordsList = responseBusinessPartnerList.records.map((row, rowIndex) => {
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

            commit('setInvoiceFieldData', {
              ...storedInvoiceData,
              containerUuid,
              currentRow,
              recordsList,
              nextPageToken: responseBusinessPartnerList.next_page_token,
              pageNumber,
              pageSize,
              isSalesTransaction: isSalesTransactionContext,
              isLoaded: true,
              recordCount: Number(responseBusinessPartnerList.record_count)
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
              commit('setBusinessPartnerIsLoading', {
                containerUuid,
                isLoading: false
              })
            }, 500)
          })
      })
    },
    invoiceBusinessPartnerList({ commit }, searchValue) {
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
    }
  },

  getters: {
    /**
     * Used by result in Business Partner List
     * @param {string} containerUuid
     */
    getInvoceData: (state) => ({ containerUuid }) => {
      return state.invoiceData[containerUuid] || {
        ...state.emtpyInvoiceData,
        containerUuid
      }
    },
    getInvoceQueryFilters: (state, getters) => ({ containerUuid }) => {
      const { queryFilters } = getters.getInvoceData({
        containerUuid
      })
      return queryFilters || {}
    },
    getInvoicesQueryFilterByAttribute: (state, getters) => ({ containerUuid, attributeKey }) => {
      const queryFilters = getters.getInvoceQueryFilters({
        containerUuid
      })
      if (!isEmptyValue(queryFilters)) {
        const { [attributeKey]: valueFilter } = queryFilters
        return valueFilter
      }
      return undefined
    },
    getInvoiceRecordsList: (state, getters) => ({ containerUuid }) => {
      return getters.getInvoceData({
        containerUuid
      }).recordsList
    },
    getInvoiceRecordCount: (state, getters) => ({ containerUuid }) => {
      return getters.getInvoceData({
        containerUuid
      }).recordCount
    },
    getInvoiceCurrentRow: (state, getters) => ({ containerUuid }) => {
      return getters.getInvoceData({
        containerUuid
      }).currentRow
    },
    getInvoiceShowQueryFields: (state, getters) => ({ containerUuid }) => {
      return getters.getInvoceData({
        containerUuid
      }).showQueryFields
    },
    getFieldInvoceShow: (state) => ({ containerUuid }) => {
      return state.invoiceShow[containerUuid] || false
    },
    getInvoiceBusinessPartnerList: (state) => {
      return state.optionsListBussines || []
    }
  }
}

export default fieldInvoice
