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
import { requestListBusinessPartner } from '@/api/ADempiere/field/search/business-partner.ts'

// Constants
import { ROW_ATTRIBUTES } from '@/utils/ADempiere/tableUtils'
import { ROWS_OF_RECORDS_BY_PAGE } from '@/utils/ADempiere/tableUtils'
import { COLUMN_NAME } from '@/utils/ADempiere/dictionary/field/search/businessPartner.ts'

// Utils and Helper Methods
import { isSalesTransaction } from '@/utils/ADempiere/contextUtils'
import { getContextAttributes } from '@/utils/ADempiere/contextUtils/contextAttributes'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { showMessage } from '@/utils/ADempiere/notification'
import { generatePageToken } from '@/utils/ADempiere/dataUtils'

const initState = {
  businessPartnerPopoverList: false,
  // container uuid: record uuid
  emtpyBusinessPartnerData: {
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
    BPshow: false,
    pageSize: ROWS_OF_RECORDS_BY_PAGE,
    pageNumber: 1,
    showQueryFields: true,
    queryFilters: {
      contact: undefined,
      email: undefined,
      name: undefined,
      phone: undefined,
      postal_code: undefined,
      value: undefined,
      is_vendor: undefined,
      is_customer: undefined
    }
  },
  businessPartnerData: {},
  BPShow: {}
}

