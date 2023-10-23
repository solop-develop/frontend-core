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
  listAvailablePaymentMethods,
  listAvailableCurrencies
} from '@/api/ADempiere/form/VPOS'
// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import { showMessage } from '@/utils/ADempiere/notification'
import { getMainPaymentMethods, getCurrencyPayment } from '@/utils/ADempiere/dictionary/form/VPOS'

const fieldsCollections = {
  paymentMethods: {
    id: ''
  },
  listPaymentMethods: [],
  availableCurrencies: {
    currencie: {},
    listCurrencies: []
  },
  amount: null
}

export default {
  state: fieldsCollections,
  mutations: {
    setPaymentMethods(state, paymentMethods) {
      state.paymentMethods = paymentMethods
    },
    setListPaymentMethods(state, list) {
      state.listPaymentMethods = list
    },
    setAvailableCurrencies(state, currencie) {
      state.availableCurrencies.currencie = currencie
    },
    setAvailableListCurrencies(state, list) {
      state.availableCurrencies.listCurrencies = list
    },
    setPayAmount(state, amount) {
      state.amount = Number(amount)
    }
  },
  actions: {
    availablePaymentMethods({
      commit,
      getters,
      dispatch
    }) {
      return new Promise(resolve => {
        const currentPos = getters.getVPOS
        if (isEmptyValue(currentPos.id)) resolve({})
        listAvailablePaymentMethods({
          posId: currentPos.id
        })
          .then(response => {
            const { payment_methods } = response
            if (!isEmptyValue(payment_methods)) commit('setPaymentMethods', getMainPaymentMethods({ listPaymentMethods: payment_methods }))
            commit('setListPaymentMethods', payment_methods)
            resolve(payment_methods)
          })
          .catch(error => {
            console.warn(`List Available Payments Methods: ${error.message}. Code: ${error.code}`)
            showMessage({
              type: 'error',
              message: error.message,
              showClose: true
            })
            resolve([])
          })
          .finally(() => {
            dispatch('availableListCurrencies')
          })
      })
    },
    availableListCurrencies({
      commit,
      getters
    }) {
      return new Promise(resolve => {
        const currentPos = getters.getVPOS
        const currentPaymentMethods = getters.getPaymentMethods
        if (isEmptyValue(currentPos.id)) resolve({})
        listAvailableCurrencies({
          posId: currentPos.id
        })
          .then(response => {
            const { currencies } = response
            const currency = getCurrencyPayment({
              paymentMethods: currentPaymentMethods
            })
            commit('setAvailableCurrencies', currency)
            commit('setAvailableListCurrencies', currencies)
            resolve(currencies)
          })
          .catch(error => {
            console.warn(`List Available Currences: ${error.message}. Code: ${error.code}`)
            showMessage({
              type: 'error',
              message: error.message,
              showClose: true
            })
            resolve([])
          })
      })
    }
  },
  getters: {
    getPaymentMethods: (state) => {
      return state.paymentMethods
    },
    getListPaymentMethods: (state) => {
      return state.listPaymentMethods
    },
    getAvailableCurrencies: (state) => {
      return state.availableCurrencies
    },
    getPayAmount: (state) => {
      return state.amount
    }
  }
}
