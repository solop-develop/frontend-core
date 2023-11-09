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

// This file is used for set a static values for references of fields,
// currently exists for ADempiere metadata distints display types and are represented for follow:
export const DEFAULT_SIZE = {
  xs: 24,
  sm: 12,
  md: 8,
  lg: 6,
  xl: 6
}

export const RECORD_ROWS_BY_LIST = 15

// Account Element
export const ACCOUNT_ELEMENT = {
  id: 25,
  isSupported: false,
  valueType: 'INTEGER',
  componentPath: 'FieldAccountingCombination',
  size: DEFAULT_SIZE
}

// Amount (Number with 4 decimals)
export const AMOUNT = {
  id: 12,
  isSupported: true,
  valueType: 'DECIMAL',
  componentPath: 'FieldNumber',
  size: DEFAULT_SIZE
}

// Resource Assignment
export const RESOURCE_ASSIGNMENT = {
  id: 33,
  isSupported: false,
  valueType: 'INTEGER',
  componentPath: 'FieldText',
  size: DEFAULT_SIZE
}

// Binary Data (display type BLOB)
export const BINARY_DATA = {
  id: 23,
  isSupported: true,
  valueType: 'INTEGER',
  componentPath: 'FieldBinary',
  size: DEFAULT_SIZE
}

// Button
export const BUTTON = {
  id: 28,
  uuid: 'a47ec1c2-fb40-11e8-a479-7a0060f0aa01',
  isSupported: true,
  valueType: 'STRING',
  componentPath: 'FieldButton',
  size: DEFAULT_SIZE
}

// Chart
export const CHART = {
  id: 53370,
  isSupported: false,
  valueType: 'STRING',
  componentPath: 'FieldText',
  size: DEFAULT_SIZE
}

// Color
export const COLOR = {
  id: 27,
  isSupported: false,
  valueType: 'INTEGER',
  componentPath: 'FieldColor',
  size: DEFAULT_SIZE
}

// Cost or Prices
export const COSTS_PLUS_PRICES = {
  id: 37,
  isSupported: true,
  valueType: 'DECIMAL',
  componentPath: 'FieldNumber',
  size: DEFAULT_SIZE
}

// Date
export const DATE = {
  id: 15,
  isSupported: true,
  valueType: 'DATE',
  componentPath: 'FieldDate',
  size: DEFAULT_SIZE
}

// Date with time
export const DATE_PLUS_TIME = {
  id: 16,
  isSupported: true,
  valueType: 'DATE',
  componentPath: 'FieldDate',
  size: DEFAULT_SIZE
}

// Local File
export const LOCAL_FILE = {
  id: 39,
  isSupported: true,
  valueType: 'STRING',
  componentPath: 'FieldText',
  size: DEFAULT_SIZE
}

// Local File Path
export const LOCAL_FILE_PATH = {
  id: 38,
  isSupported: true,
  valueType: 'STRING',
  componentPath: 'FieldText',
  size: DEFAULT_SIZE
}

// Local File Path or Name
export const LOCAL_FILE_PATH_OR_NAME = {
  id: 53670,
  isSupported: true,
  valueType: 'STRING',
  componentPath: 'FieldText',
  size: DEFAULT_SIZE
}

// ID
export const ID = {
  id: 13,
  isSupported: true,
  valueType: 'INTEGER',
  componentPath: 'FieldNumber',
  size: DEFAULT_SIZE
}

// Binary Image Data
export const IMAGE = {
  id: 32,
  isSupported: true,
  valueType: 'INTEGER',
  componentPath: 'FieldImage',
  size: DEFAULT_SIZE
}

// Integer
export const INTEGER = {
  id: 11,
  isSupported: true,
  valueType: 'INTEGER',
  componentPath: 'FieldNumber',
  size: DEFAULT_SIZE
}

// Reference List
export const LIST = {
  id: 17,
  isSupported: true,
  valueType: 'STRING',
  componentPath: 'FieldSelect',
  size: DEFAULT_SIZE
}

// Location Address
export const LOCATION_ADDRESS = {
  id: 21,
  isSupported: true,
  valueType: 'INTEGER',
  componentPath: 'FieldLocationAddress',
  size: DEFAULT_SIZE
}

// Warehouse Locator Data type
export const LOCATOR_WAREHOUSE = {
  id: 31,
  isSupported: true,
  valueType: 'INTEGER',
  componentPath: 'FieldWarehouseLocator',
  size: DEFAULT_SIZE
}

