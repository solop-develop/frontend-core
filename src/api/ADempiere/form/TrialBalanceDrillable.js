/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 * Contributor(s): Elsio Sanchez elsiosanchez@gmail.com https://github.com/elsiosanchez
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
import { config } from '@/utils/ADempiere/config'

export function listOrganizations({
  searchValue
}) {
  return request({
    url: `${config.trialBalanceDrillable.endpoint}/organizations`,
    method: 'get',
    params: {
      page_size: 200,
      search_value: searchValue
    }
  })
}

export function listBudgets({
  searchValue
}) {
  return request({
    url: `${config.trialBalanceDrillable.endpoint}/budgets`,
    method: 'get',
    params: {
      page_size: 200,
      search_value: searchValue
    }
  })
}

export function listPeriods({
  searchValue
}) {
  return request({
    url: `${config.trialBalanceDrillable.endpoint}/periods`,
    method: 'get',
    params: {
      page_size: 200,
      search_value: searchValue
    }
  })
}

export function listAccoutingKeys({
  searchValue
}) {
  return request({
    url: `${config.trialBalanceDrillable.endpoint}/accouting-keys`,
    method: 'get',
    params: {
      page_size: 200,
      search_value: searchValue
    }
  })
}

export function listReportCubes({
  searchValue
}) {
  return request({
    url: `${config.trialBalanceDrillable.endpoint}/report-cubes`,
    method: 'get',
    params: {
      page_size: 200,
      search_value: searchValue
    }
  })
}

export function listFactAcctSummary({
  organizationId,
  budgetId,
  periodId,
  accoutingFromId,
  accoutingToId,
  reportCubeId
}) {
  return request({
    url: `${config.trialBalanceDrillable.endpoint}/accouting-fact-summary`,
    method: 'get',
    params: {
      organization_id: organizationId,
      budget_id: budgetId,
      period_id: periodId,
      accouting_from_id: accoutingFromId,
      accouting_to_id: accoutingToId,
      report_cube_id: reportCubeId
    }
  })
}
