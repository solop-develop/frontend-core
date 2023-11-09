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

import Vue from 'vue'
// API Request Methods
import {
  listStocks,
  listOrderLines,
  createOrderLine,
  updateOrderLine,
  deleteOrderLine,
  listProductConversion
} from '@/api/ADempiere/form/VPOS/index'
import { isEmptyValue } from '@/utils/ADempiere'

// Utils and Helper Methods
// import { isEmptyValue } from '@/utils/ADempiere'
import { showMessage } from '@/utils/ADempiere/notification.js'
import { sumStocksByWarehouse } from '@/utils/ADempiere/dictionary/form/VPOS'

const OrderVPOS = {
  lines: [],
  listUOM: [],
  stocks: [],
  currentLine: {}
}

export default {
  state: OrderVPOS,
  mutations: {
    setListOrderLines(state, list) {
      state.lines = list
    },
    setListUOM(state, {
      productId,
      list
    }) {
      Vue.set(state.listUOM, productId, list)
    },
    setListStocks(state, {
      productId,
      list
    }) {
      Vue.set(state.stocks, productId, list)
    },
    setCurrentLine(state, line) {
      state.currentLine = line
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
            const { order_lines } = responseOrder
            // commit('setOrder', order_lines)
            // dispatch('listLines')
            dispatch('overloadOrder', {
              order: currentOrder
            })
            resolve(order_lines)
          })
          .catch(error => {
            console.warn(`Add New Line: ${error.message}. Code: ${error.code}.`)
            let message = error.message
            if (!isEmptyValue(error.response) && !isEmptyValue(error.response.data.message)) {
              message = error.response.data.message
            }

            showMessage({
              type: 'error',
              message,
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
        // dispatch('overloadOrder', {
        //   order: currentOrder
        // })
        if (isEmptyValue(currentOrder)) resolve([])
        listOrderLines({
          posId: currentPos.id,
          orderId: currentOrder.id,
          pageSize: 50
        })
          .then(ListOrderLinesResponse => {
            const { order_lines } = ListOrderLinesResponse
            const list = order_lines.map(line => {
              return {
                ...line,
                isEditQtyEntered: false,
                isEditCurrentPrice: false,
                isEditDiscount: false,
                isLoading: false
              }
            })
            commit('setListOrderLines', list)
            resolve(list)
          })
          .catch(error => {
            let message = error.message
            if (!isEmptyValue(error.response) && !isEmptyValue(error.response.data.message)) {
              message = error.response.data.message
            }

            showMessage({
              type: 'error',
              message,
              showClose: true
            })
            resolve([])
            console.warn(`Error Getting List Order Lines: ${error.message}. Code: ${error.code}.`)
          })
      })
    },
    updateCurrentLine({
      dispatch,
      getters
    }, {
      lineId,
      uom_id,
      price,
      quantity,
      discount_rate,
      warehouse_id
    }) {
      return new Promise(resolve => {
        const currentPos = getters.getVPOS
        const currentOrder = getters.getCurrentOrder
        // dispatch('overloadOrder', {
        //   order: currentOrder
        // })
        if (isEmptyValue(currentOrder)) resolve([])
        updateOrderLine({
          posId: currentPos.id,
          orderId: currentOrder.id,
          lineId,
          uom_id,
          price,
          quantity,
          discount_rate,
          warehouse_id
        })
          .then(updateLineResponse => {
            dispatch('overloadOrder', {
              order: currentOrder
            })
            resolve(updateLineResponse)
          })
          .catch(error => {
            let message = error.message
            if (!isEmptyValue(error.response) && !isEmptyValue(error.response.data.message)) {
              message = error.response.data.message
            }

            showMessage({
              type: 'error',
              message,
              showClose: true
            })
            dispatch('listLines')
            resolve([])
            console.warn(`Error Getting List Order Lines: ${error.message}. Code: ${error.code}.`)
          })
      })
    },

    findListUOM({
      commit
    }, {
      productId
    }) {
      return new Promise(resolve => {
        if (isEmptyValue(productId)) resolve([])
        listProductConversion({
          id: productId
        })
          .then(response => {
            const { product_conversion } = response
            commit('setListUOM', {
              productId,
              list: product_conversion
            })
            resolve(response)
          })
          .catch(error => {
            let message = error.message
            if (!isEmptyValue(error.response) && !isEmptyValue(error.response.data.message)) {
              message = error.response.data.message
            }

            showMessage({
              type: 'error',
              message,
              showClose: true
            })
            resolve([])
            console.warn(`Error Getting List Product Conversion UOM: ${error.message}. Code: ${error.code}.`)
          })
      })
    },
    findListStocks({
      commit,
      getters
    }, {
      productId,
      value,
      sku
    }) {
      return new Promise(resolve => {
        const currentPos = getters.getVPOS
        if (isEmptyValue(productId)) resolve([])
        listStocks({
          posId: currentPos.id,
          value,
          sku
        })
          .then(response => {
            const { stocks } = response
            const list = sumStocksByWarehouse(stocks)
            commit('setListStocks', {
              productId,
              list
            })
            resolve(response)
          })
          .catch(error => {
            showMessage({
              type: 'error',
              message: error.message,
              showClose: true
            })
            resolve([])
            console.warn(`Error Getting List Stocks: ${error.message}. Code: ${error.code}.`)
          })
      })
    },
    /**
     * Delete Order
     * @param {String} posUuid
     * @param {String} orderUuid
     * @returns (Empty) {}
     */
    deleteCurrentLine({
      commit,
      getters,
      dispatch
    }, {
      lineId
    }) {
      return new Promise(resolve => {
        const pos = getters.getVPOS
        const order = getters.getCurrentOrder
        if (isEmptyValue(lineId)) resolve({})
        deleteOrderLine({
          posId: pos.id,
          orderId: order.id,
          lineId
        })
          .then(() => {
            commit('setOrder', {})
            dispatch('overloadOrder', {
              order
            })
            resolve({})
          })
          .catch(error => {
            console.warn(`Delete Order: ${error.message}. Code: ${error.code}.`)
            let message = error.message
            if (!isEmptyValue(error.response) && !isEmptyValue(error.response.data.message)) {
              message = error.response.data.message
            }

            showMessage({
              type: 'error',
              message,
              showClose: true
            })
            resolve({})
          })
      })
    }
  },
  getters: {
    getListOrderLines(state) {
      return state.lines
    },
    getListUOM: (state) => ({ productId }) => {
      return state.listUOM[productId] || []
    },
    getListStocks: (state) => ({ productId }) => {
      return state.stocks[productId] || []
    },
    getCurrentLine(state) {
      return state.currentLine
    }
  }
}
