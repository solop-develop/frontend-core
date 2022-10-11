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
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import lang from '@/lang'

import { runCallOutRequest } from '@/api/ADempiere/window'

// utils and helper methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { showMessage } from '@/utils/ADempiere/notification'
import { convertObjectToKeyValue } from '@/utils/ADempiere/formatValue/iterableFormat'
import { DISPLAY_COLUMN_PREFIX, UNIVERSALLY_UNIQUE_IDENTIFIER_COLUMN_SUFFIX } from '@/utils/ADempiere/dictionaryUtils'
// import { containerManager } from '@/utils/ADempiere/dictionary/window'

const initState = {
  calloutManager: {}
}

const calloutManager = {
  state: initState,

  mutations: {
    resetStateCalloutManager(state) {
      state = initState
    }
  },

  actions: {
    startCallout({ dispatch, rootGetters }, {
      parentUuid,
      containerUuid,
      callout,
      tableName,
      columnName,
      valueType,
      value,
      oldValue
    }) {
      return new Promise((resolve, reject) => {
        // validate callout
        if (isEmptyValue(callout)) {
          resolve({})
          return
        }

        // const window = rootGetters.getStoredWindow(parentUuid)
        const contextAttributesList = rootGetters.getValuesView({
          parentUuid,
          containerUuid
        }).filter(attribute => {
          return !isEmptyValue(attribute.value) &&
            !attribute.columnName.startsWith(DISPLAY_COLUMN_PREFIX) &&
            !attribute.columnName.endsWith(UNIVERSALLY_UNIQUE_IDENTIFIER_COLUMN_SUFFIX)
        })

        runCallOutRequest({
          windowUuid: parentUuid,
          // windowNo: window.windowIndex,
          tabUuid: containerUuid,
          callout,
          tableName,
          columnName,
          value,
          oldValue,
          valueType,
          contextAttributesList
        })
          .then(calloutResponse => {
            const { values } = calloutResponse
            // if (inTable) {
            //   const newValues = {
            //     ...row,
            //     ...calloutResponse.values
            //   }
            //   dispatch('notifyRowTableChange', {
            //     parentUuid,
            //     containerUuid,
            //     row: newValues,
            //     isEdit: true
            //   })
            // } else {
            //   dispatch('notifyPanelChange', {
            //     parentUuid,
            //     containerUuid,
            //     panelType: 'window',
            //     newValues: calloutResponse.values,
            //     isSendToServer: false,
            //     withOutColumnNames,
            //     isSendCallout: false,
            //     isChangeFromCallout: true
            //   })
            // }
            resolve(values)

            const attributesList = convertObjectToKeyValue({
              object: values
            })

            dispatch('updateValuesOfContainer', {
              parentUuid,
              containerUuid,
              attributes: attributesList
            })

            // attributesList.forEach(attributeItem => {
            //   dispatch('notifyFieldChange', {
            //     parentUuid,
            //     containerUuid,
            //     containerManager,
            //     columnName: attributeItem.columnName,
            //     newValue: attributeItem.value
            //   })
            // })
          })
          .catch(error => {
            reject(error)
            showMessage({
              message: error.message || lang.t('window.callout.error'),
              type: 'error'
            })
            console.warn(`Field ${columnName} error callout. Code ${error.code}: ${error.message}`)
          })
      })
    }
  },

  getters: {
    getCalloutManager: (state) => {
      return state.calloutManager
    }
  }
}

export default calloutManager
