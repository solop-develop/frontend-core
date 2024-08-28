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
import { listZoomWindowsRequest } from '@/api/ADempiere/recordManagement/zoomWindows.ts'
import { isEmptyValue } from '@/utils/ADempiere'

const initState = {
  tables: {},
  zoomWindows: {}
}

const zoomManager = {
  state: initState,

  mutations: {
    setTableName(state, {
      tableId,
      tableName
    }) {
      Vue.set(state.tables, tableId, tableName)
    },
    setZoomWindows(state, {
      tableId,
      tableName,
      zoomWindows = []
    }) {
      Vue.set(state.zoomWindows, tableId, {
        tableId,
        tableName,
        zoomWindows
      })
    }
  },

  actions: {
    getZoomWindowsListFromServer({ commit, getters }, {
      tableId,
      tableName
    }) {
      return new Promise(resolve => {
        listZoomWindowsRequest({
          tableId,
          tableName
        }).then(response => {
          const { table_id, table_name, zoom_windows } = response

          commit('setZoomWindows', {
            tableId: table_id,
            tableName: table_name,
            zoomWindows: zoom_windows
          })
          commit('setTableName', {
            tableId: table_id,
            tableName: table_name
          })

          resolve(zoom_windows)
        })
      })
    }
  },

  getters: {
    getTableNameById: (state) => ({
      tableId
    }) => {
      return state.tables[tableId]
    },
    getZoomWindowsList: (state) => ({
      tableId
    }) => {
      const storedWindows = state.zoomWindows[tableId]
      if (!isEmptyValue(storedWindows)) {
        return storedWindows.zoomWindows
      }
      return []
    }
  }
}

export default zoomManager
