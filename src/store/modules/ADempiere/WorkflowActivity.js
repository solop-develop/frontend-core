import {
  workflowActivities,
  runDocAction
} from '@/api/ADempiere/workflow.js'

import { requestListWorkflowsLogs } from '@/api/ADempiere/window'
import { isEmptyValue } from '@/utils/ADempiere'
import { showMessage } from '@/utils/ADempiere/notification.js'
import language from '@/lang'
import { generatePageToken } from '@/utils/ADempiere/dataUtils'
import Vue from 'vue'

const activity = {
  listActivity: [],
  currentActivity: {},
  recordCount: 0,
  pageNumber: 0,
  isLoadActivity: false,
  workflowActionsList: [],
  workflowLogs: []
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
    }
  },
  actions: {
    serverListActivity({ commit, state, dispatch, rootGetters }, pageNumber, pageToken) {
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
        pageToken
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
    changeActionsDoc({ commit }, {
      tableName,
      id,
      uuid,
      docAction
    }) {
      return runDocAction({
        tableName,
        id,
        uuid,
        docAction
      })
        .then(response => {
          console.log({ response })
        })
        .catch(error => {
          console.warn(`Error Run Doc Action: ${error.message}. Code: ${error.code}.`)
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
    }
  }
}