// Memo
export const MEMO = {
  id: 34,
  isSupported: true,
  valueType: 'STRING',
  componentPath: 'FieldTextLong',
  size: DEFAULT_SIZE
}

// Float Number
export const NUMBER = {
  id: 22,
  isSupported: true,
  valueType: 'DECIMAL',
  componentPath: 'FieldNumber',
  size: DEFAULT_SIZE
}

// Printer Name
export const PRINTER_NAME = {
  id: 42,
  isSupported: true,
  valueType: 'STRING',
  componentPath: 'FieldText',
  size: DEFAULT_SIZE
}

// Product Attribute
export const PRODUCT_ATTRIBUTE = {
  id: 35,
  isSupported: false,
  valueType: 'INTEGER',
  componentPath: 'FieldProductAttribute',
  size: DEFAULT_SIZE
}

// Quantity
export const QUANTITY = {
  id: 29,
  isSupported: true,
  valueType: 'DECIMAL',
  componentPath: 'FieldNumber',
  size: DEFAULT_SIZE
}

// Search
export const SEARCH = {
  id: 30,
  isSupported: true,
  valueType: 'INTEGER',
  componentPath: 'FieldSearch',
  size: DEFAULT_SIZE
}

// Char (display type String)
export const CHAR = {
  id: 10,
  isSupported: true,
  valueType: 'STRING',
  componentPath: 'FieldText',
  size: DEFAULT_SIZE
}

// Table List
export const TABLE = {
  id: 18,
  isSupported: true,
  valueType: 'INTEGER',
  componentPath: 'FieldSelect',
  size: DEFAULT_SIZE
}

// Table Dir
export const TABLE_DIRECT = {
  id: 19,
  isSupported: true,
  valueType: 'INTEGER',
  componentPath: 'FieldSelect',
  size: DEFAULT_SIZE
}

// Text
export const TEXT = {
  id: 14,
  isSupported: true,
  valueType: 'STRING',
  componentPath: 'FieldText',
  size: DEFAULT_SIZE
}

// Text Long
export const TEXT_LONG = {
  id: 36,
  isSupported: true,
  valueType: 'STRING',
  componentPath: 'FieldTextLong',
  size: DEFAULT_SIZE
}

// Time
export const TIME = {
  id: 24,
  isSupported: true,
  valueType: 'DATE',
  componentPath: 'FieldTime',
  size: DEFAULT_SIZE
}

// URL
export const URL = {
  id: 40,
  isSupported: true,
  valueType: 'STRING',
  componentPath: 'FieldUrl',
  size: DEFAULT_SIZE
}

// Yes No
export const YES_NO = {
  id: 20,
  isSupported: true,
  valueType: 'BOOLEAN',
  componentPath: 'FieldYesNo',
  size: DEFAULT_SIZE
}

export const FIELDS_LOOKUP = [
  LIST.id,
  TABLE.id,
  TABLE_DIRECT.id,
  SEARCH.id,
  ACCOUNT_ELEMENT.id,
  LOCATION_ADDRESS.id,
  LOCATOR_WAREHOUSE.id,
  PRODUCT_ATTRIBUTE.id,
  RESOURCE_ASSIGNMENT.id
]

export const SUPPORTED_LOOKUPS = [
  ACCOUNT_ELEMENT.id,
  LIST.id,
  LOCATION_ADDRESS.id,
  LOCATOR_WAREHOUSE.id,
  PRODUCT_ATTRIBUTE.id,
  TABLE.id,
  TABLE_DIRECT.id,
  SEARCH.id
]

// Some helper methods
export function isLookup(displayType) {
  return FIELDS_LOOKUP.includes(displayType)
}

// Some helper methods
export function isSupportLookup(displayType) {
  return SUPPORTED_LOOKUPS.includes(displayType)
}

export const FIELDS_IDENTIFIER = [
  ID.id,
  IMAGE.id,
  COLOR.id,
  TABLE.id,
  TABLE_DIRECT.id,
  SEARCH.id,
  ACCOUNT_ELEMENT.id,
  LOCATION_ADDRESS.id,
  LOCATOR_WAREHOUSE.id,
  PRODUCT_ATTRIBUTE.id,
  RESOURCE_ASSIGNMENT.id
]

/**
 * Is Identifier reference
 * @param {Numner} displayType or reference to displayed
 * @returns {Boolean}
 */
export function isIdentifier(displayType) {
  return FIELDS_IDENTIFIER.includes(displayType)
}

/**
 * Is Integer value to save by this reference to displayed
 * @param {Numner} displayType or reference to displayed
 * @returns {Boolean}
 */
