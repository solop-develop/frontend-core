/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 * Contributor(s): Elsio Sanchez elsiosanchez15@outlook.com https://github.com/elsiosanchez
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

// import lang from '@/lang'
import Vue from 'vue'

// API Request Methods
import {
  existsCharts,
  ListWindowCharts,
  getWindowMetrics
} from '@/api/ADempiere/dashboard/panelWindows.js'

// Utils and Helper Methods
// import { showMessage } from '@/utils/ADempiere/notification.js'
import { isEmptyValue } from '@/utils/ADempiere'
import { getContextAttributes } from '@/utils/ADempiere/contextUtils/contextAttributes'

const panelWindows = {
  dashboard: 0,
  listDashboard: [],
  metrics: [],
  dashboardList: {},
  dashboardTab: {}
}

export default {
  state: panelWindows,
  mutations: {
    setNumberDashboard(state, num) {
      state.dashboard = num
    },
    setListDashboard(state, list) {
      state.listDashboard = list
    },
    setMetrics(state, metrics) {
      state.metrics = metrics
    },
    setPanelDashboardTab(state, dashboard) {
      const { tabId, list } = dashboard
      Vue.set(state.dashboardList, tabId, list)
    },
    setExistsDashboardTab(state, dashboard) {
      const { tabId, num } = dashboard
      Vue.set(state.dashboardTab, tabId, num)
    }
  },
  actions: {
    isDashboard({ commit, state }, {
      tabId,
      windowId
    }) {
      return new Promise(resolve => {
        if (!isEmptyValue(state.dashboardTab[tabId])) {
          const num = state.dashboardTab[tabId]
          commit('setNumberDashboard', num)
          resolve(num)
          return num
        }
        existsCharts({
          tabId,
          windowId
        })
          .then(response => {
            const dashboard = {
              tabId,
              num: response
            }
            commit('setExistsDashboardTab', dashboard)
            commit('setNumberDashboard', response)
            resolve(response)
          })
          .catch(error => {
            resolve(0)
            // commit('setListProduct', [])
            console.warn(`Error getting List Product: ${error.message}. Code: ${error.code}.`)
          })
      })
    },
    listWindowDashboard({ commit, getters }, {
      tabId,
      windowId,
      recordId,
      tableName,
      recordUuid
    }) {
      return new Promise(resolve => {
        ListWindowCharts({
          tabId,
          windowId,
          id: recordId,
          tableName,
          recordUuid
        })
          .then(response => {
            const { records } = response
            const { currentTab } = getters.getContainerInfo
            const {
              parentUuid,
              containerUuid
            } = currentTab
            const contextAttributesList = getContextAttributes({
              parentUuid,
              containerUuid,
              contextColumnNames: response.context_column_names,
              isBooleanToString: true
            })
            const list = records.map(list => {
              return {
                ...list,
                chartType: list.chart_type,
                dashboardType: list.dashboard_type,
                isCollapsible: list.is_collapsible,
                isOpenByDefault: list.is_open_by_default,
                tableName,
                recordId,
                recordUuid,
                contextAttributes: contextAttributesList,
                transformationScript: list.transformation_script,
                actions: 'metrics'
              }
            })
            commit('setListDashboard', list)
            const dashboard = { tabId, recordId, list }
            commit('setPanelDashboardTab', dashboard)
            resolve(list)
          })
          .catch(error => {
            resolve(0)
            console.warn(`Error getting List Product: ${error.message}. Code: ${error.code}.`)
          })
      })
    },
    metrics({ commit }, {
      id,
      uuid,
      filters,
      recordId,
      tableName,
      recordUuid,
      contextAttributes
    }) {
      return new Promise(resolve => {
        getWindowMetrics({
          id,
          uuid,
          filters,
          recordId,
          tableName,
          recordUuid,
          contextAttributes
        })
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            resolve(0)
            console.warn(`Error getting List Product: ${error.message}. Code: ${error.code}.`)
          })
      })
    }
  },
  getters: {
    getListDashboard(state) {
      return state.listDashboard
    },
    getNumberDashboard(state) {
      return state.dashboard
    },
    getPanelDashboard: (state) => ({ tabId, recordId }) => {
      let dashboardList = []
      if (!isEmptyValue(state.dashboardList)) {
        if (!isEmptyValue(state.dashboardList[tabId])) {
          dashboardList = state.dashboardList[tabId]
        }
      }
      return dashboardList
    }
  }
}
