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
  requestListBankAccounts,
  listBusinessPartners,
  // requestSearchModesList,
  requestImportedBankMovements,
  requestPaymentsList,
  requestMatchingMovementsList,
  requestGetBankStatement,
  requestBankStatemensList,
  requestListUnMatch,
  requestResultMovements,
  requestProcess
  // processMovements
} from '@/api/ADempiere/form/VBankStatementMatch.js'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere'
import { formatDate } from '@/utils/ADempiere/formatValue/dateFormat'
import { showMessage } from '@/utils/ADempiere/notification.js'

const bankStatementMatch = {
  step: 1,
  matchMode: 0,
  bankStatement: {
    records: [],
    currentRow: {}
  },
  bankAccount: {
    id: undefined,
    uuid: '',
    list: []
  },
  paymentAmount: {
    to: undefined,
    from: undefined
  },
  transactionDate: {
    from: null,
    to: null
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
  payments: {
    records: [],
    select: [],
    currentRow: {}
  },
  importedPayments: {
    select: [],
    records: [],
    currentRow: {}
  },
  matchingMovements: {
    list: [],
    select: {},
    listUnMatch: [],
    isLoading: false
  },
  result: {
    list: []
  }
}

export default {
  state: bankStatementMatch,

  mutations: {
    bankStatementMatchStep(state, wizardStep) {
      state.step = wizardStep
    },

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
    },

    setBankStatementsList(state, list) {
      state.bankStatement.records = list
    },
    setCurrentBankStatement(state, row) {
      state.bankStatement.currentRow = row
    },

    setBankAccountsList(state, list) {
      state.bankAccount.list = list
    },
    setBankAccountId(state, id) {
      state.bankAccount.id = id
    },

    setBusinessPartnersList(state, list) {
      state.businessPartner.list = list
    },
    setBusinessPartnerId(state, id) {
      state.businessPartner.id = id
    },

    setMatchMode(state, value) {
      state.matchMode = value
    },

    setImportedPayments(state, records) {
      state.importedPayments.records = records
    },

    setPayments(state, records) {
      state.payments.records = records
    }
  },

  actions: {
    getBankStatementFromServer({ commit }, {
      id,
      uuid
    }) {
      return new Promise(resolve => {
        requestGetBankStatement({
          id,
          uuid
        })
          .then(response => {
            commit('setCurrentBankStatement', response)

            commit('setBankAccountId', response.bankAccountId)

            resolve(response)
          })
          .catch(error => {
            showMessage({
              type: 'error',
              message: error.message,
              showClose: true
            })
          })
      })
    },

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
        requestListBankAccounts({
          searchValue
        })
          .then(response => {
            const { records } = response
            if (isEmptyValue(records)) {
              return
            }
            const bankAccountList = records.map(bankAccount => {
              return {
                id: bankAccount.id,
                uuid: bankAccount.uuid,
                displayedValue: bankAccount.values.DisplayColumn
              }
            })
            commit('setBankAccountsList', bankAccountList)
            resolve(bankAccountList)
          })
          .catch(error => {
            showMessage({
              type: 'error',
              message: error.message,
              showClose: true
            })
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
        listBusinessPartners({
          searchValue
        })
          .then(response => {
            const { records } = response
            if (isEmptyValue(records)) {
              return
            }
            const businessPartnersList = records.map(businessPartner => {
              return {
                id: businessPartner.id,
                uuid: businessPartner.uuid,
                displayedValue: businessPartner.values.DisplayColumn
              }
            })
            commit('setBusinessPartnersList', businessPartnersList)
            resolve(businessPartnersList)
          })
          .catch(error => {
            showMessage({
              type: 'error',
              message: error.message,
              showClose: true
            })
          })
      })
    },

    /**
     * Get List Payments
     */
    getPaymentsListFromServer({ state, commit, getters }, {
      searchValue
    }) {
      return new Promise(resolve => {
        const bankAccountId = state.bankAccount.id
        const matchMode = state.matchMode
        const businessPartnerId = state.businessPartner.id
        const dateFrom = state.transactionDate.from
        const dateTo = state.transactionDate.to
        let bankStatementId = -1
        if (!isEmptyValue(getters.getCurrentBankStatement)) {
          bankStatementId = getters.getCurrentBankStatement.id
        }

        // const {
        //   paymentAmount,
        // } = getters.getCriteriaVBankStatement
        // const paymentAmountTo = (paymentAmount.to === 0) ? null : paymentAmount.to
        // const paymentAmountFrom = (paymentAmount.from === 0) ? null : paymentAmount.from
        requestPaymentsList({
          matchMode: matchMode,
          searchValue,
          bankAccountId,
          bankStatementId,
          // paymentAmountTo,
          // paymentAmountFrom,
          businessPartnerId,
          transactionDateFrom: dateFrom,
          transactionDateTo: dateTo
        })
          .then(response => {
            const { records } = response
            commit('setPayments', records)
            resolve(records)
          })
          .catch(error => {
            showMessage({
              type: 'error',
              message: error.message,
              showClose: true
            })
          })
      })
    },

    /**
     * Get List Imported Bank Movements
     */
    searchListImportedBankMovements({ commit, state, getters }, {
      searchValue
    }) {
      return new Promise(resolve => {
        const bankAccountId = state.bankAccount.id
        const matchMode = state.matchMode
        const businessPartnerId = state.businessPartner.id
        const dateFrom = state.transactionDate.from
        const dateTo = state.transactionDate.to
        let bankStatementId = -1
        if (!isEmptyValue(getters.getCurrentBankStatement)) {
          bankStatementId = getters.getCurrentBankStatement.id
        }

        requestImportedBankMovements({
          matchMode: matchMode,
          searchValue,
          bankStatementId,
          bankAccountId,
          businessPartnerId,
          transactionDateFrom: dateFrom,
          transactionDateTo: dateTo
        })
          .then(response => {
            const { records } = response

            const recordsList = records.map(record => {
              const { transaction_date } = record
              let transactionDate = null
              if (transaction_date > 0) {
                transactionDate = formatDate({
                  value: transaction_date,
                  isDate: true
                })
              }

              return {
                ...record,
                transactionDate
              }
            })

            commit('setImportedPayments', recordsList)
            resolve(recordsList)
          })
          .catch(error => {
            showMessage({
              type: 'error',
              message: error.message,
              showClose: true
            })
          })
      })
    },

    /**
     * Get List Matching Movements
     */
    getMatchingMovementsListFromServer({ state, commit, getters }, {
      searchValue
    }) {
      return new Promise(resolve => {
        commit('updateAttributeCriteria', {
          attribute: 'isLoading',
          criteria: 'matchingMovements',
          value: true
        })
        let list = []

        const bankAccountId = state.bankAccount.id
        const matchMode = state.matchMode
        const businessPartnerId = state.businessPartner.id
        const dateFrom = state.transactionDate.from
        const dateTo = state.transactionDate.to

        let bankStatementId = -1
        if (!isEmptyValue(getters.getCurrentBankStatement)) {
          bankStatementId = getters.getCurrentBankStatement.id
        }

        requestMatchingMovementsList({
          matchMode: matchMode,
          searchValue,
          bankStatementId,
          bankAccountId,
          businessPartnerId,
          transactionDateFrom: dateFrom,
          transactionDateTo: dateTo
        })
          .then(response => {
            const { records } = response
            if (isEmptyValue(records)) {
              return
            }

            list = records.map(record => {
              const { transaction_date } = record
              let transactionDate = null
              if (transaction_date > 0) {
                transactionDate = formatDate({
                  value: transaction_date,
                  isDate: true
                })
              }

              return {
                ...record,
                transactionDate
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
    },

    getBankStatementsListFromServer({ commit }, {
      bankAccountId
    }) {
      return new Promise(resolve => {
        requestBankStatemensList({
          bankAccountId
        })
          .then(response => {
            commit('setBankStatementsList', response.records)

            resolve(response.records)
          })
          .catch(error => {
            showMessage({
              type: 'error',
              message: error.message,
              showClose: true
            })
          })
      })
    },

    listUnMatch({ state, dispatch }) {
      return new Promise(resolve => {
        requestListUnMatch({
          listImportedMovements: state.matchingMovements.listUnMatch
        })
          .then(response => {
            dispatch('getPaymentsListFromServer', {})
            dispatch('searchListImportedBankMovements', {})
            dispatch('getMatchingMovementsListFromServer', {})
            const { message } = response
            showMessage({
              type: 'success',
              message,
              showClose: true
            })
            resolve(response)
          })
          .catch(error => {
            showMessage({
              type: 'error',
              message: error.message,
              showClose: true
            })
            resolve(error)
          })
      })
    },

    processBankStatementMatch({ state, getters }) {
      return new Promise((resolve, reject) => {
        const bankAccountId = state.bankAccount.id
        const dateFrom = state.transactionDate.from
        const dateTo = state.transactionDate.to
        let bankStatementId = -1
        if (!isEmptyValue(getters.getCurrentBankStatement)) {
          bankStatementId = getters.getCurrentBankStatement.id
        }
        requestProcess({
          bankStatementId,
          bankAccountId,
          transactionDateFrom: dateFrom,
          transactionDateTo: dateTo
        })
          .then(response => {
            const { message } = response
            showMessage({
              type: 'success',
              message: message,
              showClose: true
            })
            resolve()
          })
          .catch(error => {
            showMessage({
              type: 'error',
              message: error.message,
              showClose: true
            })
            reject(error)
          })
      })
    },

    resultMovements({ state, commit, getters }) {
      return new Promise(resolve => {
        const bankAccountId = state.bankAccount.id
        const dateFrom = state.transactionDate.from
        const dateTo = state.transactionDate.to
        let bankStatementId = -1
        if (!isEmptyValue(getters.getCurrentBankStatement)) {
          bankStatementId = getters.getCurrentBankStatement.id
        }
        requestResultMovements({
          bankStatementId,
          bankAccountId,
          transactionDateFrom: dateFrom,
          transactionDateTo: dateTo
        })
          .then(response => {
            const { records } = response
            if (isEmptyValue(records)) {
              commit('updateAttributeCriteria', {
                criteria: 'result',
                attribute: 'list',
                value: records
              })
              resolve()
            }

            const list = records.map(record => {
              const { transaction_date } = record
              let transactionDate = null
              if (transaction_date > 0) {
                transactionDate = formatDate({
                  value: transaction_date,
                  isDate: true
                })
              }

              return {
                ...record,
                transactionDate
              }
            })

            commit('updateAttributeCriteria', {
              criteria: 'result',
              attribute: 'list',
              value: list
            })
            resolve()
          })
          .catch(error => {
            showMessage({
              type: 'error',
              message: error.message,
              showClose: true
            })
          })
      })
    }
  },

  getters: {
    getStatementMatchStep: (state) => {
      return state.step || 1
    },

    getCurrentBankStatement: (state) => {
      return state.bankStatement.currentRow
    },
    getBankStatementsList: (state) => {
      return state.bankStatement.records
    },

    getBanksAccountsListStatementMatch: (state) => {
      return state.bankAccount.list
    },
    getBankAccountValueStatementMatch: (state) => {
      return state.bankAccount.id
    },

    getBusinessPartnersListStatementMatch: (state) => {
      return state.businessPartner.list
    },
    getBusinessPartnerValueStatementMatch: (state) => {
      return state.businessPartner.id
    },

    getMatchModeBankStatementMatch: (state) => {
      return state.matchMode
    },
    getCriteriaVBankStatement: (state) => {
      return state
    },

    getPayments: (state) => {
      return state.payments.records
    },
    getImportedPayments: (state) => {
      return state.importedPayments.records
    },
    getListMatchingMovements: (state) => {
      return state.matchingMovements
    },
    getResult: (state) => {
      return state.result
    }
  }
}
