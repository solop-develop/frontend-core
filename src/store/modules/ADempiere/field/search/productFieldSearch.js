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
import { requestListProducts } from '@/api/ADempiere/field/search/product.ts'

// Constants
import { ROW_ATTRIBUTES } from '@/utils/ADempiere/tableUtils'
import { ROWS_OF_RECORDS_BY_PAGE } from '@/utils/ADempiere/tableUtils'
import { COLUMN_NAME } from '@/utils/ADempiere/dictionary/field/search/product.ts'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { showMessage } from '@/utils/ADempiere/notification'
import { generatePageToken } from '@/utils/ADempiere/dataUtils'

const emptyQueryFilters = {
  value: undefined,
  name: undefined,
  upc: undefined,
  sku: undefined,
  product_category_id: undefined,
  product_class_id: undefined,
  product_classification_id: undefined,
  product_group_id: undefined,
  price_list_version_id: undefined,
  warehouse_id: undefined,
  is_stocked: undefined,
  attribute_set_id: undefined,
  attribute_set_instance_id: undefined,
  vendor_id: undefined
}

const initState = {
  productPopoverList: false,
  // container uuid: record uuid
  emptyProductData: {
    parentUuid: undefined,
    containerUuid: undefined,
    contextKey: '',
    searchValue: '',
    currentRecordUuid: undefined,
    currentRow: {},
    recordsList: [],
    selectionsList: [],
    nextPageToken: undefined,
    recordCount: 0,
    isLoaded: false,
    isLoading: false,
    isSalesTransaction: undefined,
    productShow: false,
    pageSize: ROWS_OF_RECORDS_BY_PAGE,
    pageNumber: 1,
    showQueryFields: true,
    queryFilters: {
      ...emptyQueryFilters
    }
  },
  productData: {},
  productShow: {}
}

