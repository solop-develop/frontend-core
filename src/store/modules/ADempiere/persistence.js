// ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
// Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
// Contributor(s): Yamel Senih ysenih@erpya.com www.erpya.com
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import Vue from 'vue'

import language from '@/lang'

// constants
import { LOG_COLUMNS_NAME_LIST, UUID } from '@/utils/ADempiere/constants/systemColumns'
import { ROW_ATTRIBUTES } from '@/utils/ADempiere/constants/table'

// api request methods
import {
  createEntity,
  updateEntity
} from '@/api/ADempiere/common/persistence.js'

// utils and helper methods
import { isEmptyValue, isSameValues } from '@/utils/ADempiere/valueUtils.js'
import { showMessage } from '@/utils/ADempiere/notification.js'

const persistence = {
  state: {
    persistence: {}
  },

  mutations: {
    resetStatepersistence(state) {
      state = {
        persistence: {}
      }
    },
    addChangeToPersistenceQueue(state, {
      containerUuid,
      recordUuid,
      columnName,
      oldValue,
      // valueType,
      value
    }) {
      const key = containerUuid + '_' + recordUuid
      const values = {
        columnName,
        // valueType,
        oldValue,
        value
      }

      const currentValues = state.persistence[key]

      if (isEmptyValue(currentValues)) {
        Vue.set(state.persistence, key, {})
      }
      Vue.set(state.persistence[key], columnName, values)

      // if (!isEmptyValue(state.persistence[containerUuid]) && !isEmptyValue(recordUuid)) {
      //   state.persistence[containerUuid][recordUuid] = new Map()
      // } else {
      //   state.persistence[containerUuid] = {
      //     [recordUuid]: new Map()
      //   }
      // }
      // // Set value
      // if (!isEmptyValue(state.persistence[containerUuid]) && !isEmptyValue(recordUuid)) {
      //   state.persistence[containerUuid][recordUuid].set(columnName, {
      //     columnName,
      //     oldValue,
      //     value
      //   })
      // } else {
      //   state.persistence[containerUuid].set([columnName], {
      //     columnName,
      //     // valueType,
      //     oldValue,
      //     value
      //   })
      // }
    },
    // clear old values
    clearPersistenceQueue(state, {
      containerUuid,
      recordUuid
    }) {
      const key = containerUuid + '_' + recordUuid
      Vue.set(state.persistence, key, {})

      // state.persistence[containerUuid] = {
      //   [recordUuid]: new Map()
      // }
    }
  },

  actions: {
    actionPerformed({ commit, getters, rootState, dispatch }, {
      field,
      recordUuid,
      value
    }) {
      return new Promise((resolve, reject) => {
        const { parentUuid, containerUuid } = field
        const currentRecord = getters.getTabCurrentRecord({ containerUuid })
        let oldValue
        if (!isEmptyValue(currentRecord)) {
          oldValue = currentRecord[field.columnName]
        }

        commit('addChangeToPersistenceQueue', {
          containerUuid,
          recordUuid: getters.getUuidOfContainer(field.containerUuid),
          columnName: field.columnName,
          oldValue,
          value
        })

        const emptyFields = getters.getTabFieldsEmptyMandatory({
          parentUuid,
          containerUuid,
          formatReturn: false
        }).filter(itemField => {
          // omit send to server (to create or update) columns manage by backend
          return itemField.isAlwaysUpdateable ||
            !LOG_COLUMNS_NAME_LIST.includes(itemField.columnName)
        }).map(itemField => {
          return itemField.name
        })

        if (!isEmptyValue(emptyFields)) {
          showMessage({
            message: language.t('notifications.mandatoryFieldMissing') + emptyFields,
            type: 'info'
          })
          return
        }

        if (isEmptyValue(recordUuid) || recordUuid === 'create-new') {
          recordUuid = getters.getUuidOfContainer(field.containerUuid)
        }

        const autoSave = rootState.settings.autoSave
        if (autoSave) {
          dispatch('flushPersistenceQueue', {
            parentUuid: field.parentUuid,
            containerUuid,
            tableName: field.tabTableName,
            recordUuid
          })
            .then(response => {
              resolve(response)
            })
            .catch(error => reject(error))
        }
      })
    },

    flushPersistenceQueue({ commit, dispatch, getters }, {
      parentUuid,
      containerUuid,
      tableName,
      recordUuid
    }) {
      return new Promise((resolve, reject) => {
        let attributesList = getters.getPersistenceAttributes({ containerUuid, recordUuid })
          .filter(itemField => {
            // omit send to server (to create or update) columns manage by backend
            return itemField.isAlwaysUpdateable ||
              !LOG_COLUMNS_NAME_LIST.includes(itemField.columnName)
          })

        if (!isEmptyValue(attributesList)) {
          if (!isEmptyValue(recordUuid)) {
            // Update existing entity
            updateEntity({
              tableName,
              recordUuid,
              attributesList
            })
              .then(response => {
                // TODO: Get list record log
                showMessage({
                  message: language.t('recordManager.updatedRecord'),
                  type: 'success'
                })
                resolve(response)

                // clear old values
                dispatch('clearPersistenceQueue', {
                  containerUuid,
                  recordUuid: response.attributes[UUID]
                })
              })
              .catch(error => reject(error))
          } else {
            attributesList = attributesList.filter(itemAttribute => !isEmptyValue(itemAttribute.value))

            // Create new entity
            createEntity({
              tableName,
              attributesList
            })
              .then(response => {
                showMessage({
                  message: language.t('data.createRecordSuccessful'),
                  type: 'success'
                })
                response.type = 'createEntity'

                // add new row on table
                commit('setTabRow', {
                  containerUuid,
                  row: {
                    ...response.attributes,
                    ...ROW_ATTRIBUTES
                    // rowIndex: 0
                  }
                })

                // update fields values
                dispatch('updateValuesOfContainer', {
                  parentUuid,
                  containerUuid,
                  attributes: response.attributes
                }, {
                  root: true
                })

                resolve(response)

                // clear old values
                dispatch('clearPersistenceQueue', {
                  // without record uuid to clear new
                  containerUuid
                })
              })
              .catch(error => reject(error))
          }
        }
      })
    },

    // clear old values
    clearPersistenceQueue({ commit }, {
      containerUuid,
      recordUuid
    }) {
      commit('clearPersistenceQueue', {
        containerUuid,
        recordUuid
      })
    }
  },

  getters: {
    getPersistenceAttributes: (state) => ({ containerUuid, recordUuid }) => {
      const key = containerUuid + '_' + recordUuid
      if (!isEmptyValue(state.persistence[key])) {
        return Object.values(state.persistence[key])
          // only changes
          .filter(attribute => {
            const { value, oldValue } = attribute
            return !isSameValues(value, oldValue)
          })
      }
      return []
    },
    getPersistenceAttributes2: (state) => ({ containerUuid, recordUuid }) => {
      if (
        !isEmptyValue(containerUuid) &&
        !isEmptyValue(recordUuid) &&
        !isEmptyValue(state.persistence[containerUuid]) &&
        !isEmptyValue(state.persistence[containerUuid][recordUuid])
      ) {
        const attributesMap = state.persistence[containerUuid][recordUuid]
        return [
          ...attributesMap.values()
        ]
          .filter(attribute => {
            const { value, oldValue } = attribute
            return !isSameValues(value, oldValue)
          })
      }
      return []
    }
  }
}

export default persistence
