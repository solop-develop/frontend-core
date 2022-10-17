import {
  requestListEntityChats,
  requestListChatsEntries,
  requestCreateChatEntry
} from '@/api/ADempiere/window'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { showMessage } from '@/utils/ADempiere/notification'

const initStateChatEntries = {
  listRecordChats: [],
  listChatEntries: [],
  chatText: '',
  isNote: false
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
    addListRecordChats(state, payload) {
      state.listRecordChats = payload
    },
    isNote(state, payload) {
      state.isNote = payload
    }
  },
  actions: {
    createChatEntry({ commit, dispatch }, {
      tableName,
      recordId,
      comment
    }) {
      return new Promise(resolve => {
        requestCreateChatEntry({
          tableName,
          recordId,
          comment
        })
          .then((response) => {
            commit('isNote', true)
            commit('setChatText', '')

            dispatch('listChatEntries', {
              tableName,
              recordId
            })
            resolve(response)
          })
          .catch(error => {
            console.warn(`Error in Add New Note: ${error.message}. Code: ${error.code}.`)
            showMessage({
              type: 'error',
              message: error.message
            })
            resolve(error)
          })
      })
    },
    listChatEntries({ commit }, {
      tableName,
      recordId,
      recordUuid,
      pageSize,
      pageToken
    }) {
      return requestListEntityChats({
        tableName,
        recordId,
        recordUuid,
        pageSize,
        pageToken
      })
        .then(responseList => {
          const { entityChatsList: chatList } = responseList
          if (isEmptyValue(chatList)) {
            commit('addListChatEntries', [])
          }
          chatList.forEach(chat => {
            const uuid = chat.chatUuid

            requestListChatsEntries({
              uuid,
              pageSize
            })
              .then(responseChat => {
                commit('addListChatEntries', responseChat.chatEntriesList)
              })
              .catch(error => {
                commit('addListChatEntries', [])
                console.warn(`Error getting List Chat Entries: ${error.message}. Code: ${error.code}.`)
              })
          })
          commit('isNote', !isEmptyValue(chatList))
          commit('addListRecordChats', responseList)
        })
        .catch(error => {
          commit('addListChatEntries', [])
          console.warn(`Error getting List Chat: ${error.message}. Code: ${error.code}.`)
        })
    }
  },
  getters: {
    getChatTextLong: (state) => {
      return state.chatText
    },
    getListRecordChats: (state) => {
      return state.listRecordChats.entityChatsList
    },
    getChatEntries: (state) => {
      return state.listChatEntries
    },
    getIsNote: (state) => {
      return state.isNote
    }
  }
}
