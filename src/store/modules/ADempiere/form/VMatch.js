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
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

// API Request Methods
import {
  receipts,
  invoces,
  processReceipt
} from '@/api/ADempiere/form/match.js'

// Utils and Helper Methods
import { showMessage } from '@/utils/ADempiere/notification.js'

const match = {
  invoices: [],
  receipts: [],
  selectedReceipt: [],
  selectedInvoce: []
}

export default {
  state: match,
  mutations: {
    setInvoiceLisMatch(state, list) {
      state.invoices = list
    },
    setReceiptsListMatch(state, list) {
      state.receipts = list
    },
    setSelectedReceiptMatch(state, select) {
      state.selectedReceipt = select
    },
    setSelectedInvoceMatch(state, select) {
      state.selectedInvoce = select
    }
  },
  actions: {
    serverReceiptsList({ commit }, {
      businessPartnerUuid,
      formUuid
    }) {
      receipts({
        businessPartnerUuid,
        formUuid
      })
        .then(response => {
          commit('setReceiptsListMatch', response)
        })
        .catch(error => {
          console.warn(`serverReceiptsList: ${error.message}. Code: ${error.code}.`)
          showMessage({
            type: 'error',
            message: error.message,
            showClose: true
          })
        })
    },
    serverInvocesList({ commit }, {
      businessPartnerUuid,
      formUuid
    }) {
      invoces({
        businessPartnerUuid,
        formUuid
      })
        .then(response => {
          commit('setInvoiceLisMatch', response)
        })
        .catch(error => {
          console.warn(`serverInvocesList: ${error.message}. Code: ${error.code}.`)
          showMessage({
            type: 'error',
            message: error.message,
            showClose: true
          })
        })
    },
    processAssignment({ commit }, {
      businessPartnerUuid,
      receiptUuid,
      invoceUuid,
      formUuid
    }) {
      processReceipt({
        businessPartnerUuid,
        receiptUuid,
        invoceUuid,
        formUuid
      })
        .then(response => {
          showMessage({
            type: 'success',
            message: response.message,
            showClose: true
          })
        })
        .catch(error => {
          console.warn(`processAssignment: ${error.message}. Code: ${error.code}.`)
          showMessage({
            type: 'error',
            message: error.message,
            showClose: true
          })
        })
    },
    selectedelectedReceiptsMatch({ commit }, select) {
      commit('setSelectedReceiptMatch', select)
    },
    selectedInvoceMatch({ commit }, select) {
      commit('setSelectedInvoceMatch', select)
    }
  },
  getters: {
    getInvoiceMatch: (state) => {
      return state.invoices
    },
    getReceiptsMatch: (state) => {
      return state.receipts
    },
    getSelectedReceiptsMatch: (state) => {
      return state.selectedReceipt
    },
    getSelectedInvoceMatch: (state) => {
      return state.selectedInvoce
    }
  }
}
