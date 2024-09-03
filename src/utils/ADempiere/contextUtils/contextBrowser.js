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

import fieldList from '@/components/ADempiere/Form/VMatch/fieldList'
import store from '@/store'

// Constants
import {
  RECORD_ID,
  IS_SO_TRX
} from '@/utils/ADempiere/constants/systemColumns'
import {
  containerManager as CONTAINER_MANAGER_BROWSER
} from '@/utils/ADempiere/dictionary/browser'

// Utils and Helpers Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { isSalesTransaction } from '@/utils/ADempiere/contextUtils'
import { getContextAttributes } from '@/utils/ADempiere/contextUtils/contextAttributes'

export function copyWindowContextOnBrowser({
  browserUuid,
  fieldsList = [],
  windowUuid,
  tabUuid
}) {
  // set parent context
  if (isEmptyValue(windowUuid) || isEmptyValue(tabUuid)) {
    return
  }

  const storedTab = store.getters.getStoredTab(windowUuid, tabUuid)
  if (isEmptyValue(storedTab)) {
    return
  }
  const { keyColumn, table, parent_column_name, link_column_name } = storedTab
  const { key_columns } = table

  let relatedColumns = key_columns
  // TODO: Validate element columns
  const parentColumns = storedTab.fieldsList
    .filter(fieldItem => {
      return fieldItem.is_parent || fieldItem.is_key || fieldItem.is_mandatory
    })
    .map(fieldItem => {
      return fieldItem.column_name
    })

  if (!isEmptyValue(parent_column_name)) {
    relatedColumns.push(parent_column_name)
  }
  if (!isEmptyValue(link_column_name)) {
    relatedColumns.push(link_column_name)
  }
  relatedColumns = relatedColumns.concat(parentColumns).sort()

  // set context values
  const parentValues = getContextAttributes({
    parentUuid: windowUuid,
    containerUuid: tabUuid,
    contextColumnNames: relatedColumns
  })

  // Set Record ID
  const recordId = store.getters.getValueOfField({
    parentUuid: windowUuid,
    containerUuid: tabUuid,
    columnName: keyColumn
  })
  if (!isEmptyValue(recordId)) {
    parentValues.push({
      columnName: RECORD_ID,
      value: recordId
    })
  }

  // Always set Is Sales Transaction by window
  const isSOTrx = isSalesTransaction({
    parentUuid: windowUuid,
    containerUuid: tabUuid,
    isRecord: true
  })
  parentValues.push({
    columnName: IS_SO_TRX,
    value: isSOTrx
  })

  store.dispatch('updateValuesOfContainer', {
    containerUuid: browserUuid,
    attributes: parentValues
  })

  const tabContext = store.getters.getValuesView({
    parentUuid: windowUuid,
    containerUuid: tabUuid,
    format: 'object'
  })
  store.dispatch('updateValuesOfContainer', {
    containerUuid: browserUuid,
    attributes: tabContext
  })

  if (isEmptyValue(fieldList)) {
    fieldsList = store.getters.getStoredFieldsFromBrowser(browserUuid)
  }

  fieldsList.forEach(itemField => {
    const {
      isSameColumnElement, column_name, element_name, default_value, default_value_to
    } = itemField

    // no set value by window
    if (isEmptyValue(default_value) && isEmptyValue(default_value_to)) {
      return
    }

    if (!isSameColumnElement) {
      const currentContextValue = tabContext[element_name]
      if (!isEmptyValue(currentContextValue)) {
        store.commit('updateValueOfField', {
          containerUuid: browserUuid,
          columnName: element_name,
          value: currentContextValue
        })
        store.commit('updateValueOfField', {
          containerUuid: browserUuid,
          columnName: column_name,
          value: currentContextValue
        })
      }
      // change Dependents
      store.dispatch('changeDependentFieldsList', {
        field: itemField,
        containerManager: CONTAINER_MANAGER_BROWSER
      })
    }
  })
}
