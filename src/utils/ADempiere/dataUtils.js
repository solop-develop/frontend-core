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

// Utils and Helper Methods
// import { getToken } from '@/utils/auth'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

export const OPERATOR_EQUAL = {
  operator: 'equal',
  sqlOperators: [
    '='
  ],
  symbol: '='
}

export const OPERATOR_NOT_EQUAL = {
  operator: 'not_equal',
  sqlOperators: [
    '!=',
    '<>'
  ],
  symbol: '<>'
}

export const OPERATOR_LIKE = {
  operator: 'like',
  sqlOperators: [
    'like'
  ],
  symbol: '%'
}

export const OPERATOR_NOT_LIKE = {
  operator: 'not_like',
  sqlOperators: [
    'not_like'
  ],
  symbol: '!%'
}

export const OPERATOR_GREATER = {
  operator: 'greater',
  sqlOperators: [
    '>'
  ],
  symbol: '>'
}

export const OPERATOR_GREATER_EQUAL = {
  operator: 'greater_equal',
  sqlOperators: [
    '>='
  ],
  symbol: '>='
}

export const OPERATOR_LESS = {
  operator: 'lesss',
  sqlOperators: [
    '<'
  ],
  symbol: '<'
}

export const OPERATOR_LESS_EQUAL = {
  operator: 'less_equal',
  sqlOperators: [
    '<='
  ],
  symbol: '<='
}

export const OPERATOR_BETWEEN = {
  operator: 'between',
  sqlOperators: [
    'between'
  ],
  symbol: '>-<'
}

export const OPERATOR_NOT_BETWEEN = {
  operator: 'not_between',
  sqlOperators: [
    'not_between'
  ],
  symbol: '<->'
}

export const OPERATOR_NULL = {
  operator: 'null',
  sqlOperators: [
    'is null'
  ],
  symbol: ''
}

export const OPERATOR_NOT_NULL = {
  operator: 'not_null',
  sqlOperators: [
    'is not null'
  ],
  symbol: ''
}

export const OPERATOR_IN = {
  operator: 'in',
  sqlOperators: [
    'in'
  ],
  symbol: '()'
}

export const OPERATOR_NOT_IN = {
  operator: 'not_in',
  sqlOperators: [
    'not in'
  ],
  symbol: '!()'
}

const STANDARD_OPERATORS_LIST = [
  OPERATOR_EQUAL.operator,
  OPERATOR_NOT_EQUAL.operator,
  OPERATOR_NULL.operator,
  OPERATOR_NOT_NULL.operator
]

const TEXT_OPERATORS_LIST = [
  OPERATOR_LIKE.operator,
  OPERATOR_NOT_LIKE.operator
]

const GREATER_LESS_OPERATORS_LIST = [
  OPERATOR_GREATER.operator,
  OPERATOR_GREATER_EQUAL.operator,
  OPERATOR_LESS.operator,
  OPERATOR_LESS_EQUAL.operator
]

/**
 * Is value operators
 */
export const IGNORE_VALUE_OPERATORS_LIST = [
  OPERATOR_NULL.operator,
  OPERATOR_NOT_NULL.operator
]

export const RANGE_VALUE_OPERATORS_LIST = [
  OPERATOR_BETWEEN.operator,
  OPERATOR_NOT_BETWEEN.operator
]

export const MULTIPLE_VALUES_OPERATORS_LIST = [
  OPERATOR_IN.operator,
  OPERATOR_NOT_IN.operator
]

export const OPERATORS_LIST = [
  OPERATOR_EQUAL,
  OPERATOR_NOT_EQUAL,
  OPERATOR_LIKE,
  OPERATOR_NOT_LIKE,
  OPERATOR_GREATER,
  OPERATOR_GREATER_EQUAL,
  OPERATOR_LESS,
  OPERATOR_LESS_EQUAL,
  OPERATOR_BETWEEN,
  OPERATOR_NOT_BETWEEN,
  OPERATOR_NOT_NULL,
  OPERATOR_NULL,
  OPERATOR_IN,
  OPERATOR_NOT_IN
]

export const OPERATORS_FIELD_AMOUNT = {
  componentPath: 'FieldAmount',
  isRange: true,
  operatorsList: [
    ...STANDARD_OPERATORS_LIST,
    ...GREATER_LESS_OPERATORS_LIST,
    ...RANGE_VALUE_OPERATORS_LIST,
    ...MULTIPLE_VALUES_OPERATORS_LIST
  ]
}

