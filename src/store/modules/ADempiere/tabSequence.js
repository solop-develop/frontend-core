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
import { requestListTabSequences } from '@/api/ADempiere/user-interface/component/tab-sequence'

// utils and helper methods
import { getContextAttributes, generateContextKey } from '@/utils/ADempiere/contextUtils'

const initState = {
  tabSequence: {}
}

const tabSequence = {
  state: initState,

  mutations: {
    setTabSequence(state, {
      parentUuid,
      containerUuid,
      tabUuid,
      recordsList,
      contextAttributesList,
      contextKey
    }) {
      const key = tabUuid + contextKey

      Vue.set(state.tabSequence, key, {
        parentUuid,
        containerUuid,
        tabUuid,
        recordsList,
        oldRecordsList: recordsList,
        contextAttributesList,
        contextKey
      })
    },

    resetStateTabSequence(state) {
      state = initState
    }
  },

  actions: {
    listTabSequences({ commit }, {
      parentUuid,
      containerUuid,
      tabUuid,
      contextColumnNames
    }) {
      const contextAttributesList = getContextAttributes({
        parentUuid,
        containerUuid,
        contextColumnNames,
        keyName: 'key'
      })

      return new Promise(resolve => {
        requestListTabSequences({
          tabUuid,
          contextAttributesList
        })
          .then(response => {
            const recordsList = response.recordsList.map(record => {
              return {
                ...record.attributes
              }
            })

            const contextKey = generateContextKey(contextAttributesList, 'key')

            commit('setTabSequence', {
              parentUuid,
              containerUuid,
              tabUuid,
              recordsList,
              contextAttributesList,
              contextKey
            })

            resolve(recordsList)
          })
      })
    }
  },

  getters: {
    getTabSequence: (state) => {
      return state.tabSequence
    },

    getTabSequenceData: (state) => ({
      parentUuid,
      containerUuid,
      tabUuid,
      contextColumnNames
    }) => {
      const contextAttributesList = getContextAttributes({
        parentUuid,
        containerUuid,
        contextColumnNames
      })

      const contextKey = generateContextKey(contextAttributesList)
      const key = tabUuid + contextKey

      return state.tabSequence[key]
    },

    getTabSequenceRecordsList: (state, getters) => ({
      parentUuid,
      containerUuid,
      tabUuid,
      contextColumnNames
    }) => {
      const tabSequenceData = getters.getTabSequenceData({
        parentUuid,
        containerUuid,
        tabUuid,
        contextColumnNames
      })

      if (tabSequenceData) {
        return tabSequenceData.recordsList
      }
      return []
    }
  }
}

export default tabSequence
