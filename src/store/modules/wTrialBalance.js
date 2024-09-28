/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 * Contributor(s): Ricardo Fenomeno ricardofenomeno13@gmail.com https://github.com/ricargame
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

const initState = {
  organization: '',
  budget: '',
  period: '',
  accounting1: '',
  accounting2: '',
  cube: '',
  showPeriod: false,
  showAccumulated: false,
  isLoading: false,
  selectedExport: '',
  listSummary: []
}

export default {
  state: initState,
  mutations: {
    setOrganization(state, value) {
      state.organization = value
    },
    setBudget(state, value) {
      state.budget = value
    },
    setPeriod(state, value) {
      state.period = value
    },
    setAccounting1(state, value) {
      state.accounting1 = value
    },
    setAccounting2(state, value) {
      state.accounting2 = value
    },
    setCube(state, value) {
      state.cube = value
    },
    setShowPeriod(state, value) {
      state.showPeriod = value
    },
    setShowAccumulated(state, value) {
      state.showAccumulated = value
    },
    setIsLoading(state, value) {
      state.isLoading = value
    },
    setSelectedExport(state, value) {
      state.selectedExport = value
    },
    setRefreshTable(state, value) {
      state.refreshTable = value
    },
    setListSummary(state, value) {
      state.listSummary = value
    }
  },
  actions: {},
  getters: {
    getOrganization: (state) => {
      return state.organization
    },
    getBudget: (state) => {
      return state.budget
    },
    getPeriod: (state) => {
      return state.period
    },
    getAccounting1: (state) => {
      return state.accounting1
    },
    getAccounting2: (state) => {
      return state.accounting2
    },
    getCube: (state) => {
      return state.cube
    },
    getShowPeriod: (state) => {
      return state.showPeriod
    },
    getShowAccumulated: (state) => {
      return state.showAccumulated
    },
    getIsLoading: (state) => {
      return state.isLoading
    },
    getSelectedExport: (state) => {
      return state.selectedExport
    },
    getRefreshTable: (state) => {
      return state.refreshTable
    },
    getListSummary: (state) => {
      return state.listSummary
    }
  }
}
