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

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

export const GENERAL_INFO_SEARCH_LIST_FORM = 'General-Info-Search-List'

/**
 * Icon to search component by table name
 * @param {String} tableName
 * @returns
 */
export function iconSearchFieldByTable(tableName) {
  let icon = {
    type: 'svg',
    class: 'search'
  }
  if (isEmptyValue(tableName)) {
    return icon
  }
  switch (tableName) {
    case 'A_Asset':
      icon = {
        type: 'i',
        class: 'el-icon-office-building'
      }
      break
    case 'C_BPartner':
      icon = {
        type: 'i',
        class: 'el-icon-user-solid'
      }
      break
    case 'C_Invoice':
      icon = {
        type: 'i',
        class: 'el-icon-s-order'
      }
      break
    case 'C_CashLine':
      icon = {
        type: 'svg',
        class: 'el-icon-coin'
      }
      break
    case 'C_Order':
      icon = {
        type: 'svg',
        class: 'clipboard'
      }
      break
    case 'C_Payment':
      icon = {
        type: 'i',
        class: 'el-icon-money'
      }
      break
    case 'M_InOut':
      icon = {
        type: 'i',
        class: 'el-icon-truck'
      }
      break
    case 'M_Product':
      icon = {
        type: 'svg',
        class: 'shopping'
      }
      break
    case 'S_ResourceAssigment':
      icon = {
        type: 'i',
        class: 'el-icon-data-analysis'
      }
      break
  }

  return icon
}
