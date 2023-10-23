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

// API Request Methods
import {
  createPayment,
  // updatePayment,
  deletePayment,
  listPayments
  // processOrder
} from '@/api/ADempiere/form/VPOS'
// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import { showMessage } from '@/utils/ADempiere/notification'
import { defaultValueCollections } from '@/utils/ADempiere/dictionary/form/VPOS'

const collection = {
  showCollection: false,
  payments: []
}

export default {
  state: collection,
  mutations: {
    setShowCollection(state, show) {
      state.showCollection = show
    },
    setListPayments(state, list) {
      state.payments = list
    }
  },
  /**
   * Collection
   */
  actions: {
    addPayment({
      getters,
      dispatch
    }, {
      invoice_id,
      bank_id,
      reference_no,
      description,
      amount,
      payment_date,
      tender_type_code,
      currency_id,
      payment_method_id,
      payment_account_date,
      is_refund,
      charge_id,
      collecting_agent_id,
      reference_bank_account_id,
      customer_bank_account_id,
      invoice_reference_id
    }) {
      return new Promise(resolve => {
        const currentPos = getters.getVPOS
        const currentOrder = getters.getCurrentOrder
        if (
          isEmptyValue(currentPos.id) ||
          isEmptyValue(currentOrder.id)
        ) resolve({})
        createPayment({
          posId: currentPos.id,
          order_id: currentOrder.id,
          invoice_id,
          bank_id,
          reference_no,
          description,
          amount,
          payment_date,
          tender_type_code,
          currency_id,
          payment_method_id,
          payment_account_date,
          is_refund,
          charge_id,
          collecting_agent_id,
          reference_bank_account_id,
          customer_bank_account_id,
          invoice_reference_id
        })
          .then(response => {
            dispatch('getListPayments')
            dispatch('overloadOrder', { order: currentOrder })
              .then(() => {
                defaultValueCollections()
              })
            showMessage({
              type: 'success',
              message: 'Pago Agregado',
              showClose: true
            })
            resolve(response)
          })
          .catch(error => {
            console.warn(`Add Payment: ${error.message}. Code: ${error.code}.`)
            showMessage({
              type: 'error',
              message: error.message,
              showClose: true
            })
            resolve({})
          })
      })
    },
    getListPayments({
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
        listPayments({
          posId: currentPos.id,
          orderId: currentOrder.id
        })
          .then(response => {
            const { payments } = response
            commit('setListPayments', payments)
            resolve(response)
          })
          .catch(error => {
            console.warn(`Add Payment: ${error.message}. Code: ${error.code}.`)
            showMessage({
              type: 'error',
              message: error.message,
              showClose: true
            })
            resolve({})
          })
      })
    },
    removePayment({
      getters,
      dispatch
    }, {
      payment_id
    }) {
      return new Promise(resolve => {
        const currentPos = getters.getVPOS
        const currentOrder = getters.getCurrentOrder
        if (
          isEmptyValue(currentPos.id) ||
          isEmptyValue(payment_id) ||
          isEmptyValue(currentOrder.id)
        ) resolve({})
        deletePayment({
          posId: currentPos.id,
          payment_id
        })
          .then(response => {
            dispatch('getListPayments')
            dispatch('overloadOrder', { order: currentOrder })
              .then(() => {
                defaultValueCollections()
              })
            showMessage({
              type: 'success',
              message: 'OK',
              showClose: true
            })
            resolve(response)
          })
          .catch(error => {
            console.warn(`Add Payment: ${error.message}. Code: ${error.code}.`)
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
    getOpenCollection: (state) => {
      return state.showCollection
    },
    getListPayments: (state) => {
      return state.payments
    }
  }
}
