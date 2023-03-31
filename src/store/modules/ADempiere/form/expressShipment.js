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
  listProductRequest,
  // Shipment
  createShipmentRequest,
  processShipmentRequest,
  // Shipment Line
  createShipmentLineRequest,
  updateShipmentLineRequest,
  deleteShipmentLineRequest,
  listShipmentLinesRequest
} from '@/api/ADempiere/form/ExpressShipment.js'
import { isEmptyValue } from '@/utils/ADempiere'
// Utils and Helper Methods
import { showMessage } from '@/utils/ADempiere/notification.js'

const expressShipment = {
  currentShipment: {},
  listProduct: [],
  listShipmentLines: [
    {
      product: {
        value: 'VO-1',
        name: 'Epale',
        quantity: 12.2
      },
      isEditQuantity: false,
      id: 1,
      quantity: 12.2
    },
    {
      product: {
        value: 'Elm',
        name: 'Elm Tree'
      },
      isEditQuantity: false,
      id: 2,
      quantity: 2
    }
  ]
}

export default {
  state: expressShipment,
  mutations: {
    setListProduct(state, list) {
      state.listProduct = list
    },
    setListShipmentLines(state, list) {
      state.listShipmentLines = list
    },
    setCurrentShipment(state, current) {
      state.currentShipment = current
    }
  },
  actions: {
    findListProduct({ commit }, {
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
    listLine({ commit }, {
      shipmentId,
      shipmentUuid
    }) {
      listShipmentLinesRequest({
        shipmentId,
        shipmentUuid
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
          commit('setListShipmentLines', list)
        })
        .catch(error => {
          console.warn(`Error getting List Product: ${error.message}. Code: ${error.code}.`)
        })
    },
    // Shipment Line
    createLine({ state, getters, dispatch }, {
      productId,
      productUuid,
      description,
      quantity = 1
    }) {
      const { id, uuid } = getters.getCurrentShipment
      createShipmentLineRequest({
        shipmentId: id,
        shipmentUuid: uuid,
        description,
        quantity,
        productId,
        productUuid
      })
        .then(response => {
          dispatch('listLine', {
            shipmentId: id,
            shipmentUuid: uuid
          })
          console.log({ response })
        })
        .catch(error => {
          showMessage({
            type: 'error',
            message: error.message,
            showClose: true
          })
          console.warn(`Error Getting Update Shipment Line: ${error.message}. Code: ${error.code}.`)
        })
    },
    updateLine({ commit, dispatch }, {
      id,
      uuid,
      description,
      quantity
    }) {
      updateShipmentLineRequest({
        id,
        uuid,
        description,
        quantity
      })
        .then(response => {
          console.log({ response })
        })
        .catch(error => {
          showMessage({
            type: 'error',
            message: error.message,
            showClose: true
          })
          console.warn(`Error Getting Update Shipment Line: ${error.message}. Code: ${error.code}.`)
        })
    },
    deleteLine({ dispatch }, {
      id,
      uuid,
      shipmentId,
      shipmentUuid
    }) {
      console.log({ id,
        uuid,
        shipmentId,
        shipmentUuid
      })
      deleteShipmentLineRequest({
        id,
        uuid
      })
        .then(response => {
          console.log({ response })
          dispatch('listLine', {
            shipmentId,
            shipmentUuid
          })
        })
        .catch(error => {
          showMessage({
            type: 'error',
            message: error.message,
            showClose: true
          })
          console.warn(`Error Getting Update Shipment Line: ${error.message}. Code: ${error.code}.`)
        })
    },
    // Shipment
    createShipment({ commit, dispatch }, {
      id,
      uuid
    }) {
      createShipmentRequest({
        id,
        uuid
      })
        .then(response => {
          const { id, uuid } = response
          commit('setCurrentShipment', response)
          dispatch('listLine', {
            shipmentId: id,
            shipmentUuid: uuid
          })
        })
        .catch(error => {
          showMessage({
            type: 'error',
            message: error.message,
            showClose: true
          })
          console.warn(`Error Getting Update Shipment Line: ${error.message}. Code: ${error.code}.`)
        })
    },
    processShipment({ dispatch, getters }) {
      const { id, uuid } = getters.getCurrentShipment
      processShipmentRequest({
        id,
        uuid
      })
        .then(response => {
          console.log({ response })
          // dispatch('listLine', {
          //   shipmentId,
          //   shipmentUuid
          // })
        })
        .catch(error => {
          showMessage({
            type: 'error',
            message: error.message,
            showClose: true
          })
          console.warn(`Error Getting Update Shipment Line: ${error.message}. Code: ${error.code}.`)
        })
    }
  },
  getters: {
    getListProduct(state) {
      return state.listProduct
    },
    getListShipmentLines(state) {
      return state.listShipmentLines
    },
    getCurrentShipment(state) {
      return state.currentShipment
    }
  }
}