const productFieldSearch = {
  state: initState,

  mutations: {
    setProductSearchFieldData(state, {
      containerUuid,
      currentRow = {},
      recordsList = [],
      nextPageToken,
      recordCount = 0,
      isLoaded = true,
      isLoading = false,
      isSalesTransaction = undefined,
      productShow = false,
      pageNumber = 1,
      pageSize = ROWS_OF_RECORDS_BY_PAGE,
      showQueryFields = false,
      queryFilters = emptyQueryFilters
    }) {
      Vue.set(state.productData, containerUuid, {
        ...state.emptyProductData,
        containerUuid,
        currentRow,
        recordsList,
        productShow,
        nextPageToken,
        recordCount,
        isLoaded,
        isLoading,
        isSalesTransaction,
        showQueryFields,
        queryFilters,
        pageNumber,
        pageSize
      })
    },
    setProductSearchFieldSelectedRow(state, {
      containerUuid,
      currentRow = {}
    }) {
      if (isEmptyValue(state.productData[containerUuid])) {
        Vue.set(state.productData, containerUuid, {
          ...state.emptyProductData,
          containerUuid
        })
      }
      Vue.set(state.productData[containerUuid], 'currentRow', currentRow)
    },

    setProductSearchFieldIsLoading(state, {
      containerUuid,
      isLoading = false
    }) {
      if (isEmptyValue(state.productData[containerUuid])) {
        Vue.set(state.productData, containerUuid, {
          ...state.emptyProductData,
          containerUuid
        })
      }
      Vue.set(state.productData[containerUuid], 'isLoading', isLoading)
    },

    setProductSearchFieldShow(state, {
      containerUuid,
      show = false
    }) {
      Vue.set(state.productShow, containerUuid, show)
    },

    setProductSearchFieldShowQueryFields(state, {
      containerUuid,
      showQueryFields = false
    }) {
      Vue.set(state.productData[containerUuid], 'showQueryFields', showQueryFields)
    },

    setProductSearchFieldQueryFilters(state, {
      containerUuid,
      queryFilters = {}
    }) {
      Vue.set(state.productData[containerUuid], 'queryFilters', queryFilters)
    },
    setProductSearchFieldQueryFilterByAttribute(state, {
      containerUuid,
      attributeKey,
      value
    }) {
      Vue.set(state.productData[containerUuid].queryFilters, attributeKey, value)
    },

    setProductSearchFieldPageNumber(state, {
      containerUuid,
      pageNumber = 1
    }) {
      if (isEmptyValue(state.productData[containerUuid])) {
        Vue.set(state.productData, containerUuid, {
          ...state.emptyProductData,
          containerUuid
        })
      }
      Vue.set(state.productData[containerUuid], 'pageNumber', pageNumber)
    },
    setProductSearchFieldPageSize(state, {
      containerUuid,
      pageSize = ROWS_OF_RECORDS_BY_PAGE
    }) {
      if (isEmptyValue(state.productData[containerUuid])) {
        Vue.set(state.productData, containerUuid, {
          ...state.emptyProductData,
          containerUuid
        })
      }
      Vue.set(state.productData[containerUuid], 'pageSize', pageSize)
    },

    /**
     * Change showed list of business partner
     * TODO: Used only POS form
     * @param {object} state
     * @param {boolean} isShowed
     */
    changePopoverListProductSearchField(state, isShowed = false) {
      state.productPopoverList = isShowed
    }
  },

  actions: {
    gridProducts({ commit, getters }, {
      parentUuid,
      containerUuid,
      contextColumnNames = [],
      //
      fieldId,
      processParameterId,
      browseFieldId,
      columnId,
      //
      tableName,
      columnName,
      //
      searchValue,
      pageNumber,
      pageSize
    }) {
      return new Promise(resolve => {
        if (isEmptyValue(pageNumber) || pageNumber < 1) {
          const storedPage = getters.getProductSearchFieldPageNumber({
            containerUuid
          })
          // refresh with same page
          pageNumber = storedPage
        }
        const pageToken = generatePageToken({ pageNumber })

        const storedProductData = getters.getProductSearchFieldData({
          containerUuid
        })

        commit('setProductSearchFieldIsLoading', {
          containerUuid,
          isLoading: true
        })

        let queryFilters = {}
        if (isEmptyValue(searchValue)) {
          queryFilters = storedProductData.queryFilters
        }

        requestListProducts({
          contextColumnNames,
          //
          fieldId,
          processParameterId,
          browseFieldId,
          columnId,
          //
          tableName,
          columnName,
          // Query
          searchValue,
          ...queryFilters,
          //
          pageToken,
          pageSize
        })
          .then(responseProductList => {
            const recordsList = responseProductList.records.map((row, rowIndex) => {
              return {
                [COLUMN_NAME]: row.id,
                ...row,
                // datatables app attributes
                ...ROW_ATTRIBUTES,
                rowIndex
              }
            })

            let currentRow = {}
            // update current record
            if (!isEmptyValue(recordsList)) {
              // set first record
              currentRow = recordsList.at(0)
            }

            commit('setProductSearchFieldData', {
              ...storedProductData,
              containerUuid,
              currentRow,
              recordsList,
              nextPageToken: responseProductList.next_page_token,
              pageNumber,
              pageSize,
              isLoaded: true,
              recordCount: Number(responseProductList.record_count)
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
          .finally(() => {
            setTimeout(() => {
              commit('setProductSearchFieldIsLoading', {
                containerUuid,
                isLoading: false
              })
            }, 500)
          })
      })
    }
  },

  getters: {
    /**
     * Used by result in Business Partner List
     * @param {string} containerUuid
     */
    getProductSearchFieldData: (state) => ({ containerUuid }) => {
      if (isEmptyValue(state.productData[containerUuid])) {
        return {
          ...state.emptyProductData,
          containerUuid
        }
      }
      return state.productData[containerUuid]
    },
    getProductSearchFieldQueryFilters: (state, getters) => ({ containerUuid }) => {
      const { queryFilters } = getters.getProductSearchFieldData({
        containerUuid
      })
      return queryFilters || {}
    },
    getProductSearchFieldQueryFilterByAttribute: (state, getters) => ({ containerUuid, attributeKey }) => {
      const queryFilters = getters.getProductSearchFieldQueryFilters({
        containerUuid
      })
      if (!isEmptyValue(queryFilters)) {
        const { [attributeKey]: valueFilter } = queryFilters
        return valueFilter
      }
      return undefined
    },
    getIsLoadedProductSearchFieldRecord: (state, getters) => ({ containerUuid }) => {
      return getters.getProductSearchFieldData({
        containerUuid
      }).isLoaded
    },
    getIsLoadingProductSearchFieldRecord: (state, getters) => ({ containerUuid }) => {
      return getters.getProductSearchFieldData({
        containerUuid
      }).isLoading
    },
    getProductSearchFieldRecordsList: (state, getters) => ({ containerUuid }) => {
      return getters.getProductSearchFieldData({
        containerUuid
      }).recordsList
    },
    getProductSearchFieldRecordCount: (state, getters) => ({ containerUuid }) => {
      return getters.getProductSearchFieldData({
        containerUuid
      }).recordCount
    },
    getProductSearchFieldPageNumber: (state, getters) => ({ containerUuid }) => {
      return getters.getProductSearchFieldData({
        containerUuid
      }).pageNumber
    },
    getProductSearchFieldCurrentRow: (state, getters) => ({ containerUuid }) => {
      const { currentRow } = getters.getProductSearchFieldData({
        containerUuid
      })
      return currentRow
    },
    getProductSearchFieldShowQueryFields: (state, getters) => ({ containerUuid }) => {
      return getters.getProductSearchFieldData({
        containerUuid
      }).showQueryFields
    },
    getProductSearchFieldPopoverList: (state) => {
      return state.productPopoverList || false
    },
    getProductSearchFieldShow: (state) => ({ containerUuid }) => {
      return state.productShow[containerUuid] || false
    }
  }
}

export default productFieldSearch
