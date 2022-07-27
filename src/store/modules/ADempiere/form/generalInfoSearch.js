/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 // Contributor(s): Elsio Sanchez elsiosanchez@gmail.com https://github.com/elsiosanchez
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
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import Vue from 'vue'

// api request methods
import { tableSearchFields, gridGeneralInfo } from '@/api/ADempiere/field/search'
import { camelizeObjectKeys } from '@/utils/ADempiere/transformObject.js'

// utils and helper methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { showMessage } from '@/utils/ADempiere/notification'
import { generatePageToken } from '@/utils/ADempiere/dataUtils'

const initState = {
  businessPartnerPopoverList: false,
  // container uuid: record uuid
  emtpyBusinessPartnerData: {
    parentUuid: undefined,
    containerUuid: undefined,
    contextKey: '',
    searchValue: '',
    currentRecordUuid: undefined,
    recordsList: [],
    selectionsList: [],
    nextPageToken: undefined,
    recordCount: 0,
    isLoaded: false,
    show: false,
    list: [],
    pageNumber: 1
  },
  generalInfoSearch: {},
  tableHeaderList: [],
  fileListIdentifier: [],
  generalInfoShow: {}
}

const generalInfoSearch = {
  state: initState,

  mutations: {
    setGeneralInfoData(state, {
      containerUuid,
      currentRow = {},
      recordsList = [],
      nextPageToken,
      recordCount = 0,
      isLoaded = true,
      show = false,
      pageNumber = 1
    }) {
      Vue.set(state.generalInfoSearch, containerUuid, {
        containerUuid,
        currentRow,
        recordsList,
        show,
        nextPageToken,
        recordCount,
        isLoaded,
        pageNumber
      })
    },
    setGeneralInfoSelectedRow(state, {
      containerUuid,
      currentRow = {}
    }) {
      Vue.set(state.generalInfoSearch[containerUuid], 'currentRow', currentRow)
    },

    setGeneralInfoShow(state, {
      containerUuid,
      show = false
    }) {
      Vue.set(state.generalInfoShow, containerUuid, show)
    },

    setTableHeader(state, {
      containerUuid,
      list = []
    }) {
      Vue.set(state.tableHeaderList, containerUuid, list)
    },

    setIdentifier(state, {
      containerUuid,
      list = []
    }) {
      Vue.set(state.fileListIdentifier, containerUuid, list)
    }
  },

  actions: {
    findGeneralInfo({ commit, getters, dispatch }, {
      containerUuid,
      contextAttributesList,
      parametersList,
      fieldUuid,
      processParameterUuid,
      browseFieldUuid,
      id,
      //
      referenceUuid,
      searchValue,
      //
      tableName,
      columnName,
      columnUuid,
      //
      pageToken,
      pageSize,
      pageNumber
    }) {
      return new Promise(resolve => {
        if (isEmptyValue(pageNumber) || pageNumber < 1) {
          const storedPage = getters.getGeneralInfoPageNumber({
            containerUuid
          })
          // refresh with same page
          pageNumber = storedPage
        }
        const pageToken = generatePageToken({ pageNumber })

        return gridGeneralInfo({
          contextAttributesList,
          parametersList,
          fieldUuid,
          processParameterUuid,
          browseFieldUuid,
          id,
          //
          referenceUuid,
          searchValue,
          //
          tableName,
          columnName,
          columnUuid,
          //
          pageToken,
          pageSize
        })
          .then(response => {
            dispatch('searchTableHeader', {
              containerUuid,
              tableName
            })
            let recordsList = []
            if (response.recordsList) {
              recordsList = response.recordsList.map(list => list.attributes)
            }

            let currentRow = {}
            // update current record
            if (!isEmptyValue(recordsList)) {
              // set first record
              currentRow = recordsList.at(0)
            }

            commit('setGeneralInfoData', {
              containerUuid,
              currentRow,
              recordsList,
              nextPageToken: response.nextPageToken,
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
          })
      })
    },

    searchTableHeader({ commit }, {
      containerUuid,
      tableName,
      fieldList = [],
      listHeard = []
    }) {
      // return new Promise(resolve => {
      return tableSearchFields({
        tableName
      })
        .then(response => {
          if (response.records.length > 0) {
            response.records.forEach(field => {
              if (field.display_type === 10) {
                const { columnName, elementColumnName = columnName, identifierSequence, displayType, sequence } = camelizeObjectKeys(field)
                fieldList.push({
                  elementColumnName,
                  columnName,
                  tableName,
                  isFromDictionary: false,
                  overwriteDefinition: {
                    identifierSequence,
                    displayType,
                    sequence
                  }
                })
              }
            })
            commit('setIdentifier', {
              containerUuid,
              list: fieldList
            })
          }
          const { convertField } = require('@/utils/ADempiere/apiConverts/field.js')
          if (response.records.length > 0) {
            listHeard = response.records.map(heard => convertField(heard))
          }
          commit('setTableHeader', {
            containerUuid,
            list: listHeard
          })
          return fieldList
        })
        .catch(error => {
          console.warn(error)
          showMessage({
            type: 'info',
            message: error.message
          })
        })
      // })
    }
  },
  getters: {
    /**
    * Used by result in Business Partner List
    * @param {string} containerUuid
    */
    getGeneralInfoData: (state) => ({ containerUuid }) => {
      return state.generalInfoSearch[containerUuid] || {
        ...state.emtpyBusinessPartnerData,
        containerUuid
      }
    },
    // getIsLoadedBusinessPartnerRecord: (state, getters) => ({ containerUuid }) => {
    //   return getters.getGeneralInfoData({
    //     containerUuid
    //   }).isLoaded
    // },
    getGeneralInfoRecordsList: (state, getters) => ({ containerUuid }) => {
      return getters.getGeneralInfoData({
        containerUuid
      }).recordsList
    },
    getGeneralInfoCount: (state, getters) => ({ containerUuid }) => {
      return getters.getGeneralInfoData({
        containerUuid
      }).recordCount
    },
    getGeneralInfoPageNumber: (state, getters) => ({ containerUuid }) => {
      return getters.getGeneralInfoData({
        containerUuid
      }).pageNumber
    },
    getGeneralInfoCurrentRow: (state, getters) => ({ containerUuid }) => {
      return getters.getGeneralInfoData({
        containerUuid
      }).currentRow
    },
    getGeneralInfoShow: (state) => ({ containerUuid }) => {
      return state.generalInfoShow[containerUuid]
    },
    getTableHeader: (state) => ({ containerUuid }) => {
      return state.tableHeaderList[containerUuid]
    },
    getIdentifier: (state) => ({ containerUuid }) => {
      return state.fileListIdentifier[containerUuid]
    }
  }
}

export default generalInfoSearch
