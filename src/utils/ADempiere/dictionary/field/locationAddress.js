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

import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'

export const TABLE_NAME = 'C_Location'

export const COLUMN_NAME = 'C_Location_ID'

export const LOCATION_ADDRESS_FORM = 'Location-Address'

/**
 * Field Column Names
 */
export const COLUMNNAME_C_Location_ID = COLUMN_NAME

export const COLUMNNAME_Address1 = 'Address1'

export const COLUMNNAME_Address2 = 'Address2'

export const COLUMNNAME_Address3 = 'Address3'

export const COLUMNNAME_Address4 = 'Address4'

export const COLUMNNAME_City = 'City'

export const COLUMNNAME_C_City_ID = 'C_City_ID'

export const COLUMNNAME_Postal = 'Postal'

export const COLUMNNAME_Postal_Add = 'Postal_Add'

export const COLUMNNAME_RegionName = 'RegionName'

export const COLUMNNAME_C_Region_ID = 'C_Region_ID'

export const COLUMNNAME_C_Country_ID = 'C_Country_ID'

export const COLUMNNAME_Altitude = 'Altitude'

export const COLUMNNAME_Latitude = 'Latitude'

export const COLUMNNAME_Longitude = 'Longitude'

/**
 * Is Mandatory field on sequence
 */
export const MANDATORY_CHAR = '!'

/**
 * Use this function for get a list of sequence of capture for locations
 * TODO: Evaluate capture sequence by Germany "@A1@ @A2@ @A3@ @A4@ D-@P@ @R@ @C@ @CO@" with "D-" suffix in postal code
 * @param {string} captureSequence
 * @returns {array}
 */
export function getSequenceAsList(captureSequence) {
  if (!captureSequence) {
    return undefined
  }
  // Split it
  const sequenceFields = captureSequence
    .replace('@@', '@')
    .replace(',', '')
    .trim()
    .split('@')
    .filter(value => value.trim())

  const sequenceWithMandatory = []
  sequenceFields.forEach(sequence => {
    const baseSequence = sequence.replace(MANDATORY_CHAR, '')
    sequenceWithMandatory.push(baseSequence)

    if (sequence.endsWith(MANDATORY_CHAR)) {
      // sequence with mandatory
      sequenceWithMandatory.push(
        baseSequence + MANDATORY_CHAR
      )
    }
  })

  return sequenceWithMandatory
}

export const URL_BASE_MAP = 'https://www.google.com/maps?q='

export const COORDENATES_COLUMN_NAMES = [
  COLUMNNAME_Altitude,
  COLUMNNAME_Latitude,
  COLUMNNAME_Longitude
]

export const COLUMNS_BY_CAPTURE = {
  CO: [COLUMNNAME_C_Country_ID],
  R: [COLUMNNAME_C_Region_ID],
  C: [COLUMNNAME_C_City_ID, COLUMNNAME_City],
  A1: [COLUMNNAME_Address1],
  A2: [COLUMNNAME_Address2],
  A3: [COLUMNNAME_Address3],
  A4: [COLUMNNAME_Address4],
  P: [COLUMNNAME_Postal],
  A: [COLUMNNAME_Postal_Add]
}

export const ATTRIBUTES_BY_CAPTURE = {
  CO: ['country_id'],
  R: ['region_id'],
  C: ['city_id', 'city'],
  A1: ['address1'],
  A2: ['address2'],
  A3: ['address3'],
  A4: ['address4'],
  P: ['postal_code'],
  A: ['postal_code_additional']
}

/**
 * Format coordenate form decimal number
 * @param {number} coordenate
 * @returns {string}
 */
export function formatCoordinateByDecimal(coordenate) {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 6
  }).format(coordenate)
}

const Address1FieldComponent = () => import('@/components/ADempiere/FieldDefinition/FieldLocationAddress/locationAddressForm/address1Field.vue')

const Address2FieldComponent = () => import('@/components/ADempiere/FieldDefinition/FieldLocationAddress/locationAddressForm/address2Field.vue')

const Address3FieldComponent = () => import('@/components/ADempiere/FieldDefinition/FieldLocationAddress/locationAddressForm/address3Field.vue')

const Address4FieldComponent = () => import('@/components/ADempiere/FieldDefinition/FieldLocationAddress/locationAddressForm/address4Field.vue')

const CountriesListFieldComponent = () => import('@/components/ADempiere/FieldDefinition/FieldLocationAddress/locationAddressForm/countriesListField.vue')

const RegionsListFieldComponent = () => import('@/components/ADempiere/FieldDefinition/FieldLocationAddress/locationAddressForm/regionsListField.vue')

const CitiesListFieldComponent = () => import('@/components/ADempiere/FieldDefinition/FieldLocationAddress/locationAddressForm/citiesListField.vue')
const CitiyNameFieldComponent = () => import('@/components/ADempiere/FieldDefinition/FieldLocationAddress/locationAddressForm/cityNameField.vue')

const PostalCodeFieldComponent = () => import('@/components/ADempiere/FieldDefinition/FieldLocationAddress/locationAddressForm/postalCodeField.vue')
const PostalCodeAdditionalFieldComponent = () => import('@/components/ADempiere/FieldDefinition/FieldLocationAddress/locationAddressForm/postalCodeAdditionalField.vue')

