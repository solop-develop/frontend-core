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

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'

/**
 * Window Mutations
 * All related to global store of Dictionary Window
 */
export default {
  addWindowToList(state, window) {
    Vue.set(state.storedWindows, window.uuid, window)
  },

  changeWindowAttribute(state, {
    uuid,
    attributeName,
    attributeValue,
    attributeNameControl
  }) {
    let value = attributeValue
    if (!isEmptyValue(attributeNameControl)) {
      value = state.storedWindows[uuid][attributeNameControl]
    }

    Vue.set(state.storedWindows[uuid], attributeName, value)
    // state.storedWindows[uuid][attributeName] = value
  },

  changeTabAttribute(state, payload) {
    let value = payload.attributeValue
    if (!isEmptyValue(payload.attributeNameControl)) {
      value = payload.tab[payload.attributeNameControl]
    }

    payload.tab[payload.attributeName] = value
  },

  /**
   * Set Stored Table Name by Tab UUID
   * @param {*} state
   * @param {string} uuid table uuid
   * @param {string} tableName
   */
  setTableNameByTab(state, { uuid, tableName }) {
    Vue.set(state.storedTableNames, uuid, tableName)
  },

  /**
   *
   * @param {*} state
   * @param {string} parentUuid
   * @param {object} tab
   */
  setCurrentTab(state, { parentUuid, tab }) {
    Vue.set(state.storedWindows[parentUuid], 'currentTab', tab)
  },

  /**
   * @param {*} state
   * @param {string} parentUuid
   * @param {object} tab
   */
  setCurrentTabChild(state, { parentUuid, tab }) {
    Vue.set(state.storedWindows[parentUuid], 'currentTabChild', tab)
  },

  /**
   * Add Advanced Query as Tab Panel
   */
  setTabAdvancedQuery(state, {
    parentUuid,
    tabAdvanceQuery
  }) {
    if (isEmptyValue(state.storedWindows[parentUuid])) {
      Vue.set(state.storedWindows, parentUuid, {
        tabsList: []
      })
    }
    const tabsList = state.storedWindows[parentUuid].tabsList
    tabsList.push(tabAdvanceQuery)
    Vue.set(state.storedWindows[parentUuid], 'tabsList', tabsList)
  },

  /**
   * Change field tab attribute
   * @param {object} field
   * @param {string} attributeName
   * @param {mixed} attributeValue
   */
  changeTabFieldAttribute(state, payload) {
    const { attributeName, attributeValue } = payload

    payload.field[attributeName] = attributeValue
  },
  /**
   * @param {*} state
   * @param {string} parentUuid
   * @param {object} tab
   */
  setSelectProcessWindows(state, uuid) {
    state.selectProcessUuid = uuid
  }
}
