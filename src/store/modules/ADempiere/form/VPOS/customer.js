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
  listCustomers
} from '@/api/ADempiere/form/VPOS'
// Utils and Helper Methods
// import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import { showMessage } from '@/utils/ADempiere/notification'

const customers = {
  showCustomer: false,
  customers: [],
  recordCount: 0,
  currentCustomer: {},
  pageToken: ''
}

export default {
  state: customers,
  mutations: {
    setShowCustomerList(state, show) {
      state.showCustomer = show
    },
    setCustomerCount(state, recordCount) {
      state.recordCount = recordCount
    },
    setCustomerPageToken(state, pageToken) {
      state.pageToken = pageToken
    },
    setCustomersList(state, list) {
      state.customers = list
    }
  },
  /**
   * Customers List
   */
  actions: {
    /**
     * Get List Customers
     * @params {String} SearchValue
     * @params {Number} PageSize
     */
    searchCustomersList({
      commit
    }, {
      searchValue,
      name,
      email,
      value,
      pageSize = 15,
      pageToken
    }) {
      return new Promise(resolve => {
        listCustomers({
          pageSize,
          pageToken,
          searchValue,
          name,
          email,
          value
        })
          .then(response => {
            const {
              record_count,
              customers,
              next_page_token
            } = response
            commit('setCustomerCount', record_count)
            commit('setCustomersList', customers)
            commit('setCustomerPageToken', next_page_token)
            resolve(customers)
          })
          .catch(error => {
            console.warn(`Product List: ${error.message}. Code: ${error.code}.`)
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
    getCustomersList: (state) => {
      return state.customers
    },
    getCustomerCount: (state) => {
      return state.recordCount
    },
    getCustomerPageToken: (state) => {
      return state.pageToken
    },
    getShowCustomerList: (state) => {
      return state.showCustomer
    }
  }
}
