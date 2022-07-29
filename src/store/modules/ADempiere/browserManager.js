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

// api request methods
import { requestBrowserSearch, updateBrowserEntity, requestDeleteBrowser } from '@/api/ADempiere/browser'

// constants
import { ROW_ATTRIBUTES, ROW_KEY_ATTRIBUTES } from '@/utils/ADempiere/tableUtils'
import { DISPLAY_COLUMN_PREFIX } from '@/utils/ADempiere/dictionaryUtils'

// utils and helper methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { getContextAttributes } from '@/utils/ADempiere/contextUtils'
import { showMessage, showNotification } from '@/utils/ADempiere/notification'
import { isDisplayedField, isReadOnlyColumn } from '@/utils/ADempiere/dictionary/browser'
import { generatePageToken } from '@/utils/ADempiere/dataUtils'

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
      pageNumber = 1
    }) {
      const dataBrowser = {
        containerUuid,
        recordsList,
        pageNumber,
        nextPageToken,
        isLoaded,
        isLoadedContext,
        recordCount,
        selectionsList
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
      rowIndex,
      row
    }) {
      Vue.set(state.browserData[containerUuid].recordsList, rowIndex, row)
    },

    setBrowserCell(state, {
      containerUuid,
      rowIndex,
      columnName,
      value
    }) {
      Vue.set(state.browserData[containerUuid].recordsList[rowIndex], columnName, value)
      // TODO: Change selection columns
      // Vue.set(state.browserData[containerUuid].selectionsList[rowIndex], columnName, value)
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
      const fieldsList = getters.getStoredFieldsFromBrowser(containerUuid)

      const fieldsEmpty = getters.getFieldsListEmptyMandatory({
        containerUuid,
        fieldsList,
        showedMethod: isDisplayedField
      })

      if (!isEmptyValue(fieldsEmpty)) {
        showMessage({
          message: language.t('notifications.mandatoryFieldMissing') + fieldsEmpty,
          type: 'info'
        })
        return
      }

      // Validate if a field is called and visible
      if (isEmptyValue(field.dependentFieldsList)) {
        dispatch('getBrowserSearch', {
          containerUuid,
          isClearSelection: true
        })
      }
    },

    // Search with query criteria
    getBrowserSearch({ commit, getters, rootGetters }, {
      containerUuid,
      pageNumber,
      isClearSelection = false
    }) {
      return new Promise(resolve => {
        showMessage({
          title: language.t('notifications.loading'),
          message: language.t('notifications.searching'),
          type: 'info'
        })

        if (isEmptyValue(pageNumber)) {
          // refresh with same page
          pageNumber = getters.getBrowserPageNumber({
            containerUuid
          })
        }
        const pageToken = generatePageToken({ pageNumber })

        const { fieldsList, contextColumnNames } = rootGetters.getStoredBrowser(containerUuid)

        // parameters isQueryCriteria
        const parametersList = rootGetters.getBrowserQueryCriteria({
          containerUuid,
          fieldsList
        })

        // get context values
        const contextAttributesList = getContextAttributes({
          containerUuid,
          contextColumnNames
        })

        const isWithoutValues = contextAttributesList.find(attribute => isEmptyValue(attribute.value))
        if (isWithoutValues) {
          console.warn(`Without response, fill the ${isWithoutValues.columnName} field.`)
          showMessage({
            message: language.t('notifications.mandatoryFieldMissing') + isWithoutValues.columnName,
            type: 'info'
          })
          resolve([])
          return
        }
        commit('setBrowserData', {
          containerUuid,
          isLoaded: false
        })

        requestBrowserSearch({
          uuid: containerUuid,
          contextAttributesList,
          parametersList,
          nextPageToken: pageToken
        })
          .then(browserSearchResponse => {
            const recordsList = browserSearchResponse.recordsList.map((record, rowIndex) => {
              return {
                ...record.attributes,
                // datatables app attributes
                ...ROW_ATTRIBUTES,
                rowIndex
              }
            })

            commit('setBrowserData', {
              containerUuid,
              recordsList,
              recordCount: browserSearchResponse.recordCount,
              nextPageToken: browserSearchResponse.nextPageToken,
              pageNumber,
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
        fieldsList
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
    getBrowserRecordCount: (state, getters) => ({ containerUuid }) => {
      return getters.getBrowserData(containerUuid).recordCount
    },
    getBrowserPageToken: (state, getters) => ({ containerUuid }) => {
      return getters.getBrowserData(containerUuid).nextPageToken
    },
    getBrowserRowData: (state, getters) => ({ containerUuid, rowIndex }) => {
      const recordsList = getters.getBrowserRecordsList({
        containerUuid
      })
      return recordsList[rowIndex]
    },
    getBrowserCellData: (state, getters) => ({ containerUuid, rowIndex, columnName }) => {
      const recordsList = getters.getBrowserRecordsList({
        containerUuid
      })

      const row = recordsList[rowIndex]
      if (!isEmptyValue(row)) {
        return row[columnName]
      }
      return undefined
    },

    getBrowserRowToServer: (state, getter, rootState, rootGetters) => ({
      containerUuid,
      row,
      fieldsList = [],
      keyName = 'columnName'
    }) => {
      if (isEmptyValue(fieldsList)) {
        fieldsList = rootGetters.getStoredFieldsFromBrowser(containerUuid)
      }
      const attributesList = []
      fieldsList.filter(itemField => {
        return !isReadOnlyColumn(itemField)
      }).forEach(itemField => {
        const { columnName } = itemField

        attributesList.push({
          value: row[columnName],
          [keyName]: columnName
        })
      })

      return attributesList
    },

    /**
     * Getter converter selection data record in format
     * @param {string} containerUuid
     * @param {array}  selection
     * [{
     *    selectionId: keyColumn Value,
     *    selectionValues: [{ columnName, value }]
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
          return itemField.isIdentifier || itemField.isUpdateable
        })
        .map(itemField => {
          return itemField.columnName
        })

      selectionsList.forEach(itemRow => {
        const attributesList = []

        Object.keys(itemRow).forEach(columnName => {
          if (!columnName.startsWith(DISPLAY_COLUMN_PREFIX) && !ROW_KEY_ATTRIBUTES.includes(columnName)) {
            // evaluate metadata attributes before to convert
            if (fieldsListSelection.includes(columnName)) {
              attributesList.push({
                columnName,
                value: itemRow[columnName]
              })
            }
          }
        })

        selectionToServer.push({
          selectionId: itemRow[keyColumn],
          selectionValues: attributesList
        })
      })

      return selectionToServer
    }
  }
}

export default browserControl
