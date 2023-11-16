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
  listProductRequest,
  // Movement
  createMovementRequest,
  processMovementRequest,
  // // Movement Line
  createMovementLineRequest,
  updateMovementLineRequest,
  deleteMovementLineRequest,
  listMovementLinesRequest
} from '@/api/ADempiere/form/expresMovement.js'
import { isEmptyValue } from '@/utils/ADempiere'

// Utils and Helper Methods
import { showMessage } from '@/utils/ADempiere/notification.js'

const expressMovement = {
  currentMovement: {},
  listProduct: [],
  listMovementLines: []
}

export default {
  state: expressMovement,
  mutations: {
    setListProduct(state, list) {
      state.listProduct = list
    },
    setListMovementLines(state, list) {
      state.listMovementLines = list
    },
    setCurrentMovement(state, current) {
      state.currentMovement = current
    }
  },
  actions: {
    // Find Product
    findListProductWarehouses({ commit }, {
      namue,
      upc,
      searchValue,
      sku,
      value,
      shipmentId
    }) {
      return new Promise(resolve => {
        listProductRequest({
          namue,
          upc,
          searchValue,
          sku,
          value,
          shipmentId
        })
          .then(response => {
            const { records } = response
            commit('setListProduct', records)
            resolve(records)
          })
          .catch(error => {
            resolve([])
            commit('setListProduct', [])
            console.warn(`Error getting List Product: ${error.message}. Code: ${error.code}.`)
          })
      })
    },
    // Movement
    createMovement({ commit, dispatch }) {
      return new Promise(resolve => {
        createMovementRequest()
          .then(response => {
            commit('setCurrentMovement', response)
            dispatch('listLineMovement')
            resolve(response)
          })
          .catch(error => {
            showMessage({
              type: 'error',
              message: error.message,
              showClose: true
            })
            resolve(error)
            console.warn(`Error Getting Update Movement Line: ${error.message}. Code: ${error.code}.`)
          })
      })
    },
    processMovement({ commit, dispatch, getters }) {
      const { id, uuid } = getters.getCurrentMovement
      return new Promise(resolve => {
        processMovementRequest({
          id,
          uuid
        })
          .then(response => {
            dispatch('listLineMovement')
            commit('setCurrentMovement', response)
            resolve(response)
            showMessage({
              type: 'success',
              message: lang.t('form.expressMovement.movementComplete'),
              showClose: true
            })
          })
          .catch(error => {
            let message = error.message
            if (!isEmptyValue(error.response) && !isEmptyValue(error.response.data.message)) {
              message = error.response.data.message
            }
            showMessage({
              type: 'error',
              message,
              showClose: true
            })
            console.warn(`Error Getting Update Movement Line: ${error.message}. Code: ${error.code}.`)
          })
      })
    },
    // Movement Line
    createLineMovement({ state, getters, dispatch }, {
      productId,
      productUuid,
      description,
      warehouseId,
      warehouseToId,
      quantity = 1
    }) {
      const { id, uuid } = getters.getCurrentMovement
      if (isEmptyValue(id)) return
      createMovementLineRequest({
        movementId: id,
        movementUuid: uuid,
        warehouseId,
        warehouseToId,
        description,
        quantity,
        productId,
        productUuid
      })
        .then(response => {
          dispatch('listLineMovement')
          // dispatch('listLineMovement', {
          //   shipmentId: id,
          //   shipmentUuid: uuid
          // })
        })
        .catch(error => {
          showMessage({
            type: 'error',
            message: error.message,
            showClose: true
          })
          console.warn(`Error Getting Update Movement Line: ${error.message}. Code: ${error.code}.`)
        })
    },
    listLineMovement({ commit, getters }) {
      const { id, uuid } = getters.getCurrentMovement
      listMovementLinesRequest({
        movementId: id,
        movementUuid: uuid
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
          commit('setListMovementLines', list)
        })
        .catch(error => {
          console.warn(`Error getting List Product: ${error.message}. Code: ${error.code}.`)
        })
    },
    updateMovementLine({ commit, dispatch, getters }, {
      id,
      uuid,
      description,
      quantity
    }) {
      const movementId = getters.getCurrentMovement.id
      updateMovementLineRequest({
        id,
        uuid,
        movementId,
        description,
        quantity
      })
        .then(response => {
          dispatch('listLineMovement')
        })
        .catch(error => {
          showMessage({
            type: 'error',
            message: error.message,
            showClose: true
          })
          console.warn(`Error Getting Update Movement Line: ${error.message}. Code: ${error.code}.`)
          dispatch('listLineMovement')
        })
    },
    deleteMovementLine({ dispatch, getters }, {
      id,
      uuid
    }) {
      const movementId = getters.getCurrentMovement.id
      deleteMovementLineRequest({
        id,
        uuid,
        movementId
      })
        .then(response => {
          dispatch('listLineMovement')
          showMessage({
            type: 'success',
            message: 'OK',
            showClose: true
          })
        })
        .catch(error => {
          showMessage({
            type: 'error',
            message: error.message,
            showClose: true
          })
          console.warn(`Error Getting Update Movement Line: ${error.message}. Code: ${error.code}.`)
        })
    }
  },
  getters: {
    getListProduct(state) {
      return state.listProduct
    },
    getListMovementLines(state) {
      return state.listMovementLines
    },
    getCurrentMovement(state) {
      return state.currentMovement
    }
  }
}
