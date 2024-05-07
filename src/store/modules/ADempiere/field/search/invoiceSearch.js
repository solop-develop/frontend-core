/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 * Contributor(s): Elsio Sanchez elsiosanchez@gmail.com https://github.com/elsiosanchez
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
import { requestListInvoicesInfo } from '@/api/ADempiere/field/search/invoice.ts'

// Constants
import { ROWS_OF_RECORDS_BY_PAGE } from '@/utils/ADempiere/tableUtils'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

const initState = {
  InvociesInfo: {},
  emtpyInvoiceData: {
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
      document_no: undefined,
      is_sales_transaction: undefined,
      business_partner_id: undefined,
      is_paid: undefined,
      description: undefined,
      invoice_date_from: undefined,
      invoice_date_to: undefined,
      order_id: undefined,
      grand_total_from: undefined,
      grand_total_to: undefined
    }
  },
  invoiceData: {},
  CountInvocies: 0,
  showInvoice: {}
}

export default {
  state: initState,

  mutations: {
    setInvociesInfo(state, element) {
      state.InvociesInfo = element
    },

    setInvoiceSearchQueryFilterByAttribute(state, {
      containerUuid,
      attributeKey,
      value
    }) {
      if (isEmptyValue(state.invoiceData[containerUuid])) {
        Vue.set(state.invoiceData, containerUuid, state.emtpyInvoiceData)
      }
      Vue.set(state.invoiceData[containerUuid].queryFilters, attributeKey, value)
    },

    setCountInfo(state, count) {
      state.CountInvocies = count
    },
    setInoviceShow(state, {
      containerUuid,
      show = false
    }) {
      Vue.set(state.showInvoice, containerUuid, show)
    }
  },

  actions: {
    searchInvociesInfos({ commit }, {
      page_size,
      page_token,
      document_no,
      is_sales_transaction,
      business_partner_id,
      is_paid,
      description,
      invoice_date_from,
      invoice_date_to,
      order_id,
      grand_total_from,
      grand_total_to
    }) {
      return new Promise(resolve => {
        requestListInvoicesInfo({
          page_size,
          page_token,
          document_no,
          is_sales_transaction,
          business_partner_id,
          is_paid,
          description,
          invoice_date_from,
          invoice_date_to,
          order_id,
          grand_total_from,
          grand_total_to
        })
          .then(response => {
            const { records } = response
            commit('setInvociesInfo', records)

            commit('setCountInfo', records.length)
            resolve(records)
          })
      })
    }
  },

  getters: {
    getInvoicesSearchFieldRecordsList: (state) => {
      return state.InvociesInfo
    },
    getCountInvocies: (state) => {
      return state.CountInvocies
    },
    /**
     * Used by result in Invoice List
     * @param {string} containerUuid
     */
    getInvoiceSearchData: (state) => ({ containerUuid }) => {
      return state.invoiceData[containerUuid] || {
        ...state.emtpyInvoiceData,
        containerUuid
      }
    },
    getInvoiceSearchQueryFilters: (state, getters) => ({ containerUuid }) => {
      const { queryFilters } = getters.getInvoiceSearchData({
        containerUuid
      })
      return queryFilters || {}
    },
    getInvoiceSearchQueryFilterByAttribute: (state, getters) => ({ containerUuid, attributeKey }) => {
      const queryFilters = getters.getInvoiceSearchQueryFilters({
        containerUuid
      })
      if (!isEmptyValue(queryFilters)) {
        const { [attributeKey]: valueFilter } = queryFilters
        return valueFilter
      }
      return undefined
    },
    getSetShow: (state) => ({ containerUuid }) => {
      return state.showInvoice[containerUuid] || false
    }
  }
}
