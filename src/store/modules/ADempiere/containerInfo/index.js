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
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

// api request methods
import {
  requestListEntityLogs
} from '@/api/ADempiere/window'

// utils and helper methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

// const initStateContainerInfo = {
//   recordLogs: [],
//   recordAttachment: []
// }

const containerInfo = {
  // TODO: Go to Vuex Module
  state: {
    listRecordLogs: [],
    recordAttachment: [],
    showContainerInfo: false,
    containerPanelInfo: {},
    fieldLogs: [],
    currentFieldList: {
      fieldsList: [],
      option: '',
      columnName: ''
    },
    columnName: ''
  },

  mutations: {
    addListRecordLogs(state, payload) {
      state.listRecordLogs = payload
    },
    setShowLogs(state, show) {
      state.showContainerInfo = show
    },
    setContainerInfo(state, params) {
      state.containerPanelInfo = params
    },
    setCurrentFieldList(state, { fieldsList, option, columnName }) {
      state.currentFieldList = {
        fieldsList,
        columnName,
        option
      }
    },
    setFieldFocusColumnName(state, columnName) {
      state.columnName = columnName
    },
    setLogField(state, logs) {
      state.fieldLogs = logs
    }
  },

  actions: {
    listRecordLogs({ commit }, {
      tableName,
      recordId,
      recordUuid
    }) {
      const pageSize = 0
      const pageToken = 0
      return requestListEntityLogs({
        tableName,
        recordId,
        recordUuid,
        pageSize,
        pageToken
      })
        .then(response => {
          commit('addListRecordLogs', response)
          return response
        })
        .catch(error => {
          commit('addListRecordLogs', {
            entityLogsList: []
          })
          console.warn(`Error getting List Record Logs: ${error.message}. Code: ${error.code}.`)
        })
    },
    showLogs({ commit, dispatch, state }, {
      show
    }) {
      const { currentTab, currentRecord } = state.containerPanelInfo
      if (show && !isEmptyValue(currentTab) && !isEmptyValue(currentRecord)) {
        dispatch('listRecordLogs', {
          tableName: currentTab.tableName,
          recordId: currentRecord[currentTab.tableName],
          recordUuid: currentRecord.UUID
        })
      }
      commit('setShowLogs', show)
    },
    panelInfo({ commit }, {
      currentRecord,
      currentTab
    }) {
      commit('setContainerInfo', { currentRecord, currentTab })
    },
    fieldListInfo({ commit }, {
      info
    }) {
      const { fieldsList, columnName, option } = info
      commit('setCurrentFieldList', {
        fieldsList,
        columnName,
        option
      })
    },
    findFieldLogs({ commit }, {
      tableName,
      recordId,
      recordUuid,
      columnName
    }) {
      return requestListEntityLogs({
        tableName,
        recordId,
        recordUuid
      })
        .then(response => {
          const { entityLogsList } = response

          // commit('addListRecordLogs', response)
          const fieldLogs = entityLogsList.filter(logs => {
            if (logs.changeLogsList[0].columnName === columnName) {
              return logs
            }
          })
          commit('setLogField', fieldLogs)
          return response
        })
        .catch(error => {
          console.warn(`Error getting List Field Logs: ${error.message}. Code: ${error.code}.`)
        })
    }
  },

  getters: {
    getRecordLogs: (state) => {
      return state.listRecordLogs
    },
    getShowLogs: (state) => {
      return state.showContainerInfo
    },
    getContainerInfo: (state) => {
      return state.containerPanelInfo
    },
    getCurrentFieldList: (state) => {
      return state.currentFieldList
    },
    getFieldFocusColumnName: (state) => {
      return state.columnName
    },
    getFieldLogs: (state) => {
      return state.fieldLogs
    }
  }
}

export default containerInfo
