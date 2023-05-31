/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
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
  listBankAccounts,
  listBusinessPartners,
  listSearchModes,
  listImportedBankMovements,
  listPayments,
  listMatchingMovements
  // processMovements
} from '@/api/ADempiere/form/VBankStatementMatch.js'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere'
import { dateTimeFormats } from '@/utils/ADempiere/formatValue/dateFormat'
import { showMessage } from '@/utils/ADempiere/notification.js'

const bankStatementMatch = {
  matchMode: {
    label: '',
    value: '',
    list: []
  },
  bankAccounts: {
    id: '',
    uuid: '',
    list: []
  },
  paymentAmount: {
    to: null,
    from: null
  },
  // paymnetAmountFrom: '',
  transactionDate: {
    to: '',
    from: ''
  },
  businessPartner: {
    id: '',
    uuid: '',
    list: []
  },
  paymentList: {
    list: [],
    select: {}
  },
  matchingMovements: {
    list: [],
    select: {},
    isLoading: false
  }
}

export default {
  state: bankStatementMatch,
  mutations: {
    /**
     * Update Attribute
     * Generic mutation that allows to change the state of the store
     * @param {string} attribute - Attribute and which one to update - Requires it to be an Object
     * @param {string} criteria - Object Criteria
     * @param {string} value - Value to Update
     */
    updateAttributeCriteria(state, {
      attribute,
      criteria,
      value
    }) {
      state[criteria][attribute] = value
    }
  },
  actions: {

    /**
     * Get List Bank Accounts
     * @param {string} searchValue
     * @param {number} pageSize
     * @param {string} pageToken
     */
    listBankAccount({ commit }, {
      searchValue
    }) {
      return new Promise(resolve => {
        let list = []
        listBankAccounts({
          searchValue
        })
          .then(response => {
            const { records } = response
            if (isEmptyValue(records)) return
            list = records.map(list => {
              return {
                ...list,
                ...list.values
              }
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
            commit('updateAttributeCriteria', {
              attribute: 'list',
              criteria: 'bankAccounts',
              value: list
            })
            resolve(list)
          })
      })
    },

    /**
     * Get List Business Partner
     * @param {string} searchValue
     * @param {number} pageSize
     * @param {string} pageToken
     */
    listBusinessPartner({ commit }, {
      searchValue
    }) {
      return new Promise(resolve => {
        let list = []
        listBusinessPartners({
          searchValue
        })
          .then(response => {
            const { records } = response
            if (isEmptyValue(records)) return
            list = records.map(list => {
              return {
                ...list,
                ...list.values
              }
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
            commit('updateAttributeCriteria', {
              attribute: 'list',
              criteria: 'businessPartner',
              value: list
            })
            resolve(list)
          })
      })
    },

    /**
     * Get Get List Search Modes
     * @param {string} searchValue
     * @param {number} pageSize
     * @param {string} pageToken
     */
    listMatchMode({ commit }, {
      searchValue
    }) {
      return new Promise(resolve => {
        let list = []
        listSearchModes({
          searchValue
        })
          .then(response => {
            const { records } = response
            if (isEmptyValue(records)) return
            list = records.map(list => {
              return {
                ...list,
                ...list.values
              }
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
            commit('updateAttributeCriteria', {
              attribute: 'list',
              criteria: 'matchMode',
              value: list
            })
            resolve(list)
          })
      })
    },

    /**
     * Get List Payments
     */
    searchListPayments({ commit, getters }, {
      searchValue
    }) {
      return new Promise(resolve => {
        let list = []
        const {
          matchMode,
          bankAccounts,
          paymentAmount,
          transactionDate,
          businessPartner
        } = getters.getCriteriaVBankStatement
        const paymentAmountTo = (paymentAmount.to === 0) ? null : paymentAmount.to
        const paymentAmountFrom = (paymentAmount.from === 0) ? null : paymentAmount.from
        listPayments({
          matchMode: matchMode.value,
          searchValue,
          bankAccountId: bankAccounts.id,
          paymentAmountTo,
          paymentAmountFrom,
          businessPartnerId: businessPartner.id,
          transactionDateTo: transactionDate.to,
          transactionDateFrom: transactionDate.from
        })
          .then(response => {
            const { records } = response
            if (isEmptyValue(records)) return
            list = records.map(list => {
              return {
                ...list,
                isSelection: false,
                transactionDate: dateTimeFormats(list.transaction_date, 'YYYY-MM-DD')
              }
            })
          })
          .catch(error => {
            showMessage({
              type: 'error',
              message: error.message,
              showClose: true
            })
            list = []
          })
          .finally(() => {
            commit('updateAttributeCriteria', {
              attribute: 'list',
              criteria: 'paymentList',
              value: list
            })
            resolve(list)
          })
      })
    },

    /**
     * Get List Imported Bank Movements
     */
    searchListImportedBankMovements({ commit, getters }, {
      searchValue
    }) {
      return new Promise(resolve => {
        let list = []
        const {
          matchMode,
          bankAccounts,
          paymentAmount,
          transactionDate,
          businessPartner
        } = getters.getCriteriaVBankStatement
        listImportedBankMovements({
          matchMode: matchMode.value,
          searchValue,
          bankAccountId: bankAccounts.id,
          paymentAmountTo: paymentAmount.to,
          paymentAmountFrom: paymentAmount.from,
          businessPartnerId: businessPartner.id,
          transactionDateTo: transactionDate.to,
          transactionDateFrom: transactionDate.from
        })
          .then(response => {
            const { records } = response
            if (isEmptyValue(records)) return
            list = records.map(list => {
              return {
                ...list,
                ...list.values
              }
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
            commit('updateAttributeCriteria', {
              attribute: 'list',
              criteria: 'matchMode',
              value: list
            })
            resolve(list)
          })
      })
    },

    /**
     * Get List Matching Movements
     */
    searchListMatchingMovements({ commit, getters }, {
      searchValue
    }) {
      return new Promise(resolve => {
        commit('updateAttributeCriteria', {
          attribute: 'isLoading',
          criteria: 'matchingMovements',
          value: true
        })
        let list = []
        const {
          matchMode,
          bankAccounts,
          paymentAmount,
          transactionDate,
          businessPartner
        } = getters.getCriteriaVBankStatement
        listMatchingMovements({
          matchMode: matchMode.value,
          searchValue,
          bankAccountId: bankAccounts.id,
          paymentAmountTo: paymentAmount.to,
          paymentAmountFrom: paymentAmount.from,
          businessPartnerId: businessPartner.id,
          transactionDateTo: transactionDate.to,
          transactionDateFrom: transactionDate.from
        })
          .then(response => {
            const { records } = response
            if (isEmptyValue(records)) return
            list = records.map(list => {
              return {
                ...list,
                transactionDate: dateTimeFormats(list.transaction_date, 'YYYY-MM-DD')
              }
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
            commit('updateAttributeCriteria', {
              attribute: 'list',
              criteria: 'matchingMovements',
              value: list
            })
            commit('updateAttributeCriteria', {
              attribute: 'isLoading',
              criteria: 'matchingMovements',
              value: false
            })
            resolve(list)
          })
      })
    }

  },
  getters: {
    getInvoiceBankStatementMatch: (state) => {
      return state.invoices
    },
    // <--------------->
    getCriteriaVBankStatement: (state) => {
      return state
    },
    getListPaymentsVBankStatement: (state) => {
      return state.paymentList
    },
    getListMatchingMovements: (state) => {
      return state.matchingMovements
    }
  }
}
