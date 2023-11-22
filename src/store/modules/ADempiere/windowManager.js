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

import Vue from 'vue'
import language from '@/lang'
import router from '@/router'

// API Request Methods
import {
  updateEntity,
  deleteEntity,
  requestGetEntities
} from '@/api/ADempiere/userInterface/entities.ts'

// Constants
import { UUID } from '@/utils/ADempiere/constants/systemColumns'
import { ROW_ATTRIBUTES } from '@/utils/ADempiere/tableUtils'
import { IS_ADVANCED_QUERY } from '@/utils/ADempiere/dictionaryUtils'
import {
  IGNORE_VALUE_OPERATORS_LIST, MULTIPLE_VALUES_OPERATORS_LIST, RANGE_VALUE_OPERATORS_LIST
} from '@/utils/ADempiere/dataUtils'
import { FIELDS_DATE } from '@/utils/ADempiere/references'

// Utils and Helper Methods
import { containerManager } from '@/utils/ADempiere/dictionary/window'
import { getContextAttributes, generateContextKey } from '@/utils/ADempiere/contextUtils/contextAttributes'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import { convertObjectToKeyValue } from '@/utils/ADempiere/valueFormat'
import { showMessage } from '@/utils/ADempiere/notification'
import { generatePageToken } from '@/utils/ADempiere/dataUtils'

const initState = {
  tabData: {},
  oldTabData: {},
  // container uuid: record uuid
  emtpyTabData: {
    parentUuid: undefined,
    containerUuid: undefined,
    contextKey: '',
    searchValue: '',
    currentRecordUuid: undefined,
    recordsList: [], // list of response records
    selectionsList: [], // record selection
    nextPageToken: undefined,
    recordCount: 0, // total number of all records
    isLoaded: false, // has not been charged the first time
    isLoading: false, // request currently in progress
    pageNumber: 1 // page number of records
  }
}