export function isIntegerDisplayType(displayType) {
  return FIELDS_IDENTIFIER.includes(displayType) || displayType === INTEGER.id
}

/**
 * All references
 * {number} id: Identifiert to field reference
 * {string|array} valueType: to convert and send server with gRPC
 * {boolean} isSupported: Indicate if field is suported
 */
const REFERENCES = [
  ACCOUNT_ELEMENT,
  AMOUNT,
  RESOURCE_ASSIGNMENT,
  BINARY_DATA,
  BUTTON,
  CHART,
  COLOR,
  COSTS_PLUS_PRICES,
  DATE,
  DATE_PLUS_TIME,
  LOCAL_FILE,
  LOCAL_FILE_PATH,
  LOCAL_FILE_PATH_OR_NAME,
  ID,
  IMAGE,
  INTEGER,
  LIST,
  LOCATION_ADDRESS,
  LOCATOR_WAREHOUSE,
  MEMO,
  NUMBER,
  PRINTER_NAME,
  PRODUCT_ATTRIBUTE,
  QUANTITY,
  SEARCH,
  // String as CHAR
  CHAR,
  TABLE,
  TABLE_DIRECT,
  TEXT,
  TEXT_LONG,
  TIME,
  URL,
  YES_NO
]
export default REFERENCES

export const FIELDS_RANGE = [
  AMOUNT.id,
  COSTS_PLUS_PRICES.id,
  DATE.id,
  DATE_PLUS_TIME.id,
  INTEGER.id,
  NUMBER.id,
  QUANTITY.id,
  TIME.id
]

/**
 * Is range field
 * @param {number} displayType
 * @returns {boolean}
 */
export function isRangeField(displayType) {
  return FIELDS_RANGE.includes(displayType)
}

/**
 * Is manage range to in other field
 * @param {boolean} isRange
 * @param {number} displayType
 * @returns {boolean}
 */
export function isAddRangeField({ isRange, displayType }) {
  if (!isRange) {
    return false
  }

  return isNumberField(displayType)
}

/**
 * Fields not showed in panel's
 */
export const FIELDS_HIDDEN = [
  // BUTTON.id
]

/**
 * Hidden field or column by displayType
 * @param {number} displayType
 * @returns {boolean}
 */
export function isHiddenField(displayType) {
  return FIELDS_HIDDEN.includes(displayType)
}

export const FIELDS_DECIMALS = [
  AMOUNT.id,
  COSTS_PLUS_PRICES.id,
  NUMBER.id,
  QUANTITY.id
]

export const FIELDS_QUANTITY = [
  AMOUNT.id,
  COSTS_PLUS_PRICES.id,
  INTEGER.id,
  NUMBER.id,
  QUANTITY.id
]

/**
 * Manage the currency prefix/sufix in the format to display
 */
export const FIELDS_CURRENCY = [
  AMOUNT.id,
  COSTS_PLUS_PRICES.id
]

/**
 * Is currency field
 * @param {number} displayType
 * @returns {boolean}
 */
export function isCurrencyField(displayType) {
  return FIELDS_CURRENCY.includes(displayType)
}

/**
 * Is number field
 * @param {number} displayType
 * @returns {boolean}
 */
export function isNumberField(displayType) {
  return FIELDS_QUANTITY.includes(displayType)
}

export const FIELDS_INTEGER = [
  INTEGER.id,
  ID.id
]

/**
 * Is intenger number field
 * @param {number} displayType
 * @returns {boolean}
 */
export function isIntegerField(displayType) {
  return FIELDS_INTEGER.includes(displayType)
}

/**
 * Is decimal number field
 * @param {number} displayType
 * @returns {boolean}
 */
export function isDecimalField(displayType) {
  return FIELDS_DECIMALS.includes(displayType)
}

export const FIELDS_FILE = [
  BINARY_DATA.id,
  IMAGE.id,
  LOCAL_FILE.id,
  LOCAL_FILE_PATH.id,
  LOCAL_FILE_PATH_OR_NAME.id
]

export const FIELDS_TEXT = [
  CHAR.id,
  MEMO.id,
  TEXT.id,
  TEXT_LONG.id
]

export const FIELDS_DATE = [
  DATE.id,
  DATE_PLUS_TIME.id,
  TIME.id
]

/**
 * Is date or time field
 * @param {number} displayType
 * @returns {boolean}
 */
export function isDateField(displayType) {
  return FIELDS_DATE.includes(displayType)
}
