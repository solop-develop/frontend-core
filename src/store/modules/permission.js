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

import router, { constantRoutes, resetRouter } from '@/router'
import NProgress from 'nprogress' // progress bar

import { loadMainMenu } from '@/router/modules/ADempiere/menu'

const state = {
  routes: [],
  addRoutes: [],
  timeOutMenu: null
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  setTimeOutMenu(state, payload) {
    state.timeOutMenu = payload
  },
  clearTimeOutMenu(state) {
    clearTimeout(state.timeOutMenu)
  }
}

const actions = {
  generateRoutes({ commit, rootGetters }) {
    return new Promise(resolve => {
      const role = rootGetters['user/getRole']

      loadMainMenu({
        role
      }).then(menuResponse => {
        commit('SET_ROUTES', menuResponse)
        resolve(menuResponse)
      })
    })
  },
  sendRequestMenu({ commit, dispatch }) {
    commit('clearTimeOutMenu')
    const timeOutMenu = setTimeout(async() => {
      NProgress
        .configure({
          // NProgress Configuration
          showSpinner: false
        })
        .start()

      resetRouter()
      dispatch('generateRoutes')
        .then(accessRoutes => {
          // dynamically add accessible routes
          accessRoutes.forEach(access => {
            router.addRoute(access)
          })
        })
        .finally(() => {
          // finish progress bar
          NProgress.done()
        })
    }, 2500)
    commit('setTimeOutMenu', timeOutMenu)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
