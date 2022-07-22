/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 * Contributor(s): Elsio Sanchez elsiosanchez@gmail.com https://github.com/elsiosanchez
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import Vue from 'vue'

// api request methods
import { listOrders } from '@/api/ADempiere/form/point-of-sales.js'

// utils and helper methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { showMessage } from '@/utils/ADempiere/notification'
import { generatePageToken } from '@/utils/ADempiere/dataUtils'

const initState = {
  orderPopoverList: false,
  // container uuid: record uuid
  emtpyOrderData: {
    parentUuid: undefined,
    containerUuid: undefined,
    contextKey: '',
    searchValue: '',
    currentRecordUuid: undefined,
    ordersList: [],
    selectionsList: [],
    nextPageToken: undefined,
    recordCount: 0,
    isLoaded: false,
    pageNumber: 1
  },
  orderData: {}
}

const orderInfo = {
  state: initState,

  mutations: {
    setOrderData(state, {
      containerUuid,
      currentRow = {},
      ordersList = [],
      nextPageToken,
      recordCount = 0,
      isLoaded = true,
      pageNumber = 1
    }) {
      Vue.set(state.orderData, containerUuid, {
        containerUuid,
        currentRow,
        ordersList,
        nextPageToken,
        recordCount,
        isLoaded,
        pageNumber
      })
    },
    setOrderSelectedRow(state, {
      containerUuid,
      currentRow = {}
    }) {
      Vue.set(state.orderData[containerUuid], 'currentRow', currentRow)
    },

    changePopoverListOrder(state, isShowed = false) {
      state.orderPopoverList = isShowed
    }
  },

  actions: {
    findOrder({ commit, getters }, {
      posUuid,
      documentNo,
      businessPartnerUuid,
      grandTotal,
      openAmount,
      isWaitingForPay,
      isOnlyProcessed,
      isOnlyAisleSeller,
      isWaitingForInvoice,
      isWaitingForShipment,
      dateOrderedFrom,
      dateOrderedTo,
      salesRepresentativeUuid,
      pageSize,
      containerUuid,
      searchValue,
      pageNumber
    }) {
      return new Promise(resolve => {
        if (isEmptyValue(pageNumber) || pageNumber < 1) {
          const storedPage = getters.getOrderPageNumber({
            containerUuid
          })
          // refresh with same page
          pageNumber = storedPage
        }
        const pageToken = generatePageToken({ pageNumber })

        listOrders({
          posUuid,
          documentNo,
          businessPartnerUuid,
          grandTotal,
          openAmount,
          isWaitingForPay,
          isOnlyProcessed,
          isOnlyAisleSeller,
          isWaitingForInvoice,
          isWaitingForShipment,
          dateOrderedFrom,
          dateOrderedTo,
          salesRepresentativeUuid,
          pageSize,
          pageToken
        })
          .then(response => {
            const { recordCount, ordersList, nextPageToken } = response

            let currentRow = {}
            // update current record
            if (!isEmptyValue(ordersList)) {
              // set first record
              currentRow = ordersList.at(0)
            }

            commit('setOrderData', {
              containerUuid,
              currentRow,
              ordersList,
              nextPageToken,
              pageNumber,
              isLoaded: true,
              recordCount
            })

            resolve(ordersList)
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
    * Used by result in Order List
    * @param {string} containerUuid
    */
    getOrderData: (state) => ({ containerUuid }) => {
      return state.orderData[containerUuid] || {
        ...state.emtpyOrderData,
        containerUuid
      }
    },
    getIsLoadedOrderRecord: (state, getters) => ({ containerUuid }) => {
      return getters.getOrderData({
        containerUuid
      }).isLoaded
    },
    getOrderList: (state, getters) => ({ containerUuid }) => {
      return getters.getOrderData({
        containerUuid
      }).ordersList
    },
    getOrderListRecordCount: (state, getters) => ({ containerUuid }) => {
      return getters.getOrderData({
        containerUuid
      }).recordCount
    },
    getOrderPageNumber: (state, getters) => ({ containerUuid }) => {
      return getters.getOrderData({
        containerUuid
      }).pageNumber
    },
    getOrderCurrentRow: (state, getters) => ({ containerUuid }) => {
      return getters.getOrderData({
        containerUuid
      }).currentRow
    },
    getOrderPopoverList: (state) => {
      return state.orderPopoverList
    }
  }
}

export default orderInfo
