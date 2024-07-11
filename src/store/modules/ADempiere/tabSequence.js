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
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

import Vue from 'vue'

import lang from '@/lang'

// api request methods
import {
  requestListTabSequences,
  requestSaveTabSequences
} from '@/api/ADempiere/user-interface/component/tab-sequences'

// utils and helper methods
import { getContextAttributes, generateContextKey } from '@/utils/ADempiere/contextUtils/contextAttributes'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { showMessage } from '@/utils/ADempiere/notification'

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
      oldRecordsList,
      contextAttributesList,
      contextKey
    }) {
      const key = tabUuid + contextKey

      Vue.set(state.tabSequence, key, {
        parentUuid,
        containerUuid,
        tabUuid,
        recordsList,
        oldRecordsList,
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
      contextColumnNames,
      tabId
    }) {
      const contextAttributesList = getContextAttributes({
        parentUuid,
        containerUuid,
        contextColumnNames,
        format: 'object'
      })
      let contextAttributes = '{}'
      if (!isEmptyValue(contextAttributesList)) {
        contextAttributes = JSON.stringify(contextAttributesList)
      }
      return new Promise(resolve => {
        requestListTabSequences({
          tabUuid,
          contextAttributes,
          tabId
        })
          .then(response => {
            const oldRecordsList = response.records.map(record => {
              return {
                ...record.values
              }
            })
            const recordsList = oldRecordsList.map(recordRow => {
              return {
                ...recordRow,
                isEditRow: false
              }
            })

            const contextKey = generateContextKey(contextAttributesList, 'key')
            commit('setTabSequence', {
              parentUuid,
              containerUuid,
              tabUuid,
              recordsList,
              oldRecordsList,
              contextAttributesList,
              contextKey
            })

            resolve(recordsList)
          })
      })
    },

    /**
     * Save records in tab sort (sequence)
     * @param {string} containerUuid
     * @param {string} parentUuid
     */
    saveTabSequence({ commit, dispatch, getters, rootGetters }, {
      parentUuid,
      containerUuid,
      tabUuid,
      tabId
    }) {
      const { sequenceTabsList } = rootGetters.getStoredTab(parentUuid, containerUuid)
      const sortTab = sequenceTabsList.find(itemTab => {
        return itemTab.uuid === tabUuid
      })
      const { context_column_names, table_name, sort_order_column_name, sort_yes_no_column_name } = sortTab
      const { recordsList, oldRecordsList } = getters.getTabSequenceData({
        parentUuid,
        containerUuid,
        tabUuid,
        contextColumnNames: context_column_names
      })
      const entitiesList = []
      recordsList.filter(recordRow => {
        return recordRow.isEditRow
      }).map(recordRow => {
        const oldRecordRow = oldRecordsList.find(oldRow => oldRow.UUID === recordRow.UUID)

        const attributesList = [{
          columnName: sort_order_column_name,
          value: recordRow[sort_order_column_name]
        }]

        const newYesNo = recordRow[sort_yes_no_column_name]
        const oldYesNo = oldRecordRow[sort_yes_no_column_name]
        if (oldYesNo !== newYesNo) {
          attributesList.push({
            columnName: sort_yes_no_column_name,
            value: newYesNo
          })
        }

        const valuesRow = {
          [sort_order_column_name]: recordRow[sort_order_column_name],
          [sort_yes_no_column_name]: newYesNo
        }

        const recordId = recordRow[table_name + '_ID']
        entitiesList.push({
          selection_id: recordId,
          // recordUuid: recordRow.UUID,
          values: valuesRow
        })
      })

      if (isEmptyValue(entitiesList)) {
        showMessage({
          message: lang.t('component.sequenceSort.withoutChanges'),
          type: 'info'
        })
        return
      }

      const contextAttributesList = getContextAttributes({
        parentUuid,
        containerUuid,
        contextColumnNames: context_column_names,
        format: 'object'
      })
      const contextAttributes = contextAttributesList
      // if (!isEmptyValue(contextAttributesList)) {
      //   contextAttributes = JSON.stringify(contextAttributesList)
      // }
      requestSaveTabSequences({
        tabId,
        contextAttributes,
        entities: entitiesList
      })
        .then(response => {
          const contextKey = generateContextKey(contextAttributesList, 'key')
          commit('setTabSequence', {
            parentUuid,
            containerUuid,
            tabUuid,
            recordsList: [],
            oldRecordsList: [],
            contextAttributesList,
            contextKey
          })

          dispatch('getEntities', {
            parentUuid,
            containerUuid
          })

          // dispatch('listTabSequences', {
          //   tabId,
          //   parentUuid,
          //   containerUuid,
          //   tabUuid,
          //   context_column_names
          // })

          showMessage({
            message: lang.t('component.sequenceSort.updateSequencesSuccessfully'),
            type: 'success'
          })
        })
    },

    discardTabSequenceChanges({ commit, getters }, {
      parentUuid,
      containerUuid,
      tabUuid,
      contextColumnNames
    }) {
      const sequenceData = getters.getTabSequenceData({
        parentUuid,
        containerUuid,
        tabUuid,
        contextColumnNames
      })

      const { oldRecordsList } = sequenceData

      // same records
      const recordsList = oldRecordsList.map(recordRow => {
        return {
          ...recordRow,
          isEditRow: false
        }
      })
      commit('setTabSequence', {
        ...sequenceData,
        recordsList
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
    },

    getTabSequenceOldRecordsList: (state, getters) => ({
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
        return tabSequenceData.oldRecordsList
      }
      return []
    },

    getTabSequenceIsChanged: (state, getters) => ({
      parentUuid,
      containerUuid,
      tabUuid,
      contextColumnNames
    }) => {
      const recordsList = getters.getTabSequenceRecordsList({
        parentUuid,
        containerUuid,
        tabUuid,
        contextColumnNames
      })

      return recordsList.some(row => {
        return row.isEditRow
      })
    }
  }
}

export default tabSequence
