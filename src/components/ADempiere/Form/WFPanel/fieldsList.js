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

import { COLUMN_NAME } from '@/utils/ADempiere/dictionary/form/workflowEditor'

export default [
  // Workflow
  {
    // elementUuid: '8cc9377e-fb40-11e8-a479-7a0060f0aa01',
    // elementColumnName: COLUMN_NAME,
    tableName: 'AD_WF_Node', // to generate lookup type and not id type
    // tableName: TABLE_NAME,
    columnName: COLUMN_NAME,
    isFromDictionary: true,
    overwriteDefinition: {
      size: 24,
      sequence: 10,
      cssClassName: 'workflow-field-select',
      isEnabledOptionsFields: true
    }
  }
]
