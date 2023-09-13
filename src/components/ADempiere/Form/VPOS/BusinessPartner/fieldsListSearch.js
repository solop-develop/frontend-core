// ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
// Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
// Contributor(s): Elsio Sanchez elsiosanches@gmail.com https://github.com/elsiosanches
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

// List of fields to send in search
export default [
  {
    elementColumnName: 'Code',
    columnName: 'Code',
    tableName: 'C_BPartner',
    overwriteDefinition: {
      sequence: 0,
      size: 6,
      name: language.t('form.pos.order.BusinessPartnerCreate.searchValue'),
      componentPath: 'FieldText',
      displayType: 10,
      isMandatory: false,
      isCustomField: true
    }
  },
  {
    elementColumnName: 'Value',
    columnName: 'Value',
    tableName: 'C_BPartner',
    isFromDictionary: true,
    overwriteDefinition: {
      sequence: 1,
      componentPath: 'FieldText',
      size: 6,
      isMandatory: false,
      isCustomField: true
    }
  },
  {
    elementColumnName: 'TaxID',
    columnName: 'TaxID',
    fieldUuid: '8cef473e-fb40-11e8-a479-7a0060f0aa01',
    uuid: '8cef473e-fb40-11e8-a479-7a0060f0aa01',
    isFromDictionary: true,
    overwriteDefinition: {
      sequence: 2,
      size: 6,
      isMandatory: false,
      isCustomField: true
    }
  },
  {
    elementColumnName: 'Name',
    columnName: 'Name',
    tableName: 'C_BPartner',
    isFromDictionary: true,
    overwriteDefinition: {
      sequence: 3,
      size: 6,
      isMandatory: false,
      isCustomField: true
    }
  }
]
