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

// import Vue from 'vue'

// api request methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'

const initState = {
  modalDialogManagerVPOS: {}
}

const modalDialogManagerVPOS = {
  state: initState,

  mutations: {
    setModalDialogVPOS(state, modal) {
      state.modalDialogManagerVPOS = modal
    },

    setShowedModalDialogVPOS(state, {
      isShowed = false
    }) {
      state.modalDialogManagerVPOS.isShowed = isShowed
    },

    resetStateModalDialogManagerVPOS(state) {
      state = initState
    }
  },

  actions: {
    setModalDialogVPOS({ commit }, {
      actionsName,
      componentPath,
      containerManager = {},
      beforeOpen = function() {},
      doneMethod = function() {},
      isDisabledDone = function() { return false },
      cancelMethod = function() {},
      loadData = function() {},
      closeMethod = function() {},
      title,
      type,
      isShowed = false
    }) {
      commit('setModalDialogVPOS', {
        actionsName,
        componentPath,
        containerManager,
        beforeOpen,
        doneMethod,
        isDisabledDone,
        loadData,
        cancelMethod,
        closeMethod,
        title,
        type,
        isShowed
      })
    }
  },

  getters: {
    getModalDialogManagerVPOS: (state) => {
      return state.modalDialogManagerVPOS
    },

    getShowedModalDialogVPOS: (state) => {
      const modalDialog = state.modalDialogManagerVPOS
      if (isEmptyValue(modalDialog)) {
        return false
      }
      return Boolean(modalDialog.isShowed)
    }
  }
}

export default modalDialogManagerVPOS
