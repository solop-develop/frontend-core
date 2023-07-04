/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 * Contributor(s): Edwin Betancourt EdwinBetanc0urt@outlook.com https://github.com/EdwinBetanc0urt
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

// API Request Methods
import {
  requestListDocumentActions,
  requestListDocumentStatuses,
  requestRunDocumentAction
} from '@/api/ADempiere/workflow.js'

// Utils and Helper Methods
import { isEmptyValue, getTypeOfValue } from '@/utils/ADempiere/valueUtils'
import { showMessage, showNotification } from '@/utils/ADempiere/notification.js'

const initState = {
  documentStatusesList: {},
  documentActionsList: {}
}

const documentManager = {
  state: initState,

  mutations: {
    setDocumentStatuses(state, {
      tableName,
      recordUuid,
      currentDocumentStatus,
      documentStatusesList = []
    }) {
      const key = `${tableName}_${recordUuid}_${currentDocumentStatus}`
      Vue.set(state.documentStatusesList, key, {
        tableName,
        recordUuid,
        currentDocumentStatus,
        documentStatusesList
      })
    },
    setDocumentActions(state, {
      tableName,
      recordUuid,
      currentDocumentStatus,
      defaultDocumentAction,
      documentActionsList = []
    }) {
      const key = `${tableName}_${recordUuid}_${currentDocumentStatus}`
      Vue.set(state.documentActionsList, key, {
        tableName,
        recordUuid,
        currentDocumentStatus,
        defaultDocumentAction,
        documentActionsList
      })
    }
  },

  actions: {
    getDocumentStatusesListFromServer({ commit }, {
      tableName,
      recordId,
      recordUuid,
      documentStatus
    }) {
      return new Promise(resolve => {
        requestListDocumentStatuses({
          tableName,
          recordId,
          recordUuid
        }).then(response => {
          const { documentStatusesList } = response

          commit('setDocumentStatuses', {
            tableName,
            recordUuid,
            currentDocumentStatus: documentStatus,
            documentStatusesList
          })

          resolve(documentStatusesList)
        }).catch(error => {
          showMessage({
            message: error.message,
            type: 'error'
          })
          console.warn(`Error Get Document Statuses: ${error.message}. Code: ${error.code}.`)
        })
      })
    },

    getDocumentActionsListFromServer({ commit }, {
      tableName,
      recordId,
      recordUuid,
      documentStatus
    }) {
      return new Promise(resolve => {
        requestListDocumentActions({
          tableName,
          recordId,
          recordUuid
        }).then(response => {
          const { defaultDocumentAction, documentActionsList } = response

          commit('setDocumentActions', {
            tableName,
            recordUuid,
            currentDocumentStatus: documentStatus,
            defaultDocumentAction,
            documentActionsList
          })

          resolve(documentActionsList)
        }).catch(error => {
          showMessage({
            message: error.message,
            type: 'error'
          })
          console.warn(`Error Get Document Actions: ${error.message}. Code: ${error.code}.`)
        })
      })
    },

    runDocumentAction({ commit, dispatch }, {
      recordId,
      tableName,
      docAction,
      recordUuid,
      description
    }) {
      return new Promise(resolve => {
        requestRunDocumentAction({
          tableName,
          docAction,
          id: recordId,
          uuid: recordUuid
        })
          .then(response => {
            let text
            let isError
            let type = 'success'
            if (getTypeOfValue(response) === 'STRING') {
              text = response
              isError = true
            } else {
              isError = response.is_error
              text = response.summary
            }
            if (isEmptyValue(text)) {
              text = description
            }

            if (isError) {
              type = 'error'
            }

            showNotification({
              message: text,
              type
            })
            resolve(response)
          })
          .catch(error => {
            showMessage({
              message: error.message,
              type: 'error'
            })
            console.warn(`Error Run Doc Action: ${error.message}. Code: ${error.code}.`)
          })
      })
    }
  },

  getters: {
    getStoredDocumentStatusesList: (state) => ({
      tableName,
      recordUuid,
      documentStatus
    }) => {
      const key = `${tableName}_${recordUuid}_${documentStatus}`

      const storedDocumentStatus = state.documentStatusesList[key]
      if (!isEmptyValue(storedDocumentStatus)) {
        return storedDocumentStatus.documentStatusesList
      }
      return []
    },

    getStoredDefaultDocumentAction: (state) => ({
      tableName,
      recordUuid,
      documentStatus
    }) => {
      const key = `${tableName}_${recordUuid}_${documentStatus}`

      const storedDocumentActions = state.documentActionsList[key]
      if (!isEmptyValue(storedDocumentActions)) {
        return storedDocumentActions.defaultDocumentAction
      }
      return {}
    },
    getStoredDocumentActionsList: (state) => ({
      tableName,
      recordUuid,
      documentStatus
    }) => {
      const key = `${tableName}_${recordUuid}_${documentStatus}`

      const storedDocumentActions = state.documentActionsList[key]
      if (!isEmptyValue(storedDocumentActions)) {
        return storedDocumentActions.documentActionsList
      }
      return []
    }
  }
}

export default documentManager
