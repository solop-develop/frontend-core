/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
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

// API Request Methods
import {
  saveCommandShortcut,
  listCommandShortcut,
  deleteCommandShortcut
} from '@/api/ADempiere/form/CommandShortcut'

// Utils and Helper Methods
import { showMessage } from '@/utils/ADempiere/notification'
import { isEmptyValue } from '@/utils/ADempiere'

const mnemonicCommand = {
  isModifyCommand: false,
  currentCommand: {},
  listShortkey: [],
  isDialogo: false
}

export default {
  state: mnemonicCommand,
  mutations: {
    setLisCommantShortkey(state, list) {
      state.listShortkey = list
    },
    setDialogoComponent(state, isVisible) {
      state.isDialogo = isVisible
    },
    setCurrentCommand(state, command) {
      state.currentCommand = command
    },
    setModifyCommand(state, show) {
      state.isModifyCommand = show
    }
  },
  actions: {
    saveCommand({ commit, getters, dispatch }, {
      command,
      shortcut
    }) {
      const posUuid = getters.posAttributes.currentPointOfSales.uuid
      return new Promise(resolve => {
        if (isEmptyValue(posUuid)) return []
        saveCommandShortcut({
          posUuid,
          command,
          shortcut
        })
          .then(response => {
            dispatch('listCommand')
            showMessage({
              message: 'OK',
              type: 'success'
            })
            resolve(response)
          })
          .catch(error => {
            showMessage({
              message: error.message,
              type: 'error'
            })
            console.warn(`Error Save Command: ${error.message}. Code: ${error.code}.`)
            resolve(error)
          })
      })
    },
    listCommand({ commit, getters }, searchValue) {
      const posUuid = getters.posAttributes.currentPointOfSales.uuid
      return new Promise(resolve => {
        if (isEmptyValue(posUuid)) return []
        listCommandShortcut({
          posUuid,
          searchValue
        })
          .then(response => {
            const { records } = response
            commit('setLisCommantShortkey', records)
            resolve(response)
          })
          .catch(error => {
            showMessage({
              type: 'error',
              message: error.message,
              showClose: true
            })
            console.warn(`Error Getting Update Receipt Line: ${error.message}. Code: ${error.code}.`)
            resolve(error)
          })
      })
    },
    removeCommand({ commit, getters, dispatch }, {
      id
    }) {
      const posUuid = getters.posAttributes.currentPointOfSales.uuid
      return new Promise(resolve => {
        if (isEmptyValue(posUuid)) return []
        deleteCommandShortcut({
          posUuid,
          id
        })
          .then(response => {
            dispatch('listCommand')
            showMessage({
              message: response,
              type: 'success'
            })
            resolve(response)
          })
          .catch(error => {
            showMessage({
              message: error.message,
              type: 'error'
            })
            console.warn(`Error Delete Command: ${error.message}. Code: ${error.code}.`)
            resolve(error)
          })
      })
    }
  },
  getters: {
    getLisCommantShortkey(state) {
      return state.listShortkey
    },
    getDialogoComponent(state) {
      return state.isDialogo
    },
    getCurrentCommand(state) {
      return state.currentCommand
    },
    getModifyCommand(state) {
      return state.isModifyCommand
    }
  }
}
