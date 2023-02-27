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

// Get Instance for connection
import { request } from '@/utils/ADempiere/request'

// Constants
import { ROWS_OF_RECORDS_BY_PAGE } from '@/utils/ADempiere/tableUtils'

// Utils and Helper Methods
import { camelizeObjectKeys } from '@/utils/ADempiere/transformObject.js'

export function requestListAvailableWarehouses({
  warehouseId,
  warehouseUuid,
  searchValue,
  pageToken,
  pageSize = ROWS_OF_RECORDS_BY_PAGE
}) {
  return request({
    url: '/material-management/warehouse-locator/list-available-warehouses',
    method: 'post',
    params: {
      search_value: searchValue,
      page_token: pageToken,
      page_size: pageSize
    },
    data: {
      warehouse_id: warehouseId,
      warehouse_uuid: warehouseUuid
    }
  })
    .then(response => {
      return camelizeObjectKeys(response)
    })
}

export function requestListWarehouseLocators({
  contextAttributesList,
  warehouseId,
  warehouseUuid,
  searchValue,
  fieldUuid,
  processParameterUuid,
  browseFieldUuid,
  pageToken,
  pageSize = ROWS_OF_RECORDS_BY_PAGE
}) {
  return request({
    url: '/material-management/warehouse-locator/list-warehouse-locators',
    method: 'post',
    params: {
      search_value: searchValue,
      page_token: pageToken,
      page_size: pageSize
    },
    data: {
      context_attributes: contextAttributesList,
      warehouse_id: warehouseId,
      warehouse_uuid: warehouseUuid,
      field_uuid: fieldUuid,
      process_parameter_uuid: processParameterUuid,
      browse_field_uuid: browseFieldUuid
    }
  })
    .then(response => {
      return camelizeObjectKeys(response)
    })
}
