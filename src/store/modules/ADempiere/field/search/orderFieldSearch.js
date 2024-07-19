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
  requestListOrderInfo,
  requestListBusinessPartners
} from '@/api/ADempiere/field/search/order.ts'

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
  orderDataPopoverList: false,
  // container uuid: record uuid
  emtpyOrderData: {
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
      isDelivered: undefined,
      description: undefined,
      orderDateFrom: undefined,
      orderDateTo: undefined,
      orderId: undefined,
      grandTotalFrom: undefined,
      grandTotalTo: undefined
    }
  },
  orderData: {},
  optionsListBussines: [],
  orderShow: {}
}

const fieldOrder = {
  state: initState,

  mutations: {
    setOrderFieldData(state, {
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
      Vue.set(state.orderData, containerUuid, {
        ...state.emtpyOrderData,
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
    setOrderFieldSelectedRow(state, {
      containerUuid,
      currentRow = {}
    }) {
      if (isEmptyValue(state.orderData[containerUuid])) {
        Vue.set(state.orderData, containerUuid, {
          ...state.emtpyOrderData,
          containerUuid
        })
      }
      Vue.set(state.orderData[containerUuid], 'currentRow', currentRow)
    },

    setOrderFieldIsLoading(state, {
      containerUuid,
      isLoading = false
    }) {
      if (isEmptyValue(state.orderData[containerUuid])) {
        Vue.set(state.orderData, containerUuid, {
          ...state.emtpyOrderData,
          containerUuid
        })
      }
      Vue.set(state.orderData[containerUuid], 'isLoading', isLoading)
    },

    setOrderFieldShow(state, {
      containerUuid,
      show = false
    }) {
      Vue.set(state.orderShow, containerUuid, show)
    },

    setOrderFieldShowQueryFields(state, {
      containerUuid,
      showQueryFields = false
    }) {
      Vue.set(state.orderData[containerUuid], 'showQueryFields', showQueryFields)
    },

    setOrderFieldQueryFilters(state, {
      containerUuid,
      queryFilters
    }) {
      Vue.set(state.orderData[containerUuid], 'queryFilters', queryFilters)
    },
    setOrderFieldQueryFilterByAttribute(state, {
      containerUuid,
      attributeKey,
      value
    }) {
      Vue.set(state.orderData[containerUuid].queryFilters, attributeKey, value)
    },

    /**
     * Change showed list of business partner
     * TODO: Used only POS form
     * @param {object} state
     * @param {boolean} isShowed
     */
    changePopoverListOrderField(state, isShowed = false) {
      state.orderDataPopoverList = isShowed
    },
    setOptionsListBusinessPartner(state, list) {
      state.optionsListBussines = list
    }
  },

  actions: {
    gridOrders({ commit, getters }, {
      parentUuid,
      containerUuid,
      contextColumnNames = [],
      //
      processParameterId,
      browseFieldId,
      referenceId,
      columnName,
      tableName,
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
        const storedBusinessPartnerData = getters.getOrderData({
          containerUuid
        })

        if (isEmptyValue(pageNumber) || pageNumber < 1) {
          const {
            pageNumber: storedPageNumber
          } = storedBusinessPartnerData.pageNumber
          // refresh with same page
          pageNumber = storedPageNumber
        }
        if (!isEmptyValue(storedBusinessPartnerData.nextPageToken)) pageToken = storedBusinessPartnerData.nextPageToken + pageNumber

        commit('setBusinessPartnerIsLoading', {
          containerUuid,
          isLoading: true
        })

        const isSalesTransactionContext = isSalesTransaction({
          parentUuid: parentUuid,
          containerUuid: containerUuid
        })

        const { queryFilters } = storedBusinessPartnerData
        if (isSalesTransactionContext) {
          queryFilters.is_vendor = undefined
        } else {
          queryFilters.is_customer = undefined
        }
        commit('setOrderFieldData', {
          ...storedBusinessPartnerData,
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

        requestListOrderInfo({
          contextAttributes: contextAttributes,
          // References
          processParameterId,
          browseFieldId,
          referenceId,
          columnName,
          tableName,
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

            commit('setOrderFieldData', {
              ...storedBusinessPartnerData,
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
              commit('setBusinessPartnerIsLoading', {
                containerUuid,
                isLoading: false
              })
            }, 500)
          })
      })
    },
    orderBusinessPartnerList({ commit }, searchValue) {
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
    getOrderData: (state) => ({ containerUuid }) => {
      return state.orderData[containerUuid] || {
        ...state.emtpyOrderData,
        containerUuid
      }
    },
    getOrderQueryFilters: (state, getters) => ({ containerUuid }) => {
      const { queryFilters } = getters.getOrderData({
        containerUuid
      })
      return queryFilters || {}
    },
    getOrdersQueryFilterByAttribute: (state, getters) => ({ containerUuid, attributeKey }) => {
      const queryFilters = getters.getOrderQueryFilters({
        containerUuid
      })
      if (!isEmptyValue(queryFilters)) {
        const { [attributeKey]: valueFilter } = queryFilters
        return valueFilter
      }
      return undefined
    },
    getOrderRecordsList: (state, getters) => ({ containerUuid }) => {
      return getters.getOrderData({
        containerUuid
      }).recordsList
    },
    getOrderRecordCount: (state, getters) => ({ containerUuid }) => {
      return getters.getOrderData({
        containerUuid
      }).recordCount
    },
    getOrderCurrentRow: (state, getters) => ({ containerUuid }) => {
      return getters.getOrderData({
        containerUuid
      }).currentRow
    },
    getOrderShowQueryFields: (state, getters) => ({ containerUuid }) => {
      return getters.getOrderData({
        containerUuid
      }).showQueryFields
    },
    getFieldOrderShow: (state) => ({ containerUuid }) => {
      return state.orderShow[containerUuid] || false
    },
    getOrderBusinessPartnerList: (state) => {
      return state.optionsListBussines || []
    }
  }
}

export default fieldOrder
