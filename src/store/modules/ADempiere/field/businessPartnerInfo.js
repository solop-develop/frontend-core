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
import { requestListBusinessPartner } from '@/api/ADempiere/field/businessPartner'

// Constants
import { ROW_ATTRIBUTES } from '@/utils/ADempiere/tableUtils'
import { ROWS_OF_RECORDS_BY_PAGE } from '@/utils/ADempiere/tableUtils'

// Utils and Helper Methods
import { isSalesTransactionContainer } from '@/utils/ADempiere/contextUtils'
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
    recordsList: [],
    selectionsList: [],
    nextPageToken: undefined,
    recordCount: 0,
    isLoaded: false,
    BPshow: false,
    pageSize: ROWS_OF_RECORDS_BY_PAGE,
    pageNumber: 1
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
      BPshow = false,
      pageNumber = 1,
      pageSize = ROWS_OF_RECORDS_BY_PAGE
    }) {
      Vue.set(state.businessPartnerData, containerUuid, {
        containerUuid,
        currentRow,
        recordsList,
        BPshow,
        nextPageToken,
        recordCount,
        isLoaded,
        pageNumber,
        pageSize
      })
    },
    setBusinessPartnerSelectedRow(state, {
      containerUuid,
      currentRow = {}
    }) {
      Vue.set(state.businessPartnerData[containerUuid], 'currentRow', currentRow)
    },

    setBusinessPartnerShow(state, {
      containerUuid,
      show = false
    }) {
      Vue.set(state.BPShow, containerUuid, show)
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
      fieldUuid,
      processParameterUuid,
      browseFieldUuid,
      columnUuid,
      //
      tableName,
      columnName,
      //
      isForm = false,
      filters = [],
      searchValue,
      pageNumber,
      pageSize
    }) {
      return new Promise(resolve => {
        if (isEmptyValue(pageNumber) || pageNumber < 1) {
          const storedPage = getters.getBusinessPartnerPageNumber({
            containerUuid
          })
          // refresh with same page
          pageNumber = storedPage
        }
        const pageToken = generatePageToken({ pageNumber })

        if (!isForm) {
          const isSOTrx = isSalesTransactionContainer({
            parentUuid
            // containerUuid
          })
          if (!isEmptyValue(isSOTrx)) {
            let columnName = 'IsVendor'
            if (isSOTrx) {
              columnName = 'IsCustomer'
            }
            filters.push({
              columnName,
              value: true
            })
          }
        }

        requestListBusinessPartner({
          contextColumnNames,
          //
          fieldUuid,
          processParameterUuid,
          browseFieldUuid,
          columnUuid,
          //
          tableName,
          columnName,
          // Query
          filters,
          searchValue,
          pageToken,
          pageSize
        })
          .then(responseBusinessPartnerList => {
            const recordsList = responseBusinessPartnerList.recordsList.map((record, rowIndex) => {
              return {
                ...record.attributes,
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
              containerUuid,
              currentRow,
              recordsList,
              nextPageToken: responseBusinessPartnerList.nextPageToken,
              pageNumber,
              pageSize,
              isLoaded: true,
              recordCount: responseBusinessPartnerList.recordCount
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
     * Used by result in Business Partner List
     * @param {string} containerUuid
     */
    getBusinessPartnerData: (state) => ({ containerUuid }) => {
      return state.businessPartnerData[containerUuid] || {
        ...state.emtpyBusinessPartnerData,
        containerUuid
      }
    },
    getIsLoadedBusinessPartnerRecord: (state, getters) => ({ containerUuid }) => {
      return getters.getBusinessPartnerData({
        containerUuid
      }).isLoaded
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
    getBusinessPartnerPopoverList: (state) => {
      return state.businessPartnerPopoverList || false
    },
    getBPShow: (state) => ({ containerUuid }) => {
      return state.BPShow[containerUuid] || false
    }
  }
}

export default businessPartner
