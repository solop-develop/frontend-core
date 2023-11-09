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
  // productPriceSearchValue,
  listProductPrice
} from '@/api/ADempiere/form/VPOS'
// Utils and Helper Methods
// import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import { showMessage } from '@/utils/ADempiere/notification'

const productList = {
  showProductList: false,
  productList: [],
  recordCount: 0,
  pageToken: ''
}

export default {
  state: productList,
  mutations: {
    setShowProductList(state, show) {
      state.showProductList = show
    },
    setProductCount(state, recordCount) {
      state.recordCount = recordCount
    },
    setProductPageToken(state, pageToken) {
      state.pageToken = pageToken
    },
    setProductList(state, list) {
      state.productList = list
    }
  },
  /**
   * Product List
   */
  actions: {
    /**
     * Get List All Products
     * @params {String} SearchValue
     * @params {Number} PageSize
     */
    searchProductList({
      commit,
      getters
    }, {
      searchValue,
      pageSize = 15,
      pageToken
    }) {
      return new Promise(resolve => {
        const currentPos = getters.getVPOS
        const {
          id,
          price_list,
          warehouse
        } = currentPos
        listProductPrice({
          posId: id,
          pageSize,
          pageToken,
          searchValue,
          priceListId: price_list.id,
          warehouseId: warehouse.id
          // businessPartnerUuid
        })
          .then(response => {
            const {
              record_count,
              product_prices,
              next_page_token
            } = response
            commit('setProductCount', record_count)
            commit('setProductList', product_prices)
            commit('setProductPageToken', next_page_token)
            resolve(product_prices)
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
    getProductList: (state) => {
      return state.productList
    },
    getProductCount: (state) => {
      return state.recordCount
    },
    getProductPageToken: (state) => {
      return state.pageToken
    },
    getShowProductList: (state) => {
      return state.showProductList
    }
  }
}
