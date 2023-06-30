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

import Cookies from 'js-cookie'

const roleKey = 'roleUuid'

export function setCurrentRole(currentRole) {
  return Cookies.set(roleKey, currentRole)
}

export function getCurrentRole() {
  return Cookies.get(roleKey)
}

export function removeCurrentRole() {
  return Cookies.remove(roleKey)
}

const organizationKey = 'organizationUuid'

export function setCurrentOrganization(currentOrganization) {
  return Cookies.set(organizationKey, currentOrganization)
}

export function getCurrentOrganization() {
  return Cookies.get(organizationKey)
}

export function removeCurrentOrganization() {
  return Cookies.remove(organizationKey)
}

const warehouseKey = 'warehouseUuid'

export function setCurrentWarehouse(currentWarehouse) {
  return Cookies.set(warehouseKey, currentWarehouse)
}

export function getCurrentWarehouse() {
  return Cookies.get(warehouseKey)
}

export function removeCurrentWarehouse() {
  return Cookies.remove(warehouseKey)
}
