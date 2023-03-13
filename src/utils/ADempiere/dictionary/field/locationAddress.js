/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
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

export const TABLE_NAME = 'C_Location'

export const COLUMN_NAME = 'C_Location_ID'

export const LOCATION_ADDRESS_FORM = 'Location-Address'

/**
 * Field Column Names
 */
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
