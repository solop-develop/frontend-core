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
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

// Constants
import { DISPLAY_COLUMN_PREFIX } from '@/utils/ADempiere/dictionaryUtils'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'

const getters = {
  /**
   * Used by datatables in tab children, record navigation in window, result in browser
   * @param {string} containerUuid
   */
  getDataRecordAndSelection: (state, getters) => (containerUuid) => {
    return state.recordSelection.find(itemRecord => {
      return itemRecord.containerUuid === containerUuid
    }) || {
      containerUuid,
      record: [],
      recordCount: 0,
      selection: [],
      pageNumber: 1,
      nextPageToken: undefined,
      originalNextPageToken: undefined,
      isLoadedContext: false,
      isLoaded: false
    }
  },
  getDataRecordsList: (state, getters) => (containerUuid) => {
    return getters.getDataRecordAndSelection(containerUuid).record
  },
  getDataRecordSelection: (state, getters) => (containerUuid) => {
    return getters.getDataRecordAndSelection(containerUuid).selection
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
  getSelectionToServer: (state, getters, rootState, rootGetters) => ({
    containerUuid,
    selection = []
  }) => {
    const selectionToServer = []
    const withOut = ['isEdit', 'isSendToServer']

    if (isEmptyValue(selection)) {
      selection = getters.getDataRecordSelection(containerUuid)
    }

    if (isEmptyValue(selection)) {
      return selectionToServer
    }

    const { fieldsList, keyColumn } = rootGetters.getPanel(containerUuid)
    // reduce list
    const fieldsListSelection = fieldsList
      .filter(itemField => {
        return itemField.isIdentifier || itemField.isUpdateable
      })
      .map(itemField => {
        return itemField.columnName
      })

    selection.forEach(itemRow => {
      const records = []

      Object.keys(itemRow).forEach(key => {
        if (!key.startsWith(DISPLAY_COLUMN_PREFIX) && !withOut.includes(key)) {
          // evaluate metadata attributes before to convert
          if (fieldsListSelection.includes(key)) {
            records.push({
              columnName: key,
              value: itemRow[key]
            })
          }
        }
      })

      selectionToServer.push({
        selectionId: itemRow[keyColumn],
        selectionValues: records
      })
    })

    return selectionToServer
  }

}

export default getters
