/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 * Contributor(s): Elsio Sanchez elsiosanchez15@outlook.com https://github.com/elsiosanchez
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
  process,
  listPayments,
  listInvoices
} from '@/api/ADempiere/form/VAllocation.js'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere'
import { dateTimeFormats } from '@/utils/ADempiere/formatValue/dateFormat'
import { showMessage } from '@/utils/ADempiere/notification.js'

const VAllocation = {
  searchCriteria: {
    businessPartnerId: '',
    organizationId: '',
    currencyId: '',
    date: '',
    transactionType: '',
    description: '',
    chargeId: ''
  },
  listRecord: {
    payments: [],
    invoce: []
  },
  selectListRecord: {
    payments: [],
    invoce: []
  },
  difference: {
    amount: 0,
    transactionType: ''
  },
  listAllDifference: [],
  list: {
    payments: [],
    invoces: []
  },
  process: {
    date: '',
    chargeId: '',
    description: '',
    totalDifference: 0,
    transactionOrganizationId: ''
  }
}

export default {
  state: VAllocation,
  mutations: {
    setSearchCriteria(state, structure) {
      state.searchCriteria = structure
    },
    setBusinessPartner(state, id) {
      state.searchCriteria.businessPartnerId = id
    },
    setOrganizations(state, id) {
      state.searchCriteria.organizationId = id
    },
    setCurrency(state, id) {
      state.searchCriteria.currencyId = id
    },
    setDate(state, date) {
      state.searchCriteria.date = date
    },
    setTransactionType(state, type) {
      state.searchCriteria.transactionType = type
    },
    setListPayments(state, list) {
      state.listRecord.payments = list
    },
    setListInvoces(state, list) {
      state.listRecord.invoce = list
    },
    setSelectListPayments(state, listSelect) {
      state.selectListRecord.payments = listSelect
    },
    setSelectListInvoces(state, listSelect) {
      state.selectListRecord.invoce = listSelect
    },
    setDiference(state, {
      attribute,
      value
    }) {
      state.difference[attribute] = value
    },
    setProcess(state, {
      attribute,
      value
    }) {
      state.process[attribute] = value
    },
    setListDifference(state) {
      const payments = state.list.payments
      const invoces = state.list.invoces
      const list = payments.concat(invoces)
      state.listAllDifference = list
    },
    setListSelectPayments(state, list) {
      state.list.payments = list
    },
    setListSelectInvoices(state, list) {
      state.list.invoces = list
    }

  },
  actions: {
    findListPayment({ commit, state }) {
      return new Promise(resolve => {
        const {
          businessPartnerId,
          businessPartnerUuid,
          date,
          organizationId,
          organizationUuid,
          currencyId,
          currencyUuid,
          isMultiCurrency,
          transactionType,
          isAutomaticWriteOff
        } = state.searchCriteria
        listPayments({
          businessPartnerId,
          businessPartnerUuid,
          date,
          organizationId,
          organizationUuid,
          currencyId,
          currencyUuid,
          isMultiCurrency,
          transactionType,
          isAutomaticWriteOff
        })
          .then(response => {
            const { records } = response
            const list = records.map(payments => {
              return {
                ...payments,
                transaction_date: dateTimeFormats(payments.transaction_date, 'YYYY-MM-DD'),
                applied: 0,
                isSelect: false
              }
            })
            commit('setListPayments', list)
            resolve(list)
          })
          .catch(error => {
            showMessage({
              type: 'error',
              message: error.message,
              showClose: true
            })
            resolve([])
            // commit('setListProduct', [])
            console.warn(`Error getting List Product: ${error.message}. Code: ${error.code}.`)
          })
      })
    },
    findListInvoices({ commit, state }) {
      return new Promise(resolve => {
        const {
          businessPartnerId,
          businessPartnerUuid,
          date,
          organizationId,
          organizationUuid,
          currencyId,
          currencyUuid,
          isMultiCurrency,
          transactionType,
          isAutomaticWriteOff
        } = state.searchCriteria
        listInvoices({
          businessPartnerId,
          businessPartnerUuid,
          date,
          organizationId,
          organizationUuid,
          currencyId,
          currencyUuid,
          isMultiCurrency,
          transactionType,
          isAutomaticWriteOff
        })
          .then(response => {
            const { records } = response
            const list = records.map(payments => {
              return {
                ...payments,
                date_invoiced: dateTimeFormats(payments.date_invoiced, 'YYYY-MM-DD'),
                applied: 0,
                writeOff: 0,
                isSelect: false
              }
            })
            commit('setListInvoces', list)
            resolve(list)
          })
          .catch(error => {
            resolve([])
            showMessage({
              type: 'error',
              message: error.message,
              showClose: true
            })
            // commit('setListProduct', [])
            console.warn(`Error getting List Product: ${error.message}. Code: ${error.code}.`)
          })
      })
    },
    processSend({ dispatch, state }) {
      return new Promise(resolve => {
        const {
          currencyId,
          businessPartnerId
        } = state.searchCriteria
        const {
          date,
          chargeId,
          description,
          totalDifference,
          transactionOrganizationId
        } = state.process
        process({
          date,
          chargeId,
          currencyId,
          description,
          totalDifference,
          businessPartnerId,
          invoiceSelectionList: state.list.invoces,
          paymentSelectionsList: state.list.payments,
          transactionOrganizationId
        })
          .then(response => {
            showMessage({
              type: 'success',
              message: response,
              showClose: true
            })
            dispatch('findListPayment')
            dispatch('findListInvoices')
            resolve(response)
          })
          .catch(error => {
            showMessage({
              type: 'error',
              message: error.message,
              showClose: true
            })
            resolve([])
            console.warn(`Error getting List Product: ${error.message}. Code: ${error.code}.`)
          })
      })
    }
  },
  getters: {
    getSearchFilter(state) {
      return state.searchCriteria
    },
    getListVAllocation(state) {
      return state.listRecord
    },
    getSelectListPayments(state) {
      return state.selectListRecord.payments
    },
    getSelectListInvoces(state) {
      return state.selectListRecord.invoce
    },
    getListDifference(state) {
      const payments = state.list.payments
      const invoces = state.list.invoces
      if (isEmptyValue(payments) && isEmptyValue(invoces)) {
        return []
      }
      return payments.concat(invoces).map(list => {
        const date = Object.keys(list).find(key => key.includes('date'))
        return {
          transactionDate: list[date],
          transactionType: list.transaction_type.value,
          amount: list.applied
        }
      })
    },
    getProcess(state) {
      return state.process
    }
  }
}
