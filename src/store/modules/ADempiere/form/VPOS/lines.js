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

// API Request Methods
// import {
//   createOrderLine,
//   // UpdateOrderLine,
//   // DeleteOrderLine,
//   listOrderLines
// } from '@/api/ADempiere/form/point-of-sales.js'
import {
  createOrderLine,
  listOrderLines
} from '@/api/ADempiere/form/VPOS/index'
import { isEmptyValue } from '@/utils/ADempiere'

// Utils and Helper Methods
// import { isEmptyValue } from '@/utils/ADempiere'
import { showMessage } from '@/utils/ADempiere/notification.js'

const OrderVPOS = {
  lines: []
}

export default {
  state: OrderVPOS,
  mutations: {
    setListOrderLines(state, list) {
      state.lines = list
    }
  },
  actions: {
    /**
     * New Order
     * @param {String} posUuid
     * @param {String} orderUuid
     * @param {String} productUuid
     * @param {String} chargeUuid
     * @param {String} description
     * @param {Number} quantity
     * @param {Number} price
     * @param {Number} discountRate
     * @param {String} documentTypeUuid
     * @param {String} warehouseUuid
     * @param {String} resourceAssignmentUuid
     * @returns {Object} lineResponse
     */
    newLine({
      getters,
      dispatch
    }, {
      chargeId,
      productId,
      description,
      quantity,
      price,
      discountRate,
      warehouseId,
      resourceAssignmentId
    }) {
      return new Promise(resolve => {
        const currentPos = getters.getVPOS
        const currentOrder = getters.getCurrentOrder
        console.log({ getters, currentPos, currentOrder })
        console.log({
          posId: currentPos.id,
          orderId: currentOrder.id,
          chargeId,
          productId,
          description,
          quantity,
          price,
          discountRate,
          warehouseId,
          resourceAssignmentId
        })
        createOrderLine({
          posId: currentPos.id,
          orderId: currentOrder.id,
          chargeId,
          productId,
          description,
          quantity,
          price,
          discountRate,
          warehouseId,
          resourceAssignmentId
        })
          .then(responseOrder => {
            // commit('setOrder', responseOrder)
            dispatch('listLines')
            resolve(responseOrder)
          })
          .catch(error => {
            console.warn(`Add New Line: ${error.message}. Code: ${error.code}.`)
            showMessage({
              type: 'error',
              message: error.message,
              showClose: true
            })
            resolve({})
          })
      })
    },
    /**
     * Get List Order Lines
     * @param {String} posUuid
     * @param {String} orderUuid
     * @param {Number} pageSize
     * @param {String} pageToken
     * @returns {Array} ListOrderLinesResponse
     */
    listLines({
      commit,
      getters,
      dispatch
    }) {
      return new Promise(resolve => {
        const currentPos = getters.getVPOS
        const currentOrder = getters.getCurrentOrder
        console.log({
          currentOrder,
          currentPos
        })
        dispatch('overloadOrder', {
          order: currentOrder
        })
        if (isEmptyValue(currentOrder)) resolve([])
        listOrderLines({
          posId: currentPos.id,
          orderId: currentOrder.id,
          pageSize: 50
        })
          .then(ListOrderLinesResponse => {
            const { orderLineList } = ListOrderLinesResponse
            commit('setListOrderLines', orderLineList)
            resolve(orderLineList)
          })
          .catch(error => {
            showMessage({
              type: 'error',
              message: error.message,
              showClose: true
            })
            resolve([])
            console.warn(`Error Getting List Order Lines: ${error.message}. Code: ${error.code}.`)
          })
      })
    }
    // /**
    //  * Delete Order
    //  * @param {String} posUuid
    //  * @param {String} orderUuid
    //  * @returns (Empty) {}
    //  */
    // deleteOrder({ commit, getters }) {
    //   return new Promise(resolve => {
    //     const pos = getters.getPoint
    //     const order = getters.getCurrentOrder
    //     if (isEmptyValue(order)) resolve({})
    //     deleteOrder({
    //       posUuid: pos.uuid,
    //       order: order.uuid
    //     })
    //       .then(() => {
    //         commit('setOrder', {})
    //         resolve({})
    //       })
    //       .catch(error => {
    //         console.warn(`Delete Order: ${error.message}. Code: ${error.code}.`)
    //         showMessage({
    //           type: 'error',
    //           message: error.message,
    //           showClose: true
    //         })
    //         resolve({})
    //       })
    //   })
    // }
  },
  getters: {
    getListOrderLines(state) {
      return state.lines
    }
    // getCurrentOrder(state) {
    //   return state.order
    // }
  }
}
