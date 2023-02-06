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

import Vue from 'vue'

import language from '@/lang'

// API Request Methods
import {
  workflowActivities,
  runDocAction
} from '@/api/ADempiere/workflow.js'
import { listNotifiications } from '@/api/ADempiere/dashboard/dashboard.js'
import { requestListWorkflowsLogs } from '@/api/ADempiere/window'

// Utils and Helper Methods
import { isEmptyValue, typeValue } from '@/utils/ADempiere'
import { showMessage, showNotification } from '@/utils/ADempiere/notification.js'
import { generatePageToken } from '@/utils/ADempiere/dataUtils'

const activity = {
  listActivity: [],
  currentActivity: {},
  recordCount: 0,
  pageNumber: 0,
  isLoadActivity: false,
  workflowActionsList: [],
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
    setWorkFlowActions(state, {
      containerUuid,
      options = []
    }) {
      Vue.set(state.workflowActionsList, containerUuid, {
        options
      })
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
        commit('setCurrentPage', pageNumber)
        pageToken = generatePageToken({ pageNumber })
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
            dispatch('updateNotifications', {
              name,
              typeActivity: true,
              quantityActivities: state.listActivity.length
            })
          }
        })
    },
    selectedActivity({ commit }, activity) {
      commit('setCurrentActivity', activity)
    },
    changeActionsDoc({ commit, dispatch }, {
      tableName,
      id,
      uuid,
      docAction,
      containerUuid
    }) {
      return new Promise(resolve => {
        runDocAction({
          tableName,
          id,
          uuid,
          docAction
        })
          .then(response => {
            dispatch('listDocumentStatus', {
              tableName,
              recordUuid: uuid,
              recordId: id,
              containerUuid
            })
              .then(responseList => {
                const { documentActionsList } = responseList
                commit('setWorkFlowActions', {
                  containerUuid,
                  options: documentActionsList
                })
              })
            dispatch('listDocumentActionStatus', {
              tableName,
              recordUuid: uuid
            })
            let text, isError
            if (typeValue(response) === 'STRING') {
              text = response
              isError = true
            } else {
            // if (typeof response === 'object' && response.is_error) {
              isError = response.is_error
              text = response.summary
            }
            showNotification({
              message: text,
              type: isError ? 'error' : 'success'
            })
            resolve(response)
          })
          .catch(error => {
            console.warn(`Error Run Doc Action: ${error.message}. Code: ${error.code}.`)
          })
      })
    },
    searchWorkflowHistory({ commit }, {
      containerUuid,
      tableName,
      recordId,
      recordUuid
    }) {
      return requestListWorkflowsLogs({
        tableName,
        recordId,
        recordUuid
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
      return listNotifiications()
        .then(response => {
          const { records } = response
          commit('setListNotifiications', records)
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
    getWorkFlowActions: (state) => ({ containerUuid }) => {
      return state.workflowActionsList[containerUuid] || []
    },
    getWorkFlowLogs: (state) => ({ containerUuid }) => {
      return state.workflowLogs[containerUuid] || []
    },
    getListNotifiications(state) {
      return state.listNotifiications
    }
  }
}
