/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
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
import { requestProductsList } from '@/api/ADempiere/field/product-info'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { showMessage } from '@/utils/ADempiere/notification'
import { generatePageToken } from '@/utils/ADempiere/dataUtils'

const initState = {
  productInfoPopoverList: false,
  // container uuid: record uuid
  emtpyProductData: {
    parentUuid: undefined,
    containerUuid: undefined,
    contextKey: '',
    searchValue: '',
    currentRecordUuid: undefined,
    recordsList: [],
    selectionsList: [],
    nextPageToken: undefined,
    recordCount: 0,
    isLoaded: false,
    pageNumber: 1
  },
  productInfoData: {}
}

const productInfo = {
  state: initState,

  mutations: {
    setProductData(state, {
      containerUuid,
      currentRow = {},
      recordsList = [],
      nextPageToken,
      recordCount = 0,
      isLoaded = true,
      pageNumber = 1
    }) {
      Vue.set(state.productInfoData, containerUuid, {
        containerUuid,
        currentRow,
        recordsList,
        nextPageToken,
        recordCount,
        isLoaded,
        pageNumber
      })
    },
    setProductSelectedRow(state, {
      containerUuid,
      currentRow = {}
    }) {
      Vue.set(state.productInfoData[containerUuid], 'currentRow', currentRow)
    },

    changePopoverListProduct(state, isShowed = false) {
      state.productInfoPopoverList = isShowed
    }
  },

  actions: {
    getProducts({ commit, getters }, {
      containerUuid,
      searchValue,
      value,
      name,
      contactName,
      eMail,
      postalCode,
      phone,
      filters = [],
      pageNumber
    }) {
      return new Promise(resolve => {
        if (isEmptyValue(pageNumber) || pageNumber < 1) {
          const storedPage = getters.getProductPageNumber({
            containerUuid
          })
          // refresh with same page
          pageNumber = storedPage
        }
        const pageToken = generatePageToken({ pageNumber })

        requestProductsList({
          searchValue,
          value,
          name,
          contactName,
          eMail,
          postalCode,
          phone,
          // Query
          filters,
          pageToken
        })
          .then(responseProductList => {
            const { productInfosList: recordsList } = responseProductList

            let currentRow = {}
            // update current record
            if (!isEmptyValue(recordsList)) {
              // set first record
              currentRow = recordsList.at(0)
            }

            commit('setProductData', {
              containerUuid,
              currentRow,
              recordsList,
              nextPageToken: responseProductList.nextPageToken,
              pageNumber,
              isLoaded: true,
              recordCount: responseProductList.recordCount
            })

            resolve(recordsList)
          })
          .catch(error => {
            console.warn(error)
            showMessage({
              type: 'info',
              message: error.message
            })
          })
      })
    }
  },
  getters: {
    /**
     * Used by result in Product List
     * @param {string} containerUuid
     */
    getProductData: (state) => ({ containerUuid }) => {
      return state.productInfoData[containerUuid] || {
        ...state.emtpyProductData,
        containerUuid
      }
    },
    getIsLoadedProductRecord: (state, getters) => ({ containerUuid }) => {
      return getters.getProductData({
        containerUuid
      }).isLoaded
    },
    getProductRecordsList: (state, getters) => ({ containerUuid }) => {
      return getters.getProductData({
        containerUuid
      }).recordsList
    },
    getProductRecordCount: (state, getters) => ({ containerUuid }) => {
      return getters.getProductData({
        containerUuid
      }).recordCount
    },
    getProductPageNumber: (state, getters) => ({ containerUuid }) => {
      return getters.getProductData({
        containerUuid
      }).pageNumber
    },
    getProductCurrentRow: (state, getters) => ({ containerUuid }) => {
      return getters.getProductData({
        containerUuid
      }).currentRow
    },
    getProductPopoverList: (state) => {
      return state.productInfoPopoverList
    }
  }
}

export default productInfo
