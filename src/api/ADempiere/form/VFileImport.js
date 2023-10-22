/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 * Contributor(s): Elsio Sanchez elsiosanchez15@outlook.com https://github.com/elsiosanchez
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

import { request } from '@/utils/ADempiere/request'

export function requestListCharsets({
  searchValue,
  pageToken,
  pageSize = 250
}) {
  return request({
    url: '/import-file-loader/charsets',
    method: 'get',
    params: {
      page_size: pageSize,
      page_token: pageToken,
      //  DSL Query
      search_value: searchValue
    }
  })
}

export function requestListImportTables() {
  return request({
    url: '/import-file-loader/tables',
    method: 'get'
  })
}

export function requestImportFormatsList({
  tableName
}) {
  return request({
    url: `/import-file-loader/formats/${tableName}`,
    method: 'get'
  })
}

export function requestGetImportFormat({
  id
}) {
  return request({
    url: `/import-file-loader/formats/get/${id}`,
    method: 'get'
  })
}

export function requestListImportProcesses({
  tableName
}) {
  return request({
    url: `/import-file-loader/processes/${tableName}`,
    method: 'get'
  })
}

export function saveRecordImport({
  id: resourceId,
  charset,
  importFormatId,
  isProcess,
  processId,
  parameters
}) {
  return request({
    url: `/import-file-loader/imports/${importFormatId}/${resourceId}`,
    method: 'post',
    data: {
      charset,
      is_process: isProcess,
      process_id: processId,
      parameters
    }
  })
}

export function requestListFilePreview({
  charset,
  resourceId,
  importFormatId
}) {
  return request({
    url: `/import-file-loader/imports/${importFormatId}/${resourceId}/preview`,
    method: 'get',
    params: {
      charset
    }
  })
}
