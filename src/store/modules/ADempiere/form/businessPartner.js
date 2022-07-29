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
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import Vue from 'vue'

// api request methods
import { requestListBusinessPartner } from '@/api/ADempiere/system-core.js'

// utils and helper methods
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
      pageNumber = 1
    }) {
      Vue.set(state.businessPartnerData, containerUuid, {
        containerUuid,
        currentRow,
        recordsList,
        BPshow,
        nextPageToken,
        recordCount,
        isLoaded,
        pageNumber
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

    changePopoverListBusinessPartner(state, isShowed = false) {
      state.businessPartnerPopoverList = isShowed
    }
  },

  actions: {
    getBusinessPartners({ commit, getters }, {
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
          const storedPage = getters.getBusinessPartnerPageNumber({
            containerUuid
          })
          // refresh with same page
          pageNumber = storedPage
        }
        const pageToken = generatePageToken({ pageNumber })

        requestListBusinessPartner({
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
          .then(responseBusinessPartnerList => {
            const { businessPartnersList: recordsList } = responseBusinessPartnerList

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
      return state.businessPartnerPopoverList
    },
    getBPShow: (state) => ({ containerUuid }) => {
      return state.BPShow[containerUuid]
    }
  }
}

export default businessPartner
