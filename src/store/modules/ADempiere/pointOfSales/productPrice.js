/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 * Contributor(s): Edwin Betancourt EdwinBetanc0urt@outlook.com https://github.com/EdwinBetanc0urt
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

import Vue from 'vue'

// API Request Methods
import {
  getProductPriceList
} from '@/api/ADempiere/form/point-of-sales.js'

// utils and helper methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import { extractPagingToken } from '@/utils/ADempiere/dataUtils'
import { showMessage } from '@/utils/ADempiere/notification.js'
import language from '@/lang'

const withoutResponse = {
  isLoaded: false,
  isReload: true,
  recordCount: 0,
  nextPageToken: undefined
}

/**
 * Product Price Vuex Module
 * Product List
 * Search Product
 */
const listProductPrice = {
  state: {
    showedProductPriceList: false,
    withoutResponse,
    productPrice: {
      ...withoutResponse,
      isShowPopoverField: false, // with field
      isShowPopoverMenu: false // with menu
    },
    searchProduct: '',
    showProductSearch: false
  },

  mutations: {
    setListProductPrice(state, productsPrices) {
      state.productPrice = {
        ...state.productPrice,
        ...productsPrices
      }
    },
    setProductPicePageNumber(state, pageNumber) {
      state.productPrice.pageNumber = pageNumber
    },
    setIsShowListProductPrice(state, isShowed) {
      state.showedProductPriceList = isShowed
    },
    setIsReloadProductPrice(state) {
      Vue.set(state.productPrice, 'isReload', true)
      Vue.set(state.productPrice, 'isLoaded', false)
    },
    updtaeSearchProduct(state, searchProduct) {
      state.searchProduct = searchProduct
    },
    setShowProductSearch(state, show) {
      state.showProductSearch = show
    }
  },

  actions: {
    setProductPicePageNumber({ commit }, pageNumber) {
      commit('setProductPicePageNumber', pageNumber)
      commit('setIsReloadProductPrice')
    },

    listProductPriceFromServer({ state, commit, rootGetters }, {
      containerUuid = 'Products-Price-List',
      pageNumber, // 1
      searchValue,
      currentPOS
    }) {
      const posUuid = isEmptyValue(currentPOS) ? rootGetters.posAttributes.currentPointOfSales.uuid : currentPOS.uuid
      if (isEmptyValue(posUuid)) {
        const message = language.t('notifications.errorPointOfSale')
        showMessage({
          type: 'info',
          message
        })
        console.warn(message)
        return
      }
      commit('setIsReloadProductPrice')
      let pageToken, token
      if (isEmptyValue(pageNumber)) {
        pageNumber = state.productPrice.pageNumber
        if (isEmptyValue(pageNumber)) {
          pageNumber = 1
        }

        token = state.productPrice.token
        if (!isEmptyValue(token)) {
          pageToken = token + '-' + pageNumber
        }
      }
      const currentPointOfSales = rootGetters.posAttributes.currentPointOfSales
      const { templateCustomer, currentPriceList, currentWarehouse } = currentPointOfSales
      const { uuid: businessPartnerUuid } = templateCustomer
      if (isEmptyValue(searchValue)) {
        searchValue = rootGetters.getValueOfField({
          containerUuid,
          columnName: 'ProductValue'
        })
      }
      return new Promise(resolve => {
        getProductPriceList({
          searchValue,
          posUuid,
          businessPartnerUuid,
          priceListUuid: currentPriceList.uuid,
          warehouseUuid: currentWarehouse.uuid,
          pageToken
        }).then(responseProductPrice => {
          if (isEmptyValue(token) || isEmptyValue(pageToken)) {
            token = extractPagingToken(responseProductPrice.nextPageToken)
          }

          commit('setListProductPrice', {
            ...responseProductPrice,
            isLoaded: true,
            isReload: false,
            businessPartnerUuid,
            warehouseUuid: currentWarehouse.uuid,
            token,
            pageNumber
          })

          resolve(responseProductPrice)
        }).catch(error => {
          console.warn(`getProductPriceList: ${error.message}. Code: ${error.code}.`)
          showMessage({
            type: 'error',
            message: error.message,
            showClose: true
          })
        })
      })
    },

    updateSearch({ commit }, newValue) {
      commit('updtaeSearchProduct', newValue)
    }
  },

  getters: {
    /**
     * Product Price Getters
     * List Product
     * Search Product
     */
    getProductPrice: (state) => {
      if (isEmptyValue(state.productPrice)) {
        return {
          ...withoutResponse,
          productPricesList: []
        }
      }
      return state.productPrice
    },
    getSearchProduct: (state) => {
      return state.searchProduct
    },
    getShowProductPriceList: (state) => {
      return state.showedProductPriceList
    },
    getShowProductSearch: (state) => {
      return state.showProductSearch
    }
  }

}

export default listProductPrice
