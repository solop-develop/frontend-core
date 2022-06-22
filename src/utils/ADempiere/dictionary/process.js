// ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
// Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
// Contributor(s): Edwin Betancourt EdwinBetanc0urt@outlook.com www.erpya.com
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
import store from '@/store'

// utils and helpers methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import { generateField } from '@/utils/ADempiere/dictionaryUtils'
import { sortFields } from '@/utils/ADempiere/dictionary/panel'
import { isHiddenField } from '@/utils/ADempiere/references'

/**
 * Is displayed field parameter in process/report panel
 * @param {number} displayType
 * @param {boolean} isActive
 * @param {boolean} isDisplayed
 * @param {string} displayLogic
 * @param {boolean} isDisplayedFromLogic
 * @returns {boolean}
 */
export function isDisplayedField({ displayType, isActive, isDisplayed, displayLogic, isDisplayedFromLogic }) {
  // button field not showed
  if (isHiddenField(displayType)) {
    return false
  }

  // verify if field is active
  return isActive && isDisplayed && (isEmptyValue(displayLogic) || isDisplayedFromLogic)
}

/**
 * Process manager mandatory logic
 * TODO: Add support on ADempiere core to mandatory logic
 * @param {boolean} isMandatory
 * @returns {boolean}
 */
export function isMandatoryField({ isMandatory }) {
  return isMandatory
}

/**
 * Process is read only field
 * @param {string} readOnlyLogic
 * @param {boolean} isReadOnlyFromLogic
 * @returns {boolean}
 */
export function isReadOnlyField({ readOnlyLogic, isReadOnlyFromLogic }) {
  return !isEmptyValue(readOnlyLogic) && isReadOnlyFromLogic
}

/**
 * Generate the actions and the associated process to store in the vuex store,
 * avoiding additional requests
 * @param {object} processToGenerate
 * @returns {object}
 */
export function generateProcess({
  processToGenerate,
  containerUuidAssociated = undefined
}) {
  const panelType = processToGenerate.isReport ? 'report' : 'process'
  const additionalAttributes = {
    containerUuid: processToGenerate.uuid,
    isEvaluateValueChanges: true,
    panelType
  }

  //  Convert from gRPC
  let fieldsList = []
  if (processToGenerate.parameters) {
    const fieldsRangeList = []

    fieldsList = processToGenerate.parameters
      .map(fieldItem => {
        const field = generateField({
          fieldToGenerate: fieldItem,
          moreAttributes: additionalAttributes
        })
        // Add new field if is range number
        if (field.isRange && field.componentPath === 'FieldNumber') {
          const fieldRange = generateField({
            fieldToGenerate: fieldItem,
            moreAttributes: additionalAttributes,
            typeRange: true
          })

          fieldsRangeList.push(fieldRange)
        }

        return field
      })

    fieldsList = fieldsList.concat(fieldsRangeList)
    // order range fields
    fieldsList = sortFields({
      fieldsList
    })
  }

  // delete fields props
  delete processToGenerate.parameters

  const processDefinition = {
    ...processToGenerate,
    ...additionalAttributes,
    isAssociated: Boolean(containerUuidAssociated),
    containerUuidAssociated,
    fieldsList
  }

  return {
    processDefinition
  }
}

export const runProcess = {
  name: language.t('actionMenu.runProcess'),
  enabled: ({ containerUuid }) => {
    const fieldsEmpty = store.getters.getProcessParametersEmptyMandatory({
      containerUuid
    })

    return isEmptyValue(fieldsEmpty)
  },
  svg: false,
  icon: 'el-icon-setting',
  actionName: 'runProcess',
  uuid: null,
  runProcess: ({ containerUuid }) => {
    store.dispatch('startProcess', {
      containerUuid
    })
  }
}
