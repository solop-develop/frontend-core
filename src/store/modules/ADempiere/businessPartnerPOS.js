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

// api request methods
import { requestListBusinessPartner } from '@/api/ADempiere/system-core.js'

// utils and helper methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import { showMessage } from '@/utils/ADempiere/notification.js'
import { generatePageToken } from '@/utils/ADempiere/dataUtils'

const withoutResponse = {
  isLoaded: false,
  isReload: true,
  recordCount: 0,
  nextPageToken: undefined
}

const businessPartner = {
  state: {
    businessPartner: {
      ...withoutResponse,
      isShowList: false, // popover with records list
      isShowCreate: false, // popover with create form
      businessPartnersList: []
    }
  },
  mutations: {
    setBusinessPartnersList(state, businessPartners) {
      state.businessPartner = {
        ...state.businessPartner,
        ...businessPartners
      }
    },
    setBPartnerPageNumber(state, pageNumber) {
      state.businessPartner.pageNumber = pageNumber
    }
  },
  actions: {
    listBPartnerFromServer({ state, commit }, {
      searchValue,
      value,
      name,
      contactName,
      eMail,
      postalCode,
      phone,
      // Query
      criteria,
      pageNumber
    }) {
      const pageToken = generatePageToken({ pageNumber })

      return requestListBusinessPartner({
        searchValue,
        value,
        name,
        contactName,
        eMail,
        postalCode,
        phone,
        // Query
        criteria,
        pageToken
      })
        .then(responseBusinessPartnerList => {
          commit('setBusinessPartnersList', {
            ...responseBusinessPartnerList,
            isLoaded: true,
            isReload: false,
            pageNumber
          })

          return responseBusinessPartnerList.businessPartnersList
        })
        .catch(error => {
          console.warn(error)
          showMessage({
            type: 'info',
            message: error.message
          })
        })
    },
    setBPartnerPageNumber({ commit, dispatch }, pageNumber) {
      commit('setBPartnerPageNumber', pageNumber)
      dispatch('listBPartnerFromServer', {
        // posUuid: getters.getPointOfSalesUuid
      })
    }
  },
  getters: {
    getBusinessPartner: (state) => {
      const bp = state.businessPartner
      if (isEmptyValue(bp)) {
        return {
          ...withoutResponse
        }
      }
      return bp
    },
    getBusinessPartnersList: (state) => {
      const list = state.businessPartner.businessPartnersList
      if (isEmptyValue(list)) {
        return []
      }
      return list
    }
  }
}

export default businessPartner
