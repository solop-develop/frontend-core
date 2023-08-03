/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 * Contributor(s): Elsio Sanchez elsiosanchez@gmail.com https://github.com/elsiosanchez
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
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

import { request } from '@/utils/ADempiere/request'
import { config } from '@/utils/ADempiere/config'

// List Scale
export function listPayrollProcess() {
  return request({
    url: `${config.payrollActionNotice.endpoint}/list-payroll-process`,
    method: 'get'
  })
    .then(response => {
      return response
    })
}

export function listEmployeeValid({
  contextAttributes
}) {
  return request({
    url: `${config.payrollActionNotice.endpoint}/list-employee-valid`,
    method: 'get',
    params: {
      context_attributes: contextAttributes
    }
  })
    .then(response => {
      return response
    })
}

export function listPayrollConcepts({
  contextAttributes,
  searchValue
}) {
  return request({
    url: `${config.payrollActionNotice.endpoint}/list-payroll-concepts`,
    method: 'get',
    params: {
      context_attributes: contextAttributes,
      search_value: searchValue
    }
  })
    .then(response => {
      return response
    })
}

export function listPayrollMovements({
  contextAttributes,
  filters,
  searchValue
}) {
  return request({
    url: `${config.payrollActionNotice.endpoint}/list-payroll-movements`,
    method: 'get',
    params: {
      filters,
      context_attributes: contextAttributes,
      search_value: searchValue
    }
  })
    .then(response => {
      return response
    })
}

export function savePayrollMovement({
  id,
  uuid,
  contextAttributes,
  filters,
  attributes
}) {
  return request({
    url: `${config.payrollActionNotice.endpoint}/save-payroll-movement`,
    method: 'put',
    data: {
      filters,
      id,
      uuid,
      context_attributes: contextAttributes,
      attributes
    }
  })
    .then(response => {
      return response
    })
}

export function deletePayrollMovement({
  ids,
  uuids,
  contextAttributes
}) {
  return request({
    url: `${config.payrollActionNotice.endpoint}/delete-payroll-movements`,
    method: 'delete',
    params: {
      ids,
      uuids,
      context_attributes: contextAttributes
    }
  })
    .then(response => {
      return response
    })
}

export function conceptDefinition({
  id
}) {
  return request({
    url: `${config.payrollActionNotice.endpoint}/get-payroll-concept-definition`,
    method: 'get',
    params: {
      id
    }
  })
    .then(response => {
      return response
    })
}
