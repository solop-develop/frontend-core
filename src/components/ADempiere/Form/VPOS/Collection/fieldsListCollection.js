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
  // Amont
  {
    tableName,
    elementColumnName: 'PayAmt',
    columnName: 'PayAmt',
    isFromDictionary: true,
    overwriteDefinition: {
      sequence: 0,
      handleContentSelection: true,
      handleActionPerformed: true,
      size: 24,
      isNumericField: true,
      isActiveLogics: true,
      isMandatory: true,
      displayLogicPayment: 'X'
    }
  },
  // Currency
  // Bank
  // Value
  {
    elementColumnName: 'Value',
    columnName: 'Value',
    uuid: '8d382fa8-fb40-11e8-a479-7a0060f0aa01',
    isFromDictionary: true,
    overwriteDefinition: {
      isCustomField: true,
      handleFocusGained: true,
      handleFocusLost: true,
      sequence: 2,
      size: 24,
      displayLogicPayment: 'D,K,T,A,P,C',
      isActiveLogics: true,
      isMandatory: true
    }
  },
  {
    tableName,
    elementColumnName: 'DateTrx',
    isFromDictionary: true,
    overwriteDefinition: {
      sequence: 4,
      name: 'Fecha',
      handleFocusGained: true,
      handleFocusLost: true,
      handleKeyPressed: true,
      handleKeyReleased: true,
      handleActionKeyPerformed: true,
      handleActionPerformed: true,
      size: 24,
      displayLogicPayment: 'M,K,Z,P,D,K,T,A',
      isActiveLogics: true,
      isMandatory: true
    }
  },
  //
  {
    elementColumnName: 'Description',
    isFromDictionary: true,
    overwriteDefinition: {
      sequence: 2,
      handleActionKeyPerformed: true,
      handleActionPerformed: true,
      handleContentSelection: true,
      displayLogicPayment: 'M',
      size: 24
    }
  },
  {
    elementColumnName: 'EMail',
    columnName: 'EMail',
    tableName: 'AD_user',
    isFromDictionary: true,
    overwriteDefinition: {
      sequence: 5,
      handleActionKeyPerformed: true,
      handleContentSelection: true,
      handleActionPerformed: true,
      name: language.t('form.pos.collect.overdrawnInvoice.fieldList.name'),
      size: 24,
      displayLogicPayment: 'Z',
      isActiveLogics: true,
      isMandatory: true
    }
  },
  {
    elementColumnName: 'Phone',
    columnName: 'Phone',
    tableName: 'AD_user',
    isFromDictionary: true,
    overwriteDefinition: {
      sequence: 5,
      isCustomField: true,
      size: 24,
      displayLogicPayment: 'K,T,A,P,C',
      isMandatory: true
    }
  },
  // ReferenceNo
  {
    tableName: 'HR_Attribute',
    elementColumnName: 'ReferenceNo',
    columnName: 'ReferenceNo',
    isFromDictionary: true,
    overwriteDefinition: {
      sequence: 6,
      handleActionKeyPerformed: true,
      handleContentSelection: true,
      handleActionPerformed: true,
      displayLogicPayment: 'K,Z,P,D,K,T,M,A',
      size: 24,
      isActiveLogics: true,
      isMandatory: true
    }
  },
  // DocumentNo
  // {
  //   elementColumnName: 'DocumentNo',
  //   isFromDictionary: true,
  //   overwriteDefinition: {
  //     sequence: 10,
  //     handleActionKeyPerformed: true,
  //     handleContentSelection: true,
  //     handleActionPerformed: true,
  //     displayLogicPayment: 'M',
  //     size: 24,
  //     isActiveLogics: true,
  //     isMandatory: true
  //   }
  // },
  // WH_Type_ID
  {
    elementColumnName: 'WH_Type_ID',
    isFromDictionary: true,
    overwriteDefinition: {
      sequence: 11,
      handleActionKeyPerformed: true,
      handleContentSelection: true,
      handleActionPerformed: true,
      displayLogicPayment: 'ISLR',
      size: 24,
      isActiveLogics: true,
      isMandatory: true
    }
  },
  // type credit card
  {
    tableName: 'C_Payment',
    columnName: 'CreditCardType',
    isFromDictionary: true,
    overwriteDefinition: {
      sequence: 7,
      default_value: 'M',
      handleActionKeyPerformed: true,
      handleContentSelection: true,
      handleActionPerformed: true,
      size: 24,
      reference: {
        tableName: 'C_Payment'
      },
      displayLogicPayment: 'C',
      isActiveLogics: true,
      isMandatory: true
    }
  },
  // number credit card
  {
    tableName,
    elementColumnName: 'CreditCardNumber',
    columnName: 'CreditCardNumber',
    isFromDictionary: true,
    overwriteDefinition: {
      sequence: 8,
      handleActionKeyPerformed: true,
      handleContentSelection: true,
      handleActionPerformed: true,
      size: 24,
      displayLogicPayment: 'C',
      isActiveLogics: true,
      isMandatory: false
    }
  },
  // accountno
  {
    tableName,
    elementColumnName: 'AccountNo',
    columnName: 'AccountNo',
    isFromDictionary: true,
    overwriteDefinition: {
      sequence: 9,
      handleActionKeyPerformed: true,
      handleContentSelection: true,
      handleActionPerformed: true,
      size: 24,
      displayLogicPayment: 'A',
      isActiveLogics: true,
      isMandatory: true
    }
  }
]
