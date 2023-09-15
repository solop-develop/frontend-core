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
* along with this program. If not, see <https://www.gnu.org/licenses/>.
*/

import language from '@/lang'
import router from '@/router'

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
import { buildLinkHref } from '@/utils/ADempiere/resource.js'

// Constants
import { REPORT_VIEWER_NAME } from '@/utils/ADempiere/constants/report'
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
    const { currentPriceList, currentWarehouse, priceList, defaultCampaign } = rootGetters.posAttributes.currentPointOfSales
    const priceListUuid = isEmptyValue(currentPriceList) ? priceList.uuid : currentPriceList.uuid
    return createOrder({
      posUuid,
      customerUuid,
      documentTypeUuid,
      salesRepresentativeUuid: rootGetters['user/getUserUuid'],
      priceListUuid: priceListUuid,
      warehouseUuid: currentWarehouse.uuid,
      campaignUuid: isEmptyValue(defaultCampaign) ? '' : defaultCampaign.uuid
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
    discountAllLine,
    priceListUuid,
    warehouseUuid,
    campaignUuid,
    salesRepresentativeUuid
  }) {
    const isCompleted = rootGetters.posAttributes.currentPointOfSales.currentOrder.isProcessed
    const isProcessLoading = rootGetters.getProcessLoading
    if (isCompleted || isProcessLoading) {
      return
    }
    const currentPriceList = isEmptyValue(priceListUuid) ? rootGetters.posAttributes.currentPointOfSales.currentPriceList.uuid : priceListUuid
    const currentWarehouse = isEmptyValue(warehouseUuid) ? rootGetters.posAttributes.currentPointOfSales.currentWarehouse.uuid : warehouseUuid
    updateOrder({
      orderUuid,
      posUuid,
      documentTypeUuid,
      discountAmount,
      discount: discountAllLine,
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
    const isProcessLoading = rootGetters.getProcessLoading
    if (isProcessLoading) return
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
          // Establish order in the route
          const currentRoute = router.app._route
          // set action
          router.push({
            params: {
              ...currentRoute.params
            },
            query: {
              ...currentRoute.query,
              action: orderUuid
            }
          }, () => {})
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
  printTicket({ commit, dispatch, rootGetters }, { posId, orderId }) {
    const isAllowsPrintDocument = rootGetters.posAttributes.currentPointOfSales.isAllowsPrintDocument
    if (!isAllowsPrintDocument) {
      return
    }
    return printTicket({
      posId,
      orderId
    })
      .then(response => {
        const {
          output_stream,
          result_type,
          mime_type,
          file_name,
          is_error,
          summary
        } = response
        const type = is_error ? 'error' : 'success'
        const message = isEmptyValue(summary) ? (is_error ? 'Error' : 'OK') : summary
        showMessage({
          type,
          message,
          showClose: true
        })
        if (
          !isEmptyValue(output_stream) &&
          !isEmptyValue(mime_type) &&
          !isEmptyValue(file_name)
        ) {
          const link = buildLinkHref({
            fileName: file_name,
            outputStream: output_stream,
            mimeType: mime_type
          })
          // commit('addReportToList', reportResponse)
          commit('setReportOutput', {
            download: link.download,
            format: result_type,
            fileName: file_name,
            link,
            content: output_stream,
            mimeType: mime_type,
            name: file_name,
            output: output_stream,
            outputStream: output_stream,
            reportType: result_type,
            reportUuid: orderId.toString(),
            reportViewUuid: orderId.toString(),
            tableName: 'C_Order',
            url: link.href,
            uuid: orderId.toString(),
            instanceUuid: orderId.toString()
          })
          router.push({
            name: REPORT_VIEWER_NAME,
            params: {
              processId: orderId,
              reportUuid: orderId.toString(),
              tableName: 'C_Order',
              instanceUuid: orderId.toString(),
              fileName: file_name,
              name: file_name,
              mimeType: mime_type
            }
          }, () => {})
        }
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
  printTicketPreviwer({ rootGetters }, {
    posUuid, orderUuid
  }) {
    return new Promise((resolve, reject) => {
      const isAllowsPreviewDocument = rootGetters.posAttributes.currentPointOfSales.isAllowsPreviewDocument

      if (!isAllowsPreviewDocument) {
        return reject({
          message: language.t('pointOfSales.permissions.previewDocumentNotAllowed')
        })
      }

      printTicketPreviwer({
        posUuid,
        orderUuid
      })
        .then(response => {
          showMessage({
            type: 'success',
            message: response.result,
            showClose: true
          })
          resolve(response)
        })
        .catch(error => {
          console.warn(error.message)
          showMessage({
            type: 'error',
            message: error.message,
            showClose: true
          })
        })
    })
  }
}
