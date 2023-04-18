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

import lang from '@/lang'

// API Request Methods
import {
  listProductRequest,
  // Receipt
  createReceiptRequest,
  processReceiptRequest,
  // Receipt Line
  createReceiptLineRequest,
  updateReceiptLineRequest,
  deleteReceiptLineRequest,
  listReceiptLinesRequest
} from '@/api/ADempiere/form/ExpressReceipt.js'
import { isEmptyValue } from '@/utils/ADempiere'

// Utils and Helper Methods
import { showMessage } from '@/utils/ADempiere/notification.js'

const expressReceipt = {
  currentReceipt: {},
  listProduct: [],
  listReceiptLines: []
}

export default {
  state: expressReceipt,
  mutations: {
    setListProductReceipt(state, list) {
      state.listProduct = list
    },
    setListReceiptLines(state, list) {
      state.listReceiptLines = list
    },
    setCurrentReceipt(state, current) {
      state.currentReceipt = current
    }
  },
  actions: {
    findListProductReceipt({ commit }, {
      namue,
      upc,
      searchValue,
      sku,
      value,
      receiptId
    }) {
      return new Promise(resolve => {
        listProductRequest({
          namue,
          upc,
          searchValue,
          sku,
          value,
          receiptId
        })
          .then(response => {
            const { records } = response
            commit('setListProductReceipt', records)
            resolve(records)
          })
          .catch(error => {
            resolve([])
            commit('setListProductReceipt', [])
            console.warn(`Error getting List Product: ${error.message}. Code: ${error.code}.`)
          })
      })
    },
    listLineReceipt({ commit }, {
      receiptId,
      receiptUuid
    }) {
      listReceiptLinesRequest({
        receiptId,
        receiptUuid
      })
        .then(response => {
          let list = []
          const { records } = response
          if (!isEmptyValue(records)) {
            list = records.map(line => {
              return {
                ...line,
                isEditQuantity: false
              }
            })
          }
          commit('setListReceiptLines', list)
        })
        .catch(error => {
          console.warn(`Error getting List Product: ${error.message}. Code: ${error.code}.`)
        })
    },
    // Receipt Line
    createLineReceipt({ commit, getters, dispatch }, {
      productId,
      productUuid,
      description,
      quantity = 1,
      isQuantityFromOrderLine
    }) {
      const { id, uuid } = getters.getCurrentReceipt
      createReceiptLineRequest({
        receiptId: id,
        receiptUuid: uuid,
        description,
        quantity,
        isQuantityFromOrderLine,
        productId,
        productUuid
      })
        .then(response => {
          dispatch('listLineReceipt', {
            receiptId: id,
            receiptUuid: uuid
          })
          commit('setListProductReceipt', [])
        })
        .catch(error => {
          showMessage({
            type: 'error',
            message: error.message,
            showClose: true
          })
          commit('setListProductReceipt', [])
          console.warn(`Error Getting Update Receipt Line: ${error.message}. Code: ${error.code}.`)
        })
    },
    updateLineReceipt({ commit, dispatch, getters }, {
      id,
      uuid,
      description,
      quantity
    }) {
      updateReceiptLineRequest({
        id,
        uuid,
        description,
        quantity
      })
        .then(response => {
          const { id, uuid } = getters.getCurrentReceipt
          dispatch('listLineReceipt', {
            receiptId: id,
            receiptUuid: uuid
          })
          commit('setListProductReceipt', [])
        })
        .catch(error => {
          showMessage({
            type: 'error',
            message: error.message,
            showClose: true
          })
          console.warn(`Error Getting Update Receipt Line: ${error.message}. Code: ${error.code}.`)
          const { id, uuid } = getters.getCurrentReceipt
          dispatch('listLineReceipt', {
            receiptId: id,
            receiptUuid: uuid
          })
          commit('setListProductReceipt', [])
        })
    },
    deleteLineReceipt({ dispatch, getters }, {
      id,
      uuid
    }) {
      deleteReceiptLineRequest({
        id,
        uuid
      })
        .then(response => {
          const { id, uuid } = getters.getCurrentReceipt
          dispatch('listLineReceipt', {
            receiptId: id,
            receiptUuid: uuid
          })
        })
        .catch(error => {
          showMessage({
            type: 'error',
            message: error.message,
            showClose: true
          })
          console.warn(`Error Getting Update Receipt Line: ${error.message}. Code: ${error.code}.`)
        })
    },
    // Receipt
    createReceipt({ commit, dispatch }, {
      id,
      uuid
    }) {
      createReceiptRequest({
        id,
        uuid
      })
        .then(response => {
          const { id, uuid } = response
          commit('setCurrentReceipt', response)
          dispatch('listLineReceipt', {
            receiptId: id,
            receiptUuid: uuid
          })
        })
        .catch(error => {
          showMessage({
            type: 'error',
            message: error.message,
            showClose: true
          })
          console.warn(`Error Getting Update Receipt Line: ${error.message}. Code: ${error.code}.`)
        })
    },
    processReceipt({ commit, dispatch, getters }) {
      const { id, uuid } = getters.getCurrentReceipt
      return new Promise(resolve => {
        processReceiptRequest({
          id,
          uuid
        })
          .then(response => {
            const { id, uuid } = response
            dispatch('listLineReceipt', {
              receiptId: id,
              receiptUuid: uuid
            })
            commit('setCurrentReceipt', response)
            resolve(response)
            showMessage({
              type: 'success',
              message: lang.t('form.ExpressReceipt.receiptComplete'),
              showClose: true
            })
          })
          .catch(error => {
            showMessage({
              type: 'error',
              message: error.message,
              showClose: true
            })
            console.warn(`Error Getting Update Receipt Line: ${error.message}. Code: ${error.code}.`)
          })
      })
    }
  },
  getters: {
    getListProductReceipt(state) {
      return state.listProduct
    },
    getListReceipt(state) {
      return state.listReceiptLines
    },
    getCurrentReceipt(state) {
      return state.currentReceipt
    }
  }
}
