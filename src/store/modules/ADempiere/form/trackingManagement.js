/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 * Contributor(s): Elsio Sanchez elsiosanches@gmail.com https://github.com/elsiosanchez
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
  requestListIssues as requestListTracking,
  requestListStatuses,
  requestListIssueComments
  // requestCreateIssueComment,
} from '@/api/ADempiere/user-interface/component/issue'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { formatDate } from '@/utils/ADempiere/formatValue/dateFormat'
import { showMessage } from '@/utils/ADempiere/notification'

const initStateIssueManagement = {
  currentTracking: {},
  listTracking: [],
  listStatuses: [],
  listHistoryTracking: []
}

export default {
  state: initStateIssueManagement,
  mutations: {
    // new
    setListTracking(state, list) {
      state.listTracking = list
    },
    setListStatus(state, list) {
      state.listStatuses = list
    },
    setCurrentTracking(state, tracking) {
      state.currentTracking = tracking
    },
    setListHistoryTracking(state, list) {
      state.listHistoryTracking = list
    }
  },
  actions: {
    requestListTracking({ commit }, {
      tableName,
      recordId,
      recordUuid,
      pageSize,
      pageToken
    }) {
      return requestListTracking({
        tableName,
        recordId,
        recordUuid,
        pageSize,
        pageToken
      })
        .then(responseList => {
          const { records } = responseList

          if (isEmptyValue(records)) {
            commit('setListTracking', [])
          }
          const list = records.map(issues => {
            let date = ''
            if (issues.date_next_action !== 0) {
              date = formatDate(
                {
                  value: issues.date_next_action,
                  isTime: true,
                  format: 'YYYY-MM-DDTHH:MM:SS'
                }
              )
            }
            return {
              ...issues,
              dateNextAction: date,
              isEdit: false
            }
          })
          commit('setListTracking', list)
        })
        .catch(error => {
          let message = error.message
          if (!isEmptyValue(error.response) && !isEmptyValue(error.response.data.message)) {
            message = error.response.data.message
          }

          showMessage({
            type: 'error',
            message,
            showClose: true
          })
          console.warn(`Error getting List Tracking: ${message}. Code: ${error.code}.`)
        })
    },
    changeCurrentTracking({ commit }, tracking) {
      commit('setCurrentTracking', tracking)
    },
    requestListStatuses({ commit }, {
      id
    }) {
      if (isEmptyValue(id)) {
        return
      }
      return new Promise((resolve, reject) => {
        return requestListStatuses({
          requestTypeId: id
        })
          .then(response => {
            const { records } = response
            if (isEmptyValue(records)) {
              commit('setListStatus', [])
            }
            const list = records.map(comment => {
              return {
                ...comment,
                isEdit: false
              }
            })
            commit('setListStatus', list)
            resolve(response)
          })
          .catch(error => {
            let message = error.message
            if (!isEmptyValue(error.response) && !isEmptyValue(error.response.data.message)) {
              message = error.response.data.message
            }

            showMessage({
              type: 'error',
              message,
              showClose: true
            })
            console.warn(`Error getting List Status: ${message}. Code: ${error.code}.`)
            reject(error)
          })
      })
    },
    requestListIssueComments({ commit, getters }) {
      return new Promise((resolve, reject) => {
        const { id } = getters.getCurrentTracking
        if (isEmptyValue(id)) {
          resolve([])
          return
        }
        return requestListIssueComments({
          issueId: id
        })
          .then(response => {
            const { records } = response
            if (isEmptyValue(records)) {
              commit('setListComments', [])
            }
            const list = records.map((comment, index, array) => {
              let color = '#409eff'
              if (index === (array.length - 1)) color = '#0bbd87'
              return {
                ...comment,
                color,
                date: formatDate(
                  {
                    value: comment.created,
                    isTime: true,
                    format: 'YYYY-MM-DDTHH:MM:SS'
                  }
                )
              }
            })
            commit('setListHistoryTracking', list)
            resolve(response)
          })
          .catch(error => {
            let message = error.message
            if (!isEmptyValue(error.response) && !isEmptyValue(error.response.data.message)) {
              message = error.response.data.message
            }

            commit('setListHistoryTracking', [])
            showMessage({
              type: 'error',
              message,
              showClose: true
            })
            console.warn(`Error getting List History: ${message}. Code: ${error.code}.`)
            reject(error)
          })
      })
    }
  },
  getters: {
    getListTracking: (state) => {
      return state.listTracking
    },
    getListStatus: (state) => {
      return state.listStatuses
    },
    getCurrentTracking: (state) => {
      return state.currentTracking
    },
    getListHistoryTracking: (state) => {
      return state.listHistoryTracking
    }
  }
}
