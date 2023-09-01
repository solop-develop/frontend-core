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
  createRMA,
  // Line
  createRMALine,
  listRMALines
} from '@/api/ADempiere/form/ReturnRMA.js'

// utils and helper methods
import { showMessage } from '@/utils/ADempiere/notification.js'
const returnProduct = {
  state: {
    showPanelReturnProduct: false,
    listProduct: [],
    orderReturnProduct: {
      isLoading: false
    }
  },

  mutations: {
    setOrderReturn(state, rma) {
      state.orderReturnProduct = rma
    },
    setShowReturnProduct(state, value) {
      state.showPanelReturnProduct = value
    },
    setListProduct(state, list) {
      state.listProduct = list
    }
  },

  actions: {
    listReturnProduct({ commit, rootGetters }) {
      return new Promise(resolve => {
        listRMALines({
          posUuid: rootGetters.posAttributes.currentPointOfSales.id,
          rmaId: rootGetters.getOrderReturn.id
        })
          .then(response => {
            commit('setListProduct', [])
            resolve([])
          })
          .catch(error => {
            console.warn(`Get List Campaigns: ${error.message}. Code: ${error.code}.`)
            showMessage({
              type: 'error',
              message: error.message,
              showClose: true
            })
            resolve([])
          })
      })
    },
    openRMA({ commit }, {
      sourceOrderId,
      posId
    }) {
      return new Promise(resolve => {
        commit('setOrderReturn', {
          isLoading: true
        })
        createRMA({
          sourceOrderId,
          posId
        })
          .then(response => {
            commit('setOrderReturn', {
              ...response,
              isLoading: false
            })
            resolve(response)
          })
          .catch(error => {
            console.warn(`Get Get Open RMA: ${error.message}. Code: ${error.code}.`)
            showMessage({
              type: 'error',
              message: error.message,
              showClose: true
            })
            commit('setOrderReturn', {
              isLoading: false
            })
            resolve([])
          })
      })
    },
    createLineRMA({ dispatch }, {
      sourceOrderLineId,
      description,
      quantity,
      rmaId,
      posId
    }) {
      return new Promise(resolve => {
        createRMALine({
          sourceOrderLineId,
          description,
          quantity,
          rmaId,
          posId
        })
          .then(response => {
            dispatch('listRMALines')
            resolve(response)
          })
          .catch(error => {
            console.warn(`Get Get Open RMA: ${error.message}. Code: ${error.code}.`)
            showMessage({
              type: 'error',
              message: error.message,
              showClose: true
            })
            resolve(error)
          })
      })
    }
  },
  getters: {
    getShowReturnProduct: (state) => {
      return state.showPanelReturnProduct
    },
    getListProduct: (state) => {
      return state.listProduct
    },
    getOrderReturn: (state) => {
      return state.orderReturnProduct
    }
  }
}
export default returnProduct
