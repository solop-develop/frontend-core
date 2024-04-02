// ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
// Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
// Contributor(s): Elsio Sanchez esanchez@erpya.com www.erpya.com
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

export default [
  {
    elementColumnName: 'AD_Client_ID',
    columnName: 'AD_Client_ID',
    isFromDictionary: true,
    overwriteDefinition: {
      size: 24,
      sequence: 0,
      isActiveLogics: true, // enable logics
      is_read_only: true,
      handleActionPerformed: true,
      handleContentSelection: true,
      handleActionKeyPerformed: true,
      componentPath: 'FieldYesNo',
      value: true
    }
  },
  {
    elementColumnName: 'AD_Org_ID',
    columnName: 'AD_Org_ID',
    isFromDictionary: true,
    overwriteDefinition: {
      size: 24,
      sequence: 1,
      isActiveLogics: true, // enable logics
      handleActionPerformed: true,
      handleContentSelection: true,
      handleActionKeyPerformed: true,
      componentPath: 'FieldYesNo',
      read_only_logic: `@AD_Client_ID@='N'`,
      value: false
    }
  },
  {
    elementColumnName: 'AD_User_ID',
    columnName: 'AD_User_ID',
    isFromDictionary: true,
    overwriteDefinition: {
      size: 24,
      sequence: 2,
      isActiveLogics: true, // enable logics
      is_read_only: true,
      handleActionPerformed: true,
      handleContentSelection: true,
      handleActionKeyPerformed: true,
      componentPath: 'FieldYesNo',
      value: true
    }
  },
  {
    elementColumnName: 'AD_Window_ID',
    columnName: 'AD_Window_ID',
    isFromDictionary: true,
    overwriteDefinition: {
      size: 24,
      sequence: 3,
      isActiveLogics: true, // enable logics
      is_read_only: true,
      handleActionPerformed: true,
      handleContentSelection: true,
      handleActionKeyPerformed: true,
      componentPath: 'FieldYesNo',
      value: true
    }
  }
]
