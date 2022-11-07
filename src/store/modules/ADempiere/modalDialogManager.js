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
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

import Vue from 'vue'

// api request methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'

const initState = {
  modalDialogManager: {}
}

const modalDialogManager = {
  state: initState,

  mutations: {
    setModalDialog(state, {
      beforeOpen,
      cancelMethod,
      containerUuid,
      componentPath,
      containerManager,
      doneMethod,
      isDisabledDone,
      loadData,
      title,
      isShowed
    }) {
      Vue.set(state.modalDialogManager, containerUuid, {
        beforeOpen,
        cancelMethod,
        containerUuid,
        componentPath,
        containerManager,
        doneMethod,
        isDisabledDone,
        loadData,
        title,
        isShowed
      })
    },

    setShowedModalDialog(state, {
      containerUuid,
      isShowed = false
    }) {
      Vue.set(state.modalDialogManager, containerUuid, {
        ...state.modalDialogManager[containerUuid] || {},
        isShowed
      })
    },

    resetStateModalDialogManager(state) {
      state = initState
    }
  },

  actions: {
    setModalDialog({ commit }, {
      containerUuid,
      componentPath,
      containerManager = {},
      beforeOpen = function() {},
      doneMethod = function() {},
      isDisabledDone = function() { return false },
      cancelMethod = function() {},
      loadData = function() {},
      title,
      isShowed = false
    }) {
      commit('setModalDialog', {
        containerUuid,
        componentPath,
        containerManager,
        beforeOpen,
        doneMethod,
        isDisabledDone,
        loadData,
        cancelMethod,
        title,
        isShowed
      })
    }
  },

  getters: {
    getModalDialogManager: (state) => ({ containerUuid }) => {
      return state.modalDialogManager[containerUuid]
    },

    getShowedModalDialog: (state) => ({ containerUuid }) => {
      const modalDialog = state.modalDialogManager[containerUuid]
      if (isEmptyValue(modalDialog)) {
        return false
      }
      return Boolean(modalDialog.isShowed)
    }
  }
}

export default modalDialogManager
