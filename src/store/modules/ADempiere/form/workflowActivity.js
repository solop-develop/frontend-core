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

import language from '@/lang'

// API Request Methods
import {
  workflowActivities
} from '@/api/ADempiere/workflow.js'
import { listNotifiicationsRequest } from '@/api/ADempiere/dashboard/index.ts'
import { requestListWorkflowsLogs } from '@/api/ADempiere/window'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere'
import { showMessage } from '@/utils/ADempiere/notification.js'
import { generatePageToken } from '@/utils/ADempiere/dataUtils'

const activity = {
  listActivity: [],
  currentActivity: {},
  recordCount: 0,
  pageNumber: 1,
  isLoadActivity: false,
  workflowLogs: [],
  listNotifiications: []
}

export default {
  state: activity,

  mutations: {
    setActivity(state, activity) {
      state.listActivity = activity
    },
    setActivityRecordCount(state, recordCount) {
      state.recordCount = recordCount
    },
    setCurrentActivity(state, activity) {
      state.currentActivity = activity
    },
    setIsLoadActivity(state, load) {
      state.isLoadActivity = load
    },
    setCurrentPage(state, number) {
      state.pageNumber = number
    },
    setWorkFlowLogs(state, {
      containerUuid,
      list = []
    }) {
      Vue.set(state.workflowLogs, containerUuid, {
        list
      })
    },
    setListNotifiications(state, list) {
      state.listNotifiications = list
    }
  },

  actions: {
    serverListActivity({ commit, state, dispatch, rootGetters }, {
      pageNumber,
      pageToken,
      pageSize
    }) {
      const userUuid = rootGetters['user/getUserUuid']
      const name = language.t('navbar.badge.activity')
      if (isEmptyValue(userUuid)) {
        return
      }
      if (!isEmptyValue(pageNumber)) {
        pageToken = generatePageToken({ pageNumber })
        commit('setCurrentPage', pageNumber)
      }
      commit('setIsLoadActivity', true)
      workflowActivities({
        userUuid,
        pageToken,
        pageSize
      })
        .then(response => {
          commit('setIsLoadActivity', false)
          const { listWorkflowActivities, recordCount } = response
          commit('setActivity', listWorkflowActivities)
          commit('setActivityRecordCount', recordCount)
        })
        .catch(error => {
          commit('setIsLoadActivity', false)
          console.warn(`serverListActivity: ${error.message}. Code: ${error.code}.`)
          showMessage({
            type: 'error',
            message: error.message,
            showClose: true
          })
        })
        .finally(() => {
          if (isEmptyValue(rootGetters.getNotificationProcess)) {
            return
          }
          const notification = rootGetters.getNotificationProcess.find(notification => {
            if (!isEmptyValue(notification) && notification.typeActivity && notification.quantityActivities === state.listActivity.length) {
              return notification
            }
          })
          if (isEmptyValue(notification)) {
            commit('addNotificationProcess', {
              name,
              typeActivity: true,
              quantityActivities: state.listActivity.length
            })
          } else {
            // dispatch('updateNotifications', {
            //   name,
            //   typeActivity: true,
            //   quantityActivities: state.listActivity.length
            // })
          }
        })
    },
    selectedActivity({ commit }, activity) {
      commit('setCurrentActivity', activity)
    },

    getWorkflowLogsListFromServer({ commit }, {
      containerUuid,
      tableName,
      recordId
    }) {
      return requestListWorkflowsLogs({
        tableName,
        recordId
      })
        .then(response => {
          const { workflowLogsList } = response
          commit('setWorkFlowLogs', {
            containerUuid,
            list: workflowLogsList
          })
        })
        .catch(error => {
          console.warn(`Error Run Doc Action: ${error.message}. Code: ${error.code}.`)
        })
    },
    findNotifications({ commit }) {
      return listNotifiicationsRequest()
        .then(response => {
          const { notifications } = response
          commit('setListNotifiications', notifications)
          return response
        })
    }
  },

  getters: {
    getCurrentActivity: (state) => {
      return state.currentActivity
    },
    getActivity: (state) => {
      return state.listActivity
    },
    getRecordCount: (state) => {
      return state.recordCount
    },
    getIsLoadActivity: (state) => {
      return state.isLoadActivity
    },
    getCurrentPageNumber: (state) => {
      return state.pageNumber
    },
    getWorkFlowLogs: (state) => ({ containerUuid }) => {
      return state.workflowLogs[containerUuid] || []
    },
    getListNotifiications(state) {
      return state.listNotifiications
    }
  }
}
