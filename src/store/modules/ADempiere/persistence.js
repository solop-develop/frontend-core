/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 * Contributor(s): Yamel Senih ysenih@erpya.com
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

import language from '@/lang'

// constants
import { LOG_COLUMNS_NAME_LIST, UUID } from '@/utils/ADempiere/constants/systemColumns'
import { ROW_ATTRIBUTES } from '@/utils/ADempiere/tableUtils'
import { DISPLAY_COLUMN_PREFIX, IDENTIFIER_COLUMN_SUFFIX } from '@/utils/ADempiere/dictionaryUtils'

// api request methods
import {
  createEntity,
  updateEntity
} from '@/api/ADempiere/common/persistence.js'

// utils and helper methods
import { isEmptyValue, isSameValues } from '@/utils/ADempiere/valueUtils.js'
import { showMessage } from '@/utils/ADempiere/notification.js'
import { getContextDefaultValue } from '@/utils/ADempiere/dictionaryUtils.js'

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
      recordUuid,
      logs = {}
    }) {
      const key = containerUuid + '_' + recordUuid
      Vue.set(state.persistence, key, logs)

      // state.persistence[containerUuid] = {
      //   [recordUuid]: new Map()
      // }
    }
  },

  actions: {
    actionPerformed({ commit, getters, rootState, dispatch }, {
      field,
      columnName,
      recordUuid,
      value
    }) {
      return new Promise((resolve, reject) => {
        const { parentUuid, containerUuid } = field
        const currentRecord = getters.getTabCurrentRow({
          containerUuid
        })

        // column name to displayedValue
        if (isEmptyValue(columnName)) {
          columnName = field.columnName
        }

        // TODO: Old value is not working
        let oldValue
        if (!isEmptyValue(currentRecord)) {
          oldValue = currentRecord[columnName]
        }
        if (isEmptyValue(currentRecord) || oldValue === value) {
          const defaultValue = getContextDefaultValue({
            ...field
          })
          oldValue = defaultValue
        }

        commit('addChangeToPersistenceQueue', {
          containerUuid,
          recordUuid: getters.getUuidOfContainer(field.containerUuid),
          columnName,
          oldValue,
          value
        })

        // start callout on server
        dispatch('startCallout', {
          parentUuid,
          containerUuid,
          field,
          callout: field.callout,
          columnName,
          valueType: field.valueType,
          value,
          oldValue
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
          resolve()
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
        } else {
          resolve()
        }
      })
    },

    flushPersistenceQueue({ commit, dispatch, getters, rootGetters }, {
      parentUuid,
      containerUuid,
      tableName,
      recordUuid
    }) {
      return new Promise((resolve, reject) => {
        const { fieldsList } = rootGetters.getStoredTab(parentUuid, containerUuid)
        let attributesList = getters.getPersistenceAttributes({
          containerUuid,
          recordUuid
        })
          .filter(attribute => {
            const { columnName } = attribute

            // omit send to server (to create or update) columns manage by backend
            if (columnName.startsWith(DISPLAY_COLUMN_PREFIX)) {
              return false
            }

            const field = fieldsList.find(fieldItem => fieldItem.columnName === columnName)
            // prevent `PO.set_Value: Column not updateable`
            if (!isEmptyValue(recordUuid) && !field.isUpdateable) {
              return false
            }
            if (!field.isAlwaysUpdateable &&
              LOG_COLUMNS_NAME_LIST.includes(columnName)) {
              return false
            }
            return true
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

                // add new row on table
                commit('setTabRowWithRecord', {
                  containerUuid,
                  recordUuid: response.attributes[UUID],
                  row: {
                    ...response.attributes,
                    ...ROW_ATTRIBUTES
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

                const attributesRecord = response.attributes

                // add display column to current record
                const { identifierColumns } = rootGetters.getStoredTab(parentUuid, containerUuid)
                const displayedColumnName = DISPLAY_COLUMN_PREFIX + tableName + IDENTIFIER_COLUMN_SUFFIX
                let displayedValue = ''
                identifierColumns.forEach(identifier => {
                  const { columnName } = identifier
                  const currentValue = attributesRecord[columnName]
                  if (isEmptyValue(displayedValue)) {
                    displayedValue = currentValue
                    return
                  }
                  displayedValue += '_' + currentValue
                })
                attributesRecord[displayedColumnName] = displayedValue

                response.attributes = attributesRecord

                // add new row on table
                commit('setTabRow', {
                  containerUuid,
                  row: {
                    ...attributesRecord,
                    ...ROW_ATTRIBUTES
                    // rowIndex: 0
                  }
                })

                // update fields values
                dispatch('updateValuesOfContainer', {
                  parentUuid,
                  containerUuid,
                  attributes: attributesRecord
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

        resolve()
      })
    },

    setOldPersistenceValues({ commit, dispatch, getters }, {
      parentUuid,
      containerUuid,
      recordUuid
    }) {
      const valuesChanges = getters.getPersistenceAttributesChanges({
        parentUuid,
        containerUuid,
        recordUuid
      })

      // set old value as current value
      const LastChange = valuesChanges[valuesChanges.length - 1]
      const { columnName, oldValue } = LastChange

      commit('updateValueOfField', {
        parentUuid,
        containerUuid,
        columnName,
        recordUuid,
        value: oldValue
      }, {
        root: true
      })

      dispatch('clearPersistenceQueue', {
        containerUuid,
        columnName,
        recordUuid,
        logs: valuesChanges
      })
    },

    // clear old values
    clearPersistenceQueue({ commit }, {
      containerUuid,
      recordUuid,
      columnName,
      logs
    }) {
      let changeLogs
      if (!isEmptyValue(logs)) {
        changeLogs = logs.filter(log => log.columnName !== columnName)
      }

      commit('clearPersistenceQueue', {
        containerUuid,
        recordUuid,
        columnName,
        logs: changeLogs
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

    /**
     * Evaluate current and old values, if is new compate current values with default values
     * @param {string} parentUuid
     * @param {string} containerUuid
     * @param {string} recordUuid
     * @returns {array}
     */
    getPersistenceAttributesChanges: (state, getters, rootState, rootGetters) => ({
      parentUuid,
      containerUuid,
      recordUuid
    }) => {
      const key = containerUuid + '_' + recordUuid

      if (!isEmptyValue(state.persistence[key])) {
        if (isEmptyValue(recordUuid)) {
          const defaultRow = rootGetters.getTabParsedDefaultValue({
            parentUuid,
            containerUuid,
            isAddDisplayColumn: true,
            formatToReturn: 'object'
          })

          return Object.values(state.persistence[key])
            // only changes with default value
            .filter(attribute => {
              const { value, columnName } = attribute
              return !isSameValues(value, defaultRow[columnName])
            })
        }

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
