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

// import lang from '@/lang'

// API Request Methods
import {
  // listInvoices,
  listPayments
} from '@/api/ADempiere/form/VAllocation.js'
// import { isEmptyValue } from '@/utils/ADempiere'

// Utils and Helper Methods
// import { showMessage } from '@/utils/ADempiere/notification.js'

const VAllocation = {
  searchCriteria: {
    businessPartnerId: '',
    organizationsId: '',
    currencyId: '',
    date: '',
    transactionType: ''
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
      state.searchCriteria.organizationsId = id
    },
    setCurrency(state, id) {
      state.searchCriteria.currencyId = id
    },
    setDate(state, date) {
      state.searchCriteria.date = date
    },
    setTransactionType(state, type) {
      state.searchCriteria.transactionType = type
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
            console.log({ response })
            const { records } = response
            // commit('setListProduct', records)
            resolve(records)
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
    }
  }
}
