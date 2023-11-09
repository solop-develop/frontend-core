// ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
// Copyright (C) 2023-Present E.R.P. Consultores y Asociados, C.A.
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
import router from '@/router'
import lang from '@/lang'
// API Request Methods
import {
  copyOrder,
  deleteOrder,
  printTicket,
  createRMA,
  listRMALine,
  createRMALine,
  deleteRMALine,
  updateRMALine,
  reverseSales,
  printPreview,
  processRMA,
  createShipment,
  processShipment,
  listShipmentLines,
  createShipmentLine,
  updateShipmentLine,
  deleteShipmentLine,
  printShipmentPreview,
  createOrderFromRMA,
  listCashMovements,
  processCashClosing,
  listCashSummaryMovements
} from '@/api/ADempiere/form/VPOS'
// // Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import { showMessage } from '@/utils/ADempiere/notification'
import { buildLinkHref } from '@/utils/ADempiere/resource.js'
// Constants
import { REPORT_VIEWER_NAME } from '@/utils/ADempiere/constants/report'

const options = {
  showOptions: false,
  showShipment: false,
  shipment: {
    list: [],
    current: {}
  },
  rma: {
    list: [],
    current: {},
    listLine: [],
    isShowCheck: false,
    isCreateNewSubstituteOrder: true
  },
  cashClosings: {
    isDetails: false,
    isLoading: false,
    listSummary: [],
    summary: undefined
  }
}

