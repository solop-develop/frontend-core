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

// Utils and Helpers Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import { generateField } from '@/utils/ADempiere/dictionaryUtils'
import { sortFields } from '@/utils/ADempiere/dictionary/panel'
import { BUTTON, isAddRangeField, isHiddenField } from '@/utils/ADempiere/references'
import { requestSaveProcessCustomization } from '@/api/ADempiere/user-customization/process'
import { convertStringToBoolean } from '@/utils/ADempiere/formatValue/booleanFormat'

/**
 * Prefix to generate unique key
 */
export const CONTAINER_PROCESS_PREFIX = 'process_'

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
 * Default showed field from user
 */
export function evaluateDefaultFieldShowed({
  defaultValue, displayType, parsedDefaultValue,
  isShowedFromUser, isDisplayedAsPanel,
  isMandatory, displayLogic
}) {
  if (!isEmptyValue(isDisplayedAsPanel)) {
    return convertStringToBoolean(isDisplayedAsPanel)
  }
  if (!isEmptyValue(displayLogic)) {
    return true
  }
  const isMandatoryGenerated = isMandatoryField({
    displayType, isMandatory
  })
  if (isMandatoryGenerated) {
    return true
  }
  if (!isEmptyValue(defaultValue) || !isEmptyValue(parsedDefaultValue)) {
    return true
  }
  return Boolean(isShowedFromUser)
}

/**
 * Process manager mandatory logic
 * TODO: Add support on ADempiere core to mandatory logic
 * @param {boolean} isMandatory
 * @returns {boolean}
 */
export function isMandatoryField({ displayType, isMandatory }) {
  if (displayType === BUTTON.id) {
    return false
  }
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
    panelName: processToGenerate.name,
    isEvaluateValueChanges: true,
    isEditSecuence: false,
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
  isDisplayedDefault: ({ isMandatory, defaultValue, isShowedFromUser }) => {
    // add is showed from user
    if (isMandatory) {
      return true
    }
    if (!isEmptyValue(defaultValue)) {
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
  getSearchInfoList({ parentUuid, containerUuid, contextColumnNames, tableName, columnName, id, filters, searchValue, pageNumber }) {
    return store.dispatch('searchInfoList', {
      parentUuid,
      containerUuid,
      contextColumnNames,
      processParameterId: id,
      tableName,
      columnName,
      filters,
      searchValue,
      pageNumber
    })
  },
  // TODO: Deperecated
  generalInfoSearch({
    containerUuid,
    contextColumnNames,
    filters,
    id,
    searchValue,
    tableName,
    columnName,
    pageNumber
  }) {
    return store.dispatch('searchInfoList', {
      containerUuid,
      contextColumnNames,
      filters,
      processParameterId: id,
      searchValue,
      tableName,
      columnName,
      pageNumber
    })
  },
  searchTableHeader({
    containerUuid,
    tableName
  }) {
    return store.dispatch('searchTableHeader', {
      containerUuid,
      tableName
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
    levelId,
    levelUuid,
    fieldAttributes
  }) {
    return requestSaveProcessCustomization({
      processUuid: containerUuid,
      levelType,
      levelId,
      levelUuid,
      fieldAttributes
    })
  }
}
