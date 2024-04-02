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
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

import language from '@/lang'

const fieldBase = {
  tableName: 'C_Location',
  isFromDictionary: true
}

export default [
  {
    ...fieldBase,
    elementColumnName: 'C_Location_ID',
    columnName: 'C_Location_ID',
    overwriteDefinition: {
      isCustomField: true,
      size: 24,
      is_displayed: false,
      index: 1
    }
  },
  {
    ...fieldBase,
    elementColumnName: 'C_Country_ID',
    columnName: 'C_Country_ID',
    uuid: '8ceddfca-fb40-11e8-a479-7a0060f0aa01',
    overwriteDefinition: {
      isCustomField: true,
      is_updateable: true,
      isActiveLogics: true, // enable logics
      default_value: '@#C_Country_ID@',
      size: 24,
      reference: {
        tableName: 'C_Location'
      },
      sequenceFields: 'CO',
      index: 2,
      isMandatory: true
    }
  },
  {
    ...fieldBase,
    elementColumnName: 'C_Region_ID',
    columnName: 'C_Region_ID',
    uuid: '8ced32aa-fb40-11e8-a479-7a0060f0aa01',
    overwriteDefinition: {
      isCustomField: true,
      is_updateable: true,
      size: 24,
      sequenceFields: 'R',
      reference: {
        tableName: 'C_Location'
      },
      index: 3,
      isMandatory: false
    }
  },
  {
    ...fieldBase,
    elementColumnName: 'C_City_ID',
    columnName: 'C_City_ID',
    uuid: '8cfb4d90-fb40-11e8-a479-7a0060f0aa01',
    overwriteDefinition: {
      isCustomField: true,
      reference: {
        tableName: 'C_Location'
      },
      is_updateable: true,
      componentPath: 'FieldSelect',
      size: 24,
      sequenceFields: 'C',
      index: 4,
      isMandatory: true
    }
  },
  {
    ...fieldBase,
    elementColumnName: 'Address1',
    columnName: 'Address1',
    overwriteDefinition: {
      isCustomField: true,
      is_updateable: true,
      size: 24,
      sequenceFields: 'A1',
      index: 5
    }
  },
  {
    ...fieldBase,
    elementColumnName: 'Address2',
    columnName: 'Address2',
    overwriteDefinition: {
      isCustomField: true,
      is_updateable: true,
      size: 24,
      sequenceFields: 'A2',
      isMandatory: false,
      index: 6
    }
  },
  {
    ...fieldBase,
    elementColumnName: 'Address3',
    columnName: 'Address3',
    overwriteDefinition: {
      isCustomField: true,
      is_updateable: true,
      size: 24,
      sequenceFields: 'A3',
      isMandatory: false,
      index: 7
    }
  },
  {
    ...fieldBase,
    elementColumnName: 'Address4',
    columnName: 'Address4',
    overwriteDefinition: {
      isCustomField: true,
      is_updateable: true,
      size: 24,
      sequenceFields: 'A4',
      isMandatory: false,
      index: 8
    }
  },
  {
    ...fieldBase,
    elementColumnName: 'Postal',
    columnName: 'Postal',
    overwriteDefinition: {
      isCustomField: true,
      is_updateable: true,
      size: 24,
      sequenceFields: 'P',
      index: 9
    }
  },
  {
    elementColumnName: 'Name',
    isFromDictionary: true,
    overwriteDefinition: {
      tabindex: 1,
      isCustomField: true,
      is_updateable: true,
      size: 24,
      name: language.t('components.contextMenuReferences'),
      sequence: 1,
      sequenceFields: 'P',
      isMandatory: true
    }
  }
]
