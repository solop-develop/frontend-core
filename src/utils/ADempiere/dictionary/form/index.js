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

import { isHiddenField } from '@/utils/ADempiere/references'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

/**
 * Prefix to generate unique key
 */
export const CONTAINER_FORM_PREFIX = 'form_'

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
 * @param {number} display_type
 * @param {boolean} is_displayed
 * @param {string} display_logic
 * @param {boolean} isDisplayedFromLogic
 * @returns {boolean}
 */
export function isDisplayedField({ display_type, is_displayed, display_logic, isDisplayedFromLogic }) {
  // fields not showed
  if (isHiddenField(display_type)) {
    return false
  }

  // verify if field is active and displayed
  return is_displayed && (isEmptyValue(display_logic) || isDisplayedFromLogic)
}

export function isDisplayedDefault({ is_mandatory }) {
  return true
}

/**
 * Manager mandatory logic
 * @param {boolean} is_mandatory
 * @param {string} mandatory_logic
 * @param {boolean} isMandatoryFromLogic
 * @returns {boolean}
 */
export function isMandatoryField({ is_mandatory, mandatory_logic, isMandatoryFromLogic }) {
  // verify if field is active and displayed
  return (is_mandatory ||
    (!isEmptyValue(mandatory_logic) && isMandatoryFromLogic))
}

/**
 * Is read only field
 * @param {boolean} is_read_only
 * @param {string} read_only_logic
 * @param {boolean} isReadOnlyFromLogic
 * @returns {boolean}
 */
export function isReadOnlyField({ is_read_only, read_only_logic, isReadOnlyFromLogic }) {
  return (is_read_only ||
    (!isEmptyValue(read_only_logic) && isReadOnlyFromLogic))
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
