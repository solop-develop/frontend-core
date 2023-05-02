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
  listPayments,
  listInvoices
} from '@/api/ADempiere/form/VAllocation.js'

// Utils and Helper Methods
import { dateTimeFormats } from '@/utils/ADempiere/formatValue/dateFormat'

const VAllocation = {
  searchCriteria: {
    businessPartnerId: '',
    organizationId: '',
    currencyId: '',
    date: '',
    transactionType: ''
  },
  listRecord: {
    payments: [],
    invoce: []
  },
  selectListRecord: {
    payments: [],
    invoce: []
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
            // commit('setListProduct', [])
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
      return state.listRecord.payments.filter(list => list.isSelect)
    },
    getSelectListInvoces(state) {
      return state.listRecord.invoce.filter(list => list.isSelect)
    }
  }
}
