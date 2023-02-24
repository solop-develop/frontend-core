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

/**
 * Row default app attributes
 */
export const ROW_ATTRIBUTES = {
  // indicate if is new record (add mew row)
  isNewRow: false,
  // indicate if is edit record to render fields
  isEditRow: false,
  // indicate if is selected record to manage
  isSelectedRow: false,
  // row index to fast manager
  rowIndex: 0,
  // indicate if is read only row (same isReadOnlyForm)
  isReadOnlyFromRow: false
}

/**
 * Row table key name attributes
 * not to send to the server
 */
export const ROW_KEY_ATTRIBUTES = Object.keys(ROW_ATTRIBUTES)

/**
 * Rows of records number by page
 * As pageSize on backend
 */
export const ROWS_OF_RECORDS_BY_PAGE = 15

/**
 * Number of records list per page
 * Default 15
 */
export const NUMBER_RECORDS_PER_PAGE = [
  ROWS_OF_RECORDS_BY_PAGE,
  25, 50, 100
]

/**
 * Generate index to element-ui table
 * @link https://element.eleme.cn/#/es/component/table#indice-personalizado
 * @param {number} indexRow current index of row
 * @param {number} pageSize records by page
 * @param {number} pageNumber page of pagination
 * @returns {number} current index
 */
export function indexRowByPage({
  indexRow,
  pageSize = ROWS_OF_RECORDS_BY_PAGE,
  pageNumber = 1
}) {
  return (pageNumber - 1) * pageSize + (indexRow + 1)
}

export function totalRowByPage({
  pageSize = ROWS_OF_RECORDS_BY_PAGE,
  pageNumber = 1
}) {
  console.log(pageSize, pageNumber)
  return (pageSize * pageNumber)
}
