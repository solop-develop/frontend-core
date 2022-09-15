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

import store from '@/store'

import { isHiddenField } from '@/utils/ADempiere/references'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

export function getLookupList({ parentUuid, containerUuid, referenceUuid, uuid, columnUuid, searchValue }) {
  return store.dispatch('getLookupListFromServer', {
    parentUuid,
    containerUuid,
    referenceUuid,
    fieldUuid: uuid,
    columnUuid,
    searchValue
  })
}

/**
 * Dispatch to chagne displayed field on panel/table
 * @param {string} containerUuid
 * @param {array} fieldsShowed
 */
export function changeFieldShowedFromUser({ containerUuid, fieldsShowed = [] }) {
  // to forms usupported
}

/**
 * Is displayed field
 * @param {number} displayType
 * @param {boolean} isActive
 * @param {boolean} isDisplayed
 * @param {string} displayLogic
 * @param {boolean} isDisplayedFromLogic
 * @returns {boolean}
 */
export function isDisplayedField({ displayType, isActive, isDisplayed, displayLogic, isDisplayedFromLogic }) {
  // fields not showed
  if (isHiddenField(displayType)) {
    return false
  }

  // verify if field is active and displayed
  return isActive && isDisplayed && (isEmptyValue(displayLogic) || isDisplayedFromLogic)
}

export function isDisplayedDefault({ isMandatory }) {
  return true
}

/**
 * Manager mandatory logic
 * @param {boolean} isActive
 * @param {boolean} isMandatory
 * @param {string} mandatoryLogic
 * @param {boolean} isMandatoryFromLogic
 * @returns {boolean}
 */
export function isMandatoryField({ isActive, isMandatory, mandatoryLogic, isMandatoryFromLogic }) {
  // verify if field is active and displayed
  return isActive && (isMandatory ||
    (!isEmptyValue(mandatoryLogic) && isMandatoryFromLogic))
}

/**
 * Is read only field
 * @param {boolean} isActive
 * @param {boolean} isReadOnly
 * @param {string} readOnlyLogic
 * @param {boolean} isReadOnlyFromLogic
 * @returns {boolean}
 */
export function isReadOnlyField({ isActive, isReadOnly, readOnlyLogic, isReadOnlyFromLogic }) {
  return isActive && (isReadOnly ||
    (!isEmptyValue(readOnlyLogic) && isReadOnlyFromLogic))
}

/**
 * Is read only column
 * @param {boolean} isActive
 * @returns {boolean}
 */
export function isReadOnlyColumn({ isActive }) {
  return true
}

export const containerManager = {
  changeFieldShowedFromUser,
  isDisplayedField,
  isDisplayedDefault,

  isMandatoryField,

  isReadOnlyField,

  isReadOnlyColumn,

  getLookupList,

  seekRecord({ parentUuid, containerUuid, row }) {
  }
}