/**
 * Get sequencing and set component
 */
export function setComponentSequence(country) {
  const {
    is_allow_cities_out_of_list,
    capture_sequence
  } = country
  const captureSequence = capture_sequence.split(' ')
  if (isEmptyValue(captureSequence)) {
    return setDefaultComponentSequence
  }
  return captureSequence.map(captureItem => {
    let component
    const sequence = captureItem.replace(MANDATORY_CHAR, '').trim()
    switch (true) {
      case sequence.includes('@A1@'):
        component = Address1FieldComponent
        break
      case sequence.includes('@A2@'):
        component = Address2FieldComponent
        break
      case sequence.includes('@A3@'):
        component = Address3FieldComponent
        break
      case sequence.includes('@A4@'):
        component = Address4FieldComponent
        break
      case sequence.includes('@P@'):
        component = PostalCodeFieldComponent
        break
      case sequence.includes('@A@'):
        component = PostalCodeAdditionalFieldComponent
        break
      case sequence.includes('@C@'):
        if (is_allow_cities_out_of_list) {
          component = CitiyNameFieldComponent
        } else {
          component = CitiesListFieldComponent
        }
        break
      case sequence.includes('@R@'):
        component = RegionsListFieldComponent
        break
      case sequence.includes('@CO@'):
        component = CountriesListFieldComponent
        break
    }
    return {
      sequence,
      capture: sequence.replaceAll('@', '').replaceAll(',', '').trim(),
      component,
      isMandatory: captureItem.includes(MANDATORY_CHAR)
    }
  })
}

/**
 * Load All fields
 * @returns {Array}
 */
export function setDefaultComponentSequence() {
  return [
    {
      sequence: '@A1@',
      capture: 'A1',
      component: Address1FieldComponent,
      isMandatory: false
    },
    {
      sequence: '@A2@',
      capture: 'A2',
      component: Address2FieldComponent,
      isMandatory: false
    },
    {
      sequence: '@A3@',
      capture: 'A3',
      component: Address3FieldComponent,
      isMandatory: false
    },
    {
      sequence: '@A4@',
      capture: 'A4',
      component: Address4FieldComponent,
      isMandatory: false
    },
    {
      sequence: '@C@',
      capture: 'C',
      component: CitiesListFieldComponent,
      isMandatory: false
    },
    {
      sequence: '@R@',
      capture: 'R',
      component: RegionsListFieldComponent,
      isMandatory: false
    },
    {
      sequence: '@P@',
      capture: 'P',
      component: PostalCodeFieldComponent,
      isMandatory: false
    },
    {
      sequence: '@A@',
      capture: 'A',
      component: PostalCodeAdditionalFieldComponent,
      isMandatory: false
    },
    {
      sequence: '@CO@',
      capture: 'CO',
      component: CountriesListFieldComponent,
      isMandatory: true
    }
  ]
}

/**
 * Get sequencing and set component
 */
export function setComponentSequencePOSV(country) {
  const {
    is_allow_cities_out_of_list,
    capture_sequence
  } = country
  const captureSequence = capture_sequence.split(' ')
  if (isEmptyValue(captureSequence)) return setDefaultComponentSequence
  return captureSequence.map(sequence => {
    let component
    switch (true) {
      case sequence.includes('@A1@'):
        component = () => import('@/components/ADempiere/Form/VPOS2/HeaderOrder/Customer/NewCustomer/AddAddress/Fields/Address')
        break
      case sequence.includes('@A2@'):
        component = () => import('@/components/ADempiere/Form/VPOS2/HeaderOrder/Customer/NewCustomer/AddAddress/Fields/Address2')
        break
      case sequence.includes('@A3@'):
        component = () => import('@/components/ADempiere/Form/VPOS2/HeaderOrder/Customer/NewCustomer/AddAddress/Fields/Address3')
        break
      case sequence.includes('@A4@'):
        component = () => import('@/components/ADempiere/Form/VPOS2/HeaderOrder/Customer/NewCustomer/AddAddress/Fields/Address4')
        break
      case sequence.includes('@C@'):
        if (is_allow_cities_out_of_list) {
          component = () => import('@/components/ADempiere/Form/VPOS2/HeaderOrder/Customer/NewCustomer/AddAddress/Fields/CityLabel')
        } else {
          component = () => import('@/components/ADempiere/Form/VPOS2/HeaderOrder/Customer/NewCustomer/AddAddress/Fields/City')
        }
        break
      case sequence.includes('@R@'):
        component = () => import('@/components/ADempiere/Form/VPOS2/HeaderOrder/Customer/NewCustomer/AddAddress/Fields/Regions')
        break
      case sequence.includes('@P@'):
        component = () => import('@/components/ADempiere/Form/VPOS2/HeaderOrder/Customer/NewCustomer/AddAddress/Fields/PostalCode')
        break
      case sequence.includes('@A@'):
        component = () => import('@/components/ADempiere/Form/VPOS2/HeaderOrder/Customer/NewCustomer/AddAddress/Fields/PostalCodeAdditional')
        break
      case sequence.includes('@CO@'):
        component = () => import('@/components/ADempiere/Form/VPOS2/HeaderOrder/Customer/NewCustomer/AddAddress/Fields/Country')
        break
    }
    return {
      sequence,
      component
    }
  })
}
