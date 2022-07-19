import {
  requestListEntityLogs
} from '@/api/ADempiere/window'
import {
  getAttachment
} from '@/api/ADempiere/user-interface/resources.js'
import { isEmptyValue, getSource } from '@/utils/ADempiere'

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
    containerPanelInfo: {}
  },
  mutations: {
    addListRecordLogs(state, payload) {
      state.listRecordLogs = payload
    },
    setAttachment(state, attachment) {
      state.recordAttachment = attachment
    },
    setShowLogs(state, show) {
      state.showContainerInfo = show
    },
    setContainerInfo(state, params) {
      state.containerPanelInfo = params
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
    findAttachment({ commit }, {
      tableName,
      recordId,
      recordUuid
    }) {
      const pageSize = 0
      const pageToken = 0
      if (isEmptyValue(tableName) && (isEmptyValue(recordId) || isEmptyValue(recordUuid))) {
        return
      }
      return getAttachment({
        tableName,
        recordId,
        recordUuid,
        pageSize,
        pageToken
      })
        .then(response => {
          if (response.resourceReferencesList.length > 0) {
            const image = response.resourceReferencesList.map(element => {
              return {
                ...element,
                url: getSource({ resourceUuid: element.resource_uuid, resourceName: element.file_name, resourceType: element.content_type })
              }
            })
            if (image.length > 0) {
              commit('setAttachment', image)
            }
          }
          return response
        })
        .catch(error => {
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
    }
  },
  getters: {
    getRecordLogs: (state) => {
      return state.listRecordLogs
    },
    getAttachment: (state) => {
      return state.recordAttachment
    },
    getShowLogs: (state) => {
      return state.showContainerInfo
    },
    getContainerInfo: (state) => {
      return state.containerPanelInfo
    }
  }
}

export default containerInfo
