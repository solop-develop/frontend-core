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

// API Request Methods
import {
  requestBrowserSearch,
  browserExportRequest,
  updateBrowserEntity,
  requestDeleteBrowser
} from '@/api/ADempiere/user-interface/browser'

// Constants
import {
  ROW_ATTRIBUTES, ROW_KEY_ATTRIBUTES, ROWS_OF_RECORDS_BY_PAGE
} from '@/utils/ADempiere/tableUtils'
import {
  DISPLAY_COLUMN_PREFIX, SORT_COLUMN_PREFIX
} from '@/utils/ADempiere/dictionaryUtils'

// Utils and Helper Methods
import { isEmptyValue, getTypeOfValue } from '@/utils/ADempiere/valueUtils'
import { getContextAttributes } from '@/utils/ADempiere/contextUtils/contextAttributes'
import { showMessage, showNotification } from '@/utils/ADempiere/notification'
import { isReadOnlyColumn, containerManager } from '@/utils/ADempiere/dictionary/browser'
import { generatePageToken } from '@/utils/ADempiere/dataUtils'
import { getUuidv4 } from '@/utils/ADempiere/recordUtil'
import { isDateField, isDecimalField } from '@/utils/ADempiere/references'

const initState = {
  browserData: {}
}

const browserControl = {
  state: initState,

  mutations: {
    setBrowserData(state, {
      containerUuid,
      recordsList = [],
      nextPageToken,
      recordCount = 0,
      isLoaded = true,
      isLoadedContext = false,
      selectionsList = [],
      pageNumber = 1,
      pageSize = ROWS_OF_RECORDS_BY_PAGE
    }) {
      const dataBrowser = {
        containerUuid,
        recordsList,
        pageNumber,
        nextPageToken,
        isLoaded,
        isLoadedContext,
        recordCount,
        selectionsList,
        pageSize
      }
      Vue.set(state.browserData, containerUuid, dataBrowser)
    },

    clearBrowserData(state, { containerUuid }) {
      Vue.set(state.browserData, containerUuid, undefined)
    },

    setBrowserSelectionsList(state, {
      containerUuid,
      selectionsList
    }) {
      Vue.set(state.browserData[containerUuid], 'selectionsList', selectionsList)
    },

    setBrowserRow(state, {
      containerUuid,
      rowUid,
      row
    }) {
      let recordIndex = -1
      const newIndex = state.browserData[containerUuid].recordsList.findIndex(rowItem => {
        return rowItem.rowUid === rowUid
      })
      if (newIndex >= 0) {
        recordIndex = newIndex
      }
      Vue.set(state.browserData[containerUuid].recordsList, recordIndex, row)
    },

    setBrowserCell(state, {
      containerUuid,
      rowUid,
      columnName,
      value
    }) {
      let recordIndex = -1
      const newIndex = state.browserData[containerUuid].recordsList.findIndex(rowItem => {
        return rowItem.rowUid === rowUid
      })
      if (newIndex >= 0) {
        recordIndex = newIndex
      }
      Vue.set(state.browserData[containerUuid].recordsList[recordIndex], columnName, value)

      // TODO: Change selection columns
      // const selectionIndex = state.browserData[containerUuid].selectionsList.findIndex(rowItem => {
      //   return rowItem.rowUid === rowUid
      // })
      // if (selectionIndex >= 0) {
      //   Vue.set(state.browserData[containerUuid].selectionsList[selectionIndex], columnName, value)
      // }
    },

    resetStateBrowserManager(state) {
      state = initState
    }
  },

  actions: {
    browserActionPerformed({ dispatch, getters }, {
      containerUuid,
      field,
      value,
      valueTo
    }) {
      return new Promise(resolve => {
        const fieldsList = getters.getStoredFieldsFromBrowser(containerUuid)

        // change Dependents
        dispatch('changeDependentFieldsList', {
          field,
          fieldsList,
          containerManager: containerManager
        }).then(() => {
          if (field.is_info_only) {
            // omit search
            resolve()
            return
          }
          // Validate if a field is mandatory and visible
          dispatch('getBrowserSearch', {
            containerUuid,
            isClearSelection: true
          })
          resolve()
        })
      })
    },

    // Search with query criteria
    getBrowserSearch({ commit, getters, rootGetters }, {
      containerUuid,
      pageNumber,
      pageSize,
      isClearSelection = false
    }) {
      return new Promise(resolve => {
        const currentRecordsList = getters.getBrowserRecordsList({
          containerUuid
        })

        const {
          id, fieldsList, contextColumnNames
        } = rootGetters.getStoredBrowser(containerUuid)
        if (isEmptyValue(id) && isEmptyValue(fieldsList) && isEmptyValue(contextColumnNames)) {
          resolve(currentRecordsList)
          return
        }

        const fieldsEmpty = rootGetters.getBrowserFieldsEmptyMandatory({
          containerUuid,
          fieldsList
        })
        if (!isEmptyValue(fieldsEmpty)) {
          showMessage({
            message: language.t('notifications.mandatoryFieldMissing') + fieldsEmpty,
            type: 'info'
          })
          resolve(currentRecordsList)
          return
        }

        // parameters Query Criteria
        const queryCriteriaFilters = rootGetters.getBrowserQueryCriteria({
          containerUuid,
          fieldsList
        })
        const filtersList = queryCriteriaFilters.map(parameter => {
          const {
            columnName,
            operator,
            value,
            valueTo,
            values
          } = parameter
          return JSON.stringify({
            name: columnName,
            operator,
            // values > value, valueTo > value
            values: !isEmptyValue(values) ? values : !isEmptyValue(valueTo) ? [value, valueTo] : value
          })
        }).toString()
        let filters
        if (!isEmptyValue(filtersList)) {
          filters = '[' + filtersList + ']'
        }

        // get context values
        const contextAttributesList = getContextAttributes({
          containerUuid,
          contextColumnNames,
          format: 'object'
        })
        let contextAttributes = '{}'
        if (!isEmptyValue(contextAttributesList)) {
          contextAttributes = JSON.stringify(contextAttributesList)
        }

        // const isWithoutValues = contextAttributesList.find(attribute => isEmptyValue(attribute.value))
        // if (isWithoutValues) {
        //   console.warn(`Without response, fill the ${isWithoutValues.columnName} field.`)
        //   showMessage({
        //     message: language.t('notifications.mandatoryFieldMissing') + isWithoutValues.columnName,
        //     type: 'info'
        //   })
        //   resolve(currentRecordsList)
        //   return
        // }
        // page size
        const storedSize = getters.getBrowserPageSize({
          containerUuid
        })
        const preferencePageSize = getters.getPreference
        if (isEmptyValue(pageSize) && (!isEmptyValue(storedSize) || !isEmptyValue(preferencePageSize))) {
          if (!isEmptyValue(preferencePageSize) && !isEmptyValue(preferencePageSize.value)) {
            pageSize = preferencePageSize.value
          } else {
            pageSize = storedSize
          }
        }
        commit('setBrowserData', {
          containerUuid,
          isLoaded: false,
          pageSize
        })

        showMessage({
          title: language.t('notifications.loading'),
          message: language.t('notifications.searching'),
          type: 'info'
        })
        if (isEmptyValue(pageNumber) || pageNumber < 1) {
          // refresh with same page
          const storedPage = getters.getBrowserPageNumber({
            containerUuid
          })
          // refresh with same page
          pageNumber = storedPage
        }
        const pageToken = generatePageToken({ pageNumber })

        requestBrowserSearch({
          id,
          contextAttributes,
          filters,
          pageToken,
          pageSize
        })
          .then(browserSearchResponse => {
            const recordsList = browserSearchResponse.records.map((record, rowIndex) => {
              const { values } = record

              // TODO: Test peformance.
              Object.keys(values).forEach(key => {
                const currentValue = values[key]
                if (key.startsWith(DISPLAY_COLUMN_PREFIX)) {
                  // Add column with sort values to correct sorting
                  let sortValue = ''
                  if (!isEmptyValue(currentValue)) {
                    sortValue = currentValue.toLowerCase()
                  }
                  values[SORT_COLUMN_PREFIX + key] = sortValue
                }
              })

              return {
                ...values,
                // datatables app attributes
                ...ROW_ATTRIBUTES,
                rowIndex,
                rowUid: getUuidv4()
              }
            })

            commit('setBrowserData', {
              containerUuid,
              recordsList,
              recordCount: browserSearchResponse.record_count,
              nextPageToken: browserSearchResponse.next_page_token,
              pageNumber,
              pageSize,
              isLoaded: true
            })

            showMessage({
              title: language.t('notifications.succesful'),
              message: language.t('notifications.succcessSearch'),
              type: 'success'
            })

            resolve(recordsList)
          })
          .catch(error => {
            // Set default registry values so that the table does not say loading,
            // there was already a response from the server
            commit('setBrowserData', {
              containerUuid,
              isLoaded: true
            })
            resolve([])

            showMessage({
              title: language.t('notifications.error'),
              message: language.t('notifications.errorSearch'),
              summary: error.message,
              type: 'error'
            })
            console.warn(`Error getting browser search: ${error.message}. Code: ${error.code}.`)
          })
      })
    },

    // Search with query criteria
    getBrowserExportRecords({ commit, getters, rootGetters }, {
      containerUuid
    }) {
      return new Promise(resolve => {
        const currentRecordsList = getters.getBrowserRecordsList({
          containerUuid
        })

        const {
          id, fieldsList, contextColumnNames
        } = rootGetters.getStoredBrowser(containerUuid)
        if (isEmptyValue(id) && isEmptyValue(fieldsList) && isEmptyValue(contextColumnNames)) {
          resolve(currentRecordsList)
          return
        }

        const fieldsEmpty = rootGetters.getBrowserFieldsEmptyMandatory({
          containerUuid,
          fieldsList
        })
        if (!isEmptyValue(fieldsEmpty)) {
          showMessage({
            message: language.t('notifications.mandatoryFieldMissing') + fieldsEmpty,
            type: 'info'
          })
          resolve(currentRecordsList)
          return
        }

        // parameters Query Criteria
        const queryCriteriaFilters = rootGetters.getBrowserQueryCriteria({
          containerUuid,
          fieldsList
        })
        const filtersList = queryCriteriaFilters.map(parameter => {
          const {
            columnName,
            operator,
            value,
            valueTo,
            values
          } = parameter
          return JSON.stringify({
            name: columnName,
            operator,
            // values > value, valueTo > value
            values: !isEmptyValue(values) ? values : !isEmptyValue(valueTo) ? [value, valueTo] : value
          })
        }).toString()
        let filters
        if (!isEmptyValue(filtersList)) {
          filters = '[' + filtersList + ']'
        }

        // get context values
        const contextAttributesList = getContextAttributes({
          containerUuid,
          contextColumnNames,
          format: 'object'
        })
        let contextAttributes = '{}'
        if (!isEmptyValue(contextAttributesList)) {
          contextAttributes = JSON.stringify(contextAttributesList)
        }

        // const isWithoutValues = contextAttributesList.find(attribute => isEmptyValue(attribute.value))
        // if (isWithoutValues) {
        //   console.warn(`Without response, fill the ${isWithoutValues.columnName} field.`)
        //   showMessage({
        //     message: language.t('notifications.mandatoryFieldMissing') + isWithoutValues.columnName,
        //     type: 'info'
        //   })
        //   resolve(currentRecordsList)
        //   return
        // }

        showMessage({
          title: language.t('notifications.loading'),
          message: language.t('notifications.searching'),
          type: 'info'
        })

        browserExportRequest({
          id,
          contextAttributes,
          filters
        })
          .then(browserExportResponse => {
            const { records, record_count } = browserExportResponse

            const recordsList = records.map((record) => {
              return {
                ...record.values
              }
            })

            resolve(recordsList)

            showNotification({
              title: language.t('smartBrowser.exportAllRecords.successful'),
              message: language.t('smartBrowser.exportAllRecords.quantityExport') + record_count,
              type: 'success'
            })
          })
          .catch(error => {
            resolve([])

            showMessage({
              title: language.t('notifications.error'),
              message: language.t('notifications.errorSearch'),
              summary: error.message,
              type: 'error'
            })
            console.warn(`Error getting browser search: ${error.message}. Code: ${error.code}.`)
          })
      })
    },

    updateRecordOfBrowser({ dispatch, getters }, {
      containerUuid,
      row
    }) {
      const { uuid, id, keyColumn, fieldsList } = getters.getStoredBrowser(containerUuid)

      const recordId = row[keyColumn]

      const attributesList = getters.getBrowserRowToServer({
        containerUuid,
        row,
        keyName: 'key',
        fieldsList,
        type: 'object'
      })

      return new Promise((resolve) => {
        updateBrowserEntity({
          uuid,
          id,
          recordId,
          attributesList
        })
          .then(response => {
            showMessage({
              message: language.t('recordManager.updatedRecord'),
              type: 'success'
            })

            // refresh records
            // dispatch('getBrowserSearch', {
            //   containerUuid
            // })

            resolve(response)
          })
          .catch(error => {
            console.warn(`Error Update Records of Smart Browser: ${error.message}. Code: ${error.code}.`)
            showNotification({
              title: language.t('notifications.error'),
              message: error.message,
              type: 'error'
            })
            showMessage(error)
          })
      })
    },

    deleteRecordOfBrowser({ dispatch, getters }, {
      containerUuid,
      selection
    }) {
      const { tableName, keyColumn } = getters.getStoredBrowser(containerUuid)
      const listRecordId = selection.map(list => list[keyColumn])

      showNotification({
        title: language.t('actionMenu.delete'),
        message: language.t('actionMenu.delete'),
        summary: language.t('data.noDescription'),
        type: 'info'
      })
      return new Promise((resolve, reject) => {
        requestDeleteBrowser({
          tableName,
          listRecordId
        })
          .then(async(response) => {
            showNotification({
              title: language.t('notifications.succesful'),
              message: response,
              type: 'success'
            })
            await dispatch('getBrowserSearch', {
              containerUuid
            })
            resolve(response)
          })
          .catch(error => {
            showNotification({
              title: language.t('notifications.error'),
              message: error.message,
              type: 'error'
            })
            console.warn(`Error Delete Records of Smart Browser: ${error.message}. Code: ${error.code}.`)
            reject(error)
          })
      })
    },

    clearBrowserData({ commit }, {
      containerUuid
    }) {
      // clear data on this browser
      commit('clearBrowserData', {
        containerUuid
      })
    }
  },

  getters: {
    /**
     * Used by result in browser
     * @param {string} containerUuid
     */
    getBrowserData: (state, getters) => (containerUuid) => {
      return state.browserData[containerUuid] || {
        containerUuid,
        recordsList: [],
        nextPageToken: undefined,
        recordCount: 0,
        isLoadedContext: false,
        selectionsList: [],
        pageNumber: 1,
        pageSize: 15,
        isLoaded: false
      }
    },
    getBrowserRecordsList: (state, getters) => ({ containerUuid }) => {
      return getters.getBrowserData(containerUuid).recordsList
    },
    getBrowserIsLoadedRecordsList: (state, getters) => ({ containerUuid }) => {
      return state.browserData[containerUuid].isLoaded
    },
    getBrowserSelectionsList: (state, getters) => ({ containerUuid }) => {
      return getters.getBrowserData(containerUuid).selectionsList
    },
    getBrowserPageNumber: (state, getters) => ({ containerUuid }) => {
      return getters.getBrowserData(containerUuid).pageNumber
    },
    getBrowserPageSize: (state, getters) => ({ containerUuid }) => {
      return getters.getBrowserData(containerUuid).pageSize
    },
    getBrowserRecordCount: (state, getters) => ({ containerUuid }) => {
      return getters.getBrowserData(containerUuid).recordCount
    },
    getBrowserPageToken: (state, getters) => ({ containerUuid }) => {
      return getters.getBrowserData(containerUuid).nextPageToken
    },
    getBrowserRowData: (state, getters) => ({ containerUuid, rowUid }) => {
      const recordsList = getters.getBrowserRecordsList({
        containerUuid
      })

      let recordIndex = -1
      const newIndex = recordsList.findIndex(rowItem => {
        return rowItem.rowUid === rowUid
      })
      if (newIndex >= 0) {
        recordIndex = newIndex
      }
      return recordsList[recordIndex]
    },
    getBrowserCellData: (state, getters) => ({ containerUuid, rowUid, columnName }) => {
      const row = getters.getBrowserRowData({
        containerUuid,
        rowUid
      })
      if (!isEmptyValue(row)) {
        return row[columnName]
      }
      return undefined
    },

    getBrowserRowToServer: (state, getter, rootState, rootGetters) => ({
      containerUuid,
      row,
      fieldsList = [],
      keyName = 'columnName',
      type = 'array'
    }) => {
      if (isEmptyValue(fieldsList)) {
        fieldsList = rootGetters.getStoredFieldsFromBrowser(containerUuid)
      }
      const attributesList = []
      const attributesObject = {}
      fieldsList.filter(itemField => {
        return !isReadOnlyColumn(itemField)
      }).forEach(itemField => {
        const { columnName } = itemField
        attributesObject[columnName] = row[columnName]
        attributesList.push({
          value: row[columnName],
          [keyName]: columnName
        })
      })

      if (type === 'object') return attributesObject

      return attributesList
    },

    /**
     * Getter converter selection data record in format
     * @param {string} containerUuid
     * @param {array}  selection
     * [{
     *    selectionId: keyColumn Value,
     *    values: [{ columnName, value }]
     * }]
     */
    getBrowserSelectionToServer: (state, getters, rootState, rootGetters) => ({
      containerUuid,
      selectionsList = []
    }) => {
      const selectionToServer = []

      if (isEmptyValue(selectionsList)) {
        selectionsList = getters.getBrowserSelectionsList({
          containerUuid
        })
      }

      if (isEmptyValue(selectionsList)) {
        return selectionToServer
      }

      const { fieldsList, keyColumn } = rootGetters.getStoredBrowser(containerUuid)

      // reduce list
      const fieldsListSelection = fieldsList
        .filter(itemField => {
          return itemField.is_key || itemField.is_identifier || !isReadOnlyColumn(itemField)
        })
        .map(itemField => {
          return {
            columnName: itemField.columnName,
            display_type: itemField.display_type
          }
        })

      selectionsList.forEach(itemRow => {
        const attributesList = {}

        Object.keys(itemRow).forEach(columnName => {
          if (!columnName.startsWith(DISPLAY_COLUMN_PREFIX) && !ROW_KEY_ATTRIBUTES.includes(columnName)) {
            const currentField = fieldsListSelection.find(itemField => {
              return itemField.columnName === columnName
            })
            // evaluate metadata attributes before to convert
            if (!isEmptyValue(currentField)) {
              const value = itemRow[columnName]
              let serverValue = value
              // types `decimal` and `date` is a object struct
              if (getTypeOfValue(value) !== 'OBJECT' || isEmptyValue(value.type)) {
                if (isDateField(currentField.display_type)) {
                  serverValue = {
                    type: 'date',
                    value: value
                  }
                } else if (isDecimalField(currentField.display_type)) {
                  serverValue = {
                    type: 'decimal',
                    value: value
                  }
                }
              }
              attributesList[columnName] = serverValue
            }
          }
        })

        selectionToServer.push({
          selectionId: itemRow[keyColumn],
          values: attributesList
        })
      })

      return selectionToServer
    }
  }
}

export default browserControl
