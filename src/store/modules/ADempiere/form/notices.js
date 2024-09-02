/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 * Contributor(s): Ricardo Fenomeni ricardofenomeno13@gmail.com https://github.com/ricargame
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

import {
  listNotices,
  acknowledgeNotice,
  deleteNotices
} from '@/api/ADempiere/form/notice'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

const initState = {
  notices: {
    list: [],
    isLoading: false
  }
}

const notices = {
  state: initState,

  mutations: {
    setNotices(state, notices) {
      state.notices.list = notices
    },
    setLoadingNotices(state, loading) {
      state.notices.isLoading = loading
    }
  },

  actions: {
    listNotices({ commit }) {
      commit('setLoadingNotices', true)
      return new Promise(resolve => {
        listNotices()
          .then(response => {
            if (!isEmptyValue(response)) {
              const { records } = response
              commit('setNotices', records)
              resolve(response)
            }
          })
          .catch(error => {
            console.warn(error)
          })
          .finally(() => {
            setTimeout(() => {
              commit('setLoadingNotices', false)
            }, 500)
          })
      })
    },
    readCurrentNotice({ commit, dispatch }, {
      id
    }) {
      commit('setLoadingNotices', true)
      return new Promise(resolve => {
        acknowledgeNotice({
          id
        })
          .then(response => {
            dispatch('listNotices')
            resolve(response)
          })
          .catch(error => {
            console.warn(error)
          })
          .finally(() => {
            setTimeout(() => {
              commit('setLoadingNotices', false)
            }, 500)
          })
      })
    },
    readAllNotices({ commit, dispatch }, {
      userId
    }) {
      commit('setLoadingNotices', true)
      return new Promise(resolve => {
        deleteNotices(
          userId
        )
          .then(response => {
            dispatch('listNotices')
            resolve(response)
          })
          .catch(error => {
            console.warn(error)
          })
          .finally(() => {
            setTimeout(() => {
              commit('setLoadingNotices', false)
            }, 500)
          })
      })
    }
  },
  getters: {
    getNotices: (state) => {
      return state.notices
    },
    getIsLoadingNotices: (state) => {
      return state.notices.isLoading
    }
  }
}

export default notices
