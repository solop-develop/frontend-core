/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 * Contributor(s): Elsio Sanchez elsiosanchez15@outlook.com https://github.com/elsiosanchez
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

import router from '@/router'
// API Request Methods
// import {
//   createOrder,
//   // updateOrder,
//   deleteOrder,
//   listOrders,
//   getOrder
// } from '@/api/ADempiere/form/point-of-sales.js'
import {
  createOrder,
  deleteOrder,
  listOrders,
  getOrder
} from '@/api/ADempiere/form/VPOS/index'
// import { isEmptyValue } from '@/utils/ADempiere'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere'
import { showMessage } from '@/utils/ADempiere/notification.js'

const OrderVPOS = {
  list: [],
  order: {
    lines: []
  },
  isShowOrder: false
}

export default {
  state: OrderVPOS,
  mutations: {
    setListOrders(state, list) {
      state.list = list
    },
    setOrder(state, order) {
      state.order = order
    }
  },
  actions: {
    /**
     * New Order
     * @param {String} posUuid
     * @param {String} customerUuid
     * @param {String} campaignUuid
     * @param {String} priceListUuid
     * @param {String} warehouseUuid
     * @param {String} documentTypeUuid
     * @param {String} salesRepresentativeUuid
     * @returns {Object} responseOrder
     */
    newOrder({ commit, getters }) {
      return new Promise(resolve => {
        const currentPos = getters.getVPOS
        const {
          id,
          price_list,
          warehouse,
          document_type,
          default_campaign,
          template_customer
        } = currentPos
        createOrder({
          posId: id,
          customerId: template_customer.id,
          documentTypeId: document_type.id,
          priceListId: price_list.id,
          warehouseId: warehouse.id,
          campaignId: default_campaign.id,
          salesRepresentativeId: getters['user/userInfo'].id
        })
          .then(responseOrder => {
            commit('setOrder', responseOrder)
            resolve(responseOrder)
          })
          .catch(error => {
            console.warn(`New Order: ${error.message}. Code: ${error.code}.`)
            showMessage({
              type: 'error',
              message: error.message,
              showClose: true
            })
            resolve({})
          })
      })
    },
    // /**
    //  * Get List Orders
    //  * @param {String} posUuid
    //  * @param {String} documentNo
    //  * @param {String} documentStatus
    //  * @param {String} businessPartnerUuid
    //  * @param {Number} grandTotal
    //  * @param {Number} openAmount
    //  * @param {Boolean} isWaitingForPay
    //  * @param {Boolean} isOnlyProcessed
    //  * @param {Boolean} isOnlyAisleSeller
    //  * @param {Boolean} isWaitingForInvoice
    //  * @param {Boolean} isWaitingForShipment
    //  * @param {Boolean} isBindingOffer
    //  * @param {Boolean} isClosed
    //  * @param {Boolean} isNullified
    //  * @param {Boolean} isOnlyRma
    //  * @param {String} dateOrderedFrom
    //  * @param {String} dateOrderedTo
    //  * @param {String} salesRepresentativeUuid
    //  * @param {String} searchValue
    //  * @param {Number} pageSize
    //  * @param {String} pageToken
    //  * @returns {Array} ListOrdersResponse
    //  */
    listOrder({ commit, getters }, {
      documentNo,
      documentStatus,
      businessPartnerUuid,
      grandTotal,
      openAmount,
      isWaitingForPay,
      isOnlyProcessed,
      isOnlyAisleSeller,
      isWaitingForInvoice,
      isWaitingForShipment,
      isBindingOffer,
      isClosed,
      isNullified,
      isOnlyRma,
      dateOrderedFrom,
      dateOrderedTo,
      searchValue,
      pageSize,
      pageToken
    }) {
      return new Promise(resolve => {
        const {
          id
        } = getters.getPoint
        listOrders({
          posId: id,
          documentNo,
          documentStatus,
          businessPartnerUuid,
          grandTotal,
          openAmount,
          isWaitingForPay,
          isOnlyProcessed,
          isOnlyAisleSeller,
          isWaitingForInvoice,
          isWaitingForShipment,
          isBindingOffer,
          isClosed,
          isNullified,
          isOnlyRma,
          dateOrderedFrom,
          dateOrderedTo,
          salesRepresentativeUuid: getters['user/getUserUuid'],
          searchValue,
          pageSize,
          pageToken
        })
          .then(response => {
            const { ordersList } = response
            commit('setListOrders', ordersList)
            resolve(ordersList)
          })
          .catch(error => {
            showMessage({
              type: 'error',
              message: error.message,
              showClose: true
            })
            resolve([])
            console.warn(`Error Getting List Order: ${error.message}. Code: ${error.code}.`)
          })
      })
    },
    // /**
    //  * Get Order
    //  * @param {String} posUuid
    //  * @param {String} orderUuid
    //  * @returns {Object} responseOrder
    //  */
    overloadOrder({
      commit,
      getters,
      dispatch
    }, {
      order
    }) {
      return new Promise(resolve => {
        const { id } = getters.getVPOS
        const currentOrder = getters.getCurrentOrder
        const currentRouter = router.app.$route
        const {
          name,
          query,
          params
        } = currentRouter
        if (
          isEmptyValue(order)
        ) {
          order = currentOrder
        }
        if (
          isEmptyValue(currentOrder)
        ) {
          order = { id: query.orderId }
        }
        // const { orderId } = query
        // if (
        //   isEmptyValue(id) &&
        //   isEmptyValue(order) &&
        //   !isEmptyValue(query)
        // ) {
        //   const { orderId } = query
        //   id = orderId
        // }
        getOrder({
          orderId: order.id,
          posId: id
        })
          .then(responseOrder => {
            router.push({
              name,
              params,
              query: {
                ...query,
                orderId: responseOrder.id
              }
            }, () => {})
            commit('setOrder', responseOrder)
            dispatch('listLines')
            resolve(responseOrder)
          })
          .catch(error => {
            console.warn(`Get Order: ${error.message}. Code: ${error.code}.`)
            showMessage({
              type: 'error',
              message: error.message,
              showClose: true
            })
            resolve({})
          })
      })
    },
    // /**
    //  * Delete Order
    //  * @param {String} posUuid
    //  * @param {String} orderUuid
    //  * @returns (Empty) {}
    //  */
    deleteOrder({ commit, getters }) {
      return new Promise(resolve => {
        const pos = getters.getPoint
        const order = getters.getCurrentOrder
        if (isEmptyValue(order)) resolve({})
        deleteOrder({
          posId: pos.id,
          orderId: order.id
        })
          .then(() => {
            commit('setOrder', {})
            resolve({})
          })
          .catch(error => {
            console.warn(`Delete Order: ${error.message}. Code: ${error.code}.`)
            showMessage({
              type: 'error',
              message: error.message,
              showClose: true
            })
            resolve({})
          })
      })
    }

  },
  getters: {
    getListOrder(state) {
      return state.list
    },
    getCurrentOrder(state) {
      return state.order
    }
  }
}
