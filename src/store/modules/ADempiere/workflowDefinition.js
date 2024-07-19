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
import language from '@/lang'

// API Request Methods
import { requestWorkflowMetadata } from '@/api/ADempiere/workflow'

// Utils and Helper Methods
import { generateWorkflowDiagram } from '@/utils/ADempiere/dictionary/workflow'
import { showMessage } from '@/utils/ADempiere/notification'

const workflow = {
  state: {
    workflowDefinition: {}
  },

  mutations: {
    addWorkflow(state, workflow) {
      Vue.set(state.workflowDefinition, workflow.uuid, workflow)
    },
    dictionaryResetCacheWorkflow(state) {
      state.workflow = {}
    }
  },

  actions: {
    getWorkflowFromServer({ commit, dispatch }, {
      id,
      containerUuid,
      routeToDelete
    }) {
      return new Promise(resolve => {
        requestWorkflowMetadata({
          uuid: containerUuid,
          id
        })
          .then(workflowResponse => {
            const panelType = 'workflow'

            // Panel for save on store
            const newWorkflow = {
              ...workflowResponse,
              containerUuid,
              // TODO: Add `uuid` property by server
              uuid: containerUuid,
              diagramMetadata: generateWorkflowDiagram(workflowResponse),
              // fieldsList: [],
              panelType
            }

            commit('addWorkflow', newWorkflow)

            resolve(newWorkflow)

            const actions = []

            // Add process menu
            dispatch('setContextMenu', {
              containerUuid,
              actions
            })
          })
          .catch(error => {
            // router.push({
            //   path: '/dashboard'
            // }, () => {})
            // dispatch('tagsView/delView', routeToDelete)
            showMessage({
              message: language.t('page.login.unexpectedError'),
              type: 'error'
            })
            console.warn(`Dictionary Workflow - Error ${error.code}: ${error.message}.`)
          })
      })
    }
  },

  getters: {
    getStoredWorkflowByUuid: (state) => (workflowUuid) => {
      return state.workflowDefinition[workflowUuid] || {}
    }
  }
}

export default workflow
