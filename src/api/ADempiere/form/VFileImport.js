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
import { camelizeObjectKeys } from '@/utils/ADempiere/transformObject.js'

export function listCharsets({
  searchValue,
  pageToken,
  pageSize = 250
}) {
  return request({
    url: '/form/addons/import-file-loader/list-charsets',
    method: 'get',
    params: {
      page_size: pageSize,
      page_token: pageToken,
      //  DSL Query
      search_value: searchValue
    }
  })
    .then(response => {
      return camelizeObjectKeys(response)
    })
}

export function listImportFormats({
  searchValue,
  pageToken,
  id,
  pageSize = 250
}) {
  return request({
    url: '/form/addons/import-file-loader/list-import-formats',
    method: 'get',
    params: {
      page_size: pageSize,
      page_token: pageToken,
      table_id: id,
      //  DSL Query
      search_value: searchValue
    }
  })
    .then(response => {
      return camelizeObjectKeys(response)
    })
}

export function getImportFormats({
  id
}) {
  return request({
    url: '/form/addons/import-file-loader/get-import-formats',
    method: 'get',
    params: {
      id
    }
  })
    .then(response => {
      return camelizeObjectKeys(response)
    })
}

export function getListImportTables() {
  return request({
    url: '/form/addons/import-file-loader/list-import-tables',
    method: 'get'
  })
    .then(response => {
      return camelizeObjectKeys(response)
    })
}

export function listImportProcess({
  tableName
}) {
  return request({
    url: '/form/addons/import-file-loader/list-import-processes',
    method: 'get',
    params: {
      table_name: tableName
    }
  })
    .then(response => {
      return camelizeObjectKeys(response)
    })
}

export function saveRecordImport({
  id,
  charset,
  isProcess,
  processId,
  importFormatId
}) {
  return request({
    url: '/form/addons/import-file-loader/save-records',
    method: 'post',
    data: {
      charset,
      resource_id: id,
      is_process: isProcess,
      process_id: processId,
      import_format_id: importFormatId
    }
  })
    .then(response => {
      return camelizeObjectKeys(response)
    })
}

export function requestListFilePreview({
  charset,
  resourceId,
  importFormatId
}) {
  return request({
    url: '/form/addons/import-file-loader/list-file-preview',
    method: 'get',
    params: {
      import_format_id: importFormatId,
      resource_id: resourceId,
      charset
    }
  })
    .then(response => {
      return camelizeObjectKeys(response)
    })
}
