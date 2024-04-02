// ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
// Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
// Contributor(s): Yamel Senih ysenih@erpya.com www.erpya.com
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
import language from '@/lang'
const tableName = 'C_Payment'

export default [
  // Name
  {
    elementColumnName: 'Name',
    columnName: 'Name',
    tableName: 'C_BPartner',
    tabindex: '1',
    isFromDictionary: true,
    overwriteDefinition: {
      sequence: 1,
      isCustomField: true,
      size: 24,
      name: language.t('form.pos.collect.overdrawnInvoice.fieldList.name'),
      isMandatory: true
    }
  },
  // Code
  {
    elementColumnName: 'Value',
    columnName: 'Value',
    isFromDictionary: true,
    tabindex: '0',
    overwriteDefinition: {
      sequence: 0,
      isCustomField: true,
      name: language.t('form.pos.collect.overdrawnInvoice.fieldList.code'),
      size: 24,
      isMandatory: true
    }
  },
  // Bank
  {
    tableName,
    columnName: 'C_Bank_ID',
    isFromDictionary: true,
    overwriteDefinition: {
      sequence: 3,
      handleActionKeyPerformed: true,
      handleActionPerformed: true,
      handleContentSelection: true,
      name: language.t('form.pos.collect.overdrawnInvoice.fieldList.bank'),
      size: 24,
      isActiveLogics: true,
      isMandatory: true
    }
  },
  // bank_account_type
  {
    tableName: 'C_BP_BankAccount',
    columnName: 'BankAccountType',
    isFromDictionary: true,
    overwriteDefinition: {
      sequence: 3,
      handleActionKeyPerformed: true,
      handleActionPerformed: true,
      handleContentSelection: true,
      size: 24,
      name: language.t('form.pos.collect.overdrawnInvoice.fieldList.accountType'),
      isActiveLogics: true,
      isMandatory: true
    }
  },
  // IsACH
  {
    tableName: 'C_BP_BankAccount',
    columnName: 'IsACH',
    isFromDictionary: true,
    overwriteDefinition: {
      sequence: 3,
      handleActionKeyPerformed: true,
      handleActionPerformed: true,
      handleContentSelection: true,
      size: 24,
      isActiveLogics: true,
      is_read_only: true,
      isMandatory: true
    }
  },
  // accountno
  {
    tableName,
    elementColumnName: 'AccountNo',
    columnName: 'AccountNo',
    isFromDictionary: true,
    overwriteDefinition: {
      sequence: 4,
      handleActionKeyPerformed: true,
      handleContentSelection: true,
      handleActionPerformed: true,
      size: 24,
      isActiveLogics: true,
      isMandatory: true
    }
  },
  {
    elementColumnName: 'EMail',
    columnName: 'EMail',
    tableName: 'AD_user',
    isFromDictionary: true,
    overwriteDefinition: {
      sequence: 2,
      handleActionKeyPerformed: true,
      handleContentSelection: true,
      handleActionPerformed: true,
      size: 24,
      isActiveLogics: true,
      isMandatory: true
    }
  }
]
