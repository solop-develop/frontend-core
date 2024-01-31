/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 * Contributor(s): Elsio Sanchez elsiosanchez15@outlook.com https://github.com/elsiosanchez
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

// import lang from '@/lang'

// API Request Methods
import { requestListTasks } from '@/api/ADempiere/form/task-management.ts'
import { isEmptyValue } from '@/utils/ADempiere'

// Utils and Helper Methods
// import { translateDate } from '@/utils/ADempiere/formatValue/dateFormat'
import { showMessage } from '@/utils/ADempiere/notification.js'

const calendarView = {
  listEvents: []
}

export default {
  state: calendarView,

  mutations: {
    setListTaks(state, list) {
      state.listEvents = list
    }
  },

  actions: {
    getListTasksFromServer({ commit }, {
      date = undefined
    }) {
      return new Promise(resolve => {
        requestListTasks({
          date
        })
          .then(response => {
            const { tasks } = response
            // const list = tasks.map(list => {
            //   return {
            //     title: list.name,
            //     timeText: translateDate({
            //       value: list.start_date,
            //       format: 'long'
            //     })
            //   }
            // })
            commit('setListTaks', tasks)
            resolve(tasks)
          })
          .catch(error => {
            console.warn(`Add List Taks: ${error.message}. Code: ${error.code}.`)
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
    getListTasksEvents(state) {
      return state.listEvents
    }
  }
}
