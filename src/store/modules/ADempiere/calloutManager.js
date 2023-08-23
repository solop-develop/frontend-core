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

import lang from '@/lang'

// API Request Methods
import { runCallOutRequest } from '@/api/ADempiere/window'

// Constants
import { ROW_ATTRIBUTES } from '@/utils/ADempiere/tableUtils'
import { DISPLAY_COLUMN_PREFIX, UNIVERSALLY_UNIQUE_IDENTIFIER_COLUMN_SUFFIX } from '@/utils/ADempiere/dictionaryUtils'
import { TABLE } from '@/utils/ADempiere/references'

// Utils and Helper Methods
import { isEmptyValue, isSameValues } from '@/utils/ADempiere/valueUtils'
import { showMessage } from '@/utils/ADempiere/notification'
import { convertObjectToKeyValue } from '@/utils/ADempiere/formatValue/iterableFormat'
import { isNumber } from '@/utils/ADempiere/formatValue/numberFormat'
// import { isIntegerDisplayType } from '@/utils/ADempiere/references'

const calloutManager = {
  actions: {
    startCallout({ commit, dispatch, rootGetters }, {
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

        const { fieldsList, isParentTab, firstTabUuid } = rootGetters.getStoredTab(parentUuid, containerUuid)
        let fieldsListParent = []
        if (!isParentTab && !isEmptyValue(firstTabUuid)) {
          fieldsListParent = rootGetters.getStoredFieldsFromTab(parentUuid, firstTabUuid)
        }

        // const window = rootGetters.getStoredWindow(parentUuid)
        const contextAttributesList = rootGetters.getValuesView({
          parentUuid,
          containerUuid
        }).filter(attribute => {
          const { columnName } = attribute
          return !isEmptyValue(attribute.value) &&
            !columnName.startsWith(DISPLAY_COLUMN_PREFIX) &&
            !columnName.endsWith(UNIVERSALLY_UNIQUE_IDENTIFIER_COLUMN_SUFFIX) &&
            !Object.prototype.hasOwnProperty.call(ROW_ATTRIBUTES, columnName)
        }).map(attribute => {
          const { columnName, value } = attribute
          let valueType = 'UNKNOWN'

          const field = fieldsList.find(fieldItem => fieldItem.columnName === columnName)
          let displayType = null
          if (!isEmptyValue(field)) {
            valueType = field.valueType
            displayType = field.displayType
          } else {
            // find on parent tab (first tab)
            const parentField = fieldsListParent.find(fieldItem => fieldItem.columnName === columnName)
            if (!isEmptyValue(parentField)) {
              valueType = parentField.valueType
              displayType = parentField.displayType
            }
          }
          if (!isEmptyValue(displayType) && displayType === TABLE.id) {
            // if (!isEmptyValue(displayType) && isIntegerDisplayType(displayType)) {
            // AD_Language = 'en_US' and table
            if (!isNumber(value)) {
              valueType = 'STRING'
            }
          }

          return {
            key: columnName,
            value: {
              value,
              valueType
            }
          }
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

            resolve(values)

            const attributesList = convertObjectToKeyValue({
              object: values
            })

            const recordUuid = rootGetters.getUuidOfContainer(containerUuid)
            attributesList.forEach(attribute => {
              const { value, columnName } = attribute

              const oldValue = rootGetters.getValueOfFieldOnContainer({
                parentUuid,
                containerUuid,
                columnName
              })

              // add changes to send
              if (!isSameValues(value, oldValue)) {
                const field = fieldsList.find(fieldItem => fieldItem.columnName === columnName)
                if (!isEmptyValue(field)) {
                  commit('addChangeToPersistenceQueue', {
                    containerUuid,
                    recordUuid,
                    columnName,
                    oldValue,
                    value
                  })
                }
              }
            })

            dispatch('updateValuesOfContainer', {
              parentUuid,
              containerUuid,
              attributes: attributesList,
              isOverWriteParent: isParentTab
            })

            // set values on table
            const rowIndex = rootGetters.getTabRowIndex({
              containerUuid,
              recordUuid
            })
            const currentRow = rootGetters.getTabRowData({
              containerUuid,
              recordUuid
            })
            commit('setTabRow', {
              containerUuid,
              recordUuid,
              rowIndex,
              row: {
                ...ROW_ATTRIBUTES,
                ...currentRow,
                ...values
              }
            })
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
  }
}

export default calloutManager
