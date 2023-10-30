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
import {
  createOrder,
  listOrders,
  getOrder,
  releaseOrder,
  holdOrder,
  updateOrder
} from '@/api/ADempiere/form/VPOS/index'
// import { isEmptyValue } from '@/utils/ADempiere'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere'
import { showMessage } from '@/utils/ADempiere/notification.js'

const OrderVPOS = {
  // list: [],
  order: {},
  orderList: {
    list: [],
    recordCount: 0,
    pageToken: ''
  },
  isShowOrder: false,
  isLoadingRecords: false,
  isShowQuickOptions: false
}

export default {
  state: OrderVPOS,
  mutations: {
    setListOrders(state, list) {
      state.orderList.list = list
    },
    setOrders(state, {
      recordCount,
      pageToken,
      list
    }) {
      state.orderList = {
        recordCount,
        pageToken,
        list
      }
    },
    setCurrentOrder(state, order) {
      state.order = order
    },
    setShowQuickOptions(state, show) {
      state.isShowQuickOptions = show
    },
    setLoadingRecord(state, load) {
      state.isLoadingRecords = load
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
    newOrder({ commit, getters, dispatch }) {
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
        const currentRouter = router.app.$route
        const {
          name,
          query,
          params
        } = currentRouter
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
            commit('setCurrentOrder', responseOrder)
            dispatch('overloadOrder', {
              order: responseOrder
            })
            router.push({
              name,
              params,
              query: {
                ...query,
                orderId: responseOrder.id
              }
            }, () => {})
            resolve(responseOrder)
          })
          .catch(error => {
            console.warn(`New Order: ${error.message}. Code: ${error.code}.`)
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
      search_value,
      document_no,
      document_status,
      business_partner_id,
      grand_total,
      open_amount,
      is_waiting_for_pay,
      is_only_processed,
      is_only_aisle_seller,
      is_waiting_for_invoice,
      is_waiting_for_shipment,
      is_binding_offer,
      is_closed,
      is_nullified,
      is_only_rma,
      date_ordered_from,
      date_ordered_to,
      // sales_representative_id,
      pageSize = 15,
      pageToken
    }) {
      return new Promise(resolve => {
        const {
          id
        } = getters.getVPOS
        commit('setLoadingRecord', true)
        listOrders({
          posId: id,
          pageSize,
          pageToken,
          search_value,
          document_no,
          document_status,
          business_partner_id,
          grand_total,
          open_amount,
          is_waiting_for_pay,
          is_only_processed,
          is_only_aisle_seller,
          is_waiting_for_invoice,
          is_waiting_for_shipment,
          is_binding_offer,
          is_closed,
          is_nullified,
          is_only_rma,
          date_ordered_from,
          date_ordered_to,
          sales_representative_id: getters['user/userInfo'].id
        })
          .then(response => {
            const {
              orders,
              record_count,
              next_page_token
            } = response
            commit('setOrders', {
              recordCount: record_count,
              pageToken: next_page_token,
              list: orders
            })
            commit('setListOrders', orders)
            resolve(orders)
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
            console.warn(`Error Getting List Order: ${error.message}. Code: ${error.code}.`)
          })
          .finally(() => {
            commit('setLoadingRecord', false)
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
          isEmptyValue(currentOrder) &&
          isEmptyValue(order)
        ) {
          order = { id: query.orderId }
        }
        if (isEmptyValue(order.id)) {
          resolve()
          return
        }
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
            commit('setCurrentOrder', responseOrder)
            dispatch('listLines')
            resolve(responseOrder)
          })
          .catch(error => {
            console.warn(`Get Order: ${error.message}. Code: ${error.code}.`)
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

    releaseCurrentOrder({ commit, getters, dispatch }, {
      order
    }) {
      return new Promise(resolve => {
        const pos = getters.getVPOS
        if (isEmptyValue(order)) resolve({})
        if (order.document_status.value === 'CO') {
          resolve({})
          return
        }
        releaseOrder({
          posId: pos.id,
          orderId: order.id
        })
          .then(() => {
            const currentRouter = router.app.$route
            const {
              name,
              query,
              params
            } = currentRouter
            router.push({
              name,
              params,
              query: {
                posId: query.posId
              }
            }, () => {})
            commit('setCurrentOrder', {})
            commit('setListOrderLines', [])
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
    },

    holdCurrentOrder({ dispatch, getters }, {
      order
    }) {
      return new Promise(resolve => {
        const pos = getters.getVPOS
        if (isEmptyValue(order)) resolve({})
        if (order.document_status.value === 'CO') {
          dispatch('overloadOrder', { order })
          resolve({})
          return
        }
        holdOrder({
          posId: pos.id,
          orderId: order.id
        })
          .then((response) => {
            const currentRouter = router.app.$route
            const {
              name,
              query,
              params
            } = currentRouter
            router.push({
              name,
              params,
              query: {
                posId: query.posId,
                orderId: response.id
              }
            }, () => {})
            // commit('setCurrentOrder', response)
            dispatch('overloadOrder', { order: response })
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
    },
    updateCurrentOrder({ dispatch, getters }, {
      customer_id,
      document_type_id,
      price_list_id,
      warehouse_id,
      campaign_id,
      discount_rate,
      discount_rate_off,
      discount_amount_off,
      sales_representative_id
    }) {
      return new Promise(resolve => {
        const pos = getters.getVPOS
        const order = getters.getCurrentOrder
        if (isEmptyValue(order)) resolve({})
        if (order.document_status.value !== 'DR') {
          dispatch('overloadOrder', { order })
          resolve({})
        }
        updateOrder({
          posId: pos.id,
          orderId: order.id,
          customer_id,
          document_type_id,
          price_list_id,
          warehouse_id,
          campaign_id,
          discount_rate,
          discount_rate_off,
          discount_amount_off,
          sales_representative_id
        })
          .then((response) => {
            const currentRouter = router.app.$route
            const {
              name,
              query,
              params
            } = currentRouter
            router.push({
              name,
              params,
              query: {
                posId: query.posId,
                orderId: response.id
              }
            }, () => {})
            // commit('setCurrentOrder', response)
            dispatch('overloadOrder', { order: response })
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
      return state.orderList.list
    },
    getCurrentOrder(state) {
      return state.order
    },
    getShowQuickOptions(state) {
      return state.isShowQuickOptions
    },
    getLoadingRecord(state) {
      return state.isLoadingRecords
    },
    getOrderRecords(state) {
      return state.orderList
    }
  }
}
