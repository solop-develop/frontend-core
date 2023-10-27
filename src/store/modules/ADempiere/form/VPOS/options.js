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
// API Request Methods
import {
  reverseSales,
  printTicket,
  printPreview,
  copyOrder,
  deleteOrder
} from '@/api/ADempiere/form/VPOS'
// // Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import { showMessage } from '@/utils/ADempiere/notification'
import { buildLinkHref } from '@/utils/ADempiere/resource.js'
// Constants
import { REPORT_VIEWER_NAME } from '@/utils/ADempiere/constants/report'

const options = {
  showOptions: false,
  showShipment: false
}

export default {
  state: options,
  mutations: {
    setShowOptions(state, show) {
      state.showOptions = show
    },
    setShowShipment(state, show) {
      state.showShipment = show
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
    }
  },
  getters: {
    getShowOptions: (state) => {
      return state.showOptions
    },
    getShowShipment: (state) => {
      return state.showShipment
    }
  }
}
