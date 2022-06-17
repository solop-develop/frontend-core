// ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
// Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
// Contributor(s): Elsio Sanchez esanchez@erpya.com www.erpya.com
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

// api request methods
import {
  createOrder,
  getOrder,
  updateOrder,
  createOrderLine,
  listOrders,
  printTicket
} from '@/api/ADempiere/form/point-of-sales.js'

// utils and helper methods
import { isEmptyValue, convertValuesToSendListOrders } from '@/utils/ADempiere/valueUtils.js'
import { extractPagingToken, generatePageToken } from '@/utils/ADempiere/dataUtils'
import { showMessage } from '@/utils/ADempiere/notification.js'

/**
 * Order Actions
 */
export default {
  /**
   * Create Sales Order
   * @param {string} posUuid Current POS Uuid
   * @param {string} customerUuid Customer Uuid
   * @param {string} salesRepresentativeUuid Sales Representative Uuid
   */
  createOrder({ commit, dispatch, rootGetters }, {
    posUuid,
    customerUuid,
    documentTypeUuid,
    warehouseUuid
  }) {
    const { currentPriceList, currentWarehouse, defaultCampaignUuid } = rootGetters.posAttributes.currentPointOfSales
    return createOrder({
      posUuid,
      customerUuid,
      documentTypeUuid,
      salesRepresentativeUuid: rootGetters['user/getUserUuid'],
      priceListUuid: currentPriceList.uuid,
      warehouseUuid: currentWarehouse.uuid,
      campaignUuid: defaultCampaignUuid
    })
      .then(order => {
        commit('setOrder', order)
        dispatch('fillOrde', { attribute: order })

        commit('setIsReloadListOrders')
        return order
      })
      .catch(error => {
        console.error(error.message)
        showMessage({
          type: 'error',
          message: error.message,
          showClose: true
        })
      })
  },
  /**
   * Update Sales Order
   * @param {string} posUuid Current POS Uuid
   * @param {string} posUuid Order Uuid
   * @param {string} customerUuid Customer Uuid
   */
  updateOrder({ commit, dispatch, rootGetters }, {
    orderUuid,
    posUuid,
    customerUuid,
    documentTypeUuid,
    discountAmount,
    discountRateOff,
    priceListUuid,
    warehouseUuid,
    campaignUuid
  }) {
    const isCompleted = rootGetters.posAttributes.currentPointOfSales.currentOrder.isProcessed
    if (isCompleted) {
      return
    }
    const currentPriceList = isEmptyValue(priceListUuid) ? rootGetters.posAttributes.currentPointOfSales.currentPriceList.uuid : priceListUuid
    const currentWarehouse = isEmptyValue(warehouseUuid) ? rootGetters.posAttributes.currentPointOfSales.currentWarehouse.uuid : warehouseUuid
    updateOrder({
      orderUuid,
      posUuid,
      documentTypeUuid,
      discountAmount,
      discountRateOff,
      customerUuid,
      priceListUuid: currentPriceList,
      warehouseUuid: currentWarehouse,
      campaignUuid
    })
      .then(response => {
        dispatch('reloadOrder', { orderUuid: response.uuid })
      })
      .catch(error => {
        console.error(error.message)
        showMessage({
          type: 'error',
          message: error.message,
          showClose: true
        })
      })
    dispatch('changeFocusNewOrder', false)
  },

  /**
   * Create order line from order uuid and product
   * @param {string} orderUuid Order Uuid
   * @param {string} productUuid Product Uuid
   * @param {string} description Product description
   * @param {number} quantity Quantity Producto
   * @param {number} price Price Producto
   * @param {number} discountRate DiscountRate Producto
   */
  createOrderLine({ commit, dispatch, rootGetters }, {
    orderUuid,
    productUuid,
    chargeUuid,
    description,
    quantity,
    price,
    discountRate
  }) {
    const { currentPriceList, currentWarehouse } = rootGetters.posAttributes.currentPointOfSales
    createOrderLine({
      orderUuid,
      priceListUuid: currentPriceList.uuid,
      warehouseUuid: currentWarehouse.uuid,
      productUuid,
      chargeUuid,
      description,
      quantity,
      price,
      discountRate
    })
      .then(orderLine => {
        dispatch('updateOrderLines', orderLine)
        this.reloadOrder(true, orderUuid)
      })
      .catch(error => {
        console.warn(error.message)
        showMessage({
          type: 'error',
          message: error.message,
          showClose: true
        })
      })
  },
  /**
   * Reload Order
   * @param {string} orderUuid Order Uuid
   */
  reloadOrder({ commit, dispatch, rootGetters }, { orderUuid }) {
    if (isEmptyValue(orderUuid)) {
      orderUuid = rootGetters.posAttributes.currentPointOfSales.currentOrder.uuid // this.currentOrder.uuid
    }
    if (!isEmptyValue(orderUuid)) {
      getOrder(orderUuid)
        .then(orderResponse => {
          dispatch('fillOrde', {
            attribute: orderResponse,
            setToStore: false
          })
          dispatch('currentOrder', orderResponse)
        // dispatch('listOrderLinesFromServer', orderResponse.uuid)
        })
        .catch(error => {
          showMessage({
            type: 'error',
            message: error.message,
            showClose: true
          })
        })
    }
  },
  /**
   * Fill Order
   * @param {object} attribute Attributes of the Order
   * @param {boolean} setToStore set To Store
   */
  fillOrde({ commit, dispatch }, {
    attribute,
    setToStore = true
  }) {
    const orderToPush = {
      ...attribute,
      uuid: attribute.uuid,
      id: attribute.id,
      businessPartner: attribute.businessPartner, // description, duns, id, lastName, naics, name, taxId, uuid, value
      documentNo: attribute.documentNo,
      dateOrdered: attribute.dateOrdered,
      documentStatus: attribute.documentStatus, // value, name, description
      documentType: attribute.documentType, // name, printName
      salesRepresentative: attribute.salesRepresentative, // id, uuid, name, description,
      totalLines: attribute.totalLines,
      isDelivered: attribute.isDelivered,
      grandTotal: attribute.grandTotal
    }
    // if (setToStore) {
    dispatch('setOrder', {
      ...orderToPush
    })
    // }
  },
  /**
   * Set page number of pagination list
   * @param {number}  pageNumber
   */
  setOrdersListPageNumber({ commit, dispatch }, pageNumber) {
    commit('setOrdersListPageNumber', pageNumber)
    dispatch('listOrdersFromServer', {})
  },
  listOrdersFromServer({ state, commit, getters }, {
    posUuid
  }) {
    if (isEmptyValue(posUuid)) {
      posUuid = getters.posAttributes.currentPointOfSales.uuid
    }

    const { pageNumber } = state.listOrder
    const pageToken = generatePageToken({ pageNumber })

    let values = getters.getValuesView({
      containerUuid: 'Orders-List'
    })
    values = convertValuesToSendListOrders(values)
    const isWaitingForPay = values.isPaid
    const isOnlyProcessed = values.isProcessed
    const isOnlyAisleSeller = values.isAisleSeller
    const isWaitingForInvoice = values.isInvoiced
    const { documentNo, businessPartnerUuid, grandTotal, openAmount, dateOrderedFrom, dateOrderedTo } = values
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
      dateOrderedFrom,
      dateOrderedTo,
      salesRepresentativeUuid: getters['user/getUserUuid'],
      pageToken
    })
      .then(responseOrdersList => {
        // TODO: Validate this implementation with extractPagingToken
        const token = extractPagingToken(responseOrdersList.nextPageToken)

        commit('setListOrder', {
          ...responseOrdersList,
          isLoaded: true,
          isReload: false,
          posUuid,
          token,
          pageNumber
        })
      })
      .catch(error => {
        console.warn(`listOrdersFromServer: ${error.message}. Code: ${error.code}.`)
        showMessage({
          type: 'info',
          message: error.message,
          showClose: true
        })
      })
  },
  setOrder({ commit, dispatch }, order) {
    dispatch('listOrderLinesFromServer', order.uuid)
    commit('setOrder', order)
  },
  currentOrder({ commit }, findOrder) {
    commit('findOrder', findOrder)
  },
  findOrderServer({ commit }, orderUuid) {
    if (typeof orderUuid === 'string' && !isEmptyValue(orderUuid)) {
      getOrder(orderUuid)
        .then(responseOrder => {
          commit('findOrder', responseOrder)
        })
        .catch(error => {
          console.warn(`findOrderServer: ${error.message}. Code: ${error.code}.`)
          showMessage({
            type: 'info',
            message: error.message,
            showClose: true
          })
        })
    }
    commit('findOrder', {})
  },
  printTicket({ commit, dispatch }, { posUuid, orderUuid }) {
    printTicket({
      posUuid,
      orderUuid
    })
      .then(response => {
        showMessage({
          type: 'success',
          message: response,
          showClose: true
        })
      })
      .catch(error => {
        console.warn(error.message)
        showMessage({
          type: 'error',
          message: error.message,
          showClose: true
        })
      })
  }
}