export default {
  state: options,
  mutations: {
    setShowOptions(state, show) {
      state.showOptions = show
    },
    setShowShipment(state, show) {
      state.showShipment = show
    },
    setShipmentList(state, list) {
      state.shipment.list = list
    },
    setShipment(state, shipment) {
      state.shipment.current = shipment
    },
    setAttributeRMA(state, {
      attribute,
      value
    }) {
      state.rma[attribute] = value
    },
    setAttributeCashClosings(state, {
      attribute,
      value
    }) {
      state.cashClosings[attribute] = value
    }
  },
  actions: {
    reverseSales({ dispatch, getters }, {
      description
    }) {
      return new Promise(resolve => {
        const currentPos = getters.getVPOS
        const currentOrder = getters.getCurrentOrder
        if (isEmptyValue(currentOrder)) resolve({})
        reverseSales({
          posId: currentPos.id,
          orderId: currentOrder.id,
          description
        })
          .then(response => {
            dispatch('overloadOrder', { order: response })
            dispatch('printTicketVPOS', {
              orderId: response.id
            })
            resolve(response)
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
    printTicketVPOS({
      dispatch,
      getters
    }, {
      orderId,
      invoiceId,
      shipmentId,
      recordId,
      tableName
    }) {
      return new Promise(resolve => {
        const currentPos = getters.getVPOS
        const currentOrder = getters.getCurrentOrder
        if (isEmptyValue(orderId)) orderId = currentOrder.id
        printTicket({
          posId: currentPos.id,
          orderId,
          invoiceId,
          shipmentId,
          recordId,
          tableName
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
              dispatch('generateReportVPOS', {
                orderId,
                file_name,
                mime_type,
                result_type,
                output_stream
              })
            }
            resolve(response)
          })
          .catch(error => {
            console.warn(`Prin Ticket: ${error.message}. Code: ${error.code}.`)
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
    printPreview({
      dispatch,
      getters
    }, {
      orderId
    }) {
      return new Promise(resolve => {
        const currentPos = getters.getVPOS
        const currentOrder = getters.getCurrentOrder
        if (isEmptyValue(orderId)) orderId = currentOrder.id
        printPreview({
          posId: currentPos.id,
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
              dispatch('generateReportVPOS', {
                orderId,
                file_name,
                mime_type,
                result_type,
                output_stream
              })
            }
            resolve(response)
          })
          .catch(error => {
            console.warn(`Prin Previwer: ${error.message}. Code: ${error.code}.`)
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
    generateReportVPOS({
      commit
    }, {
      orderId,
      file_name,
      mime_type,
      result_type,
      output_stream
    }) {
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
    },
    copyOrder({
      getters,
      dispatch
    }, {
      sourceOrderId
    }) {
      return new Promise(resolve => {
        const currentPos = getters.getVPOS
        const currentOrder = getters.getCurrentOrder
        if (
          isEmptyValue(currentPos.id) ||
          isEmptyValue(currentOrder.id)
        ) resolve({})
        if (isEmptyValue(sourceOrderId) && !isEmptyValue(currentOrder)) {
          sourceOrderId = currentOrder.id
        }
        copyOrder({
          posId: currentPos.id,
          sourceOrderId,
          salesRepresentativeId: currentPos.sales_representative.id
        })
          .then(response => {
            dispatch('overloadOrder', { order: currentOrder })
            resolve(response)
          })
          .catch(error => {
            console.warn(`Process Orders: ${error.message}. Code: ${error.code}.`)
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
    deleteOrder({ commit, getters }) {
      return new Promise(resolve => {
        const pos = getters.getVPOS
        const order = getters.getCurrentOrder
        if (isEmptyValue(order)) resolve({})
        deleteOrder({
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
    newShipment({
      getters,
      commit,
      dispatch
    }, {
      isCreateLinesFromOrder = false
    }) {
      return new Promise(resolve => {
        const currentPos = getters.getVPOS
        const currentOrder = getters.getCurrentOrder
        if (
          isEmptyValue(currentPos.id) ||
          isEmptyValue(currentOrder.id)
        ) resolve({})
        createShipment({
          posId: currentPos.id,
          isCreateLinesFromOrder,
          orderId: currentOrder.id,
          salesRepresentativeId: currentPos.sales_representative.id
        })
          .then(response => {
            commit('setShipment', response)
            dispatch('listShipmentLines')
            resolve(response)
          })
          .catch(error => {
            commit('setShipment', {})
            commit('setShipmentList', [])
            console.warn(`Create Shipment: ${error.message}. Code: ${error.code}.`)
            let message = error.message
            if (!isEmptyValue(error.response) && !isEmptyValue(error.response.data.message)) {
              message = error.response.data.message
            }

            commit('setShowedModalDialogVPOS', {
              isShowed: false
            })

            showMessage({
              type: 'error',
              message,
              showClose: true
            })
            resolve({})
          })
      })
    },
    createShipmentLine({
      getters,
      dispatch
    }, {
      quantity,
      description,
      orderLineId
    }) {
      return new Promise(resolve => {
        const currentPos = getters.getVPOS
        const currentShipment = getters.getCurrentShipment
        if (
          isEmptyValue(currentPos.id)
        ) resolve({})
        createShipmentLine({
          posId: currentPos.id,
          quantity,
          shipmentId: currentShipment.id,
          description,
          orderLineId
        })
          .then(response => {
            dispatch('listShipmentLines')
            resolve(response)
          })
          .catch(error => {
            console.warn(`Create Shipment Line: ${error.message}. Code: ${error.code}.`)
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
    updateShipmentLine({
      getters,
      dispatch
    }, {
      lineId,
      quantity
    }) {
      return new Promise(resolve => {
        const currentPos = getters.getVPOS
        const currentShipment = getters.getCurrentShipment
        if (
          isEmptyValue(currentPos.id) ||
          isEmptyValue(currentShipment.id)
        ) resolve({})
        updateShipmentLine({
          posId: currentPos.id,
          lineId,
          quantity,
          shipmentId: currentShipment.id
        })
          .then(response => {
            dispatch('listShipmentLines')
            resolve(response)
          })
          .catch(error => {
            console.warn(`Update Shipment Line: ${error.message}. Code: ${error.code}.`)
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
    deleteShipmentLine({
      getters,
      dispatch
    }, {
      lineId
    }) {
      return new Promise(resolve => {
        const currentPos = getters.getVPOS
        const currentShipment = getters.getCurrentShipment
        if (
          isEmptyValue(currentPos.id) ||
          isEmptyValue(currentShipment.id)
        ) resolve({})
        deleteShipmentLine({
          lineId,
          posId: currentPos.id,
          shipmentId: currentShipment.id
        })
          .then(response => {
            dispatch('listShipmentLines')
            resolve(response)
          })
          .catch(error => {
            console.warn(`Delete Shipment Line: ${error.message}. Code: ${error.code}.`)
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
    listShipmentLines({
      commit,
      getters
    }) {
      return new Promise(resolve => {
        const currentPos = getters.getVPOS
        const currentShipment = getters.getCurrentShipment
        if (
          isEmptyValue(currentPos.id)
        ) resolve({})
        listShipmentLines({
          posId: currentPos.id,
          shipmentId: currentShipment.id
        })
          .then(response => {
            const { shipment_lines } = response
            commit('setShipmentList', shipment_lines.map(list => {
              return {
                ...list,
                isEditQty: false,
                isLoading: false
              }
            }))
            resolve(response)
          })
          .catch(error => {
            console.warn(`List Shipment Line: ${error.message}. Code: ${error.code}.`)
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
    sendProcessShipment({
      getters,
      commit,
      dispatch
    }) {
      return new Promise(resolve => {
        const currentPos = getters.getVPOS
        const { id } = getters.getCurrentShipment
        if (
          isEmptyValue(currentPos.id)
        ) resolve({})
        processShipment({
          posId: currentPos.id,
          id
        })
          .then(response => {
            dispatch('printShipmentPreview')
              .then(() => {
                commit('setShipment', {})
                commit('setShipmentList', [])
              })
            dispatch('setModalDialogVPOS', {
              title: lang.t('form.pos.optionsPoinSales.salesOrder.confirmDelivery'),
              type: 'success',
              doneMethod: () => {},
              // TODO: Change to string and import dynamic in component
              componentPath: () => import('@/components/ADempiere/Form/VPOS2/Options/Shipments/info.vue'),
              isShowed: true
            })
            resolve(response)
          })
          .catch(error => {
            console.warn(`Process Shipment: ${error.message}. Code: ${error.code}.`)
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
    printShipmentPreview({
      dispatch,
      getters
    }) {
      return new Promise(resolve => {
        const currentPos = getters.getVPOS
        const shipment = getters.getCurrentShipment
        printShipmentPreview({
          posId: currentPos.id,
          shipmentId: shipment.id
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
              dispatch('generateReportVPOS', {
                orderId: shipment.id,
                file_name,
                mime_type,
                result_type,
                output_stream
              })
            }
            resolve(response)
          })
          .catch(error => {
            console.warn(`Prin Previwer: ${error.message}. Code: ${error.code}.`)
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
    createRMA({
      commit,
      getters,
      dispatch
    }) {
      return new Promise(resolve => {
        const currentPos = getters.getVPOS
        const currentOrder = getters.getCurrentOrder
        if (
          isEmptyValue(currentPos.id) ||
          isEmptyValue(currentOrder.id)
        ) resolve({})
        createRMA({
          posId: currentPos.id,
          sourceOrderId: currentOrder.id
        })
          .then(response => {
            commit('setAttributeRMA', {
              attribute: 'current',
              value: response
            })
            dispatch('listRMALine')
              .finally(() => {
                resolve(response)
              })
          })
          .catch(error => {
            console.warn(`Create RMA: ${error.message}. Code: ${error.code}.`)
            let message = error.message
            if (!isEmptyValue(error.response) && !isEmptyValue(error.response.data.message)) {
              message = error.response.data.message
            }

            commit('setShowedModalDialogVPOS', {
              isShowed: false
            })

            showMessage({
              type: 'error',
              message,
              showClose: true
            })
            resolve({})
          })
      })
    },
    createRMALine({
      getters,
      dispatch
    }, {
      quantity,
      sourceOrderLineId
    }) {
      return new Promise(resolve => {
        const currentPos = getters.getVPOS
        const currentRMA = getters.getAttributeRMA({
          attribute: 'current'
        })
        if (
          isEmptyValue(currentPos.id) ||
          isEmptyValue(currentRMA.id)
        ) resolve({})
        createRMALine({
          posId: currentPos.id,
          rmaId: currentRMA.id,
          sourceOrderLineId,
          quantity
        })
          .then(response => {
            dispatch('createRMA')
            resolve(response)
          })
          .catch(error => {
            dispatch('listRMALine')
            console.warn(`Create RMA Line: ${error.message}. Code: ${error.code}.`)
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
    updateRMALine({
      getters,
      dispatch
    }, {
      lineId,
      quantity
    }) {
      return new Promise(resolve => {
        const currentPos = getters.getVPOS
        const currentRMA = getters.getAttributeRMA({
          attribute: 'current'
        })
        if (
          isEmptyValue(currentPos.id) ||
          isEmptyValue(currentRMA.id)
        ) resolve({})
        updateRMALine({
          posId: currentPos.id,
          rmaId: currentRMA.id,
          lineId,
          quantity
        })
          .then(response => {
            dispatch('createRMA')
              .finally(() => {
                resolve(response)
              })
          })
          .catch(error => {
            dispatch('listRMALine')
            console.warn(`Update RMA Line: ${error.message}. Code: ${error.code}.`)
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
    listRMALine({
      commit,
      getters
    }) {
      return new Promise(resolve => {
        const currentPos = getters.getVPOS
        const currentRMA = getters.getAttributeRMA({
          attribute: 'current'
        })
        if (
          isEmptyValue(currentPos.id)
        ) resolve({})
        listRMALine({
          posId: currentPos.id,
          rmaId: currentRMA.id
        })
          .then(response => {
            const { rma_lines } = response
            commit('setAttributeRMA', {
              attribute: 'listLine',
              value: rma_lines.map(list => {
                return {
                  ...list,
                  isEditQty: false,
                  isLoading: false
                }
              })
            })
            resolve(rma_lines)
          })
          .catch(error => {
            commit('setAttributeRMA', {
              attribute: 'listLine',
              value: []
            })
            console.warn(`List RMA Line: ${error.message}. Code: ${error.code}.`)
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
    deleteRMALine({
      getters,
      dispatch
    }, {
      lineId
    }) {
      return new Promise(resolve => {
        const currentPos = getters.getVPOS
        const currentRMA = getters.getAttributeRMA({
          attribute: 'current'
        })
        if (
          isEmptyValue(currentPos.id) ||
          isEmptyValue(currentRMA.id)
        ) resolve({})
        deleteRMALine({
          posId: currentPos.id,
          rmaId: currentRMA.id,
          lineId
        })
          .then(response => {
            dispatch('createRMA')
            resolve(response)
          })
          .catch(error => {
            dispatch('listRMALine')
            console.warn(`Delete RMA Line: ${error.message}. Code: ${error.code}.`)
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
    processRMA({
      commit,
      getters,
      dispatch
    }) {
      return new Promise(resolve => {
        const currentPos = getters.getVPOS
        const currentOrder = getters.getCurrentOrder
        const currentRMA = getters.getAttributeRMA({
          attribute: 'current'
        })
        const isCreateNewSubstituteOrder = getters.getAttributeRMA({
          attribute: 'isCreateNewSubstituteOrder'
        })
        if (
          isEmptyValue(currentPos.id) ||
          isEmptyValue(currentRMA.id)
        ) resolve({})
        processRMA({
          posId: currentPos.id,
          rmaId: currentRMA.id
        })
          .then(response => {
            commit('setAttributeRMA', {
              attribute: 'isShowCheck',
              value: true
            })
            dispatch('listRMALine')
            dispatch('overloadOrder', { order: currentOrder })
            dispatch('setModalDialogVPOS', {
              title: lang.t('form.pos.optionsPoinSales.salesOrder.newOrderFromRMA'),
              type: 'success',
              doneMethod: () => {
                commit('setShowedModalDialogVPOS', {
                  isShowed: false
                })
                commit('setAttributeRMA', {
                  attribute: 'current',
                  value: {}
                })
                commit('setAttributeRMA', {
                  attribute: 'list',
                  value: []
                })
                if (isCreateNewSubstituteOrder) {
                  dispatch('createOrderFromRMA', {
                    sourceRmaId: response.id,
                    salesRepresentativeId: response.sales_representative.id
                  })
                }
              },
              componentPath: () => import('@/components/ADempiere/Form/VPOS2/Options/RMA/previwerRMA.vue'),
              isShowed: true
            })
            resolve(response)
          })
          .catch(error => {
            dispatch('listRMALine')
            console.warn(`Process RMA: ${error.message}. Code: ${error.code}.`)
            let message = error.message
            if (!isEmptyValue(error.response) && !isEmptyValue(error.response.data.message)) {
              message = error.response.data.message
            }

            showMessage({
              type: 'error',
              message,
              showClose: true
            })
            dispatch('setModalDialogVPOS', {
              title: message,
              type: 'error',
              doneMethod: () => {
                dispatch('processRMA', {})
              },
              // TODO: Change to string and import dynamic in component
              componentPath: () => import('@/components/ADempiere/Form/VPOS2/Options/RMA/previwerRMA.vue'),
              isShowed: true
            })
            resolve({})
          })
      })
    },
    createOrderFromRMA({
      dispatch,
      getters
    }, {
      sourceRmaId,
      salesRepresentativeId
    }) {
      return new Promise(resolve => {
        const currentPos = getters.getVPOS
        createOrderFromRMA({
          posId: currentPos.id,
          sourceRmaId,
          salesRepresentativeId
        })
          .then(response => {
            dispatch('overloadOrder', { order: response })
            resolve(response)
          })
          .catch(error => {
            console.warn(`Create Order from RMA: ${error.message}. Code: ${error.code}.`)
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
    listCashMovements({
      commit,
      getters
    }, {
      isOnlyProcessed,
      isOnlyRefund
    }) {
      return new Promise(resolve => {
        const currentPos = getters.getVPOS
        if (
          isEmptyValue(currentPos.id)
        ) resolve({})
        commit('setAttributeCashClosings', {
          attribute: 'isLoading',
          value: true
        })
        commit('setAttributeCashClosings', {
          attribute: 'isDetails',
          value: false
        })
        listCashMovements({
          posId: currentPos.id,
          isOnlyProcessed,
          isOnlyRefund
        })
          .then(response => {
            const {
              id,
              cash_movements
            } = response
            commit('setAttributeCashClosings', {
              attribute: 'listSummary',
              value: cash_movements
            })
            commit('setAttributeCashClosings', {
              attribute: 'summary',
              value: id
            })
            resolve(response)
          })
          .catch(error => {
            console.warn(`List Summary Movements Line: ${error.message}. Code: ${error.code}.`)
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
          .finally(() => {
            commit('setAttributeCashClosings', {
              attribute: 'isLoading',
              value: false
            })
          })
      })
    },
    listCashSummaryMovements({
      commit,
      getters
    }, {
      isOnlyProcessed,
      isOnlyRefund
    }) {
      return new Promise(resolve => {
        const currentPos = getters.getVPOS
        if (
          isEmptyValue(currentPos.id)
        ) resolve({})
        commit('setAttributeCashClosings', {
          attribute: 'isLoading',
          value: true
        })
        commit('setAttributeCashClosings', {
          attribute: 'isDetails',
          value: true
        })
        listCashSummaryMovements({
          posId: currentPos.id,
          isOnlyProcessed,
          isOnlyRefund
        })
          .then(response => {
            const {
              id,
              cash_movements
            } = response
            commit('setAttributeCashClosings', {
              attribute: 'listSummary',
              value: cash_movements
            })
            commit('setAttributeCashClosings', {
              attribute: 'summary',
              value: id
            })
            resolve(response)
          })
          .catch(error => {
            console.warn(`List Summary Movements Line: ${error.message}. Code: ${error.code}.`)
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
          .finally(() => {
            commit('setAttributeCashClosings', {
              attribute: 'isLoading',
              value: false
            })
          })
      })
    },
    processCashClosing({
      dispatch,
      getters,
      commit
    }) {
      return new Promise(resolve => {
        const { summary } = getters.getCashClosings
        const currentPos = getters.getVPOS
        if (isEmptyValue(currentPos.id)) resolve({})
        processCashClosing({
          posId: currentPos.id,
          id: summary
        })
          .then(response => {
            dispatch('setModalDialogVPOS', {
              title: lang.t('form.pos.optionsPoinSales.cashManagement.closeBox'),
              type: 'success',
              doneMethod: () => {
                commit('setShowedModalDialogVPOS', {
                  isShowed: false
                })
              },
              componentPath: () => import('@/components/ADempiere/Form/VPOS2/Options/cashManagement/cashClosing/panel.vue'),
              isShowed: true
            })
            resolve(response)
          })
          .catch(error => {
            console.warn(`Process Cash Closing: ${error.message}. Code: ${error.code}.`)
            let message = error.message
            if (!isEmptyValue(error.response) && !isEmptyValue(error.response.data.message)) {
              message = error.response.data.message
            }

            dispatch('setModalDialogVPOS', {
              title: lang.t('form.pos.optionsPoinSales.cashManagement.closeBox'),
              type: 'error',
              doneMethod: () => {
                commit('setShowedModalDialogVPOS', {
                  isShowed: false
                })
              },
              componentPath: () => import('@/components/ADempiere/Form/VPOS2/Options/cashManagement/cashClosing/panel.vue'),
              isShowed: true
            })

            showMessage({
              type: 'error',
              message,
              showClose: true
            })
            resolve({})
          })
          .finally(() => {
            commit('setAttributeCashClosings', {
              attribute: 'isLoading',
              value: false
            })
          })
      })
    }
  },
  getters: {
    getShowOptions: (state) => {
      return state.showOptions
    },
    getShowShipment: (state) => {
      return state.showShipment
    },
    getCurrentShipment: (state) => {
      return state.shipment.current
    },
    getShipmentList: (state) => {
      return state.shipment.list
    },
    getAttributeRMA: (state) => ({ attribute }) => {
      if (isEmptyValue(attribute)) return ''
      return state.rma[attribute]
    },
    getAttributeCashClosings: (state) => ({ attribute }) => {
      if (isEmptyValue(attribute)) return ''
      return state.cashClosings[attribute]
    },
    getCashClosings: (state) => {
      return state.cashClosings
    }
  }
}
