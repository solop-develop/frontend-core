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

import lang from '@/lang'
// API Request Methods
import {
  createPayment as createPaymentWithdrawal,
  listPayments as listPaymentsWithdrawal,
  deletePayment as deletePaymentsWithdrawal,
  processCashWithdrawal
  // listAvailableCash
} from '@/api/ADempiere/form/VPOS'
// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import { showMessage } from '@/utils/ADempiere/notification'

const cashWithdrawal = {
  field: {
    cash: '',
    amount: 0,
    sellers: '',
    currency: {
      id: ''
    },
    description: '',
    paymentMethods: {
      id: ''
    },
    collectionAgent: '',
    cashBank: ''
  },
  payments: []
}

export default {
  state: cashWithdrawal,
  mutations: {
    setAttributeCashWithdrawalFields(state, {
      attribute,
      value
    }) {
      state.field[attribute] = value
    },
    setCashWithdrawalPayments(state, payments) {
      state.payments = payments
    }
  },
  actions: {
    createPaymentWithdrawal({
      getters,
      dispatch
    }, {
      amount,
      charge_id,
      currency_id,
      payment_method_id
    }) {
      return new Promise(resolve => {
        let reference_bank_account_id
        const currentPos = getters.getVPOS
        const cashBank = getters.getAttributeCashWithdrawalFields({
          attribute: 'cashBank'
        })
        if (!isEmptyValue(cashBank)) {
          reference_bank_account_id = cashBank.id
        }
        if (isEmptyValue(currentPos.id)) resolve([])
        createPaymentWithdrawal({
          amount,
          charge_id,
          currency_id,
          is_refund: true,
          payment_method_id,
          posId: currentPos.id,
          reference_bank_account_id
        })
          .then(responde => {
            dispatch('listPaymentsWithdrawal')
            showMessage({
              type: 'success',
              message: lang.t('pointOfSales.collection.addPayment'),
              showClose: true
            })
            resolve(responde)
          })
          .catch(error => {
            console.warn(`Add Payment: ${error.message}. Code: ${error.code}.`)
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
            resolve({})
          })
      })
    },
    listPaymentsWithdrawal({
      commit,
      getters
    }) {
      return new Promise(resolve => {
        const currentPos = getters.getVPOS
        if (isEmptyValue(currentPos.id)) resolve([])
        listPaymentsWithdrawal({
          isOnlyRefund: true,
          posId: currentPos.id
        })
          .then(response => {
            const { payments } = response
            const list = payments.map(list => {
              return {
                ...list,
                amount: Number(list.amount),
                converted_amount: Number(list.converted_amount)
              }
            })
            commit('setCashOpeningPayments', list)
          })
          .catch(error => {
            console.warn(`List Payments: ${error.message}. Code: ${error.code}.`)
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
          })
      })
    },
    deletePaymentsWithdrawal({
      dispatch,
      getters
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
        deletePaymentsWithdrawal({
          posId: currentPos.id,
          payment_id
        })
          .then(response => {
            dispatch('listPaymentsWithdrawal')
            showMessage({
              type: 'success',
              message: 'OK',
              showClose: true
            })
            resolve(response)
          })
          .catch(error => {
            console.warn(`Add Payment: ${error.message}. Code: ${error.code}.`)
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
    processCashWithdrawal({
      commit,
      getters,
      dispatch
    }) {
      return new Promise(resolve => {
        const currentPos = getters.getVPOS
        const payments = getters.getCashOpeningPayments
        const {
          description,
          collectionAgent
        } = getters.getCashWithdrawal
        processCashWithdrawal({
          posId: currentPos.id,
          payments,
          description,
          collectingAgentId: collectionAgent.id
        })
          .then(response => {
            commit('setShowedModalDialogVPOS', {
              isShowed: false
            })
            dispatch('setModalDialogVPOS', {
              title: lang.t('form.pos.optionsPoinSales.cashManagement.successfulCashWithdrawal'),
              type: 'success',
              doneMethod: () => {
                commit('setShowedModalDialogVPOS', {
                  isShowed: false
                })
                commit('setAttributeCashOpenFields', {
                  attribute: 'description',
                  value: ''
                })
                commit('setAttributeCashOpenFields', {
                  attribute: 'collectionAgent',
                  value: undefined
                })
              },
              // TODO: Change to string and import dynamic in component
              componentPath: () => import('@/components/ADempiere/Form/VPOS2/Options/cashManagement/cashWithdrawal/info.vue'),
              isShowed: true
            })
          })
          .catch(error => {
            console.warn(`Process Cash Withdrawal: ${error.message}. Code: ${error.code}.`)
            let message = error.message
            if (!isEmptyValue(error.response) && !isEmptyValue(error.response.data.message)) {
              message = error.response.data.message
            }

            dispatch('setModalDialogVPOS', {
              title: message,
              type: 'error',
              doneMethod: () => {
                dispatch('processCashWithdrawal')
              },
              // TODO: Change to string and import dynamic in component
              componentPath: () => import('@/components/ADempiere/Form/VPOS2/Options/cashManagement/cashWithdrawal/info.vue'),
              isShowed: true
            })

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
    getAttributeCashWithdrawalFields: (state) => ({ attribute }) => {
      if (isEmptyValue(attribute)) return ''
      return state.field[attribute]
    },
    getCashWithdrawalPayments: (state) => {
      return state.payments
    },
    getCashWithdrawal: (state) => {
      return state.field
    }
  }
}
