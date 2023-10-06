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

// Get Instance for connection
import { request } from '@/utils/ADempiere/request'

/**
 * Request a process
 * This function allows follow structure:
 * @param {string}  id, identifier from process to run
 * @param {string}  uuid, uuid from process to run
 * @param {string}  tableName, table name of tab, used only window
 * @param {number}  recordId, record identifier, used only window
 * @param {string}  recordUuid, record universal unique identifier, used only window
 * @param {array}   parametersList, parameters from process [{ columnName, value }]
 * @param {array}   selectionsList, selection records, used only browser
      [{
          selectionId,
          selectionValues: [{ columnName, value }]
      }]
 * @param {number}  tableSelectedId, used only browser // TODO: Add support on adempiere-vue
 */
export function requestRunProcess({
  id,
  uuid,
  parametersList = [],
  // window
  tableName,
  recordId,
  recordUuid,
  // browse
  browserId,
  selectionsList = []
}) {
  parametersList = parametersList.map(parameter => {
    return {
      key: parameter.columnName,
      value: parameter.value
    }
  })

  return request({
    url: '/common/api/process',
    method: 'post',
    data: {
      id,
      uuid,
      parameters: parametersList,
      //
      table_name: tableName,
      record_id: recordId,
      record_uuid: recordUuid,
      //
      browser_id: browserId,
      selections: selectionsList
    }
  })
    .then(processRunResponse => {
      const { convertProcessLog } = require('@/utils/ADempiere/apiConverts/process.js')

      return convertProcessLog(processRunResponse)
    })
}
