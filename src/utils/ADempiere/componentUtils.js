// ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
// Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
// Contributor(s): Edwin Betancourt EdwinBetanc0urt@outlook.com www.erpya.com
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

/**
 * Using forms and events with the enter key prevents the page from reloading
 * with @submit.native.prevent="notSubmitForm" in el-form component
 */
export function notSubmitForm(event) {
  event.preventDefault()
  return false
}

/**
 * Max number columns per row on layout by component ui
 * https://element.eleme.io/#/es/component/layout
 */
export const LAYOUT_MAX_COLUMNS_PER_ROW = 24

/**
 * Default columns per row on layout
 */
export const DEFAULT_COLUMNS_PER_ROW = 3

/**
 * Focusable Fields List
 */

export const FOCUSABLE_FIELDS_LIST = [
  'FieldText',
  'FieldTextLong',
  'FieldNumber'
]
