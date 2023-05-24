/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
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

// API Request Methods

import {
  ListMatchedTo,
  ListMatchedFrom,
  process
} from '@/api/ADempiere/form/VMatch.js'

// Utils and Helper Methods
// import { showMessage } from '@/utils/ADempiere/notification.js'
import { dateTimeFormats } from '@/utils/ADempiere/formatValue/dateFormat'

const match = {
  searchCriteria: {
    matchMode: '',
    searchValue: '',
    matchFromType: '',
    matchToType: '',
    vendorId: '',
    productId: '',
    dateFrom: '',
    dateto: ''
  },
  displayAssignFrom: '',
  displayAssignTo: '',
  matchedFrom: {
    isLoading: false,
    list: []
  },
  matchedTo: {
    isLoading: false,
    list: []
  },
  searchModeList: [],
  assignFromList: [],
  assignUpList: [],
  selecteAssignFrom: {},
  selectedAssignTo: {}
}

export default {
  state: match,
  mutations: {
    /**
     * Search Criteria
     */
    setSearchValue(state, id) {
      state.searchCriteria.searchValue = id
    },
    setMatchFromType(state, id) {
      state.searchCriteria.matchFromType = id
    },
    setMatchMode(state, id) {
      state.searchCriteria.matchMode = id
    },
    setMatchToType(state, id) {
      state.searchCriteria.matchToType = id
    },
    setVendorId(state, id) {
      state.searchCriteria.vendorId = id
    },
    setProductId(state, id) {
      state.searchCriteria.productId = id
    },
    setDateFrom(state, id) {
      state.searchCriteria.dateFrom = id
    },
    setDateto(state, id) {
      state.searchCriteria.dateto = id
    },
    setLabelAssignFrom(state, assignFrom) {
      state.displayAssignFrom = assignFrom.DisplayColumn
    },
    setLabelAssignTo(state, assignTo) {
      state.displayAssignTo = assignTo.DisplayColumn
    },
    setMatchedFrom(state, list) {
      state.matchedFrom.list = list
    },
    setMatchedFromLoading(state, load) {
      state.matchedFrom.isLoading = load
    },
    setMatchedTo(state, list) {
      state.matchedTo.list = list
    },
    setMatchedToLoading(state, load) {
      state.matchedTo.isLoading = load
    },
    setSelecteAssignFrom(state, assignFrom) {
      state.selecteAssignFrom = assignFrom
    },
    setSelecteAssignTo(state, assignTo) {
      state.selectedAssignTo = assignTo
    },
    setAssignFromList(state, list) {
      state.assignFromList = list
    },
    setAssignUpList(state, list) {
      state.assignUpList = list
    },
    setSearchModeList(state, list) {
      state.searchModeList = list
    }
  },
  actions: {
    selectedInvoceMatch({ commit }, select) {
      commit('setSelectedInvoceMatch', select)
    },
    findListMatchedFrom({ commit, state }) {
      return new Promise(resolve => {
        const {
          matchMode,
          searchValue,
          matchFromType,
          matchToType,
          vendorId,
          productId,
          dateFrom,
          dateto
        } = state.searchCriteria
        commit('setMatchedFromLoading', true)
        ListMatchedFrom({
          matchMode,
          searchValue,
          matchFromType,
          matchToType,
          vendorId,
          productId,
          dateFrom,
          dateto
        })
          .then(response => {
            const { records } = response
            const list = records.map(list => {
              return {
                ...list,
                isSelection: false,
                date: dateTimeFormats(list.date, 'YYYY-MM-DD')
              }
            })
            commit('setMatchedFrom', list)
            commit('setMatchedFromLoading', false)
            resolve(response)
          })
          .catch(error => {
            resolve([])
            commit('setMatchedFrom', [])
            commit('setMatchedFromLoading', false)
            console.warn(`Error getting List Match From: ${error.message}. Code: ${error.code}.`)
          })
      })
    },
    findListMatchedTo({ commit, state }, {
      id,
      vendorId,
      productId,
      isSameQuantity
    }) {
      return new Promise(resolve => {
        const {
          matchMode,
          searchValue,
          matchFromType,
          matchToType,
          dateFrom,
          dateto
        } = state.searchCriteria
        commit('setMatchedToLoading', true)
        ListMatchedTo({
          matchMode,
          searchValue,
          matchFromType,
          matchToType,
          vendorId,
          productId,
          dateFrom,
          dateto,
          matchFromSelectedId: id,
          isSameQuantity
        })
          .then(response => {
            const { records } = response
            const list = records.map(list => {
              return {
                ...list,
                isSelection: false,
                date: dateTimeFormats(list.date, 'YYYY-MM-DD')
              }
            })
            commit('setMatchedToLoading', false)
            commit('setMatchedTo', list)
            resolve(response)
          })
          .catch(error => {
            resolve([])
            commit('setMatchedTo', [])
            commit('setMatchedToLoading', false)
            console.warn(`Error getting List Match From: ${error.message}. Code: ${error.code}.`)
          })
      })
    },
    sendProcess({ commit, dispatch, state }) {
      return new Promise(resolve => {
        const {
          matchMode,
          matchFromType,
          matchToType
        } = state.searchCriteria
        const {
          id,
          quantity
        } = state.selecteAssignFrom
        const matchedToSelections = [state.selectedAssignTo]
        commit('setMatchedFromLoading', true)
        commit('setMatchedToLoading', true)
        process({
          matchMode,
          matchFromType,
          matchToType,
          matchFromSelectedId: id,
          matchedToSelections,
          quantity
        })
          .then(response => {
            dispatch('findListMatchedFrom')
            dispatch('clean')
            resolve(response)
          })
          .catch(error => {
            dispatch('clean')
            resolve([])
            console.warn(`Error getting List Match From: ${error.message}. Code: ${error.code}.`)
          })
      })
    },
    clean({ commit }) {
      commit('setMatchedFromLoading', false)
      commit('setMatchedToLoading', false)
      commit('setMatchedTo', [])
      commit('setSelecteAssignFrom', {})
      commit('setSelecteAssignTo', {})
    }
  },
  getters: {
    getCriteriaVMatch: (state) => {
      return state.searchCriteria
    },
    getMatchFromList: (state) => {
      return state.matchedFrom
    },
    getMatchToList: (state) => {
      return state.matchedTo
    },
    getLabelAssignFrom: (state) => {
      return state.displayAssignFrom
    },
    getLabelAssignTo: (state) => {
      return state.displayAssignTo
    },
    getSelecteAssignFrom: (state) => {
      return state.selecteAssignFrom
    },
    getSelecteAssignTo: (state) => {
      return state.selectedAssignTo
    },
    getAssignFromList: (state) => {
      return state.assignFromList
    },
    getAssignUpList: (state) => {
      return state.assignUpList
    },
    getSearchModeList: (state) => {
      return state.searchModeList
    }
  }
}
