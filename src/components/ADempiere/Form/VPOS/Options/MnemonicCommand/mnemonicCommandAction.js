// ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
// Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
// Contributor(s): Elsio Sanchez elsiosanchez15@outlook.com https://github.com/elsiosanchez
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

import store from '@/store'
import router from '@/router'
import lang from '@/lang'
// API Request Methods
import {
  generateImmediateInvoice,
  processOrder,
  deleteOrder
} from '@/api/ADempiere/form/point-of-sales.js'
// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere'
import { showMessage } from '@/utils/ADempiere/notification'
import { buildLinkHref } from '@/utils/ADempiere/resource.js'
// Constants
import { REPORT_VIEWER_NAME } from '@/utils/ADempiere/constants/report'

export function selectCommand(command) {
  let isRequirePin = false
  const list = store.getters.getLisCommantShortkey
  const action = (!isEmptyValue(command.isRequirePin) && command.isRequirePin) ? list.find(list => list.shortcut === command.shortcut) : list.find(list => list.shortcut === 'ctrl + ' + command)
  switch (action.command) {
    case 'newOrder':
      isRequirePin = newOrder(command)
      break
    case 'ordersHistory':
      isRequirePin = ordersHistory(command)
      break
    case 'addResource':
      isRequirePin = addResource(command)
      break
    case 'generateImmediateInvoice':
      isRequirePin = immediateInvoice(command)
      break
    case 'completePreparedOrder':
      isRequirePin = completeOrder(command)
      break
    case 'cancelSaleTransaction':
      isRequirePin = reverseOrder(command)
      break
    case 'print':
      isRequirePin = printOrder(command)
      break
    case 'preview':
      isRequirePin = printPreview(command)
      break
    case 'cancelOrder':
      isRequirePin = cancelOrder(command)
      break
    case 'confirmDelivery':
      isRequirePin = openDelivery(command)
      break
    case 'deliverAllProducts':
      isRequirePin = openDeliveryAllProducts(command)
      break
    case 'applyDiscountOnOrder':
      isRequirePin = applyDiscount(command)
      break
    case 'cashOpening':
      isRequirePin = cashOpen(command)
      break
    case 'closeBox':
      isRequirePin = cashClose(command)
      break
    case 'assignSeller':
      isRequirePin = assignSeller(command)
      break
    case 'unassignSeller':
      isRequirePin = unassignSeller(command)
      break
    case 'changePos':
      isRequirePin = changePos(command)
      break
    case 'listProducts':
      isRequirePin = listProducts(command)
      break
    case 'changeWarehouseList':
      isRequirePin = changeWarehouseList(command)
      break
    case 'changePriceList':
      isRequirePin = changePriceList(command)
      break
  }
  store.commit('setCurrentCommand', {
    isRequirePin,
    ...action
  })
  return {
    ...isRequirePin,
    ...action
  }
}

function newOrder({ pinVerificationApproved = false }) {
  const { isAllowsCreateOrder, salesRepresentative, templateCustomer, uuid } = store.getters.posAttributes.currentPointOfSales
  if (!isAllowsCreateOrder && !pinVerificationApproved) return { isRequirePin: true, pinName: lang.t('form.pos.optionsPoinSales.salesOrder.newOrder'), requestedAccess: 'IsAllowsCreateOrder' }
  const currentRoute = router.app._route
  const documentTypeUuid = store.getters.getValueOfField({
    containerUuid: currentRoute.meta.uuid,
    columnName: 'C_DocTypeTarget_ID_UUID'
  })
  store.dispatch('createOrder', {
    posUuid: uuid,
    customerUuid: templateCustomer.uuid,
    salesRepresentativeUuid: salesRepresentative.uuid,
    documentTypeUuid
  })
    .then(response => {
      store.dispatch('reloadOrder', { orderUuid: response.uuid })
      router.push({
        params: {
          ...currentRoute.params
        },
        query: {
          ...currentRoute.query,
          action: response.uuid
        }
      }).then(() => {
        store.commit('setShowPOSCollection', false)
        store.dispatch('listOrdersFromServer', {
          posUuid: uuid
        })
      }).catch(() => {})
    })
  store.dispatch('changeFocusNewOrder', true)
  return false
}

function ordersHistory() {
  store.commit('setDialogoComponent', true)
  return false
}

function addResource() {
  store.commit('setDialogoComponent', true)
  return false
}

function immediateInvoice() {
  const { id, uuid } = store.getters.posAttributes.currentPointOfSales
  generateImmediateInvoice({
    posId: id,
    posUuid: uuid
  })
  return false
}

function completeOrder() {
  if (this.$store.getters.getProcessLoading) return
  const {
    currentOrder,
    uuid,
    id
  } = store.getters.posAttributes.currentPointOfSales
  if (isEmptyValue(currentOrder) || currentOrder.documentStatus.value) return true
  const isOpenRefund = !isEmptyValue(store.getters.getListRefundReference)
  this.$store.commit('setProcessLoading', true)
  processOrder({
    posUuid: uuid,
    orderUuid: currentOrder.uuid,
    isOpenRefund,
    createPayments: false,
    payments: []
  })
    .then(response => {
      store.dispatch('printTicket', {
        posId: id,
        orderId: currentOrder.id
      })
      store.dispatch('reloadOrder', response.uuid)
        .then(() => {
          if (store.getters.posAttributes.currentPointOfSales.IsAllowsPreviewDocument) {
            printPreview({
              posUuid: uuid,
              orderUuid: currentOrder.uuid
            })
          }
        })
      showMessage({
        type: 'success',
        message: lang.t('notifications.completed'),
        showClose: true
      })
    })
    .catch(error => {
      showMessage({
        type: 'error',
        message: error.message,
        showClose: true
      })
    })
    .finally(() => {
      store.dispatch('listOrdersFromServer', {
        posUuid: uuid
      })
      this.$store.commit('setProcessLoading', false)
      store.dispatch('updateOrderPos', false)
      store.dispatch('updatePaymentPos', false)
      store.commit('setShowPOSOptions', false)
    })
}

