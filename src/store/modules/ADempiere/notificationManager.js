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
import language from '@/lang'
import {
  SendNotification,
  ListNotificationsTypes,
  ListUsers
} from '@/api/ADempiere/reportManagement/index.ts'
import { showNotification } from '@/utils/ADempiere/notification.js'

const initState = {
  userList: {},
  notifyList: {}
}

const notifyManager = {
  state: initState,
  mutations: {
    setNotifyList(state, notifyList) {
      state.notifyList = notifyList
    },
    setUserList(state, userList) {
      state.userList = userList
    }
  },
  action: {
    notifyUser({ commit }) {
      return new Promise(resolve => {
        ListUsers()
          .then(response => {
            commit('setUserList', response)
            resolve(response)
          })
          .catch(error => {
            showNotification({
              title: language.t('notifications.error'),
              message: error.message,
              type: 'error'
            })
            console.warn(`Error exporting report: ${error.message}. Code: ${error.code}.`)
          })
      })
    },
    notifyType({ commit }) {
      return new Promise(resolve => {
        ListNotificationsTypes()
          .then(response => {
            commit('setNotifyList', response)
            resolve(response)
          })
          .catch(error => {
            showNotification({
              title: language.t('notifications.error'),
              message: error.message,
              type: 'error'
            })
            console.warn(`Error exporting report: ${error.message}. Code: ${error.code}.`)
          })
      })
    },
    notifyReport({ commit }, {
      user_id,
      title,
      recipients,
      notification_type,
      attachments,
      subject
    }) {
      return new Promise(resolve => {
        SendNotification({
          user_id,
          title,
          recipients,
          notification_type,
          attachments,
          subject
        })
          .then(response => {
            showNotification({
              title: language.t('notifications.succesful'),
              message: title,
              type: 'success'
            })
            resolve(response)
          })
          .catch(error => {
            showNotification({
              title: language.t('notifications.error'),
              message: error.message,
              type: 'error'
            })
            console.warn(`Error exporting report: ${error.message}. Code: ${error.code}.`)
          })
      })
    }
  },
  getters: {
    getNotifyList: (state) => {
      return state.notifyList
    },
    getUserList: (state) => {
      return state.userList
    }
  }
}

export default notifyManager
