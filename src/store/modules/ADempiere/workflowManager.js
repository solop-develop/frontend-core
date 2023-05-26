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
import { isEmptyValue, getTypeOfValue } from '@/utils/ADempiere/valueUtils'
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
      recordId,
      tableName,
      docAction,
      recordUuid,
      description,
      containerUuid
    }) {
      return new Promise(resolve => {
        runDocAction({
          tableName,
          docAction,
          id: recordId,
          uuid: recordUuid
        })
          .then(response => {
            dispatch('listDocumentStatus', {
              recordId,
              tableName,
              recordUuid,
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
            if (isEmptyValue(text)) text = description

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
            console.warn(`Error Run Doc Action: ${error.message}. Code: ${error.code}.`)
          })
      })
    }
  }
}

export default workflowManager
