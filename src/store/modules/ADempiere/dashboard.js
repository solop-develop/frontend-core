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

// This file is for get all information for dashboard of ADempiere client,
// please if you want to implement a custom dashboard create a new fielwith api definition
// Default store for handle dashboard refresh and other functionalities

// Constants
import { UNSUPPORTED_DASHBOARDS } from '@/utils/ADempiere/dictionary/dashboard'

// API Request Methods
import { lisDashboardsRequest } from '@/api/ADempiere/dashboard/index.ts'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

const dashboard = {
  state: {
    dashboardsList: [],
    recentItems: [],
    mainashboard: {}
  },
  mutations: {
    setDashboardsList(state, payload = []) {
      state.dashboardsList = payload
    },
    notifyDashboardRefresh: (state, payload) => {

    },
    setRecentItems(state, payload) {
      state.recentItems = payload
    },
    setMainDashboard(state, payload) {
      state.mainashboard = payload
    }
  },

  actions: {
    refreshDashboard({ commit }, parameters) {
      commit('notifyDashboardRefresh', parameters)
    },
    getDashboardListFromServer({ commit, dispatch, getters }) {
      return new Promise(resolve => {
        lisDashboardsRequest({})
          .then(dashboardResponse => {
            const dashboardsList = dashboardResponse.dashboardsList
              .filter(item => {
                return !UNSUPPORTED_DASHBOARDS.includes(item.fileName)
              })
              .sort((itemA, itemB) => {
                return itemA.chartType > itemB.chartType
              })

            // TODO: verify it with uuid
            const roleDashboards = {
              ...dashboardResponse,
              dashboardsList
            }
            commit('setDashboardsList', dashboardsList)

            if (isEmptyValue(getters.getStoredMainDashboard)) {
              dispatch('mainDashboard', dashboardsList.at())
            }
            resolve(roleDashboards)
          })
          .catch(error => {
            console.warn(`Error getting List Dashboards: ${error.message}. Code: ${error.code}.`)
          })
      })
    },
    mainDashboard({ commit }, dashboard) {
      commit('setMainDashboard', dashboard)
    }
  },
  getters: {
    getStoredDashboardsList: (state) => {
      return state.dashboardsList
    },
    getStoredMainDashboard: (state) => {
      return state.mainashboard
    }
  }
}

export default dashboard
