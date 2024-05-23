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

import store from '@/store'

// API Request Methods
import { requestSaveProcessCustomization } from '@/api/ADempiere/user-customization/processes'

// Constants
import { REPORT_EXPORT_TYPES } from '@/utils/ADempiere/constants/report'
import { BUTTON } from '@/utils/ADempiere/references'

// Utils and Helpers Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import { generateField } from '@/utils/ADempiere/dictionaryUtils'
import { sortFields } from '@/utils/ADempiere/dictionary/panel'
import { isAddRangeField, isHiddenField } from '@/utils/ADempiere/references'
import { convertStringToBoolean } from '@/utils/ADempiere/formatValue/booleanFormat'

/**
 * Prefix to generate unique key
 */
export const CONTAINER_PROCESS_PREFIX = 'process_'

/**
 * Is displayed field parameter in process/report panel
 * @param {number} display_type
 * @param {string} display_logic
 * @param {boolean} isDisplayedFromLogic
 * @returns {boolean}
 */
export function isDisplayedField({ display_type, display_logic, isDisplayedFromLogic }) {
  // button field not showed
  if (isHiddenField(display_type)) {
    return false
  }

  // verify if field is active
  return (isEmptyValue(display_logic) || isDisplayedFromLogic)
}

/**
 * Default showed field from user
 */
export function evaluateDefaultFieldShowed({
  default_value, display_type, parsedDefaultValue,
  isShowedFromUser, is_displayed_as_panel,
  is_mandatory, display_logic
}) {
  if (!isEmptyValue(is_displayed_as_panel)) {
    return convertStringToBoolean(is_displayed_as_panel)
  }
  if (!isEmptyValue(display_logic)) {
    return true
  }
  const isMandatoryGenerated = isMandatoryField({
    display_type, is_mandatory
  })
  if (isMandatoryGenerated) {
    return true
  }
  if (!isEmptyValue(default_value) || !isEmptyValue(parsedDefaultValue)) {
    return true
  }
  return Boolean(isShowedFromUser)
}

/**
 * Process manager mandatory logic
 * TODO: Add support on ADempiere core to mandatory logic
 * @param {boolean} is_mandatory
 * @returns {boolean}
 */
export function isMandatoryField({ display_type, is_mandatory }) {
  if (display_type === BUTTON.id) {
    return false
  }
  return is_mandatory
}

/**
 * Process is read only field
 * @param {string} read_only_logic
 * @param {boolean} isReadOnlyFromLogic
 * @returns {boolean}
 */
export function isReadOnlyField({ read_only_logic, isReadOnlyFromLogic }) {
  return !isEmptyValue(read_only_logic) && isReadOnlyFromLogic
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
  let panelType = 'process'
  let reportExportTypes = []
  if (processToGenerate.is_report) {
    panelType = 'report'
    reportExportTypes = REPORT_EXPORT_TYPES
  }

  const additionalAttributes = {
    containerUuid: processToGenerate.uuid,
    parentUuid: containerUuidAssociated,
    panelName: processToGenerate.name,
    isEvaluateValueChanges: true,
    isEditSecuence: false,
    panelType: panelType
  }

  //  Convert from gRPC
  let fieldsList = []
  if (processToGenerate.parameters) {
    const fieldsRangeList = []

    fieldsList = processToGenerate.parameters
      .map(fieldItem => {
        const field = generateField({
          fieldToGenerate: fieldItem,
          moreAttributes: additionalAttributes,
          evaluateDefaultFieldShowed
        })
        // Add new field if is range number
        if (isAddRangeField(field)) {
          const fieldRange = generateField({
            fieldToGenerate: fieldItem,
            moreAttributes: additionalAttributes,
            typeRange: true,
            evaluateDefaultFieldShowed
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
    reportExportTypes: reportExportTypes,
    containerUuidAssociated,
    isLoadedFieldsList: true,
    sortOrderColumnName: 'sequence',
    fieldsList
  }

  return {
    processDefinition
  }
}

/**
 * Container manager to Process panel
 */
export const containerManager = {
  getPanel({ containerUuid }) {
    return store.getters.getStoredProcess(containerUuid)
  },
  changePanelAttribute({
    containerUuid,
    attributeName,
    attributeValue
  }) {
    store.commit('changeProcessAttribute', {
      uuid: containerUuid,
      attributeName,
      attributeValue
    })
  },
  getFieldsList({ containerUuid }) {
    return store.getters.getStoredFieldsFromProcess(containerUuid)
  },
  getFieldsToHidden: ({ parentUuid, containerUuid, fieldsList, showedMethod, isEvaluateDefaultValue, isTable }) => {
    return store.getters.getProcessParametersListToHidden({
      parentUuid,
      containerUuid,
      fieldsList,
      showedMethod,
      isEvaluateDefaultValue,
      isTable
    })
  },

  actionPerformed: ({ field, value }) => {
    store.dispatch('processActionPerformed', {
      field,
      value
    })
  },

  setDefaultValues: ({ containerUuid }) => {
    store.dispatch('setProcessDefaultValues', {
      containerUuid
    })
  },

  isDisplayedField,
  isDisplayedDefault: ({ is_mandatory, default_value, isShowedFromUser }) => {
    // add is showed from user
    if (is_mandatory) {
      return true
    }
    if (!isEmptyValue(default_value)) {
      return isShowedFromUser
    }
    return false
  },

  isReadOnlyField,

  isMandatoryField,

  changeFieldShowedFromUser({ containerUuid, fieldsShowed }) {
    store.dispatch('changeProcessFieldShowedFromUser', {
      containerUuid,
      fieldsShowed
    })
  },

  /**
   * @returns Promisse with value and displayedValue
   */
  getDefaultValue({ parentUuid, containerUuid, uuid, id, contextColumnNames, columnName, value }) {
    return store.dispatch('getDefaultValueFromServer', {
      parentUuid,
      containerUuid,
      contextColumnNames,
      processParameterId: id,
      processParameterUuid: uuid,
      //
      columnName,
      value
    })
  },
  getLookupList({ parentUuid, containerUuid, contextColumnNames, id, uuid, searchValue, isAddBlankValue = false, blankValue }) {
    return store.dispatch('getLookupListFromServer', {
      parentUuid,
      containerUuid,
      contextColumnNames,
      processParameterId: id,
      processParameterUuid: uuid,
      searchValue,
      // app attributes
      isAddBlankValue,
      blankValue
    })
  },
  getSearchRecordsList({ parentUuid, containerUuid, contextColumnNames, tableName, columnName, id, filters, searchValue, pageNumber, pageSize }) {
    return store.dispatch('getSearchRecordsFromServer', {
      parentUuid,
      containerUuid,
      contextColumnNames,
      processParameterId: id,
      tableName,
      columnName,
      filters,
      searchValue,
      pageNumber,
      pageSize
    })
  },

  warehouseLocatorSearch({
    containerUuid,
    parentUuid,
    warehouseId,
    contextColumnNames,
    contextAttributesList,
    id,
    searchValue,
    // tableName,
    // columnName,
    pageNumber,
    pageSize
  }) {
    return store.dispatch('listWarehouseLocators', {
      containerUuid,
      parentUuid,
      warehouseId,
      contextColumnNames,
      contextAttributesList,
      processParameterId: id,
      searchValue,
      // tableName,
      // columnName,
      pageNumber,
      pageSize
    })
  },

  applyCustomization({
    containerUuid,
    levelType,
    levelValue,
    fieldAttributes
  }) {
    return requestSaveProcessCustomization({
      processId: containerUuid,
      levelType,
      levelValue,
      fieldAttributes
    })
  }
}
