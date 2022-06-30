// ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
// Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
// Contributor(s): Edwin Betancourt EdwinBetanc0urt@outlook.com www.erpya.com
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
import router from '@/router'

// api request methods
import {
  getEntities
} from '@/api/ADempiere/user-interface/persistence.js'
import {
  deleteEntity
} from '@/api/ADempiere/common/persistence.js'

// constants
import { UUID } from '@/utils/ADempiere/constants/systemColumns'
import { ROW_ATTRIBUTES } from '@/utils/ADempiere/constants/table'

// utils and helper methods
import { containerManager } from '@/utils/ADempiere/dictionary/window'
import { getContextAttributes } from '@/utils/ADempiere/contextUtils.js'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import { convertObjectToKeyValue } from '@/utils/ADempiere/valueFormat'
import { showMessage } from '@/utils/ADempiere/notification'
import { generatePageToken } from '@/utils/ADempiere/dataUtils'

const initState = {
  tabData: {},
  // container uuid: record uuid
  currentRecordOnPanel: {}
}

const windowManager = {
  state: initState,

  mutations: {
    setTabData(state, {
      parentUuid,
      containerUuid,
      searchValue = '',
      recordsList = [],
      selectionsList = [],
      nextPageToken,
      recordCount = 0,
      isLoaded = true,
      isLoadedContext = false,
      pageNumber = 1
    }) {
      const dataTab = {
        parentUuid,
        containerUuid,
        searchValue,
        recordsList,
        selectionsList,
        nextPageToken,
        recordCount,
        isLoaded,
        isLoadedContext,
        pageNumber
      }
      Vue.set(state.tabData, containerUuid, dataTab)
    },

    setTabRow(state, { containerUuid, row, index }) {
      const recordsList = state.tabData[containerUuid].recordsList
      if (!isEmptyValue(index)) {
        recordsList.splice(index, 0, row)
      } else {
        recordsList.unshift(row)
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
      Vue.set(state.currentRecordOnPanel, containerUuid, recordUuid)
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
      filters = [],
      pageNumber
    }) {
      return new Promise(resolve => {
        const storedPage = getters.getTabPageNumber({
          containerUuid
        })
        if (isEmptyValue(pageNumber)) {
          // refresh with same page
          pageNumber = storedPage
        }

        if (!isEmptyValue(filters)) {
          const parseFilter = JSON.parse(filters)
          filters = [parseFilter]
        }

        const currentPageNumber = pageNumber
        const pageToken = generatePageToken({ pageNumber })

        if (isEmptyValue(searchValue)) {
          searchValue = getters.getSearchValueTabRecordsList({
            containerUuid
          })
        }

        const {
          contextColumnNames, name, linkColumnName,
          parentColumnName, fieldsList
        } = rootGetters.getStoredTab(parentUuid, containerUuid)

        // add filters with link column name and parent column name
        if (!isEmptyValue(linkColumnName) &&
          !contextColumnNames.includes(linkColumnName) &&
          !filters.some(filter => filter.columnName === linkColumnName)) {
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
        if (!isEmptyValue(parentColumnName) &&
          !contextColumnNames.includes(parentColumnName &&
          !filters.some(filter => filter.columnName === parentColumnName))) {
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
          keyName: 'key'
        })

        const isWithoutValues = contextAttributesList.find(attribute => isEmptyValue(attribute.value))
        if (isWithoutValues) {
          console.warn(`Get entites without response, fill the **${isWithoutValues.key}** field in **${name}** tab.`)
          resolve([])
          return
        }
        commit('setTabData', {
          parentUuid,
          isLoaded: false,
          containerUuid
        })

        const currentRoute = router.app._route
        getEntities({
          windowUuid: parentUuid,
          tabUuid: containerUuid,
          contextAttributesList,
          searchValue,
          filters,
          pageToken
        })
          .then(dataResponse => {
            const dataToStored = dataResponse.recordsList.map((record, rowIndex) => {
              return {
                ...record.attributes,
                // datatables app attributes
                ...ROW_ATTRIBUTES,
                rowIndex
              }
            })

            // update current record
            if (!isEmptyValue(dataToStored)) {
              let currentRow = dataToStored.at(0) // set first record
              const recordUuid = rootGetters.getUuidOfContainer(containerUuid)
              if (!isEmptyValue(recordUuid) && storedPage === pageNumber) {
                const recordFromUuid = dataToStored.find(record => record[UUID] === recordUuid)
                if (!isEmptyValue(recordFromUuid)) {
                  currentRow = recordFromUuid
                }
              }

              // remove datatables app attributes
              for (const key in ROW_ATTRIBUTES) {
                delete currentRow[key]
              }

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
                attributes
              })

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
              dispatch('setTabDefaultValues', {
                parentUuid,
                containerUuid
              })
            }

            commit('setTabData', {
              parentUuid,
              containerUuid,
              searchValue,
              recordsList: dataToStored,
              nextPageToken: dataResponse.nextPageToken,
              pageNumber: currentPageNumber,
              isLoaded: true,
              recordCount: dataResponse.recordCount
            })

            resolve(dataToStored)
          })
          .catch(error => {
            console.warn(`Error get entites`, error.message)
            commit('setTabData', {
              parentUuid,
              isLoaded: true,
              containerUuid
            })
            resolve([])
          })
      })
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
    }
  },

  getters: {
    /**
     * Used by result in tab
     * @param {string} containerUuid
     */
    getTabData: (state) => ({ containerUuid }) => {
      return state.tabData[containerUuid] || {
        parentUuid: undefined,
        containerUuid,
        searchValue: '',
        recordsList: [],
        selectionsList: [],
        nextPageToken: undefined,
        recordCount: 0,
        isLoadedContext: false,
        pageNumber: 1,
        isLoaded: false
      }
    },
    getIsLoadedTabRecord: (state, getters) => ({ containerUuid }) => {
      return getters.getTabData({
        containerUuid
      }).isLoaded || false
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
    getTabPageToken: (state, getters) => ({ containerUuid }) => {
      return getters.getTabData({ containerUuid }).nextPageToken
    },
    getTabRowData: (state, getters) => ({ containerUuid, recordUuid, rowIndex }) => {
      const recordsList = getters.getTabRecordsList({ containerUuid })
      if (!isEmptyValue(rowIndex)) {
        return recordsList[rowIndex]
      }

      if (!isEmptyValue(recordUuid)) {
        return recordsList.find(itemData => {
          return itemData.UUID === recordUuid
        })
      }
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

    getCurrentRecordOnPanel: (state) => (containerUuid) => {
      return state.currentRecordOnPanel[containerUuid]
    }
  }
}

export default windowManager