export const OPERATORS_FIELD_DATE = {
  componentPath: 'FieldDate',
  isRange: true,
  operatorsList: [
    ...RANGE_VALUE_OPERATORS_LIST,
    ...STANDARD_OPERATORS_LIST,
    ...GREATER_LESS_OPERATORS_LIST,
    ...MULTIPLE_VALUES_OPERATORS_LIST
  ]
}

export const OPERATORS_FIELD_NUMBER = {
  componentPath: 'FieldNumber',
  isRange: true,
  operatorsList: [
    ...STANDARD_OPERATORS_LIST,
    ...GREATER_LESS_OPERATORS_LIST,
    ...MULTIPLE_VALUES_OPERATORS_LIST
  ]
}

export const OPERATORS_FIELD_SELECT = {
  componentPath: 'FieldSelect',
  isRange: false,
  operatorsList: [
    ...STANDARD_OPERATORS_LIST,
    ...MULTIPLE_VALUES_OPERATORS_LIST
  ]
}

export const OPERATORS_FIELD_SEARCH = {
  componentPath: 'FieldSearch',
  isRange: false,
  operatorsList: [
    ...STANDARD_OPERATORS_LIST
    // TODO: Add support to IN and NOT IN
  ]
}

export const OPERATORS_FIELD_TEXT = {
  componentPath: 'FieldText',
  isRange: false,
  operatorsList: [
    ...STANDARD_OPERATORS_LIST,
    ...TEXT_OPERATORS_LIST,
    ...MULTIPLE_VALUES_OPERATORS_LIST
  ]
}

export const OPERATORS_FIELD_TEXT_LONG = {
  componentPath: 'FieldTextLong',
  isRange: false,
  operatorsList: [
    ...STANDARD_OPERATORS_LIST,
    ...TEXT_OPERATORS_LIST,
    ...MULTIPLE_VALUES_OPERATORS_LIST
  ]
}

export const OPERATORS_FIELD_TIME = {
  componentPath: 'FieldTime',
  isRange: true,
  operatorsList: [
    ...RANGE_VALUE_OPERATORS_LIST,
    ...STANDARD_OPERATORS_LIST,
    ...GREATER_LESS_OPERATORS_LIST,
    ...MULTIPLE_VALUES_OPERATORS_LIST
  ]
}

export const OPERATORS_FIELD_URL = {
  componentPath: 'FieldUrl',
  isRange: false,
  operatorsList: [
    ...STANDARD_OPERATORS_LIST,
    ...TEXT_OPERATORS_LIST,
    ...MULTIPLE_VALUES_OPERATORS_LIST
  ]
}

export const OPERATORS_FIELD_YES_NO = {
  componentPath: 'FieldYesNo',
  isRange: false,
  operatorsList: [
    ...STANDARD_OPERATORS_LIST
  ]
}

// Components associated with search componentPath
export const FIELD_OPERATORS_LIST = [
  OPERATORS_FIELD_AMOUNT,
  OPERATORS_FIELD_DATE,
  OPERATORS_FIELD_NUMBER,
  OPERATORS_FIELD_SEARCH,
  OPERATORS_FIELD_SELECT,
  OPERATORS_FIELD_TEXT,
  OPERATORS_FIELD_TEXT_LONG,
  OPERATORS_FIELD_TIME,
  OPERATORS_FIELD_URL,
  OPERATORS_FIELD_YES_NO
]

/**
 * Return token of pagination.
 * @author EdwinBetanc0urt <EdwinBetanc0urt@oulook.com>
 * @param {string} token
 * @returns {string}
 */
export function extractPagingToken(token) {
  if (isEmptyValue(token)) {
    return ''
  }

  const lastIndex = token.lastIndexOf('-')
  const onlyToken = token.slice(0, lastIndex)

  return onlyToken
}

/**
 * Return token of pagination.
 * @author EdwinBetanc0urt <EdwinBetanc0urt@oulook.com>
 * @param {number} pageNumber
 * @param {string} token
 * @returns {string}
 */
export function generatePageToken({ pageNumber = 1, token }) {
  if (isEmptyValue(pageNumber) || pageNumber < 1) {
    pageNumber = 1
  }

  // if (isEmptyValue(token)) {
  //   return getToken() + '-' + pageNumber
  // }

  // const onlyToken = extractPagingToken(token)
  // if (isEmptyValue(onlyToken)) {
  //   return ''
  // }

  // return onlyToken + '-' + pageNumber
  return pageNumber
}
