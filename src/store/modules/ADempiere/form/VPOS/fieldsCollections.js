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
  listAvailablePaymentMethods,
  listAvailableCurrencies,
  createCustomerBankAccount,
  listCustomerCredits,
  listBankAccounts,
  validatePIN,
  listBanks
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
  banks: {
    recipientBank: {},
    issuingBank: {},
    listBanks: []
  },
  bankAccounts: {
    list: [],
    currentAccount: {}
  },
  field: {
    value: '',
    bank: {},
    date: '',
    phone: '',
    referenceNo: '',
    description: '',
    pin: ''
  },
  customerCredits: {
    list: [],
    currentCustomerCredist: {}
  },
  fieldsRefunds: {
    bank: {},
    date: '',
    value: '',
    phone: '',
    typeOptions: '1',
    amount: null,
    currencie: {},
    referenceNo: '',
    description: '',
    accountNo: '',
    issuingBank: {},
    bankAccountType: '',
    recipientBank: {},
    paymentMethods: {},
    currentAccount: {},
    currentCustomerCredist: {}
  },
  amount: null,
  modalPinManager: {}
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
    },
    /**
     * Update Attribute
     * Generic mutation that allows to change the state of the store
     * @param {string} Field - Object Field
     * @param {string} attribute - Attribute and which one to update - Requires it to be an Object
     * @param {string} value - Value to Update
     */
    setAttributeField(state, {
      field,
      attribute,
      value
    }) {
      state[field][attribute] = value
    },
    setDialogPin(state, modal) {
      state.modalPinManager = modal
    },
    setShowedDialogPin(state, {
      isShowed = false
    }) {
      state.modalPinManager.isShowed = isShowed
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
    banks({
      commit,
      getters
    }) {
      return new Promise(resolve => {
        const currentPos = getters.getVPOS
        if (isEmptyValue(currentPos.id)) resolve({})
        listBanks({
          posId: currentPos.id
        })
          .then(response => {
            const { records } = response
            commit('setAttributeField', {
              field: 'banks',
              attribute: 'listBanks',
              value: records
            })
          })
          .catch(error => {
            console.warn(`List Banks: ${error.message}. Code: ${error.code}`)
            let message = error.message
            if (!isEmptyValue(error.response) && !isEmptyValue(error.response.data.message)) {
              message = error.response.data.message
            }

            showMessage({
              type: 'error',
              message,
              showClose: true
            })
            commit('setAttributeField', {
              field: 'banks',
              attribute: 'listBanks',
              value: []
            })
          })
      })
    },
    listAccounts({
      commit,
      getters
    }) {
      return new Promise(resolve => {
        const currentPos = getters.getVPOS
        const currentOrder = getters.getCurrentOrder
        let bankId
        const banck = getters.getAttributeField({
          field: 'banks',
          attribute: 'recipientBank'
        })
        if (banck) bankId = banck.id
        if (isEmptyValue(currentPos.id)) resolve({})
        listBankAccounts({
          posId: currentPos.id,
          bankId,
          customerId: currentOrder.customer.id
        })
          .then(response => {
            const { customer_bank_accounts } = response
            commit('setAttributeField', {
              field: 'bankAccounts',
              attribute: 'list',
              value: customer_bank_accounts
            })
          })
          .catch(error => {
            console.warn(`List Banks Accounts: ${error.message}. Code: ${error.code}`)
            let message = error.message
            if (!isEmptyValue(error.response) && !isEmptyValue(error.response.data.message)) {
              message = error.response.data.message
            }

            showMessage({
              type: 'error',
              message,
              showClose: true
            })
            commit('setAttributeField', {
              field: 'bankAccounts',
              attribute: 'list',
              value: []
            })
          })
      })
    },
    newCustomerBankAccount({
      commit,
      getters
    }, {
      accountNo,
      driverLicense,
      bankId,
      bankAccountType
    }) {
      return new Promise(resolve => {
        const currentPos = getters.getVPOS
        const currentOrder = getters.getCurrentOrder
        const banck = getters.getAttributeField({
          field: 'banks',
          attribute: 'issuingBank'
        })
        const phone = getters.getAttributeField({
          field: 'field',
          attribute: 'phone'
        })
        const value = getters.getAttributeField({
          field: 'field',
          attribute: 'value'
        })
        if (isEmptyValue(bankId)) {
          bankId = banck.id
        }
        if (isEmptyValue(accountNo)) {
          accountNo = phone
        }
        if (isEmptyValue(driverLicense)) {
          driverLicense = value
        }
        if (isEmptyValue(currentPos.id)) resolve({})
        createCustomerBankAccount({
          posId: currentPos.id,
          bankId,
          customerId: currentOrder.customer.id,
          accountNo,
          driverLicense,
          bankAccountType
        })
          .then(response => {
            showMessage({
              type: 'success',
              message: 'OK',
              showClose: true
            })
            resolve(response)
          })
          .catch(error => {
            console.warn(`List Banks Accounts: ${error.message}. Code: ${error.code}`)
            let message = error.message
            if (!isEmptyValue(error.response) && !isEmptyValue(error.response.data.message)) {
              message = error.response.data.message
            }

            showMessage({
              type: 'error',
              message,
              showClose: true
            })
            commit('setAttributeField', {
              field: 'bankAccounts',
              attribute: 'list',
              value: []
            })
            resolve({})
          })
      })
    },
    listCustomerCreditsMemo({
      commit,
      getters
    }) {
      return new Promise(resolve => {
        const currentPos = getters.getVPOS
        const currentOrder = getters.getCurrentOrder
        let document_type_id
        const currentPaymentMethods = getters.getPaymentMethods
        if (currentPaymentMethods) document_type_id = currentPaymentMethods.document_type_id
        if (isEmptyValue(currentPos.id)) resolve({})
        listCustomerCredits({
          posId: currentPos.id,
          customerId: currentOrder.customer.id,
          documentTypeId: document_type_id
        })
          .then(response => {
            let validateRecords = []
            const { records } = response
            if (!isEmptyValue(records)) {
              validateRecords = records.filter(list => Number(list.open_amount.value) > 0)
            }
            commit('setAttributeField', {
              field: 'customerCredits',
              attribute: 'list',
              value: validateRecords
            })
          })
          .catch(error => {
            console.warn(`List Customer Credit Memo: ${error.message}. Code: ${error.code}`)
            let message = error.message
            if (!isEmptyValue(error.response) && !isEmptyValue(error.response.data.message)) {
              message = error.response.data.message
            }

            showMessage({
              type: 'error',
              message,
              showClose: true
            })
            commit('setAttributeField', {
              field: 'customerCredits',
              attribute: 'list',
              value: []
            })
          })
      })
    },
    setModalPin({ commit }, {
      typePin,
      componentPath,
      containerManager = {},
      beforeOpen = function() {},
      doneMethod = function() {},
      isDisabledDone = function() { return false },
      cancelMethod = function() {},
      loadData = function() {},
      title,
      requestedAmount,
      requestedAccess,
      isShowed = false
    }) {
      commit('setDialogPin', {
        typePin,
        componentPath,
        containerManager,
        beforeOpen,
        doneMethod,
        isDisabledDone,
        loadData,
        cancelMethod,
        title,
        requestedAmount,
        requestedAccess,
        isShowed
      })
    },
    validatePIN({
      commit,
      getters
    }, {
      pin,
      requestedAccess,
      requestedAmount
    }) {
      return new Promise(resolve => {
        const currentPos = getters.getVPOS
        const currentOrder = getters.getCurrentOrder
        if (isEmptyValue(pin)) {
          pin = getters.getAttributeField({
            field: 'field',
            attribute: 'pin'
          })
        }
        validatePIN({
          pin,
          posId: currentPos.id,
          orderId: currentOrder.id,
          requestedAccess,
          requestedAmount
        })
          .then(() => {
            showMessage({
              type: 'success',
              message: lang.t('pointOfSales.pin.validateSuccessfully'),
              showClose: true
            })
            resolve(true)
          })
          .catch(error => {
            console.warn(`Validate Pin: ${error.message}. Code: ${error.code}`)
            let message = error.message
            if (!isEmptyValue(error.response) && !isEmptyValue(error.response.data.message)) {
              message = error.response.data.message
            }

            showMessage({
              type: 'error',
              message,
              showClose: true
            })
            resolve(false)
          })
          .finally(() => {
            commit('setAttributeField', {
              field: 'field',
              attribute: 'pin',
              value: ''
            })
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
    },
    getAttributeField: (state) => ({ field, attribute }) => {
      if (isEmptyValue(field) || isEmptyValue(attribute)) return ''
      return state[field][attribute]
    },
    getModalPin: (state) => {
      return state.modalPinManager
    },

    getShowedModalPin: (state) => {
      const modalDialog = state.modalPinManager
      if (isEmptyValue(modalDialog)) {
        return false
      }
      return Boolean(modalDialog.isShowed)
    }
    // getModalPin: (state) => ({ typePin }) => {
    //   return state.modalDialogManager[typePin]
    // },

    // getShowedModalPin: (state) => ({ typePin }) => {
    //   const modalPin = state.modalPinManager[typePin]
    //   if (isEmptyValue(modalPin)) {
    //     return false
    //   }
    //   return Boolean(modalPin.isShowed)
    // }
  }
}
