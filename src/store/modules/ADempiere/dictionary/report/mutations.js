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

import Vue from 'vue'

/**
 * Report Mutations
 * All related to global store of Dictionary Window
 */
export default {
  addReportToList(state, report) {
    Vue.set(state.storedReports, report.uuid, report)
  },

  /**
   * Change report field attribute
   * @param {object} field
   * @param {string} attributeName
   * @param {mixed} attributeValue
   */
  changeReportFieldAttribute(state, payload) {
    const { attributeName, attributeValue } = payload

    payload.field[attributeName] = attributeValue
  },

  /**
   * Change Report Attribute
   * @param {string} uuid - Uuid the Report
   * @param {string} attributeName - Name of the Attribute to change
   * @param {string} attributeValue - Value of the Attribute to change
   */
  changeReportAttribute(state, {
    uuid,
    attributeName,
    attributeValue
  }) {
    Vue.set(state.storedReports[uuid], attributeName, attributeValue)
  }
}
