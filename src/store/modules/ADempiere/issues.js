import {
  requestListExists
} from '@/api/ADempiere/window'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
// import { showMessage } from '@/utils/ADempiere/notification'

const initStateChatEntries = {
  listIssues: [],
  // listRecordChats: [],
  // listChatEntries: [],
  isLoaded: false
  // chatText: '',
  // isNote: false
}

export default {
  state: initStateChatEntries,
  mutations: {
    setChatText(state, payload) {
      state.chatText = payload
    },
    addListChatEntries(state, payload) {
      state.listChatEntries = payload
    },
    isNote(state, payload) {
      state.isNote = payload
    },
    // new
    setListIssues(state, payload) {
      state.listIssues = payload
    },
    setIsLoadListIssues(state, loading) {
      state.isLoaded = loading
    }
  },
  actions: {
    // createChatEntry({ commit, dispatch }, {
    //   tableName,
    //   recordId,
    //   comment
    // }) {
    //   return new Promise(resolve => {
    //     requestCreateChatEntry({
    //       tableName,
    //       recordId,
    //       comment
    //     })
    //       .then((response) => {
    //         commit('isNote', true)
    //         commit('setChatText', '')

    //         dispatch('listChatEntries', {
    //           tableName,
    //           recordId
    //         })
    //         resolve(response)
    //       })
    //       .catch(error => {
    //         console.warn(`Error in Add New Note: ${error.message}. Code: ${error.code}.`)
    //         showMessage({
    //           type: 'error',
    //           message: error.message
    //         })
    //         resolve(error)
    //       })
    //   })
    // },
    listIssues({ commit }, {
      tableName,
      recordId,
      recordUuid,
      pageSize,
      pageToken
    }) {
      commit('setIsLoadListIssues', true)
      return requestListExists({
        tableName,
        recordId,
        recordUuid,
        pageSize,
        pageToken
      })
        .then(responseList => {
          const { records } = responseList
          console.log({ records })
          if (isEmptyValue(records)) {
            commit('setListIssues', [])
          }
          commit('setListIssues', records)
          commit('setIsLoadListIssues', false)
        })
        .catch(error => {
          commit('setIsLoadListIssues', false)
          commit('addListChatEntries', [])
          console.warn(`Error getting List Chat: ${error.message}. Code: ${error.code}.`)
        })
    }
  },
  getters: {
    // getChatTextLong: (state) => {
    //   return state.chatText
    // },
    // getListRecordChats: (state) => {
    //   return state.listRecordChats.entityChatsList
    // },
    // getChatEntries: (state) => {
    //   return state.listChatEntries
    // },
    // getIsNote: (state) => {
    //   return state.isNote
    // },
    getListIssues: (state) => {
      return state.listIssues
    },
    getIsLoadListIssues: (state) => {
      return state.isLoaded
    }
  }
}
