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
    url: `${config.payrollActionNotice.endpoint}/process`,
    method: 'get'
  })
    .then(response => {
      return response
    })
}

export function listEmployeeValid({
  contextAttributes,
  payrollProcessId
}) {
  return request({
    url: `${config.payrollActionNotice.endpoint}/process/${payrollProcessId}/employees`,
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
  payrollProcessId,
  businessPartnerId,
  searchValue
}) {
  return request({
    url: `${config.payrollActionNotice.endpoint}/process/${payrollProcessId}/concepts/employees/${businessPartnerId}`,
    method: 'get'
    // params: {
    //   context_attributes: contextAttributes,
    //   search_value: searchValue
    // }
  })
    .then(response => {
      return response
    })
}

export function listPayrollMovements({
  contextAttributes,
  payrollProcessId,
  businessPartnerId,
  searchValue,
  filters
}) {
  return request({
    url: `${config.payrollActionNotice.endpoint}/process/${payrollProcessId}/employees/${businessPartnerId}/movements`,
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
  attributes,
  payrollProcessId,
  payrollConcept,
  businessPartnerId
}) {
  return request({
    url: `${config.payrollActionNotice.endpoint}/process/${payrollProcessId}/employees/${businessPartnerId}/movements/concepts/${payrollConcept}`,
    method: 'post',
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
    url: `${config.payrollActionNotice.endpoint}/delete-movements`,
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
  id,
  payrollProcessId
}) {
  return request({
    url: `${config.payrollActionNotice.endpoint}/process/${payrollProcessId}/concepts/${id}`,
    method: 'get',
    params: {
      id
    }
  })
    .then(response => {
      return response
    })
}
