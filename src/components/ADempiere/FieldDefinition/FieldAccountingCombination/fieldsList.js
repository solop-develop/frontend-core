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
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

// List of fields to send in search
export default [
  // Alias
  {
    uuid: '8cead820-fb40-11e8-a479-7a0060f0aa01',
    isFromDictionary: true,
    overwriteDefinition: {
      sequence: 10,
      size: 6,
      isCustomField: true
    }
  },
  // Combination
  {
    uuid: '8d54b3c6-fb40-11e8-a479-7a0060f0aa01',
    isFromDictionary: true,
    overwriteDefinition: {
      sequence: 20,
      size: 6,
      isCustomField: true
    }
  },
  // Organization
  {
    uuid: '8d591c68-fb40-11e8-a479-7a0060f0aa01',
    isFromDictionary: true,
    overwriteDefinition: {
      sequence: 30,
      size: 6,
      // isMandatory: true,
      isCustomField: true
    }
  },
  // Account
  {
    uuid: '8d38be28-fb40-11e8-a479-7a0060f0aa01',
    isFromDictionary: true,
    overwriteDefinition: {
      sequence: 40,
      size: 6,
      // isMandatory: true,
      isCustomField: true
    }
  },
  // Product
  {
    uuid: '8d568b24-fb40-11e8-a479-7a0060f0aa01',
    isFromDictionary: true,
    overwriteDefinition: {
      sequence: 50,
      size: 6,
      isCustomField: true
    }
  },
  // Business Partner
  {
    uuid: '8d5b78b4-fb40-11e8-a479-7a0060f0aa01',
    isFromDictionary: true,
    overwriteDefinition: {
      sequence: 60,
      size: 6,
      isCustomField: true
    }
  },
  // Project
  {
    uuid: '8d3a3a78-fb40-11e8-a479-7a0060f0aa01',
    isFromDictionary: true,
    overwriteDefinition: {
      sequence: 70,
      size: 6,
      isCustomField: true
    }
  },
  // Campaign
  {
    uuid: '8d3b505c-fb40-11e8-a479-7a0060f0aa01',
    isFromDictionary: true,
    overwriteDefinition: {
      sequence: 80,
      size: 6,
      isCustomField: true
    }
  }
  // TODO: Add fields: From Location, To Location, Sales Region, User1, User2, User3, User4, UserElement1, UserElement2
]
