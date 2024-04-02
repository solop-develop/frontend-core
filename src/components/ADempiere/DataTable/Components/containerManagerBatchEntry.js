/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 * Contributor(s): Elsio Sanchez elsiosanches@gmail.com https://github.com/elsiosanchez
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

// Utils and Helpers Methods
// import { isHiddenField } from '@/utils/ADempiere/references'

export function getLookupList({ parentUuid, containerUuid, contextColumnNames, columnName, tableName, searchValue, isAddBlankValue, referenceUuid, blankValue }) {
  return store.dispatch('getLookupListFromServer', {
    parentUuid,
    containerUuid,
    contextColumnNames,
    tableName,
    columnName,
    searchValue,
    referenceUuid,
    // app attributes
    isAddBlankValue,
    blankValue
  })
}

export function changeFieldShowedFromUser({ containerUuid, fieldsShowed }) {
  store.dispatch('changeBrowserFieldShowedFromUser', {
    containerUuid,
    fieldsShowed
  })
}

export function isMandatoryField({ is_mandatory, isMandatoryFromLogic }) {
  return is_mandatory || isMandatoryFromLogic
}

export function isDisplayedField({ is_quick_entry, display_type, is_displayed, isDisplayedFromLogic }) {
  // button field not showed
  // if (isHiddenField(display_type)) {
  //   return false
  // }
  // verify if field is active
  return is_displayed && is_quick_entry
}

export function isDisplayedDefault({ isMandatory }) {
  return true
}

export function isReadOnlyField({ is_query_criteria, isReadOnlyFromLogic }) {
  return is_query_criteria && isReadOnlyFromLogic
}

export function getSearchRecordsList({
  containerUuid,
  contextColumnNames,
  filters,
  id,
  searchValue,
  tableName,
  columnName,
  pageNumber
}) {
  return store.dispatch('getSearchRecordsFromServer', {
    containerUuid,
    contextColumnNames,
    filters,
    // fieldId: id,
    searchValue,
    tableName,
    columnName,
    pageNumber
  })
}