const windowManager = {
  state: initState,

  mutations: {
    setTabData(state, {
      parentUuid,
      containerUuid,
      contextKey = '',
      searchValue = '',
      currentRecordUuid = '',
      recordsList = [],
      selectionsList = [],
      nextPageToken,
      recordCount = 0,
      isLoaded = true,
      isLoading = false,
      pageNumber = 1,
      pageSize = 15
    }) {
      const dataTab = {
        parentUuid,
        containerUuid,
        contextKey,
        searchValue,
        currentRecordUuid,
        recordsList,
        selectionsList,
        nextPageToken,
        recordCount,
        isLoaded,
        isLoading,
        pageNumber,
        pageSize
      }
      Vue.set(state.tabData, containerUuid, dataTab)
      Vue.set(state.oldTabData, containerUuid, dataTab)
    },

    setNewTabData(state, { parentUuid, containerUuid }) {
      // current to old data
      const currentAsOld = state.tabData[containerUuid]
      Vue.set(state.oldTabData, containerUuid, currentAsOld)

      // new empty as current
      Vue.set(state.tabData, containerUuid, {
        ...state.emtpyTabData,
        parentUuid,
        containerUuid
      })
    },

    setOldAsCurrentTabData(state, { containerUuid }) {
      // set old to current data
      const oldAsCurrent = state.oldTabData[containerUuid]
      Vue.set(state.tabData, containerUuid, oldAsCurrent)

      // new emty as old
      Vue.set(state.oldTabData, containerUuid, {
        ...state.emtpyTabData,
        containerUuid
      })
    },

    setTabRow(state, { containerUuid, row, rowIndex }) {
      let recordsList = []
      if (state.tabData[containerUuid] && state.tabData[containerUuid].recordsList) {
        recordsList = state.tabData[containerUuid].recordsList
      }

      if (isEmptyValue(rowIndex)) {
        if (!isEmptyValue(recordsList)) {
          const recordUuid = row[UUID]
          const firstRow = recordsList.at()
          if (recordUuid === firstRow[UUID]) {
            rowIndex = 0
          } else {
            rowIndex = recordsList.findIndex(rowItem => {
              return rowItem[UUID] === recordUuid
            })
          }
        }
      }

      if (!isEmptyValue(rowIndex)) {
        recordsList.splice(rowIndex, 1, {
          ...row,
          rowIndex
        })
      } else {
        recordsList.unshift(row)

        recordsList = recordsList.map((rowItem, index) => {
          return {
            ...rowItem,
            rowIndex: index
          }
        })
      }

      Vue.set(state.tabData[containerUuid], 'recordsList', recordsList)
    },
    removeTabRow(state, { containerUuid, index = 0 }) {
      // temporal record list
      let recordsList = []
      if (state.tabData[containerUuid] && state.tabData[containerUuid].recordsList) {
        recordsList = state.tabData[containerUuid].recordsList
      }

      // delete an item
      recordsList.splice(index, 1)
      // to set index
      recordsList = recordsList.map((rowItem, rowIndex) => {
        return {
          ...rowItem,
          rowIndex
        }
      })

      Vue.set(state.tabData[containerUuid], 'recordsList', recordsList)
    },

    setTabCell(state, {
      containerUuid,
      rowIndex,
      columnName,
      value
    }) {
      if (isEmptyValue(rowIndex) || isEmptyValue(containerUuid) || isEmptyValue(columnName) ||
        isEmptyValue(state.tabData[containerUuid]) || isEmptyValue(state.tabData[containerUuid].recordsList) ||
        isEmptyValue(state.tabData[containerUuid].recordsList[rowIndex])) {
        return
      }
      Vue.set(state.tabData[containerUuid].recordsList[rowIndex], columnName, value)
    },

    setTabRowWithRecord(state, { containerUuid, row, recordUuid }) {
      if (isEmptyValue(recordUuid)) {
        return
      }
      let recordsList
      recordsList = state.tabData[containerUuid].recordsList
      if (!isEmptyValue(row)) {
        recordsList = state.tabData[containerUuid].recordsList.map(currentRowTable => {
          if (currentRowTable.UUID === row.UUID) {
            return {
              ...row,
              isSelectedRow: true
            }
          }
          return currentRowTable
        })
      }

      Vue.set(state.tabData[containerUuid], 'recordsList', recordsList)
    },

    clearTabData(state, { containerUuid }) {
      Vue.set(state.tabData, containerUuid, undefined)
    },

    setTabSelectionsList(state, {
      containerUuid,
      selectionsList
    }) {
      Vue.set(state.tabData[containerUuid], 'selectionsList', selectionsList)
    },

    setRecordUuidOnPanel(state, {
      containerUuid,
      recordUuid
    }) {
      Vue.set(state.tabData[containerUuid], 'currentRecordUuid', recordUuid)
    },

    setSearchValueTabRecordsList(state, {
      containerUuid,
      searchValue
    }) {
      Vue.set(state.tabData[containerUuid], 'searchValue', searchValue)
    },

    setIsLoadingTabRecordsList(state, {
      containerUuid,
      isLoading
    }) {
      Vue.set(state.tabData[containerUuid], 'isLoading', isLoading)
    },

    resetStateWindowManager(state) {
      state = initState
    }
  },

  actions: {
    /**
     * Get list entities
     * @param {string} parentUuid
     * @param {string} containerUuid
     * @param {string} searchValue used to compare with selections columns
     * @param {array} filters used as where clause
     * @param {number} pageNumber
     * @returns {promise} array entities list
     * @returns {promise} array current entity
     */
    getEntities({
      commit,
      dispatch,
      getters,
      rootGetters
    }, {
      parentUuid,
      containerUuid,
      searchValue = '',
      referenceUuid = '',
      filters = [],
      filtersRecord = {},
      pageNumber,
      pageSize
    }) {
      return new Promise(resolve => {
        const storedPage = getters.getTabPageNumber({
          containerUuid
        })

        let contextAttributes = '{}'

        let pageToken

        const {
          isParentTab,
          isHasTree,
          fieldsList,
          id,
          linkColumnName,
          parentColumnName,
          contextColumnNames
        } = rootGetters.getStoredTab(parentUuid, containerUuid)

        if (isEmptyValue(pageNumber)) {
          pageNumber = storedPage
        }

        pageToken = generatePageToken({
          pageNumber
        })

        if (!isEmptyValue(filters) && typeof filters !== 'object') {
          const parseFilter = JSON.parse(filters)
          filters = [parseFilter]
        }

        if (isEmptyValue(searchValue)) {
          searchValue = getters.getSearchValueTabRecordsList({
            containerUuid
          })
        }

        // add filters with link column name and parent column name
        if (
          !isEmptyValue(linkColumnName) &&
          !contextColumnNames.includes(linkColumnName) &&
          !filters.some(filter => filter.columnName === linkColumnName)
        ) {
          const value = rootGetters.getValueOfField({
            parentUuid,
            containerUuid,
            columnName: linkColumnName
          })
          if (!isEmptyValue(value)) {
            filters.push({
              columnName: linkColumnName,
              value
            })
          } else {
            console.warn(`Get entities without context to ${linkColumnName} to filter in getEntities`)
          }
        }
        if (
          !isEmptyValue(parentColumnName) &&
          !contextColumnNames.includes(parentColumnName &&
          !filters.some(filter => filter.columnName === parentColumnName))
        ) {
          const value = rootGetters.getValueOfField({
            parentUuid,
            containerUuid,
            columnName: parentColumnName
          })
          if (!isEmptyValue(value)) {
            filters.push({
              columnName: parentColumnName,
              value
            })
          } else {
            console.warn(`Get entities without context to ${parentColumnName} to filter in getEntities`)
          }
        }

        // get context values
        const contextAttributesList = getContextAttributes({
          parentUuid,
          contextColumnNames,
          keyName: 'key',
          format: 'object'
        })

        // const isWithoutValues = contextColumnNames.find(columnName =>
        //   isEmptyValue(columnName) ||
        //   isEmptyValue(contextAttributesList[columnName])
        // )
        // if (isWithoutValues) {
        //   console.warn(`Get entites without response, fill the **${isWithoutValues.key}** field in **${name}** tab.`)
        //   resolve([])
        //   return
        // }

        if (!isEmptyValue(filtersRecord) && isEmptyValue(filters)) {
          filters.map(list => {
            const { columnName } = list
            if (filtersRecord.columnName === columnName) {
              return filtersRecord
            }
            return list
          })
        }

        commit('setTabData', {
          parentUuid,
          isLoaded: false,
          containerUuid
        })

        commit('setIsLoadingTabRecordsList', {
          containerUuid,
          isLoading: true
        })
        if (
          !isEmptyValue(filters) &&
          !isEmptyValue(linkColumnName) &&
          !isEmptyValue(contextAttributesList)
        ) {
          const listFilters = filters.find(i => i.columnName === linkColumnName)
          // const listContextAttributes = contextAttributesList.find(i => i.key === linkColumnName)
          const listContextAttributes = contextAttributesList[linkColumnName]
          if (
            !isEmptyValue(listFilters) &&
            !isEmptyValue(listFilters.value) &&
            !isEmptyValue(listContextAttributes) &&
            !isEmptyValue(listContextAttributes.value) &&
            (listFilters.value !== listContextAttributes.value)
          ) {
            console.warn(`Get entites without response, fill the **${filters}**`)
            filters = []
          }
        }

        if (!isEmptyValue(searchValue)) {
          pageToken = ''
        }

        if (!isEmptyValue(searchValue)) {
          searchValue = encodeURI(searchValue)
        }

        if (!isEmptyValue(contextAttributesList)) {
          contextAttributes = JSON.stringify(contextAttributesList)
        }

        let listFilters

        if (!isEmptyValue(filters)) {
          listFilters = '[' + filters.map(parameter => {
            const {
              columnName,
              operator,
              value,
              valueTo
            } = parameter
            return JSON.stringify({
              name: columnName,
              operator,
              values: !isEmptyValue(valueTo) ? [value, valueTo] : value
            })
          }).toString() + ']'
        }

        requestGetEntities({
          tabId: id,
          contextAttributes,
          searchValue,
          referenceUuid,
          filters: listFilters,
          pageToken,
          pageSize
        })
          .then(dataResponse => {
            const dataToStored = dataResponse.records.map((record, rowIndex) => {
              return {
                ...record.values,
                // datatables app attributes
                ...ROW_ATTRIBUTES,
                rowIndex
              }
            })

            let currentRecordUuid
            // update current record
            if (!isEmptyValue(dataToStored)) {
              let currentRow = {
                // set first record
                ...dataToStored.at(0)
              }
              const recordUuid = rootGetters.getUuidOfContainer(containerUuid)
              if (!isEmptyValue(recordUuid) && storedPage === pageNumber) {
                const recordFromUuid = dataToStored.find(record => record[UUID] === recordUuid)
                if (!isEmptyValue(recordFromUuid)) {
                  currentRow = {
                    ...recordFromUuid
                  }
                }
              }
              currentRecordUuid = currentRow[UUID]

              // remove datatables app attributes
              for (const key in ROW_ATTRIBUTES) {
                delete currentRow[key]
              }
              const currentRoute = router.app._route

              const defaultValues = getters.getParsedDefaultValues({
                parentUuid,
                containerUuid,
                isSOTrxMenu: currentRoute.meta.isSalesTransaction,
                fieldsList,
                formatToReturn: 'object'
              })
              const attributes = convertObjectToKeyValue({
                object: {
                  ...defaultValues,
                  ...currentRow
                }
              })
              dispatch('updateValuesOfContainer', {
                parentUuid,
                containerUuid,
                attributes,
                isOverWriteParent: isParentTab
              })

              // Always overwrite key values on parent context
              const relatedColumnsList = fieldsList
                .filter(fieldItem => {
                  return fieldItem.isParent || fieldItem.isKey
                })
                .map(fieldItem => {
                  return fieldItem.columnName
                })

              if (!isEmptyValue(parentColumnName)) {
                relatedColumnsList.push(parentColumnName)
              }
              // set context values
              const parentValues = getContextAttributes({
                containerUuid,
                contextColumnNames: relatedColumnsList,
                format: 'array'
              })

              dispatch('updateValuesOfContainer', {
                parentUuid,
                containerUuid,
                attributes: parentValues,
                isOverWriteParent: true
              })

              // TODO: Evaluate seek record on container manager
              // active logics with set records values
              fieldsList.forEach(field => {
                // change Dependents
                dispatch('changeDependentFieldsList', {
                  field,
                  fieldsList,
                  containerManager
                })
              })
            } else {
              // set default values to create if without records response
              // dispatch('setTabDefaultValues', {
              //   parentUuid,
              //   containerUuid
              // })
            }

            const contextKey = generateContextKey(contextAttributesList, 'key')
            commit('setTabData', {
              parentUuid,
              containerUuid,
              contextKey,
              searchValue,
              currentRecordUuid,
              recordsList: dataToStored,
              nextPageToken: dataResponse.nextPageToken,
              pageNumber,
              pageSize,
              isLoaded: true,
              isLoading: false,
              recordCount: dataResponse.recordCount
            })

            if (isEmptyValue(dataToStored)) {
              // set default values to create if without records response
              dispatch('setTabDefaultValues', {
                parentUuid,
                containerUuid
              })
            }

            // TODO: Set recordId as nodeId
            if (isHasTree) {
              dispatch('getTreeNodesFromServer', {
                parentUuid,
                containerUuid
              })
            }

            resolve(dataToStored)
          })
          .catch(error => {
            console.warn(`Error get entites`, error.message)
            commit('setTabData', {
              parentUuid,
              isLoaded: true,
              containerUuid
            })
            commit('setIsLoadingTabRecordsList', {
              containerUuid,
              isLoading: false
            })
            resolve([])
          })
      })
    },

    setOldAsCurrentTabData({ commit, dispatch, getters, rootGetters }, {
      parentUuid,
      containerUuid
    }) {
      const currentData = getters.getTabOldData({ containerUuid })

      commit('setOldAsCurrentTabData', containerUuid)

      if (!isEmptyValue(currentData.recordsList)) {
        let currentRow = currentData.recordsList.at(0)
        const currentRecordUuid = currentData.currentRecordUuid
        if (!isEmptyValue(currentRecordUuid)) {
          const recordFromUuid = currentData.recordsList.find(row => {
            return row[UUID] === currentRecordUuid
          })

          if (!isEmptyValue(recordFromUuid)) {
            currentRow = recordFromUuid
          }
        }

        dispatch('updateValuesOfContainer', {
          parentUuid,
          containerUuid,
          attributes: currentRow
        })
      }
    },

    /**
     * Delete Entity panel
     * @param {string} parentUuid
     * @param {string} containerUuid
     * @param {number} recordId
     * @param {string} recordUuid
     * @returns {promise}
     */
    deleteEntity({
      dispatch,
      rootGetters
    }, {
      parentUuid,
      containerUuid,
      recordId,
      recordUuid
    }) {
      return new Promise((resolve, reject) => {
        const tab = rootGetters.getStoredTab(parentUuid, containerUuid)

        deleteEntity({
          tableName: tab.tableName,
          recordId,
          recordUuid
        })
          .then(responseDeleteEntity => {
            // TODO: Remove row in array of stored recrods, if empty stored records refresh
            dispatch('getEntities', {
              parentUuid,
              containerUuid
            })

            resolve(responseDeleteEntity)

            // clear old values
            dispatch('clearPersistenceQueue', {
              containerUuid,
              recordUuid
            })
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    /**
     * Delete Entity table
     * @param {string} parentUuid
     * @param {string} containerUuid
     * TODO: Add suport to uuid list
     */
    deleteSelectedRecordsFromWindow({
      dispatch,
      getters
    }, {
      parentUuid,
      containerUuid
    }) {
      const tableName = getters.getTableName(parentUuid, containerUuid)
      const selectionsList = getters.getTabSelectionsList({ containerUuid })
      const listRecordId = selectionsList.map(list => list[tableName + '_ID'])

      showMessage({
        message: language.t('table.dataTable.deleteSelection'),
        type: 'info'
      })
      return new Promise((resolve, reject) => {
        deleteEntity({
          tableName,
          listRecordId
        })
          .then(async(response) => {
            showMessage({
              message: language.t('notifications.succesful'),
              type: 'success'
            })
            await dispatch('getEntities', {
              parentUuid,
              containerUuid
            })
            resolve(response)
          })
          .catch(error => {
            showMessage({
              message: language.t('notifications.error'),
              type: 'error'
            })
            reject(error)
          })
      })
    },

    /**
     * Update Row of Table in Windows
     * @param {string} containerUuid
     * @param {object} row
     * @returns
     */
    updateRowTableWindows({ commit, dispatch, getters }, {
      parentUuid,
      containerUuid,
      recordUuid,
      attributesList
    }) {
      const persistenceAttributesList = getters.getPersistenceAttributesChanges({
        parentUuid,
        containerUuid,
        recordUuid
      })
      if (isEmptyValue(persistenceAttributesList)) return
      attributesList = persistenceAttributesList.map(record => {
        const { columnName, oldValue } = record
        return {
          columnName,
          oldValue,
          value: oldValue
        }
      })
      return new Promise((resolve, reject) => {
        updateEntity({
          tabUuid: containerUuid,
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
            // refresh records
            dispatch('getEntities', {
              parentUuid,
              containerUuid
            })

            resolve(response)
          })
          .catch(error => {
            console.warn(`Error Update Records of Windows Table: ${error.message}. Code: ${error.code}.`)
            showMessage({
              message: language.t('notifications.error'),
              type: 'error'
            })
            reject(error)
          })
      })
    },

    clearTabData({ commit, rootGetters }, {
      parentUuid,
      containerUuid
    }) {
      // clear only this tab
      if (!isEmptyValue(containerUuid)) {
        commit('clearTabData', {
          containerUuid
        })
        return
      }

      // clear all tabs
      const { tabsList } = rootGetters.getStoredWindow(parentUuid)
      tabsList.forEach(tab => {
        commit('clearTabData', {
          containerUuid: tab.uuid
        })
      })
    },
    reloadTableData({ commit, getters }, {
      containerUuid,
      isLoaded
    }) {
      // clear only this tab
      const {
        contextKey,
        searchValue,
        recordCount,
        recordsList,
        selectionsList,
        currentRecordUuid,
        pageNumber,
        pageSize
      } = getters.getTabData({
        containerUuid
      })
      commit('setTabData', {
        containerUuid,
        contextKey,
        searchValue,
        recordCount,
        recordsList,
        selectionsList,
        currentRecordUuid,
        pageNumber,
        isLoaded,
        pageSize
      })
    }
  },

  getters: {
    /**
     * Used by result in tab
     * @param {string} containerUuid
     */
    getTabData: (state) => ({ containerUuid }) => {
      return state.tabData[containerUuid] || {
        ...state.emtpyTabData,
        containerUuid
      }
    },
    getTabOldData: (state) => ({ containerUuid }) => {
      return state.oldTabData[containerUuid] || {
        ...state.emtpyTabData,
        containerUuid
      }
    },
    getIsLoadedTabRecord: (state, getters) => ({ containerUuid }) => {
      return getters.getTabData({
        containerUuid
      }).isLoaded || false
    },
    getIsLoadedTabOldRecord: (state, getters) => ({ containerUuid }) => {
      return getters.getTabOldData({
        containerUuid
      }).isLoaded || false
    },
    getTabContextKey: (state, getters) => ({ containerUuid }) => {
      return getters.getTabData({
        containerUuid
      }).contextKey || ''
    },
    getTabOldContextKey: (state, getters) => ({ containerUuid }) => {
      return getters.getTabOldData({
        containerUuid
      }).contextKey || ''
    },
    getSearchValueTabRecordsList: (state, getters) => ({ containerUuid }) => {
      return getters.getTabData({
        containerUuid
      }).searchValue || ''
    },
    getTabRecordCount: (state, getters) => ({ containerUuid }) => {
      return getters.getTabData({ containerUuid }).recordCount
    },
    getTabRecordsList: (state, getters) => ({ containerUuid }) => {
      return getters.getTabData({ containerUuid }).recordsList
    },
    getTabSelectionsList: (state, getters) => ({ containerUuid }) => {
      return getters.getTabData({ containerUuid }).selectionsList
    },
    getTabPageNumber: (state, getters) => ({ containerUuid }) => {
      return getters.getTabData({ containerUuid }).pageNumber
    },
    getTabPageSize: (state, getters) => ({ containerUuid }) => {
      return getters.getTabData({ containerUuid }).pageSize
    },
    getTabCurrentRow: (state, getters, rootState, rootGetters) => ({ containerUuid }) => {
      // get current record uuid with container uuid
      const recordUuid = getters.getUuidOfContainer(containerUuid)
      if (isEmptyValue(recordUuid)) {
        return rootGetters.getValuesView({
          containerUuid,
          format: 'object'
        })
      }
      // get row with record uuid
      return getters.getTabRowData({ containerUuid, recordUuid })
    },
    getTabRowData: (state, getters) => ({ containerUuid, recordUuid, rowIndex }) => {
      const recordsList = getters.getTabRecordsList({ containerUuid })
      if (isEmptyValue(recordsList)) {
        return {}
      }

      if (!isEmptyValue(rowIndex)) {
        return recordsList[rowIndex]
      }

      return recordsList.find(itemData => {
        return itemData.UUID === recordUuid
      }) || {}
    },
    getTabCellData: (state, getters) => ({ containerUuid, recordUuid, rowIndex, columnName }) => {
      const recordsList = getters.getTabRecordsList({ containerUuid })

      let row = {}
      if (!isEmptyValue(rowIndex)) {
        row = recordsList[rowIndex]
      }

      if (isEmptyValue(row) && !isEmptyValue(recordUuid)) {
        row = recordsList.find(itemData => {
          if (itemData.UUID === recordUuid) {
            return true
          }
        })
      }

      if (!isEmptyValue(row)) {
        return row[columnName]
      }
      return undefined
    },
    getTabRowIndex: (state, getters) => ({ containerUuid, recordUuid }) => {
      if (isEmptyValue(recordUuid)) {
        return 0
      }
      const recordsList = getters.getTabRecordsList({ containerUuid })
      const rowIndex = recordsList.findIndex(row => {
        return row.UUID === recordUuid
      })
      return rowIndex
    },

    getTabDataFilters: (state, getters) => ({ parentUuid, containerUuid }) => {
      const panelAdvancedQuery = getters.getStoredTab(
        parentUuid + IS_ADVANCED_QUERY,
        containerUuid + IS_ADVANCED_QUERY
      )
      if (isEmptyValue(panelAdvancedQuery)) {
        // without filters on advanced query
        return []
      }

      const filters = {}
      const fieldsList = panelAdvancedQuery.fieldsList.filter(field => {
        // hidden of search criteria
        return field.isShowedFromUser
      })
      fieldsList.forEach(field => {
        // default operator
        const { columnName, operator, valueType } = field

        let value, valueTo, values

        const contextValue = getters.getValueOfFieldOnContainer({
          containerUuid: containerUuid + IS_ADVANCED_QUERY,
          columnName: columnName
        })
        if (!IGNORE_VALUE_OPERATORS_LIST.includes(operator)) {
          if (isEmptyValue(contextValue)) {
            return
          }
          // TODO: Improve conditions
          if (FIELDS_DATE.includes(field.displayType)) {
            if (MULTIPLE_VALUES_OPERATORS_LIST.includes(operator)) {
              values = contextValue
            } else if (RANGE_VALUE_OPERATORS_LIST.includes(operator)) {
              if (Array.isArray(contextValue)) {
                value = contextValue.at(0)
                valueTo = contextValue.at(1)
              } else {
                value = contextValue
                valueTo = getters.getValueOfFieldOnContainer({
                  containerUuid: containerUuid + IS_ADVANCED_QUERY,
                  columnName: field.columnNameTo
                })
              }
            } else {
              value = contextValue
            }
          } else {
            if (Array.isArray(contextValue)) {
              values = contextValue
            } else {
              value = contextValue
            }
          }
        }

        filters[columnName] = {
          ...filters[columnName] || {},
          columnName,
          operator,
          value,
          valueTo,
          values,
          valueType
        }
      })

      return Object.values(filters)
    },

    getCurrentRecordOnPanel: (state, getters) => (containerUuid) => {
      return getters.getTabData({
        containerUuid
      }).currentRecordUuid
    },
    getOldRecordOnPanel: (state, getters) => (containerUuid) => {
      return getters.getTabOldData({
        containerUuid
      }).currentRecordUuid
    }
  }
}

export default windowManager