const businessPartner = {
  state: initState,

  mutations: {
    setBusinessPartnerData(state, {
      containerUuid,
      currentRow = {},
      recordsList = [],
      nextPageToken,
      recordCount = 0,
      isLoaded = true,
      isLoading = false,
      isSalesTransaction = undefined,
      BPshow = false,
      pageNumber = 1,
      pageSize = ROWS_OF_RECORDS_BY_PAGE,
      showQueryFields = false,
      queryFilters = {}
    }) {
      Vue.set(state.businessPartnerData, containerUuid, {
        ...state.emtpyBusinessPartnerData,
        containerUuid,
        currentRow,
        recordsList,
        BPshow,
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
    setBusinessPartnerSelectedRow(state, {
      containerUuid,
      currentRow = {}
    }) {
      if (isEmptyValue(state.businessPartnerData[containerUuid])) {
        Vue.set(state.businessPartnerData, containerUuid, {
          ...state.emtpyBusinessPartnerData,
          containerUuid
        })
      }
      Vue.set(state.businessPartnerData[containerUuid], 'currentRow', currentRow)
    },

    setBusinessPartnerIsLoading(state, {
      containerUuid,
      isLoading = false
    }) {
      if (isEmptyValue(state.businessPartnerData[containerUuid])) {
        Vue.set(state.businessPartnerData, containerUuid, {
          ...state.emtpyBusinessPartnerData,
          containerUuid
        })
      }
      Vue.set(state.businessPartnerData[containerUuid], 'isLoading', isLoading)
    },

    setBusinessPartnerShow(state, {
      containerUuid,
      show = false
    }) {
      Vue.set(state.BPShow, containerUuid, show)
    },

    setBusinessPartnerShowQueryFields(state, {
      containerUuid,
      showQueryFields = false
    }) {
      Vue.set(state.businessPartnerData[containerUuid], 'showQueryFields', showQueryFields)
    },

    setBusinessPartnerQueryFilters(state, {
      containerUuid,
      queryFilters
    }) {
      Vue.set(state.businessPartnerData[containerUuid], 'queryFilters', queryFilters)
    },
    setBusinessPartnerQueryFilterByAttribute(state, {
      containerUuid,
      attributeKey,
      value
    }) {
      Vue.set(state.businessPartnerData[containerUuid].queryFilters, attributeKey, value)
    },

    /**
     * Change showed list of business partner
     * TODO: Used only POS form
     * @param {object} state
     * @param {boolean} isShowed
     */
    changePopoverListBusinessPartner(state, isShowed = false) {
      state.businessPartnerPopoverList = isShowed
    }
  },

  actions: {
    gridBusinessPartners({ commit, getters }, {
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
      pageSize,
      isWithoutValidation = false
    }) {
      return new Promise(resolve => {
        const storedBusinessPartnerData = getters.getBusinessPartnerData({
          containerUuid
        })

        if (isEmptyValue(pageNumber) || pageNumber < 1) {
          const {
            pageNumber: storedPageNumber
          } = storedBusinessPartnerData.pageNumber
          // refresh with same page
          pageNumber = storedPageNumber
        }
        const pageToken = generatePageToken({ pageNumber })

        commit('setBusinessPartnerIsLoading', {
          containerUuid,
          isLoading: true
        })

        let originContainerUuid = containerUuid
        if (containerUuid.includes('_')) {
          const containers = containerUuid.split('_')
          originContainerUuid = containers.pop()
        }
        const contextAttributesList = getContextAttributes({
          parentUuid,
          containerUuid: originContainerUuid,
          contextColumnNames,
          isBooleanToString: true
        })

        const isSalesTransactionContext = isSalesTransaction({
          parentUuid: parentUuid,
          containerUuid: containerUuid
        })

        const { queryFilters } = storedBusinessPartnerData
        if (isSalesTransactionContext) {
          queryFilters.is_vendor = undefined
        } else {
          queryFilters.is_customer = undefined
        }

        requestListBusinessPartner({
          contextAttributesList,
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
          pageSize,
          isWithoutValidation
        })
          .then(responseBusinessPartnerList => {
            const recordsList = responseBusinessPartnerList.records.map((row, rowIndex) => {
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

            commit('setBusinessPartnerData', {
              ...storedBusinessPartnerData,
              containerUuid,
              currentRow,
              recordsList,
              nextPageToken: responseBusinessPartnerList.next_page_token,
              pageNumber,
              pageSize,
              isSalesTransaction: isSalesTransactionContext,
              isLoaded: true,
              recordCount: Number(responseBusinessPartnerList.record_count)
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
              commit('setBusinessPartnerIsLoading', {
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
    getBusinessPartnerData: (state) => ({ containerUuid }) => {
      return state.businessPartnerData[containerUuid] || {
        ...state.emtpyBusinessPartnerData,
        containerUuid
      }
    },
    getBusinessPartnerQueryFilters: (state, getters) => ({ containerUuid }) => {
      const { queryFilters } = getters.getBusinessPartnerData({
        containerUuid
      })
      return queryFilters || {}
    },
    getBusinessPartnerQueryFilterByAttribute: (state, getters) => ({ containerUuid, attributeKey }) => {
      const queryFilters = getters.getBusinessPartnerQueryFilters({
        containerUuid
      })
      if (!isEmptyValue(queryFilters)) {
        const { [attributeKey]: valueFilter } = queryFilters
        return valueFilter
      }
      return undefined
    },
    getIsLoadedBusinessPartnerRecord: (state, getters) => ({ containerUuid }) => {
      return getters.getBusinessPartnerData({
        containerUuid
      }).isLoaded
    },
    getIsLoadingBusinessPartnerRecord: (state, getters) => ({ containerUuid }) => {
      return getters.getBusinessPartnerData({
        containerUuid
      }).isLoading
    },
    getBusinessPartnerRecordsList: (state, getters) => ({ containerUuid }) => {
      return getters.getBusinessPartnerData({
        containerUuid
      }).recordsList
    },
    getBusinessPartnerRecordCount: (state, getters) => ({ containerUuid }) => {
      return getters.getBusinessPartnerData({
        containerUuid
      }).recordCount
    },
    getBusinessPartnerPageNumber: (state, getters) => ({ containerUuid }) => {
      return getters.getBusinessPartnerData({
        containerUuid
      }).pageNumber
    },
    getBusinessPartnerCurrentRow: (state, getters) => ({ containerUuid }) => {
      return getters.getBusinessPartnerData({
        containerUuid
      }).currentRow
    },
    getBusinessPartnerShowQueryFields: (state, getters) => ({ containerUuid }) => {
      return getters.getBusinessPartnerData({
        containerUuid
      }).showQueryFields
    },
    getBusinessPartnerPopoverList: (state) => {
      return state.businessPartnerPopoverList || false
    },
    getBPShow: (state) => ({ containerUuid }) => {
      return state.BPShow[containerUuid] || false
    }
  }
}

export default businessPartner
