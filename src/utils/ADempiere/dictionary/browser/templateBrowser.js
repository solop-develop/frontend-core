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

export function templateBrowser(browser) {
  if (isEmptyValue(browser)) {
    return {}
  }
  const {
    fields,
    table_name,
    internal_id,
    context_column_names
  } = browser
  return {
    ...browser,
    fields: fields,
    id: internal_id,
    tableName: table_name,
    contextColumnNames: context_column_names
  }
}

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
    context_column_names
  } = field
  return {
    ...field,
    isAdvancedQuery: false,
    isActive: true,
    columnName: column_name,
    displayType: display_type,
    isDisplayed: true,
    isMandatory: is_mandatory,
    default_value: default_value,
    default_value_to: default_value_to,
    isQueryCriteria: is_query_criteria,
    elementColumnName: element_column_name,
    contextColumnNames: context_column_names
    // reference: {
    //   tableName: '',
    //   contextColumnNames: context_column_names
    // }
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
    context_column_names
  } = itemTab
  return {
    id,
    name,
    uuid,
    table_name,
    tableName: table_name,
    sequence,
    tabLevel: tab_level,
    contextColumnNames: context_column_names
  }
}
