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

import { requestListInvoicesInfo } from '@/api/ADempiere/field/search/invoice.ts'

const initState = {
  InvociesInfo: {},
  CountInvocies: 0,
  BPShowInvoice: {}
}

export default {
  state: initState,

  mutations: {
    setInvociesInfo(state, element) {
      state.InvociesInfo = element
    },
    setCountInfo(state, count) {
      state.CountInvocies = count
    },
    setInoviceShow(state, {
      containerUuid,
      show = false
    }) {
      Vue.set(state.BPShowInvoice, containerUuid, show)
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
    getSetShow: (state) => ({ containerUuid }) => {
      return state.BPShowInvoice[containerUuid] || false
    }
  }
}
