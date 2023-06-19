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

// Utils and Helper Methods
import { isEmptyValue, recursiveTreeSearch } from '@/utils/ADempiere/valueUtils.js'

// Store used for set all related to context menu
// for Window, Process, Smart Browser andother customized component
// See structure:
// contextMenu: [
//   {
//     containerUuid: '',
//     relations: [],
//     actions: [],
//     references: []
//   }
// ]
const initStateContextMenu = {
  isShowRightPanel: false,
  isShowOptionField: true,
  isShowPopoverField: false,
  optionField: {},
  contextMenu: [],
  recordAccess: false,
  embedded: {
    name: ''
  }
}

const contextMenu = {
  state: initStateContextMenu,
  mutations: {
    setContextMenu(state, payload) {
      state.contextMenu.push(payload)
    },
    dictionaryResetCacheContextMenu(state) {
      state.contextMenu = []
    },
    changeShowRigthPanel(state, params) {
      if (isEmptyValue(params)) {
        state.isShowRightPanel = !state.isShowRightPanel
      }
      state.isShowRightPanel = params
    },
    changeShowOptionField(state, params) {
      state.isShowOptionField = params
    },
    changeShowPopoverField(state) {
      state.isShowPopoverField = !state.isShowPopoverField
    },
    resetContextMenu(state) {
      state = initStateContextMenu
    },
    fieldContextMenu(state, payload) {
      state.optionField = payload
    },
    setRecordAccess(state, params) {
      state.recordAccess = params
    },
    attributeEmbedded(state, params) {
      state.embedded = params
    }
  },
  actions: {
    /**
     * Sub menu associated with panel
     * @param {string} containerUuid
     * @param {array}  relations
     * @param {array}  actions
     * @param {array}  references
     */
    setContextMenu({ commit }, {
      containerUuid,
      relations = [],
      actions = [],
      references = []
    }) {
      commit('setContextMenu', {
        containerUuid,
        relations,
        actions,
        references
      })
    },
    addAction({ state }, newAction) {
      newAction.push(state.contextMenu.actions)
    },
    setOptionField({ commit }, params) {
      commit('fieldContextMenu', params)
    }
  },
  getters: {
    getContextMenu: (state) => (containerUuid) => {
      return state.contextMenu.find(item => item.containerUuid === containerUuid)
    },
    getRelations: (state, getters, rootState, rootGetters) => (containerOrMenuUuid) => {
      const dataTree = rootGetters.permission_routes
      return recursiveTreeSearch({
        treeData: dataTree,
        attributeName: 'name',
        attributeValue: containerOrMenuUuid,
        attributeChilds: 'children'
      })
    },
    getActions: (state) => (containerUuid) => {
      const menu = state.contextMenu.find(
        item => item.containerUuid === containerUuid
      )
      if (menu) {
        return menu.actions
      }
      return menu
    },
    getFieldContextMenu: (state) => {
      return state.optionField
    },
    getShowRecordAccess: (state) => {
      return state.recordAccess
    },
    getAttributeEmbedded: (state) => {
      return state.embedded
    }
  }
}

export default contextMenu
