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
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

import Vue from 'vue'

// API Request Methods
import { requestListTreeNodes } from '@/api/ADempiere/user-interface/component/tree-trab'

const initState = {
  treeData: {},
  emtpyTreeData: {
    parentUuid: undefined,
    containerUuid: undefined,
    tableName: undefined,
    elementId: 0,
    nodeId: 0,
    recordUuid: undefined,
    recordsList: []
  }
}

const treeTab = {
  state: initState,

  mutations: {
    setTreeNodes(state, {
      parentUuid,
      containerUuid,
      elementId,
      tableName,
      nodeId = 0,
      recordUuid = '',
      recordsList = []
    }) {
      Vue.set(state.treeData, containerUuid, {
        ...state.emtpyTreeData,
        parentUuid,
        containerUuid,
        elementId,
        tableName,
        nodeId,
        recordUuid,
        recordsList
      })
    }
  },

  actions: {
    getTreeNodesFromServer({ commit, getters }, {
      parentUuid,
      containerUuid,
      nodeId = 0
    }) {
      const storedTab = getters.getStoredTab(parentUuid, containerUuid)
      const { tableName } = storedTab

      const elementId = getters.getValueOfFieldOnContainer({
        parentUuid,
        containerUuid,
        columnName: 'C_Element_ID'
      })

      return new Promise(resolve => {
        requestListTreeNodes({
          tableName,
          elementId
        }).then(response => {
          commit('setTreeNodes', {
            parentUuid,
            containerUuid,
            elementId,
            tableName,
            nodeId,
            recordsList: response.recordsList
          })
          resolve(response.recordsList)
        }).finally(() => {
          // treePanel.value.setCurrentKey(recordUuid.value)
        })
      })
    }
  },

  getters: {
    getStoredTreeNodes: (state) => ({
      containerUuid
    }) => {
      return state.treeData[containerUuid] || {
        ...state.emtpyTreeData,
        containerUuid
      }
    }
  }
}

export default treeTab
