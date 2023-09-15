/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 * Contributor(s): Elsio Sanchez elsiosanches@gmail.com https://github.com/elsiosanchez
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
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

export default [
  // S_ResourceType_ID
  {
    uuid: '8cf19da4-fb40-11e8-a479-7a0060f0aa01',
    isFromDictionary: true,
    overwriteDefinition: {
      size: 8,
      sequence: 10
    }
  },
  // S_ResourceType_ID Search
  {
    // TODO: Fix always request when render
    uuid: '8cf19da4-fb40-11e8-a479-7a0060f0aa01',
    elementColumnName: 'RecurringTypeSearch',
    columnName: 'RecurringTypeSearch',
    isFromDictionary: true,
    overwriteDefinition: {
      size: 8,
      isMandatory: false,
      sequence: 10,
      columnId: 68511,
      id: 5471,
      columnName: 'RecurringTypeSearch',
      elementColumnName: 'RecurringTypeSearch',
      elementName: 'RecurringTypeSearch'
    }
  }
]
