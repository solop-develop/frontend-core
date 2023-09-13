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

import store from '@/store'

import { computed } from '@vue/composition-api'

// Constants
import {
  DISPLAY_COLUMN_PREFIX
} from '@/utils/ADempiere/dictionaryUtils'
import { WAREHOUSE } from '@/utils/ADempiere/constants/systemColumns'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { getContextAttributes } from '@/utils/ADempiere/contextUtils/contextAttributes'
import useDisplayedColumn from '@/components/ADempiere/FieldDefinition/useDisplayedColumn.js'

export default ({
  parentUuid,
  containerUuid,
  containerManager,
  fieldAttributes
}) => {
  const {
    value,
    uuidValue,
    displayedValue
  } = useDisplayedColumn({
    containerManager,
    fieldMetadata: fieldAttributes
  })

  const blankValues = computed(() => {
    return {
      [fieldAttributes.columnName]: undefined,
      [fieldAttributes.elementName]: undefined,
      [DISPLAY_COLUMN_PREFIX + fieldAttributes.columnName]: undefined,
      [DISPLAY_COLUMN_PREFIX + fieldAttributes.elementName]: undefined,
      id: undefined,
      uuid: undefined,
      UUID: undefined,
      value: undefined
    }
  })

  const uuidForm = computed(() => {
    if (!isEmptyValue(fieldAttributes.containerUuid)) {
      return fieldAttributes.columnName + '_' + containerUuid
    }
    return 'Warehouse-Locator-Form'
  })

  const warehouseId = computed(() => {
    return store.getters.getValueOfField({
      parentUuid,
      containerUuid,
      columnName: WAREHOUSE
    })
  })

  const isShowedPopover = computed({
    get() {
      return store.getters.getWarehouseLocatorShow({
        containerUuid: uuidForm.value
      })
    },
    set(newValue) {
      store.commit('setWarehouseLocatorShow', {
        containerUuid: uuidForm.value,
        isShowed: newValue
      })
    }
  })

  const contextAttributesList = computed(() => {
    if (!isEmptyValue(fieldAttributes.reference) && !isEmptyValue(fieldAttributes.reference.contextColumnNames)) {
      return getContextAttributes({
        parentUuid,
        containerUuid,
        contextColumnNames: fieldAttributes.reference.contextColumnNames,
        keyName: 'key'
      })
    }
    return []
  })

  function close(row) {
    // store.commit('setShowProductAttribute', false)
    isShowedPopover.value = false
  }

  function clearValues() {
    setValues(
      blankValues.value
    )

    store.dispatch('clearValuesOnContainer', {
      containerUuid: uuidForm.value
    })
  }

  function setValues(row) {
    const { id, uuid, value: displayValue } = row

    // const { parentUuid, containerUuid } = fieldAttributes

    const columnName = fieldAttributes.columnName

    // set ID value
    value.value = id

    // set display column (Value) value
    displayedValue.value = displayValue

    // set UUID value
    uuidValue.value = uuid

    store.dispatch('notifyFieldChange', {
      containerUuid,
      containerManager,
      field: fieldAttributes,
      columnName
    })
  }

  return {
    blankValues,
    contextAttributesList,
    isShowedPopover,
    uuidForm,
    warehouseId,
    clearValues,
    close,
    setValues
  }
}
