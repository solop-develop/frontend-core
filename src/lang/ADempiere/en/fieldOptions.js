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

const fieldOptions = {
  // calculator
  field: 'Field',
  value: 'Value',
  translation: 'Translation',
  translationValue: 'Translation Value',
  // preference value
  currentValue: 'Current Value',
  preference: {
    title: 'Preference Value',
    defaultMessage: 'Applies for this ',
    defaultMessageUser: 'Applies for this ',
    preferenceIsOk: 'The preference is saved',
    preferenceRemoved: 'Preference Removed',
    for: 'For ',
    clientAndOrganization: 'this Client and this Organization',
    allOrganizationOfClient: 'all Organizations of this Client',
    entireSystem: 'entire System',
    thisUser: ', this User',
    allUsers: ', all Users',
    thisWindow: ' and this Window',
    allWindows: ' and all Windows'
  },
  // field info
  info: {
    defaultValue: 'Default Value',
    displayLogic: 'Display Logic',
    readOnlyLogic: 'Read Only Logic',
    mandatoryLogic: 'Mandatory Logic'
  },
  hideThisField: 'Hide This Field',
  refresh: 'Refresh'
}

export default fieldOptions
