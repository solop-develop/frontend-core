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

// API Request Methods
import {
  requestListAvailableWarehouses,
  requestListWarehouseLocators
} from '@/api/ADempiere/field/warehouseLocator'

// Constants
import {
  ROW_ATTRIBUTES, ROWS_OF_RECORDS_BY_PAGE
} from '@/utils/ADempiere/tableUtils'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { generatePageToken } from '@/utils/ADempiere/dataUtils'
import { getContextAttributes } from '@/utils/ADempiere/contextUtils/contextAttributes'
import { isSameSize } from '@/utils/ADempiere/formatValue/iterableFormat'
import { showMessage } from '@/utils/ADempiere/notification'

const initState = {
  warehousesList: {},
  warehouseLocatorsList: {},
  emptyWarehouseLocator: {
    parentUuid: undefined,
    containerUuid: undefined,
    warehouseId: 0,
    contextKey: '',
    searchValue: '',
    currentRecordUuid: undefined,
    currentRow: {},
    recordsList: [],
    nextPageToken: undefined,
    recordCount: 0,
    isLoaded: false,
    isShowed: false,
    pageSize: ROWS_OF_RECORDS_BY_PAGE,
    pageNumber: 1
  }
}

const warehouseLocator = {
  state: initState,

  mutations: {
    setWarehousesList(state, {
      containerUuid,
      recordsList
    }) {
      Vue.set(state.warehousesList, containerUuid, recordsList)
    },

    setWarehouseLocatorsData(state, {
      containerUuid,
      warehouseId = 0,
      searchValue = '',
      currentRow = {},
      recordsList = [],
      nextPageToken,
      recordCount = 0,
      isLoaded = true,
      isShowed = false,
      pageSize = ROWS_OF_RECORDS_BY_PAGE,
      pageNumber = 1
    }) {
      Vue.set(state.warehouseLocatorsList, containerUuid, {
        containerUuid,
        warehouseId,
        searchValue,
        currentRow,
        recordsList,
        nextPageToken,
        recordCount,
        isLoaded,
        isShowed,
        pageSize,
        pageNumber
      })
    },
    setWarehouseLocatorShow(state, {
      containerUuid,
      isShowed = false
    }) {
      if (isEmptyValue(state.warehouseLocatorsList[containerUuid])) {
        Vue.set(state.warehouseLocatorsList, containerUuid, {
          ...state.emptyWarehouseLocator,
          containerUuid
        })
      }
      Vue.set(state.warehouseLocatorsList[containerUuid], 'isShowed', isShowed)
    },
    setWarehouseLocatorSearchValue(state, {
      containerUuid,
      searchValue = ''
    }) {
      if (isEmptyValue(state.warehouseLocatorsList[containerUuid])) {
        Vue.set(state.warehouseLocatorsList, containerUuid, {
          ...state.emptyWarehouseLocator,
          containerUuid
        })
      }
      Vue.set(state.warehouseLocatorsList[containerUuid], 'searchValue', searchValue)
    },

    setWarehouseLocatorWarehouseId(state, {
      containerUuid,
      warehouseId = 0
    }) {
      if (isEmptyValue(state.warehouseLocatorsList[containerUuid])) {
        Vue.set(state.warehouseLocatorsList, containerUuid, {
          ...state.emptyWarehouseLocator,
          containerUuid
        })
      }
      Vue.set(state.warehouseLocatorsList[containerUuid], 'warehouseId', warehouseId)
    },

    resetStateWarehouseLocator(state) {
      state = initState
    }
  },

  actions: {
    listAvailableWarehouses({ commit, getters }, {
      containerUuid,
      searchValue,
      warehouseId
    }) {
      return new Promise(resolve => {
        requestListAvailableWarehouses({
          warehouseId,
          searchValue
        })
          .then(response => {
            const recordsList = response.records
            commit('setWarehousesList', {
              containerUuid,
              recordsList
            })

            resolve(recordsList)
          })
      })
    },
    listWarehouseLocators({ commit, getters }, {
      containerUuid,
      parentUuid,
      //
      searchValue,
      warehouseId,
      contextAttributesList = [],
      contextColumnNames = [],
      //
      fieldUuid,
      processParameterUuid,
      browseFieldUuid,
      //
      pageSize,
      pageNumber
    }) {
      return new Promise(resolve => {
        if (isEmptyValue(pageNumber) || pageNumber < 1) {
          const storedPage = getters.getWarehouseLocatorPageNumber({
            containerUuid
          })
          // refresh with same page
          pageNumber = storedPage
        }
        const pageToken = generatePageToken({ pageNumber })

        if (isEmptyValue(pageSize)) {
          pageSize = getters.getWarehouseLocatorPageSize({
            containerUuid
          })
          if (isEmptyValue(pageSize)) {
            pageSize = ROWS_OF_RECORDS_BY_PAGE
          }
        }

        if (isEmptyValue(contextAttributesList)) {
          contextAttributesList = getContextAttributes({
            parentUuid,
            containerUuid,
            contextColumnNames,
            isBooleanToString: true
          })
          // fill context value to continue
          if (!isSameSize(contextColumnNames, contextAttributesList)) {
            resolve([])
            return
          }
        }

        requestListWarehouseLocators({
          // filters
          warehouseId,
          contextAttributesList,
          searchValue,
          // references
          fieldUuid,
          processParameterUuid,
          browseFieldUuid,
          // pagination
          pageToken,
          pageSize,
          pageNumber
        })
          .then(response => {
            const oldData = getters.getWarehouseLocatorData({
              containerUuid
            })
            const recordsList = response.records.map((record, rowIndex) => {
              return {
                ...record,
                // datatables app attributes
                ...ROW_ATTRIBUTES,
                rowIndex
              }
            })
            let currentRow = {}
            // update current record
            if (!isEmptyValue(recordsList)) {
              // set first record
              currentRow = recordsList.at(0)
            }

            commit('setWarehouseLocatorsData', {
              ...oldData,
              containerUuid,
              searchValue,
              warehouseId,
              currentRow,
              recordsList,
              nextPageToken: response.nextPageToken,
              pageSize,
              pageNumber,
              isLoaded: true,
              recordCount: response.recordCount
            })

            resolve(recordsList)
          })
          .catch(error => {
            console.warn(error)
            showMessage({
              type: 'info',
              message: error.message
            })
            resolve([])
          })
      })
    }
  },

  getters: {
    getListAvailableWarehouses: (state) => ({
      containerUuid
    }) => {
      return state.warehousesList[containerUuid] ||
        []
    },

    /**
     * Used by result in Warehouse Locator List
     * @param {string} containerUuid
     */
    getWarehouseLocatorData: (state) => ({
      containerUuid
    }) => {
      const currentValues = state.warehouseLocatorsList[containerUuid] || {}
      return {
        ...state.emptyWarehouseLocator,
        ...currentValues,
        containerUuid
      }
    },

    getIsLoadedWarehouseLocatorRecords: (state, getters) => ({ containerUuid }) => {
      return getters.getWarehouseLocatorData({
        containerUuid
      }).isLoaded
    },
    getWarehouseLocatorRecordsList: (state, getters) => ({ containerUuid }) => {
      return getters.getWarehouseLocatorData({
        containerUuid
      }).recordsList
    },
    getWarehouseLocatorCount: (state, getters) => ({ containerUuid }) => {
      return getters.getWarehouseLocatorData({
        containerUuid
      }).recordCount
    },
    getWarehouseLocatorPageNumber: (state, getters) => ({ containerUuid }) => {
      return getters.getWarehouseLocatorData({
        containerUuid
      }).pageNumber
    },
    getWarehouseLocatorPageSize: (state, getters) => ({ containerUuid }) => {
      return getters.getWarehouseLocatorData({
        containerUuid
      }).pageSize
    },
    getWarehouseLocatorWarehouseId: (state, getters) => ({ containerUuid }) => {
      return getters.getWarehouseLocatorData({
        containerUuid
      }).warehouseId
    },
    getWarehouseLocatorCurrentRow: (state, getters) => ({ containerUuid }) => {
      return getters.getWarehouseLocatorData({
        containerUuid
      }).currentRow
    },
    getWarehouseLocatorShow: (state, getters) => ({ containerUuid }) => {
      const date = getters.getWarehouseLocatorData({
        containerUuid
      })
      return date.isShowed || false
    }
  }
}

export default warehouseLocator
