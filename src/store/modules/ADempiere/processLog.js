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
import language from '@/lang'

// API Request Methods
import { listProcessLogsRequest } from '@/api/ADempiere/logs/process.ts'

// Utils and Helper Methods
import { showNotification } from '@/utils/ADempiere/notification.js'

/**
 * Process Vuex Module
 * @author Edwin Betancourt <EdwinBetanc0urt@outlook.com>
 */
const processLog = {
  state: {
    sessionProcess: [],
    inRequestMetadata: {}
  },

  mutations: {
    setSessionProcess(state, processList) {
      state.sessionProcess = processList
    },

    // Add process in request metadata from server
    addInRequestMetadata(state, containerUuid) {
      Vue.set(state.inRequestMetadata, containerUuid, true)
    },

    // Delete process in request metadata
    deleteInRequestMetadata(state, containerUuid) {
      Vue.set(state.inRequestMetadata, containerUuid, undefined)
    }
  },

  actions: {
    /**
     * List log of process/reports executed
     * @author Edwin Betancourt <EdwinBetanc0urt@outlook.com>
     * @param {string} pageToken
     * @param {number} pageSize default 50
     */
    getSessionProcessFromServer({ commit }, {
      pageToken,
      pageSize
    }) {
      // process Activity
      return new Promise(resolve => {
        listProcessLogsRequest({ pageToken, pageSize })
          .then(processActivityResponse => {
            const { processLogsList } = processActivityResponse

            commit('setSessionProcess', processLogsList)

            resolve(processLogsList)
          })
          .catch(error => {
            console.warn(`Error getting process activity: ${error.message}. Code: ${error.code}.`)
            showNotification({
              title: language.t('notifications.error'),
              message: error.message,
              type: 'error'
            })
          })
      })
    }
  },

  getters: {
    /**
     * Process request metadata from server filter form uuid process
     */
    getInRequestMetadata: (state) => (containerUuid) => {
      return state.inRequestMetadata[containerUuid]
    },

    /**
     * Process receibed from server associated whith this session
     */
    getAllSessionProcess: (state) => {
      return state.sessionProcess
    }
  }
}

export default processLog
