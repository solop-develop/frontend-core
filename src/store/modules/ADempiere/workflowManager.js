/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
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
  runDocAction
} from '@/api/ADempiere/workflow.js'

// Utils and Helper Methods
import { isEmptyValue, typeValue } from '@/utils/ADempiere/valueUtils'
import { showNotification } from '@/utils/ADempiere/notification.js'

const initState = {
  documentActionsList: {},
  documentStatusList: {}
}

const workflowManager = {
  state: initState,

  mutations: {
    setDocumentActions(state, {
      defaultDocumentAction,
      documentActionsList,
      recordUuid
    }) {
      Vue.set(state.documentActionsList, recordUuid, {
        defaultDocumentAction,
        documentActionsList,
        recordUuid
      })
    }
  },

  actions: {
    runDocumentAction({ commit, dispatch }, {
      tableName,
      recordId,
      recordUuid,
      docAction,
      containerUuid
    }) {
      return new Promise(resolve => {
        runDocAction({
          tableName,
          id: recordId,
          uuid: recordUuid,
          docAction
        })
          .then(response => {
            console.log(response)
            dispatch('listDocumentStatus', {
              tableName,
              recordUuid,
              recordId,
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
              recordUuid
            })

            let text, isError
            if (typeValue(response) === 'STRING') {
              text = response
              isError = true
            } else {
              isError = response.is_error
              text = response.summary
            }
            if (isEmptyValue(text) && !isError) {
              text = ' '
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
    }
  }
}

export default workflowManager
