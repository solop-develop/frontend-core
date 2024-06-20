/**
* ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
* Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
* Contributor(s): Elsio Sanchez elsiosanchez@gmail.com https://github.com/elsiosanchez
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

// Constants
import {
  DISPLAY_COLUMN_PREFIX,
  UNIVERSALLY_UNIQUE_IDENTIFIER_COLUMN_SUFFIX
} from '@/utils/ADempiere/dictionaryUtils'

export default ({
  parentUuid,
  containerUuid,
  containerManager,
  fieldAttributes
}) => {
  const blankValues = computed(() => {
    return {
      [fieldAttributes.columnName]: undefined,
      [fieldAttributes.element_name]: undefined,
      [DISPLAY_COLUMN_PREFIX + fieldAttributes.columnName]: undefined,
      [DISPLAY_COLUMN_PREFIX + fieldAttributes.element_name]: undefined,
      id: undefined,
      uuid: undefined,
      UUID: undefined,
      description: undefined
    }
  })

  const productId = computed(() => {
    return store.getters.getValueOfField({
      containerUuid,
      columnName: 'M_Product_ID'
    })
  })

  function close(row) {
    store.commit('setShowProductAttribute', false)
  }

  function clearValues() {
    setValues(
      blankValues.value
    )
  }

  function setValues(row) {
    const { id, uuid, description } = row

    const { parentUuid, containerUuid, column_name } = fieldAttributes

    store.commit('updateValueOfField', {
      parentUuid,
      containerUuid,
      columnName: column_name,
      value: id
    })
    // set display column (name) value
    store.commit('updateValueOfField', {
      parentUuid,
      containerUuid,
      // DisplayColumn_'ColumnName'
      columnName: DISPLAY_COLUMN_PREFIX + column_name,
      value: description
    })
    // set UUID value
    store.commit('updateValueOfField', {
      parentUuid,
      containerUuid,
      columnName: column_name + UNIVERSALLY_UNIQUE_IDENTIFIER_COLUMN_SUFFIX,
      value: uuid
    })
    // update element column name
    if (!fieldAttributes.isSameColumnElement) {
      store.commit('updateValueOfField', {
        parentUuid,
        containerUuid,
        columnName: fieldAttributes.element_name,
        value: id
      })
      // set display column (name) value
      store.commit('updateValueOfField', {
        parentUuid,
        containerUuid,
        // DisplayColumn_'ColumnName'
        columnName: DISPLAY_COLUMN_PREFIX + fieldAttributes.element_name,
        value: description
      })
    }

    // implement container manager row
    if (fieldAttributes.inTable) {
      containerManager.setCell({
        containerUuid,
        rowIndex: fieldAttributes.rowIndex,
        columnName: column_name,
        value: id
      })
      containerManager.setCell({
        containerUuid,
        rowIndex: fieldAttributes.rowIndex,
        columnName: DISPLAY_COLUMN_PREFIX + column_name,
        value: description
      })
      return
    }

    store.dispatch('notifyFieldChange', {
      containerUuid,
      containerManager,
      field: fieldAttributes,
      columnName: column_name
    })
  }

  return {
    blankValues,
    productId,
    clearValues,
    close,
    setValues
  }
}
