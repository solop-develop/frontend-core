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
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

export const WORKFLOW_EDITOR_FORM = 'WFPanel'

export const TABLE_NAME = 'AD_Workflow'

export const COLUMN_NAME = 'AD_Workflow_ID'

export const FIELDS_LIST_DEFINITION = [
  // Workflow List
  {
    tableName: TABLE_NAME,
    columnName: COLUMN_NAME,
    isFromDictionary: true,
    overwriteDefinition: {
      size: 24,
      sequence: 10,
      // cssClassName: 'price-inquiry',
      // inputSize: 'large',
      // handleFocusGained: true,
      // handleFocusLost: true,
      // handleActionKeyPerformed: true,
      isDisplayed: true,
      isReadOnly: false
      // componentPath: 'FieldSelect'
    }
  }
]
