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

import lang from '@/lang'

// API Request Methods
import {
  createRMA,
  processRMA,
  // Line
  createRMALine,
  listRMALines,
  updateRMALine,
  deleteRMALine
} from '@/api/ADempiere/form/ReturnRMA.js'

// Utils and Helper Methods
import { camelizeObjectKeys } from '@/utils/ADempiere/transformObject.js'
import { showMessage } from '@/utils/ADempiere/notification.js'

const returnProduct = {
  state: {
    showPanelReturnProduct: false,
    listProduct: [],
    orderReturnProduct: {
      isLoading: false
    },
    isShowSummary: false,
    summary: {}
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
    },
    setShowSummaryRMA(state, show) {
      state.isShowSummary = show
    },
    setSummaryRMA(state, summary) {
      state.summary = summary
    }
  },

  actions: {
    listReturnProduct({ commit, rootGetters }) {
      return new Promise(resolve => {
        listRMALines({
          posId: rootGetters.posAttributes.currentPointOfSales.id,
          rmaId: rootGetters.getOrderReturn.id
        })
          .then(response => {
            const { records } = response
            const list = records.map(line => camelizeObjectKeys(line))
            commit('setListProduct', list)
            resolve([])
          })
          .catch(error => {
            console.warn(`Get List Campaigns: ${error.message}. Code: ${error.code}.`)
            showMessage({
              type: 'error',
              message: error.message,
              showClose: true
            })
            commit('setListProduct', [])
            resolve([])
          })
      })
    },
    openRMA({ commit, dispatch, rootGetters }) {
      return new Promise(resolve => {
        commit('setOrderReturn', {
          isLoading: true
        })
        createRMA({
          posId: rootGetters.posAttributes.currentPointOfSales.id,
          sourceOrderId: rootGetters.posAttributes.currentPointOfSales.currentOrder.id
        })
          .then(response => {
            commit('setOrderReturn', {
              ...response,
              isLoading: false
            })
            dispatch('listReturnProduct')
            resolve(response)
          })
          .catch(error => {
            console.warn(`Get Get Open RMA: ${error.message}. Code: ${error.code}.`)
            showMessage({
              type: 'error',
              message: error.message,
              showClose: true
            })
            commit('setListProduct', [])
            commit('setOrderReturn', {})
            dispatch('listReturnProduct')
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
            showMessage({
              type: 'success',
              message: `${lang.t('form.pos.orderRMA.addProduct')} - ${response.product.name}`,
              showClose: true
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
            resolve(error)
          })
          .finally(() => {
            dispatch('listReturnProduct')
            dispatch('openRMA')
          })
      })
    },
    updateLineRMA({ dispatch }, {
      id,
      posId,
      quantity
    }) {
      return new Promise(resolve => {
        updateRMALine({
          id,
          posId,
          quantity
        })
          .then(response => {
            showMessage({
              type: 'success',
              message: `${lang.t('form.pos.orderRMA.updateProduct')}`,
              showClose: true
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
            resolve(error)
          })
          .finally(() => {
            dispatch('listReturnProduct')
            dispatch('openRMA')
          })
      })
    },
    deleteLineRMA({ dispatch }, {
      id,
      posId
    }) {
      return new Promise(resolve => {
        deleteRMALine({
          id,
          posId
        })
          .then(response => {
            showMessage({
              type: 'success',
              message: `${lang.t('form.pos.orderRMA.deleteProduct')}`,
              showClose: true
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
            resolve(error)
          })
          .finally(() => {
            dispatch('listReturnProduct')
            dispatch('openRMA')
          })
      })
    },
    processRma({ commit, rootGetters, dispatch }) {
      return new Promise(resolve => {
        commit('setShowReturnProduct', false)
        processRMA({
          posId: rootGetters.posAttributes.currentPointOfSales.id,
          id: rootGetters.getOrderReturn.id
        })
          .then(response => {
            showMessage({
              type: 'success',
              message: `${lang.t('form.pos.orderRMA.document')} ${response.documentNo} - ${lang.t('form.pos.orderRMA.process')}`,
              showClose: true
            })

            commit('setSummaryRMA', {
              label: `${lang.t('form.pos.orderRMA.document')} ${response.documentNo} - ${lang.t('form.pos.orderRMA.process')}`,
              title: lang.t('form.pos.returnProduct'),
              lines: rootGetters.getListProduct,
              type: 'success',
              order: response
            })
            commit('setOrderReturn', {
              ...response,
              isLoading: false
            })
            dispatch('printTicket', {
              posId: rootGetters.posAttributes.currentPointOfSales.id,
              orderId: response.id
            })
            commit('setShowSummaryRMA', true)
            // const { IsAllowsPreviewDocument } = rootGetters.posAttributes.currentPointOfSales
            resolve([])
          })
          .catch(error => {
            console.warn(`Get List Campaigns: ${error.message}. Code: ${error.code}.`)
            showMessage({
              type: 'error',
              message: error.message,
              showClose: true
            })
            commit('setShowReturnProduct', true)
            commit('setSummaryRMA', {
              label: `${error.message} - ${rootGetters.getOrderReturn.documentNo}`,
              title: lang.t('form.pos.returnProduct'),
              lines: rootGetters.getListProduct,
              type: 'error',
              order: rootGetters.getOrderReturn
            })
            commit('setShowSummaryRMA', true)
            resolve([])
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
    },
    getShowSummaryRMA: (state) => {
      return state.isShowSummary
    },
    getSummaryRMA: (state) => {
      return state.summary
    }
  }
}
export default returnProduct
