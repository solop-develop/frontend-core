import {
  getPendingDocumentsFromServer
} from '@/api/ADempiere/dashboard/tasks'
// import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { showMessage } from '@/utils/ADempiere/notification'

const initStateChatEntries = {
  listTaks: []
}

export default {
  state: initStateChatEntries,
  mutations: {
    setListTaks(state, list) {
      state.listTaks = list
    }
  },
  actions: {
    listPendingDocuments({ commit, getters }) {
      return new Promise(resolve => {
        const userUuid = getters['user/getUserUuid']
        const roleUuid = getters.getRoleUuid
        getPendingDocumentsFromServer({
          userUuid,
          roleUuid
        })
          .then((response) => {
            const { pendingDocumentsList } = response
            const listTaks = pendingDocumentsList.map(documentItem => {
              return {
                ...documentItem,
                name: documentItem.documentName,
                description: documentItem.documentDescription
              }
            })
            commit('setListTaks', listTaks)
            resolve(listTaks)
          })
          .catch(error => {
            console.warn(`Error in Add New Note: ${error.message}. Code: ${error.code}.`)
            showMessage({
              type: 'error',
              message: error.message
            })
            resolve([])
          })
      })
    }
  },
  getters: {
    getListTaks: (state) => {
      return state.listTaks
    }
  }
}
