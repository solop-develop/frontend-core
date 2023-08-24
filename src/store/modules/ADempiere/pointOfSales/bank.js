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
  banks
} from '@/api/ADempiere/form/point-of-sales.js'

// utils and helper methods
import { showMessage } from '@/utils/ADempiere/notification.js'
const bank = {
  state: {
    listBanks: []
  },

  mutations: {
    setListBanks(state, list) {
      state.listBanks = list
    }
  },

  actions: {
    listBanks({ commit, rootGetters }, {
      searchValue
    }) {
      return new Promise(resolve => {
        banks({
          posUuid: rootGetters.posAttributes.currentPointOfSales.uuid,
          searchValue
        })
          .then(response => {
            const { records } = response
            commit('setListBanks', records)
            resolve(records)
          })
          .catch(error => {
            console.warn(`Get List Banks: ${error.message}. Code: ${error.code}.`)
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
    getListBanks: (state) => {
      return state.listBanks
    }
  }
}
export default bank
