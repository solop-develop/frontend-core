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
  printTicket,
  printTicketPreviwer
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
        commit('customer', {})
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
    campaignUuid,
    salesRepresentativeUuid
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
      campaignUuid,
      salesRepresentativeUuid
    })
      .then(response => {
        dispatch('reloadOrder', { orderUuid: response.uuid })
      })
      .catch(error => {
        dispatch('reloadOrder', { orderUuid })
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
    posUuid,
    orderUuid,
    productUuid,
    chargeUuid,
    description,
    quantity,
    price,
    discountRate
  }) {
    if (isEmptyValue(posUuid)) {
      posUuid = rootGetters.posAttributes.currentPointOfSales.uuid
    }
    const { currentPriceList, currentWarehouse } = rootGetters.posAttributes.currentPointOfSales
    createOrderLine({
      posUuid,
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
    const posUuid = rootGetters.posAttributes.currentPointOfSales.uuid
    if (!isEmptyValue(orderUuid)) {
      getOrder(orderUuid, posUuid)
        .then(orderResponse => {
          commit('setCurrentPriceList', orderResponse.priceList)
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
  listOrdersFromServer({ state, commit, getters }, {
    posUuid,
    pageNumber
  }) {
    if (isEmptyValue(posUuid)) {
      posUuid = getters.posAttributes.currentPointOfSales.uuid
    }

    if (isEmptyValue(pageNumber) || pageNumber <= 0) {
      // refresh with same page
      pageNumber = state.listOrder.pageNumber
    }
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
        commit('setListOrder', {
          isLoaded: true,
          ordersList: [],
          isReload: false,
          posUuid
        })
        console.warn(`listOrdersFromServer: ${error.message}. Code: ${error.code}.`)
        showMessage({
          type: 'error',
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
  findOrderServer({ commit, rootGetters }, orderUuid) {
    if (typeof orderUuid === 'string' && !isEmptyValue(orderUuid)) {
      const posUuid = rootGetters.posAttributes.currentPointOfSales.uuid
      getOrder(orderUuid, posUuid)
        .then(responseOrder => {
          commit('findOrder', responseOrder)
        })
        .catch(error => {
          console.warn(`findOrderServer: ${error.message}. Code: ${error.code}.`)
          showMessage({
            type: 'error',
            message: error.message,
            showClose: true
          })
        })
    }
    commit('findOrder', {})
  },
  printTicket({ commit, dispatch, rootGetters }, { posUuid, orderUuid }) {
    const isAllowsPrintDocument = rootGetters.posAttributes.currentPointOfSales.isAllowsPrintDocument
    if (!isAllowsPrintDocument) {
      return
    }
    return printTicket({
      posUuid,
      orderUuid
    })
      .then(response => {
        showMessage({
          type: 'success',
          message: response,
          showClose: true
        })
        return response
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
  printTicketPreviwer({ commit, dispatch, rootGetters }, { posUuid, orderUuid }) {
    const isAllowsPreviewDocument = rootGetters.posAttributes.currentPointOfSales.isAllowsPreviewDocument
    if (!isAllowsPreviewDocument) {
      return
    }
    return printTicketPreviwer({
      posUuid,
      orderUuid
    })
      .then(response => {
        showMessage({
          type: 'success',
          message: response.result,
          showClose: true
        })
        return response
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
