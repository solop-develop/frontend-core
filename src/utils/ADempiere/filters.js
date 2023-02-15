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

import { castValueWithType, isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import { isNumber } from '@/utils/ADempiere/formatValue/numberFormat'
import { OPERATOR_EQUAL, OPERATORS_LIST, OPERATOR_NULL } from '@/utils/ADempiere/dataUtils'

class Filters {
  constructor() {
    this.filtersList = new Map()
  }

  static newInstance() {
    return new Filters()
  }

  /**
   * Set filter with columnName, operator and value
   * @param {string} columnName as key filter
   * @param {string} operator
   * @returns {class} Filters
   */
  withFilter({ columnName, operator = 'equal', value }) {
    if (isEmptyValue(value) || isEmptyValue(columnName)) {
      return this
    }
    this.filtersList.set(columnName, {
      columnName,
      operator,
      value
    })
    return this
  }

  /**
   * Get filter with columnName key
   * @param {string} columnName
   * @returns {object}
   */
  getFilter(columnName) {
    return this.filtersList.get(columnName)
  }

  /**
   * Set value with columnName key
   * @param {string} columnName as key filter
   * @param {string} value
   * @returns {class} Filters
   */
  setValue({ columnName, value }) {
    let filter = this.getFilter(columnName)
    if (isEmptyValue(filter)) {
      filter = {
        columnName,
        operator: 'equal'
      }
    }

    this.filtersList.set(columnName, {
      ...filter,
      value
    })
    return this
  }

  /**
   * Set operator with columnName key
   * @param {string} columnName as key filter
   * @param {string} operator
   * @returns {class} Filters
   */
  setOperator({ columnName, operator = 'equal' }) {
    let filter = this.getFilter(columnName)
    if (isEmptyValue(filter)) {
      filter = {
        columnName
      }
    }

    this.filtersList.set(columnName, {
      ...filter,
      operator
    })

    return this
  }

  /**
   * Convert URI to filters
   * @param {array} filters
   * @returns {object} data
   */
  convertFilters(filters) {
    if (!filters) {
      return
    }

    const delimiter = ','
    const data = {}
    // str: columnName, type, value
    filters.forEach(str => {
      const index = str.indexOf(delimiter)
      const columnName = str.substr(0, index)

      // type, value
      const str2 = str.substr(index + 1)

      const index2 = str2.indexOf(delimiter)
      const type = str2.substr(0, index2)

      const value = str2.substr(index2 + 1)

      data[columnName] = castValueWithType({
        value,
        type
      })
    })

    return data
  }

  /**
   * Based on evaluator.js
   * TODO: Add support to LIKE, NOT, IN
   * @param {*} sqlWhere
   */
  setFiltersWithSQL(sqlWhere) {
    const comparations = []
    const conditions = sqlWhere.split(/(OR|AND)/)
    conditions.forEach(condition => {
      if (['AND', 'OR'].includes(condition.trim())) {
        // break
        return
      }
      const compare = condition.replace(/\(|\)/g, '')
      comparations.push(compare)
    })

    const sqlOperators = /(<>|<=|>=|!=|<|=|>|NOT\s+IN|IN|NOT\s+BETWEEN|BETWEEN|NOT\s+LIKE|LIKE|IS\s+NULL|IS\s+NOT\s+NULL)/

    comparations.forEach(compare => {
      // TODO: Add support to <>!=
      const values = compare.split(sqlOperators)

      const index = values.at(0).indexOf('.')
      const columnName = values.at(0).substr(index + 1)
      const filterOperator = values.at(1)

      let operatorValue = OPERATORS_LIST.find(itemOperator => {
        return itemOperator.sqlOperators.includes(filterOperator.trim())
      })

      let type = 'STRING'
      let value = values.at(2).trim()
      if (isEmptyValue(value)) {
        value
      } else if (value.includes('\'')) {
        value = value.replace(/'/g, '')
      } else if (isNumber(value)) {
        value = Number(value)
        type = 'NUMBER'
      }
      if (isEmptyValue(operatorValue)) {
        operatorValue = OPERATOR_EQUAL
      }
      if (operatorValue.operator === OPERATOR_NULL.operator) {
        value = undefined
        type = 'UNKNOWN'
      }

      this.filtersList.set(columnName, {
        columnName,
        type,
        operator: operatorValue.operator,
        value
      })
    })

    return this
  }

  /**
   * Get array of objects, [{ columnName, value, operator }]
   * @returns array objects
   */
  getAsArray() {
    return Array.from(this.filtersList.values())
  }

  /**
   * Get array of objects, [{ columnName, value, operator }]
   * @returns array objects
   */
  getAsObject() {
    const filters = []
    for (const item of this.filtersList) {
      filters.push(item[1])
    }
    return filters
  }

  get asArray() {
    return this.getAsArray()
  }

  /**
   * Get array to uri
   * @returns string
   */
  getAsUri() {
    return encodeURIComponent(
      JSON.stringify(
        this.getAsArray()
      )
    )
  }

  get asUri() {
    return this.getAsUri()
  }
}

export default Filters
