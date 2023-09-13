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

import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

// import Cookies from 'js-cookie'

const CLIENT_KEY = 'clientId'

export function setCurrentClient(currentClient) {
  // Cookies.set(CLIENT_KEY, currentClient)
  localStorage.setItem(CLIENT_KEY, currentClient)
}

export function getCurrentClient() {
  // return Cookies.get(CLIENT_KEY)
  const client = localStorage.getItem(CLIENT_KEY)
  if (isEmptyValue(client)) {
    return -1
  }
  return Number(client)
}

export function removeCurrentClient() {
  // Cookies.remove(CLIENT_KEY)
  localStorage.removeItem(CLIENT_KEY)
}

const ROLE_KEY = 'roleId'

export function setCurrentRole(currentRole) {
  // Cookies.set(ROLE_KEY, currentRole)
  localStorage.setItem(ROLE_KEY, currentRole)
}

export function getCurrentRole() {
  // return Cookies.get(ROLE_KEY)
  const role = localStorage.getItem(ROLE_KEY)
  if (isEmptyValue(role)) {
    return -1
  }
  return Number(role)
}

export function removeCurrentRole() {
  // Cookies.remove(ROLE_KEY)
  localStorage.removeItem(ROLE_KEY)
}

const ORGANIZATION_KEY = 'organizationId'

export function setCurrentOrganization(currentOrganization) {
  // Cookies.set(ORGANIZATION_KEY, currentOrganization)
  localStorage.setItem(ORGANIZATION_KEY, currentOrganization)
}

export function getCurrentOrganization() {
  // return Cookies.get(ORGANIZATION_KEY)
  const organization = localStorage.getItem(ORGANIZATION_KEY)
  if (isEmptyValue(organization)) {
    return -1
  }
  return Number(organization)
}

export function removeCurrentOrganization() {
  // Cookies.remove(ORGANIZATION_KEY)
  localStorage.removeItem(ORGANIZATION_KEY)
}

const WAREHOUSE_KEY = 'warehouseId'

export function setCurrentWarehouse(currentWarehouse) {
  // Cookies.set(WAREHOUSE_KEY, currentWarehouse)
  localStorage.setItem(WAREHOUSE_KEY, currentWarehouse)
}

export function getCurrentWarehouse() {
  // return Cookies.get(WAREHOUSE_KEY)
  const warehouse = localStorage.getItem(WAREHOUSE_KEY)
  if (isEmptyValue(warehouse)) {
    return -1
  }
  return Number(warehouse)
}

export function removeCurrentWarehouse() {
  // Cookies.remove(WAREHOUSE_KEY)
  localStorage.removeItem(WAREHOUSE_KEY)
}
