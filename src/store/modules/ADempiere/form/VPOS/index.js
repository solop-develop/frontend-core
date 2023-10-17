// ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
// Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
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

import router from '@/router'

// Api Request Methods
// import {
//   listDocumentTypes,
//   // listPointOfSales,
//   // getPointOfSales,
//   // listTenderTypes,
//   listWarehouses,
//   listPrices
// } from '@/api/ADempiere/form/point-of-sales.js'
import {
  listPointOfSales,
  getPointOfSales,
  listAvailableWarehouses,
  // listAvailablePaymentMethods,
  listAvailablePriceList,
  // listAvailableCurrencies,
  listAvailableDocumentTypes
  // listAvailableDiscounts,
  // listAvailableSellers
} from '@/api/ADempiere/form/VPOS'
// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import { showMessage } from '@/utils/ADempiere/notification'

const VPOS = {
  listDocumentTypes: [],
  listWarehouses: [],
  listCurrencies: [],
  listPrices: [],
  currentPos: {},
  listPos: []
}

export default {
  state: VPOS,
  mutations: {
    setVPOS(state, pos) {
      state.currentPos = pos
    },
    setLisVPOS(state, list) {
      state.listPos = list
    },
    setListWarehouses(state, list) {
      state.listWarehouses = list
    },
    setListPrices(state, list) {
      state.listPrices = list
    },
    setListDocumentTypes(state, list) {
      state.listDocumentTypes = list
    }
  },
  /**
   * Pos Actions
   */
  actions: {
    /**
     * Get Point of Sale Data
     * @param {Number} posId
     */
    searchPointOfSaleData({
      dispatch
    }, id) {
      return new Promise(resolve => {
        const currentRouter = router.app.$route
        const { posId } = currentRouter.query
        dispatch('listPointOfSale')
        if (!isEmptyValue(posId)) id = posId
        if (isEmptyValue(id)) {
          resolve({})
          return
        }
        getPointOfSales({ id })
          .then(response => {
            dispatch('changeVPOS', { getPointOfSales: response })
            resolve(response)
          })
          .catch(error => {
            console.warn(`Set PointOfSales: ${error.message}. Code: ${error.code}. ID: ${id}`)
            showMessage({
              type: 'error',
              message: error.message,
              showClose: true
            })
            dispatch('listPointOfSale')
            resolve({})
          })
      })
    },
    /**
     * List All Point of Sale
     */
    listPointOfSale({
      commit,
      getters,
      dispatch
    }) {
      return new Promise(resolve => {
        const currentPos = getters.getVPOS
        listPointOfSales()
          .then(response => {
            const { selling_points } = response
            commit('setLisVPOS', selling_points)
            if (isEmptyValue(currentPos)) dispatch('changeVPOS', { getPointOfSales: selling_points[0] })
            resolve(selling_points)
          })
          .catch(error => {
            console.warn(`List All PointOfSales: ${error.message}. Code: ${error.code}`)
            showMessage({
              type: 'error',
              message: error.message,
              showClose: true
            })
            resolve([])
          })
      })
    },
    /**
     * Change Point of Sale
     * @param {Object} Point
     */
    changeVPOS({
      commit
    }, {
      getPointOfSales
    }) {
      return new Promise(resolve => {
        if (isEmptyValue(getPointOfSales)) {
          resolve({})
          return
        }
        commit('setVPOS', getPointOfSales)
        commit('setOrder', {})
        const currentRouter = router.app.$route
        const {
          name,
          query,
          params
        } = currentRouter
        const { id } = getPointOfSales
        router.push({
          name,
          params: { ...params },
          query: {
            ...query,
            posId: id
          }
        }, () => {})
        resolve(getPointOfSales)
      })
    },
    /**
     * List of Available Price
     * @param {Number} posId
     */
    listAvailablePrices({ commit, getters }) {
      return new Promise(resolve => {
        const currentPos = getters.getVPOS
        if (isEmptyValue(currentPos)) {
          resolve([])
          return
        }
        listAvailablePriceList({
          posId: currentPos.id
        })
          .then(response => {
            const { price_list } = response
            commit('setListPrices', price_list)
            resolve(price_list)
          })
          .catch(error => {
            console.warn(`List of Available Price: ${error.message}. Code: ${error.code}.`)
            showMessage({
              type: 'error',
              message: error.message,
              showClose: true
            })
            resolve([])
          })
      })
    },
    /**
     * List of Available Warehouses
     * @param {Number} posId
     */
    listAvailableWarehouse({ commit, getters }) {
      return new Promise(resolve => {
        const currentPos = getters.getVPOS
        if (isEmptyValue(currentPos)) {
          resolve([])
          return
        }
        listAvailableWarehouses({
          posId: currentPos.id
        })
          .then(response => {
            const { warehouses } = response
            commit('setListWarehouses', warehouses)
            resolve(warehouses)
          })
          .catch(error => {
            console.warn(`List of Available Warehouses: ${error.message}. Code: ${error.code}.`)
            showMessage({
              type: 'error',
              message: error.message,
              showClose: true
            })
            resolve([])
          })
      })
    },
    /**
     * List of Available Document Types
     * @param {Number} posId
     */
    listAvailableDocumentTypes({ commit, getters }) {
      return new Promise(resolve => {
        const currentPos = getters.getVPOS
        if (isEmptyValue(currentPos)) {
          resolve([])
          return
        }
        listAvailableDocumentTypes({
          posId: currentPos.id
        })
          .then(response => {
            const { document_types } = response
            commit('setListDocumentTypes', document_types)
            resolve(document_types)
          })
          .catch(error => {
            console.warn(`List of Available Document Types: ${error.message}. Code: ${error.code}.`)
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
    getVPOS: (state) => {
      return state.currentPos
    },
    getLisVPOS: (state) => {
      return state.listPos
    },
    getListWarehouses: (state) => {
      return state.listWarehouses
    },
    getListPrices: (state) => {
      return state.listPrices
    },
    getListDocumentTypes: (state) => {
      return state.listDocumentTypes
    }
  }
}