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

import { computed } from '@vue/composition-api'

import store from '@/store'

import useFieldDefinition from '@/components/ADempiere/FieldDefinition/useFieldDefinition.js'

// Constants
import {
  DISPLAY_COLUMN_PREFIX,
  UNIVERSALLY_UNIQUE_IDENTIFIER_COLUMN_SUFFIX
} from '@/utils/ADempiere/dictionaryUtils'

// Utils and Helpers Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

export default ({ fieldMetadata, containerManager }) => {
  const {
    value,
    storedDefaultValue
  } = useFieldDefinition({
    fieldMetadata,
    containerManager
  })

  const displayedValue = computed({
    get() {
      // if (isEmptyValue(value.value)) {
      //   return undefined
      // }
      const currenStoredDefaultValue = storedDefaultValue.value
      if (!isEmptyValue(currenStoredDefaultValue)) {
        if (!isEmptyValue(currenStoredDefaultValue.displayedValue)) {
          return currenStoredDefaultValue.displayedValue
        }
      }

      // DisplayColumn_'ColumnName'
      const { displayColumnName: columnName, containerUuid, inTable } = fieldMetadata
      // table records values
      if (inTable) {
        // implement container manager row
        if (containerManager && containerManager.getCell) {
          const currentValue = containerManager.getCell({
            containerUuid,
            rowIndex: fieldMetadata.rowIndex,
            columnName
          })
          if (!isEmptyValue(currentValue)) {
            return currentValue
          }
        }
      }

      // return store.getters.getValueOfFieldOnContainer({
      //   parentUuid: fieldMetadata.parentUuid,
      //   containerUuid,
      //   columnName
      // })
      return store.getters.getValueOfField({
        // parentUuid: fieldMetadata.parentUuid,
        containerUuid,
        columnName
      })
    },
    set(newValue) {
      const { displayColumnName, containerUuid, inTable } = fieldMetadata

      // table records values
      if (inTable) {
        // implement container manager row
        if (containerManager && containerManager.setCell) {
          containerManager.setCell({
            containerUuid,
            rowIndex: fieldMetadata.rowIndex,
            columnName: displayColumnName,
            value: newValue
          })
        }
      }

      store.commit('updateValueOfField', {
        parentUuid: fieldMetadata.parentUuid,
        containerUuid,
        // DisplayColumn_'ColumnName'
        columnName: displayColumnName,
        value: newValue
      })
      // update element column name
      if (!fieldMetadata.isSameColumnElement) {
        store.commit('updateValueOfField', {
          parentUuid: fieldMetadata.parentUuid,
          containerUuid,
          columnName: DISPLAY_COLUMN_PREFIX + fieldMetadata.elementName,
          value: newValue
        })
      }
    }
  })

  const uuidValue = computed({
    get() {
      return store.getters.getValueOfFieldOnContainer({
        parentUuid: fieldMetadata.parentUuid,
        containerUuid: fieldMetadata.containerUuid,
        // 'ColumnName'_UUID
        columnName: fieldMetadata.columnName + UNIVERSALLY_UNIQUE_IDENTIFIER_COLUMN_SUFFIX
      })
    },
    set(value) {
      const { parentUuid, containerUuid } = fieldMetadata

      store.commit('updateValueOfField', {
        parentUuid,
        containerUuid,
        // 'ColumnName'_UUID
        columnName: fieldMetadata.columnName + UNIVERSALLY_UNIQUE_IDENTIFIER_COLUMN_SUFFIX,
        value
      })
      // update element column name
      if (!fieldMetadata.isSameColumnElement) {
        store.commit('updateValueOfField', {
          parentUuid,
          containerUuid,
          columnName: fieldMetadata.elementName + UNIVERSALLY_UNIQUE_IDENTIFIER_COLUMN_SUFFIX,
          value
        })
      }
    }
  })
  // // created hook
  // if (fieldMetadata.isGetServerValue && isEmptyValue(value.value)) {
  //   setDefaultValue()

  //   // change depends fields
  //   // preHandleChange(value)
  //   activeLogics()
  // }

  return {
    // computeds
    uuidValue,
    value,
    displayedValue,
    storedDefaultValue
  }
}
