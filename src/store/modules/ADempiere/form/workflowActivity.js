/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 * Contributor(s): Elsio Sanchez elsiosanchez@gmail.com https://github.com/elsiosanchez
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

// import Vue from 'vue'

// import language from '@/lang'

// API Request Methods
import {
  workflowActivities
} from '@/api/ADempiere/form/workflow-activity.js'
// import { listNotifiicationsRequest } from '@/api/ADempiere/dashboard/index.ts'
// import { requestListWorkflowsLogs } from '@/api/ADempiere/window'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere'
import { showMessage } from '@/utils/ADempiere/notification.js'
// import { generatePageToken } from '@/utils/ADempiere/dataUtils'

const workflowActivity = {
  records: [],
  activity: {}
}

export default {
  state: workflowActivity,

  mutations: {
    setActivityList(state, list) {
      state.records = list
    },
    setActivity(state, activity) {
      state.activity = activity
    }
  },

  actions: {
    loadActivity({ commit, getters }) {
      const { id } = getters['user/userInfo']
      if (isEmptyValue(id)) return
      return new Promise(resolve => {
        workflowActivities({
          id
        })
          .then(response => {
            const { activities } = response
            commit('setActivityList', activities)
            resolve(activities)
          })
          .catch(error => {
            console.warn(`Workflow Activities: ${error.message}. Code: ${error.code}.`)
            let message = error.message
            if (!isEmptyValue(error.response) && !isEmptyValue(error.response.data.message)) {
              message = error.response.data.message
            }

            showMessage({
              type: 'error',
              message,
              showClose: true
            })
            resolve({})
          })
      })
    }
  },

  getters: {
    getCurrentActivity: (state) => {
      return state.activity
    },
    getRecordsWorkflowActivities: (state) => {
      return state.records
    }
  }
}