function printPreview({
  posUuid,
  orderUuid
}) {
  const { IsAllowsPreviewDocument } = store.getters.posAttributes.currentPointOfSales
  if (IsAllowsPreviewDocument) return true
  store.dispatch('printTicketPreviwer', {
    posUuid,
    orderUuid
  })
    .then(response => {
      const { processLog } = response
      if (!isEmptyValue(processLog)) {
        const link = buildLinkHref({
          fileName: processLog.output.file_name,
          outputStream: processLog.output.output_stream,
          mimeType: processLog.output.mime_type
        })
        store.commit('setReportOutput', {
          download: link.download,
          format: processLog.output.report_type,
          fileName: processLog.output.file_name,
          link,
          content: processLog.output.output,
          mimeType: processLog.output.mime_type,
          name: processLog.output.name,
          output: processLog.output,
          outputStream: processLog.output.output_stream,
          outputStream_asB64: processLog.output.output_stream_asB64,
          outputStream_asU8: processLog.output.output_stream_asU8,
          reportType: processLog.output.report_type,
          reportUuid: processLog.uuid,
          reportViewUuid: processLog.uuid,
          tableName: 'C_Order',
          url: link.href,
          uuid: processLog.uuid,
          instanceUuid: processLog.instance_uuid
        })
        router.push({
          name: REPORT_VIEWER_NAME,
          params: {
            processId: 110,
            reportUuid: processLog.uuid,
            tableName: 'C_Order',
            menuParentUuid: '',
            instanceUuid: processLog.instance_uuid,
            fileName: processLog.output.name,
            name: processLog.output.name,
            mimeType: processLog.output.mime_type
          }
        }, () => {})
      }
    })
    .catch(error => {
      showMessage({
        type: 'error',
        message: error.message,
        showClose: true
      })
    })
}

function printOrder() {
  const {
    isAllowsPrintDocument,
    currentOrder,
    id
  } = store.getters.posAttributes.currentPointOfSales
  if (isEmptyValue(currentOrder.uuid)) return false
  if (isAllowsPrintDocument) return true
  store.dispatch('printTicket', {
    posId: id,
    orderId: currentOrder.id
  })
}

function reverseOrder() {
  store.commit('setDialogoComponent', true)
  return false
}

function cancelOrder() {
  const {
    currentOrder,
    uuid
  } = store.getters.posAttributes.currentPointOfSales
  const {
    documentStatus
  } = currentOrder
  if (isEmptyValue(currentOrder) || (isEmptyValue(documentStatus) && documentStatus.value !== 'CO')) return false
  deleteOrder({
    orderUuid: currentOrder.uuid
  })
    .then(response => {
      showMessage({
        type: 'success',
        message: lang.t('form.pos.optionsPoinSales.salesOrder.orderRemoved'),
        showClose: true
      })
      store.dispatch('listOrdersFromServer', {
        posUuid: uuid
      })
      store.dispatch('reloadOrder', '')
      store.dispatch('updateOrderPos', false)
      // close panel lef
      store.commit('setShowPOSOptions', false)
    })
    .catch(error => {
      showMessage({
        type: 'error',
        message: error.message,
        showClose: true
      })
    })
}

function openDelivery() {
  store.commit('setDialogoComponent', true)
  return false
}

function openDeliveryAllProducts() {
  store.commit('setDialogoComponent', true)
  return false
}

function applyDiscount({ pinVerificationApproved = false }) {
  const { isAllowsModifyDiscount, currentOrder } = store.getters.posAttributes.currentPointOfSales
  if (isEmptyValue(currentOrder.uuid)) return true
  if (!isAllowsModifyDiscount && !pinVerificationApproved) return { isRequirePin: true, pinName: lang.t('form.pos.applyDiscountOnOrder'), requestedAccess: 'applyDiscount' }
  store.commit('setDialogoComponent', true)
  return false
}

function cashOpen() {
  const { isAllowsCashOpening } = store.getters.posAttributes.currentPointOfSales
  if (!isAllowsCashOpening) return true
  store.commit('setshowCashOpen', true)
  return false
}

function cashClose() {
  const { isAllowsCashClosing } = store.getters.posAttributes.currentPointOfSales
  if (!isAllowsCashClosing) return true
  store.commit('setShowCashSummaryMovements', true)
  return false
}

function assignSeller() {
  const { isAllowsAllocateSeller } = store.getters.posAttributes.currentPointOfSales
  if (!isAllowsAllocateSeller) return true
  store.commit('setShowAssignSeller', true)
  return false
}

function unassignSeller() {
  const { isAllowsAllocateSeller } = store.getters.posAttributes.currentPointOfSales
  if (!isAllowsAllocateSeller) return true
  store.commit('setShowUnassignSeller', true)
  return false
}

function changePos() {
  store.commit('setDialogoComponent', true)
  return false
}

function listProducts() {
  store.commit('setDialogoComponent', true)
  return false
}

function changeWarehouseList() {
  store.commit('setDialogoComponent', true)
  return false
}

function changePriceList() {
  store.commit('setDialogoComponent', true)
  return false
}
