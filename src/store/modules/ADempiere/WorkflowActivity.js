import {
  workflowActivities
} from '@/api/ADempiere/workflow.js'
import { isEmptyValue } from '@/utils/ADempiere'
import { showMessage } from '@/utils/ADempiere/notification.js'
import language from '@/lang'
import { generatePageToken } from '@/utils/ADempiere/dataUtils'

const activity = {
  listActivity: [],
  currentActivity: {},
  recordCount: 0,
  pageNumber: 0,
  isLoadActivity: false
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
    }
  }
}
