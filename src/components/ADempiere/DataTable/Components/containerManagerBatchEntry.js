/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
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
import { isHiddenField } from '@/utils/ADempiere/references'

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

export function isMandatoryField({ isMandatory, isMandatoryFromLogic }) {
  return isMandatory || isMandatoryFromLogic
}

export function isDisplayedField({ isQuickEntry, displayType, isActive, isDisplayed, isDisplayedFromLogic }) {
  // button field not showed
  if (isHiddenField(displayType)) {
    return false
  }
  // verify if field is active
  return isActive && isDisplayed && isQuickEntry
}

export function isDisplayedDefault({ isMandatory }) {
  return true
}

export function isReadOnlyField({ isQueryCriteria, isReadOnlyFromLogic }) {
  return isQueryCriteria && isReadOnlyFromLogic
}

export function generalInfoSearch({
  containerUuid,
  contextColumnNames,
  filters,
  uuid,
  searchValue,
  tableName,
  columnName,
  pageNumber
}) {
  return store.dispatch('findGeneralInfo', {
    containerUuid,
    contextColumnNames,
    filters,
    // fieldUuid: uuid,
    searchValue,
    tableName,
    columnName,
    pageNumber
  })
}
export function searchTableHeader({
  containerUuid,
  tableName
}) {
  return store.dispatch('searchTableHeader', {
    containerUuid,
    tableName
  })
}
