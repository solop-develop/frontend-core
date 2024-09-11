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

// Utils and Helpers Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'

export function templateFields(field) {
  if (isEmptyValue(field)) return field
  const {
    column_name,
    display_type,
    is_mandatory,
    default_value,
    default_value_to,
    is_query_criteria,
    element_column_name,
    internal_id,
    context_column_names
  } = field
  return {
    ...field,
    id: internal_id,
    isDisplayed: true,
    isAdvancedQuery: false,
    columnName: column_name,
    displayType: display_type,
    isMandatory: is_mandatory,
    defaultValue: default_value,
    default_value_to: default_value_to,
    isQueryCriteria: is_query_criteria,
    elementColumnName: element_column_name,
    contextColumnNames: context_column_names
  }
}

export function convertRelationTabs(itemTab) {
  if (isEmptyValue(itemTab)) {
    return {
      id: '',
      name: '',
      uuid: '',
      tableName: '',
      sequence: 0,
      tabLevel: 0,
      contextColumnNames: []
    }
  }
  const {
    id,
    name,
    uuid,
    table_name,
    sequence,
    tab_level,
    link_column_name,
    parent_column_name
  } = itemTab
  let array_context_column_names = []
  if (!isEmptyValue(itemTab.context_column_names)) {
    array_context_column_names = itemTab.context_column_names
  }
  if (!array_context_column_names.includes(parent_column_name) && !isEmptyValue(parent_column_name)) {
    array_context_column_names.push(parent_column_name)
  }
  if (!array_context_column_names.includes(link_column_name) && !isEmptyValue(link_column_name)) {
    array_context_column_names.push(link_column_name)
  }

  return {
    ...itemTab,
    id,
    name,
    uuid,
    table_name,
    tableName: table_name,
    sequence,
    tabLevel: tab_level,
    context_column_names: array_context_column_names,
    contextColumnNames: array_context_column_names
  }
}
