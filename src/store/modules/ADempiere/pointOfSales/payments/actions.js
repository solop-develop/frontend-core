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

import lang from '@/lang'

// api request methods
import {
  // requestGetConversionRate,
  createPayment,
  deletePayment,
  updatePayment,
  getPaymentsList,
  // Customer Bank Account
  createCustomerBankAccount,
  listCustomerBankAccounts,
  // Cash Summary Movements
  cashSummaryMovements,
  listCashMovements,
  RefundReferenceRequest,
  listRefundReference,
  deleteRefundReference
} from '@/api/ADempiere/form/point-of-sales.js'

import {
  requestGetConversionRate
} from '@/api/ADempiere/common/index.ts'

// utils and helper methods
import { formatDate } from '@/utils/ADempiere/formatValue/dateFormat'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import { showMessage } from '@/utils/ADempiere/notification.js'

/**
 * Payments Actions
 */
export default {
  /**
   * creating boxes with the payment list
   */
  setPaymentBox({ state, commit, getters }, {
    quantityCahs,
    bankUuid,
    referenceNo,
    description,
    amount,
    convertedAmount,
    paymentDate,
    tenderTypeCode,
    currencyUuid
  }) {
    const payments = getters.getPaymentBox.find(element => {
      if (tenderTypeCode === 'X' && element.currencyUuid === currencyUuid) {
        return element
      }
    })
    if (isEmptyValue(payments)) {
      commit('addPaymentBox', {
        quantityCahs,
        bankUuid,
        referenceNo,
        description,
        amount,
        convertedAmount,
        paymentDate,
        tenderTypeCode,
        currencyUuid
      })
    } else {
      const addPayment = getters.getPaymentBox.map(item => {
        if ((item.tenderTypeCode === tenderTypeCode) && item.currencyUuid === currencyUuid) {
          return {
            ...item,
            payAmt: item.amount + amount,
            quantityCahs: item.quantityCahs + quantityCahs
          }
        }
        return item
      })
      state.paymentBox = addPayment
    }
  },
  // upload orders to theServer
  uploadOrdersToServer({ dispatch, rootGetters }, {
    listPaymentsLocal,
    posUuid,
    orderUuid,
    invoiceReferenceId
  }) {
    listPaymentsLocal.forEach(payment => {
      const isProcessLoading = rootGetters.getProcessLoading
      if (isProcessLoading) return
      createPayment({
        posUuid,
        orderUuid,
        bankUuid: payment.bankUuid,
        referenceNo: payment.referenceNo,
        description: payment.description,
        amount: payment.amount,
        paymentDate: payment.paymentDate,
        tenderTypeCode: payment.tenderTypeCode,
        isRefund: false,
        invoiceReferenceId,
        currencyUuid: payment.currencyUuid

      })
        .then(response => {
          const orderUuid = response.orderUuid
          dispatch('listPayments', { posUuid, orderUuid })
          dispatch('reloadOrder', { posUuid, orderUuid })
        })
        .catch(error => {
          console.warn(`ListPaymentsFromServer: ${error.message}. Code: ${error.code}.`)
          showMessage({
            type: 'error',
            message: error.message,
            showClose: true
          })
        })
    })
  },
  deleteCollectBox({ state }, key) {
    const payment = state.paymentBox
    payment.splice(key, 1)
  },
  deleteAllCollectBox({ state }) {
    const payment = state.paymentBox
    payment.splice(0)
  },
  searchConversion({ commit, getters, rootGetters }, params) {
    const posUuid = isEmptyValue(params.currentPOS) ? rootGetters.posAttributes.currentPointOfSales.uuid : params.currentPOS.uuid
    if (isEmptyValue(params.currencyToUuid)) {
      return
    }
    return requestGetConversionRate({
      posUuid,
      conversionTypeUuid: params.conversionTypeUuid,
      currencyFromUuid: params.currencyFromUuid,
      currencyToUuid: params.currencyToUuid,
      conversionDate: params.conversionDate
    })
      .then(response => {
        if (isEmptyValue(response) || response.id <= 0) {
          let conversionDate = params.conversionDate
          if (isEmptyValue(conversionDate)) {
            conversionDate = formatDate(new Date())
          }
        }

        commit('addConversionToList', response)
        return response
      })
      .catch(error => {
        console.warn(`conversionDivideRate: ${error.message}. Code: ${error.code}.`)
      })
  },
  conversionDivideRate({ commit, dispatch, getters, rootGetters }, params) {
    const posUuid = isEmptyValue(params.currentPOS) ? rootGetters.posAttributes.currentPointOfSales.uuid : params.currentPOS.uuid
    return requestGetConversionRate({
      posUuid,
      conversionTypeUuid: params.conversionTypeUuid,
      currencyFromUuid: params.currencyFromUuid,
      currencyToUuid: params.currencyToUuid,
      conversionDate: params.conversionDate
    })
      .then(response => {
        if (isEmptyValue(response) || response.id <= 0) {
          let conversionDate = params.conversionDate
          if (isEmptyValue(conversionDate)) {
            conversionDate = formatDate(new Date())
          }
          const currencyFrom = getters.getCurrenciesList.find(currency => {
            return currency.uuid === params.currencyFromUuid
          })
          const currencyTo = getters.getCurrenciesList.find(currency => {
            return currency.uuid === params.currencyToUuid
          })

          showMessage({
            type: 'warning',
            message: lang.t('pointOfSales.conversionRate.withoutConversionRate') + conversionDate + ', ' +
              currencyFrom.currency_symbol + ' => ' + currencyTo.currency_symbol
          })
          console.warn(
            lang.t('pointOfSales.conversionRate.withoutConversionRate') + conversionDate + ', ' +
            currencyFrom.currency_symbol + ' => ' + currencyTo.currency_symbol
          )
        }
        commit('setFieldCurrency', response.currencyTo)
        if (!isEmptyValue(response.currencyTo)) {
          const currency = {
            ...response.currencyTo,
            amountConvertion: response.divideRate,
            multiplyRate: response.multiplyRate
          }
          dispatch('addRateConvertion', currency)
        }
        const divideRate = isEmptyValue(response.divideRate) ? 1 : response.divideRate
        const multiplyRate = isEmptyValue(response.multiplyRate) ? 1 : response.multiplyRate
        if (params.containerUuid === 'Collection') {
          commit('currencyMultiplyRateCollection', multiplyRate)
          commit('currencyDivideRateCollection', divideRate)
        } else {
          commit('currencyMultiplyRate', multiplyRate)
          commit('currencyDivideRateCollection', divideRate)
        }
        return response
      })
      .catch(error => {
        console.warn(`conversionDivideRate: ${error.message}. Code: ${error.code}.`)
        showMessage({
          type: 'error',
          message: error.message,
          showClose: true
        })
      })
  },
  addRateConvertion({ commit, state, getters }, currency) {
    commit('conversionRate', currency)
  },
  changeMultiplyRate({ commit }, params) {
    commit('currencyMultiplyRate', params)
  },
  changeDivideRate({ commit }, divideRate) {
    commit('currencyDivideRate', divideRate)
  },
  createPayments({ dispatch, state, getters }, {
    posUuid,
    orderUuid,
    invoiceUuid,
    bankUuid,
    referenceNo,
    description,
    amount,
    convertedAmount,
    paymentDate,
    tenderTypeCode,
    paymentMethodUuid,
    customerBankAccountUuid,
    currencyUuid,
    invoiceReferenceId
  }) {
    const isProcessLoading = getters.getProcessLoading
    if (isProcessLoading) return
    const listPayments = getters.getListPayments.payments.find(payment => {
      if ((payment.paymentMethod.uuid === paymentMethodUuid) && (payment.tenderTypeCode === 'X') && (currencyUuid === payment.currency.uuid)) {
        return payment
      }
      return undefined
    })
    if (isEmptyValue(listPayments)) {
      return createPayment({
        posUuid,
        orderUuid,
        invoiceUuid,
        bankUuid,
        referenceNo,
        description,
        amount,
        convertedAmount,
        paymentDate,
        tenderTypeCode,
        paymentMethodUuid,
        customerBankAccountUuid,
        isRefund: false,
        invoiceReferenceId,
        currencyUuid
      })
        .then(response => {
          const orderUuid = response.orderUuid
          dispatch('listPayments', { posUuid, orderUuid })
          dispatch('reloadOrder', { posUuid, orderUuid })
          return {
            ...response,
            type: 'Success'
          }
        })
        .catch(error => {
          console.warn(`ListPaymentsFromServer: ${error.message}. Code: ${error.code}.`)
          showMessage({
            type: 'error',
            message: error.message,
            showClose: true
          })
          return {
            ...error,
            type: 'error'
          }
        })
    } else {
      return updatePayment({
        posUuid,
        paymentUuid: listPayments.uuid,
        bankUuid,
        referenceNo,
        description,
        amount: listPayments.amount + amount,
        paymentDate,
        paymentMethodUuid,
        tenderTypeCode
      })
        .then(response => {
          const orderUuid = response.order_uuid
          dispatch('listPayments', { posUuid, orderUuid })
          dispatch('reloadOrder', { posUuid, orderUuid })
          return {
            ...response,
            type: 'Success'
          }
        })
        .catch(error => {
          console.warn(`ListPaymentsFromServer: ${error.message}. Code: ${error.code}.`)
          showMessage({
            type: 'error',
            message: error.message,
            showClose: true
          })
          return {
            ...error,
            type: 'error'
          }
        })
    }
  },
  deletetPayments({ dispatch }, {
    posUuid,
    orderUuid,
    paymentUuid
  }) {
    deletePayment({
      posUuid,
      paymentUuid
    })
      .then(response => {
        dispatch('listPayments', { posUuid, orderUuid })
        dispatch('reloadOrder', { posUuid, orderUuid })
      })
      .catch(error => {
        console.warn(`ListPaymentsFromServer: ${error.message}. Code: ${error.code}.`)
        showMessage({
          type: 'error',
          message: error.message,
          showClose: true
        })
      })
  },
  listPayments({ commit, dispatch }, { posUuid, orderUuid }) {
    dispatch('updatePaymentPos', true)
    getPaymentsList({
      posUuid,
      orderUuid
    })
      .then(response => {
        commit('listRefund', response.listPayments)
        commit('setListPayments', {
          payments: response.listPayments.reverse(),
          isLoaded: true
        })
        dispatch('listRefunds', { posUuid, orderUuid })
        dispatch('reloadOrder', { posUuid, orderUuid })
      })
      .catch(error => {
        console.warn(`ListPaymentsFromServer: ${error.message}. Code: ${error.code}.`)
      })
      .finally(() => {
        dispatch('updatePaymentPos', false)
      })
  },
  currencyDisplaye({ commit }, currency) {
    const displaycurrency = currency.map(item => {
      return {
        currencyUuid: item.uuid,
        currencyId: item.id,
        currencyDisplay: item.label
      }
    })
    commit('setCurrencyDisplaye', displaycurrency)
  },
  addRefundLoaded({ commit, state }, refund) {
    const addRefund = state.refundLoaded
    addRefund.push(refund)
    commit('setRefundLoaded', addRefund)
  },
  currencyRedund({ commit }, currency) {
    commit('setCurrencyRedund', currency)
  },
  addCreateCustomerAccount({ commit }, {
    customerAccount,
    customer,
    posUuid,
    orderUuid,
    invoiceUuid,
    bankUuid,
    referenceNo,
    description,
    amount,
    convertedAmount,
    paymentDate,
    tenderTypeCode,
    paymentMethodUuid,
    currencyUuid
  }) {
    commit('setAddRefund', {
      customerAccount,
      customer,
      posUuid,
      orderUuid,
      invoiceUuid,
      bankUuid,
      referenceNo,
      description,
      amount,
      convertedAmount,
      paymentDate,
      tenderTypeCode,
      paymentMethodUuid,
      currencyUuid
    })
  },
  sendCreateCustomerAccount({ commit, dispatch, getters }, {
    customerAccount,
    posUuid,
    orderUuid,
    invoiceUuid,
    bankUuid,
    referenceNo,
    description,
    amount,
    convertedAmount,
    paymentDate,
    tenderTypeCode,
    customerBankAccountUuid,
    paymentMethodUuid,
    currencyUuid
  }) {
    const listPayments = getters.getListPayments.payments.find(payment => {
      if (payment.isRefund && (payment.paymentMethod.uuid === paymentMethodUuid) && (payment.tenderTypeCode === 'X') && (currencyUuid === payment.currency.uuid)) {
        return payment
      }
      return undefined
    })
    if (isEmptyValue(listPayments)) {
      return createPayment({
        customerAccount,
        posUuid,
        orderUuid,
        invoiceUuid,
        bankUuid,
        referenceNo,
        description,
        amount,
        convertedAmount,
        paymentDate,
        tenderTypeCode,
        paymentMethodUuid,
        currencyUuid,
        customerBankAccountUuid,
        isRefund: true
      })
        .then(response => {
          const orderUuid = response.orderUuid
          dispatch('listPayments', { posUuid, orderUuid })
          return {
            ...response,
            type: 'success'
          }
        })
        .catch(error => {
          console.warn(`ListPaymentsFromServer: ${error.message}. Code: ${error.code}.`)
          showMessage({
            type: 'error',
            message: error.message,
            showClose: true
          })
          return { type: 'error' }
        })
    } else {
      return updatePayment({
        posUuid,
        paymentUuid: listPayments.uuid,
        bankUuid,
        referenceNo,
        description,
        amount: listPayments.amount + amount,
        paymentDate,
        paymentMethodUuid,
        tenderTypeCode
      })
        .then(response => {
          const orderUuid = response.order_uuid
          dispatch('listPayments', { posUuid, orderUuid })
          dispatch('reloadOrder', { posUuid, orderUuid })
          return {
            ...response,
            type: 'Success'
          }
        })
        .catch(error => {
          console.warn(`ListPaymentsFromServer: ${error.message}. Code: ${error.code}.`)
          showMessage({
            type: 'error',
            message: error.message,
            showClose: true
          })
          return {
            ...error,
            type: 'error'
          }
        })
    }
  },
  /**
  * Refund payment at a later time
  * customer_uuid - Customer UUID
  * pos_uuid - Value
  * city - City
  * country - Country
  * email - EMail
  * driver_license - Driver Licence
  * social_security_number - Social Security Number (SSN)
  * name - Name
  * state - State
  * street - Strert
  * zip - ZIP
  * bank_account_type - Bank Accoubnt Type
  * bank_uuid - Bank UUID
  * is_ach - ACH
  * address_verified - Address Verified
  * zip_verified - ZIP Verified
  * routing_no - Routing No
  * iban - IBAN
  */
  customerBankAccount({ commit, dispatch }, {
    customerUuid,
    posUuid,
    city,
    country,
    email,
    driverLicense,
    socialSecurityNumber,
    name,
    state,
    street,
    zip,
    bankAccountType = 'C',
    bankUuid,
    paymentMethodUuid,
    isAch,
    addressVerified,
    zipVerified,
    routingNo,
    AccountNo,
    iban
  }) {
    return new Promise(resolve => {
      createCustomerBankAccount({
        customerUuid,
        posUuid,
        city,
        country,
        email,
        driverLicense,
        socialSecurityNumber,
        name,
        state,
        street,
        zip,
        bankAccountType,
        paymentMethodUuid,
        bankUuid,
        isAch,
        AccountNo,
        addressVerified,
        zipVerified,
        routingNo,
        iban
      })
        .then(response => {
          commit('setCurrentCustomerBankAccount', response)
          dispatch('listCustomerBankAccounts', { customerUuid: response.customerUuid })
          resolve(response)
        })
        .catch(error => {
          console.warn(`conversionDivideRate: ${error.message}. Code: ${error.code}.`)
          showMessage({
            type: 'error',
            message: error.message,
            showClose: true
          })
          resolve({})
        })
    })
  },
  listCustomerBankAccounts({ commit, dispatch }, {
    posUuid,
    customerUuid,
    pageToken
  }) {
    listCustomerBankAccounts({
      posUuid,
      customerUuid,
      pageToken
    })
      .then(response => {
        commit('setListCustomerBankAccounts', response.records)
      })
  },
  refundReference({ commit, dispatch }, {
    posUuid,
    description,
    amount,
    sourceAmount,
    isReceipt,
    date,
    tenderTypeCode,
    currencyUuid,
    conversionTypeUuid,
    paymentMethodUuid,
    paymentAccountDate,
    customerBankAccountUuid,
    orderUuid,
    customerUuid,
    salesRepresentativeUuid
  }) {
    RefundReferenceRequest({
      posUuid,
      description,
      amount,
      sourceAmount,
      date,
      isReceipt,
      customerUuid,
      tenderTypeCode,
      currencyUuid,
      conversionTypeUuid,
      paymentMethodUuid,
      paymentAccountDate,
      orderUuid,
      customerBankAccountUuid,
      salesRepresentativeUuid
    })
      .then(response => {
        dispatch('listRefunds', {
          posUuid,
          customerUuid,
          orderUuid
        })
        dispatch('reloadOrder', { posUuid, orderUuid })
      })
  },
  listRefunds({ commit }, {
    posUuid,
    orderUuid
  }) {
    listRefundReference({
      posUuid,
      orderUuid
    })
      .then(response => {
        commit('setListRefundReference', response.records)
      })
  },
  deleteRefundReferences({ dispatch }, {
    posUuid,
    customerUuid,
    orderUuid,
    uuid
  }) {
    deleteRefundReference({
      posUuid,
      uuid
    })
      .then(response => {
        dispatch('listRefunds', {
          posUuid,
          orderUuid
        })
        dispatch('reloadOrder', { posUuid, orderUuid })
      })
      .catch(error => {
        console.warn(`ListPaymentsFromServer: ${error.message}. Code: ${error.code}.`)
        showMessage({
          type: 'error',
          message: error.message,
          showClose: true
        })
        return { type: 'error' }
      })
  },
  addDeliveryList({ commit, state, getters }, product) {
    const deliveryList = state.deliveryList
    const addProduct = deliveryList.find(delivery => {
      if (delivery.uuid === product.uuid) {
        return delivery
      }
      return undefined
    })
    if (isEmptyValue(addProduct)) {
      deliveryList.push(product)
      commit('setDeliveryList', deliveryList)
    } else {
      deliveryList.map(delivery => {
        if (delivery.uuid === product.uuid) {
          return {
            ...delivery,
            quantity: delivery.quantity++
          }
        }
        return delivery
      })
      commit('setDeliveryList', deliveryList)
    }
  },
  listCashSummary({ commit, state }, posUuid) {
    cashSummaryMovements({
      posUuid
    })
      .then(response => {
        commit('setListCashSummary', response)
      })
      .catch(error => {
        this.$message({
          message: error.message,
          isShowClose: true,
          type: 'error'
        })
        commit('setListCashSummary', [])
        console.warn(`Error: ${error.message}. Code: ${error.code}.`)
      })
  },
  listCashMovementsSummary({ commit, state, rootGetters }, {
    posUuid,
    customerUuid,
    salesRepresentativeUuid
  }) {
    if (isEmptyValue(posUuid)) {
      posUuid = rootGetters.posAttributes.currentPointOfSales.uuid
    }
    listCashMovements({
      posUuid,
      customerUuid,
      salesRepresentativeUuid
    })
      .then(response => {
        const records = response.records.map(list => {
          return {
            ...list,
            payment_method_name: list.payment_method.name
          }
        })
        commit('setListCashSummaryMovements', {
          ...response,
          records
        })
      })
      .catch(error => {
        this.$message({
          message: error.message,
          isShowClose: true,
          type: 'error'
        })
        commit('setListCashSummaryMovements', {
          records: []
        })
        console.warn(`Error: ${error.message}. Code: ${error.code}.`)
      })
  },
  listPaymentOpen({ commit, state }, posUuid) {
    getPaymentsList({
      posUuid,
      isOnlyReceipt: true
    })
      .then(response => {
        commit('setListCastOpen', response.listPayments)
      })
      .catch(error => {
        this.$message({
          message: error.message,
          isShowClose: true,
          type: 'error'
        })
        console.warn(`Error: ${error.message}. Code: ${error.code}.`)
      })
  },
  listPaymentWithdrawal({ commit, state }, posUuid) {
    getPaymentsList({
      posUuid,
      isOnlyRefund: true
    })
      .then(response => {
        commit('setListWithdrawal', response.listPayments)
      })
      .catch(error => {
        this.$message({
          message: error.message,
          isShowClose: true,
          type: 'error'
        })
        console.warn(`Error: ${error.message}. Code: ${error.code}.`)
      })
  }

}
