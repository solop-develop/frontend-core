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
  listSystemPayments,
  listImportMovements
} from '@/api/ADempiere/form/VBankStatementMatch.js'
import { isEmptyValue } from '@/utils/ADempiere'

// Utils and Helper Methods
import { showMessage } from '@/utils/ADempiere/notification.js'

const bankStatementMatch = {
  listManualMatch: [],
  listDataImportedMovements: [],
  listDataSystemPayments: [],
  listPendingMatch: []
}

export default {
  state: bankStatementMatch,
  mutations: {
    setLPendingMatch(state, list) {
      state.listPendingMatch = list
    },
    setLManualMatch(state, list) {
      state.listManualMatch = list
    },
    setDataImportedMovements(state, list) {
      state.listDataImportedMovements = list
    },
    setDataSystemPayments(state, list) {
      state.listDataSystemPayments = list
    }
  },
  actions: {
    searchMatch({ commit, dispatch }, {
      bankAccountId,
      bankAccountUuid,
      dateFrom,
      dateTo,
      businessPartnerId,
      businessPartnerUuid,
      paymentAmountFrom,
      paymentAmountTo,
      matchMode
    }) {
      dispatch('findPayments', {
        bankAccountId,
        bankAccountUuid,
        dateFrom,
        dateTo,
        businessPartnerId,
        businessPartnerUuid,
        paymentAmountFrom,
        paymentAmountTo,
        matchMode
      })
      dispatch('findImportMovements', {
        bankAccountId,
        bankAccountUuid,
        dateFrom,
        dateTo,
        businessPartnerId,
        businessPartnerUuid,
        paymentAmountFrom,
        paymentAmountTo,
        matchMode
      })
    },
    findPayments({ commit }, {
      bankAccountId,
      bankAccountUuid,
      dateFrom,
      dateTo,
      businessPartnerId,
      businessPartnerUuid,
      paymentAmountFrom,
      paymentAmountTo,
      matchMode
    }) {
      listSystemPayments({
        bankAccountId,
        bankAccountUuid,
        dateFrom,
        dateTo,
        businessPartnerId,
        businessPartnerUuid,
        paymentAmountFrom,
        paymentAmountTo,
        matchMode
      })
        .then(response => {
          const { records } = response
          if (!isEmptyValue(records)) {
            commit('setDataSystemPayments', records)
          } else {
            commit('setDataSystemPayments', [])
          }
        })
        .catch(error => {
          commit('setDataSystemPayments', [])
          console.warn(`List Payments: ${error.message}. Code: ${error.code}.`)
          showMessage({
            type: 'error',
            message: error.message,
            showClose: true
          })
        })
    },
    findImportMovements({ commit }, {
      bankAccountId,
      bankAccountUuid,
      dateFrom,
      dateTo,
      businessPartnerId,
      businessPartnerUuid,
      paymentAmountFrom,
      paymentAmountTo,
      matchMode
    }) {
      listImportMovements({
        bankAccountId,
        bankAccountUuid,
        dateFrom,
        dateTo,
        businessPartnerId,
        businessPartnerUuid,
        paymentAmountFrom,
        paymentAmountTo,
        matchMode
      })
        .then(response => {
          const { records } = response
          if (!isEmptyValue(records)) {
            commit('setDataImportedMovements', records)
          } else {
            commit('setDataImportedMovements', [])
          }
        })
        .catch(error => {
          commit('setDataImportedMovements', [])
          console.warn(`List Imported Bank Movements: ${error.message}. Code: ${error.code}.`)
          showMessage({
            type: 'error',
            message: error.message,
            showClose: true
          })
        })
    }
  },
  getters: {
    getInvoiceBankStatementMatch: (state) => {
      return state.invoices
    }
  }
}
