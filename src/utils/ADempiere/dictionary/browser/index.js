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

import language from '@/lang'
import store from '@/store'

// Constants
import {
  DISPLAY_COLUMN_PREFIX
} from '@/utils/ADempiere/dictionaryUtils'
import { BUTTON } from '@/utils/ADempiere/references'
import { OPERATOR_IN } from '@/utils/ADempiere/dataUtils.js'

// API Request Methods
import { requestSaveBrowseCustomization } from '@/api/ADempiere/user-customization/browsers'

// Utils and Helpers Methods
import { isHiddenField } from '@/utils/ADempiere/references'
import { showNotification } from '@/utils/ADempiere/notification.js'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import { zoomIn } from '@/utils/ADempiere/coreUtils.js'
import { convertStringToBoolean } from '@/utils/ADempiere/formatValue/booleanFormat'

/**
 * Is displayed field in panel query criteria
 */
export function isDisplayedField({ display_type, is_query_criteria, display_logic, isDisplayedFromLogic }) {
  // button field not showed
  if (isHiddenField(display_type)) {
    return false
  }

  return is_query_criteria && (isEmptyValue(display_logic) || isDisplayedFromLogic)
}

/**
 * Default showed field from user
 */
export function evaluateDefaultFieldShowed({
  display_type, is_query_criteria,
  isShowedFromUser, is_displayed_as_panel,
  default_value, parsedDefaultValue, display_logic,
  is_mandatory, isMandatoryFromLogic, mandatory_logic
}) {
  if (!isEmptyValue(is_displayed_as_panel)) {
    return convertStringToBoolean(is_displayed_as_panel)
  }
  if (!isEmptyValue(display_logic)) {
    return true
  }
  const isMandatoryGenerated = isMandatoryField({
    display_type, is_query_criteria, is_mandatory, isMandatoryFromLogic, mandatory_logic
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
 * Smart Browser not manager mandatory logic, used as query
 * @param {boolean} isMandatoryFromLogic
 * @returns {boolean}
 */
export function isMandatoryField({ display_type, is_query_criteria, is_mandatory, isMandatoryFromLogic, mandatory_logic }) {
  if (display_type === BUTTON.id) {
    return false
  }
  return is_query_criteria && (is_mandatory || (!isEmptyValue(mandatory_logic) && isMandatoryFromLogic))
}

export function isReadOnlyField({ is_query_criteria, operator, isReadOnlyFromLogic }) {
  return is_query_criteria && isReadOnlyFromLogic // || IGNORE_VALUE_OPERATORS_LIST.includes(operator)
}

export function evaluateDefaultColumnShowed({
  is_key, display_type, is_displayed,
  isShowedTableFromUser, is_displayed_as_table,
  is_mandatory, isMandatoryFromLogic, mandatory_logic
}) {
  if (!isEmptyValue(is_displayed_as_table)) {
    return convertStringToBoolean(is_displayed_as_table)
  }
  // const isDisplayedColumnGenerated = isDisplayedColumn({
  //   is_key,
  //   display_type,
  //   isDisplayed,
  //   is_mandatory,
  //   isMandatoryFromLogic,
  //   mandatory_logic
  // })
  // if (!isDisplayedColumnGenerated) {
  //   return
  // }
  // const isMandatoryGenerated = isMandatoryColumn({
  //   display_type, is_mandatory, isMandatoryFromLogic, mandatory_logic
  // })
  // if (isMandatoryGenerated) {
  //   return true
  // }

  // return Boolean(isShowedTableFromUser)
  return true
}

/**
 * Is displayed column in table multi record
 */
export function isDisplayedColumn({ display_type, is_displayed, is_key }) {
  // column check to selection or button field not showed
  if (is_key || isHiddenField(display_type)) {
    return false
  }

  return is_displayed
}

export function isMandatoryColumn({ display_type, is_mandatory, isMandatoryFromLogic, mandatory_logic }) {
  if (display_type === BUTTON.id) {
    return false
  }
  return is_mandatory || (!isEmptyValue(mandatory_logic) && isMandatoryFromLogic)
}

/**
 * Read only column in table multi record
 * @param {boolean} is_read_only
 * @returns {boolean}
 */
export function isReadOnlyColumn({ is_read_only }) {
  return is_read_only
}

export const refreshBrowserSearh = {
  name: language.t('actionMenu.refreshRecords'),
  enabled: () => {
    return true
  },
  svg: false,
  icon: 'el-icon-refresh',
  actionName: 'refreshRecords',
  refreshRecords: ({ containerUuid }) => {
    // used to browser
    store.dispatch('getBrowserSearch', {
      containerUuid
    })
  }
}

export const runProcessOfBrowser = {
  name: language.t('actionMenu.runProcess'),
  enabled: ({ containerUuid, containerManager }) => {
    const selection = containerManager.getSelection({
      containerUuid
    })

    return !isEmptyValue(selection)
  },
  svg: false,
  icon: 'el-icon-setting',
  actionName: 'runProcessOfBrowser',
  uuid: null,
  runProcessOfBrowser: ({ containerUuid, containerManager }) => {
    const selection = containerManager.getSelection({
      containerUuid
    })
    if (isEmptyValue(selection)) {
      showNotification({
        title: language.t('data.selectionRequired'),
        type: 'warning'
      })
      return
    }

    const process = store.getters.getProcessOfBrowser(containerUuid)
    /*
    const storedProcess = store.getters.getStoredProcess(process.uuid)
    if (isEmptyValue(storedProcess)) {
      store.dispatch('getProcessDefinitionFromServer', {
        uuid: process.uuid
      })
    }
    */

    store.commit('setShowedModalDialog', {
      containerUuid: process.uuid,
      isShowed: true
    })
  }
}

/**
 * TableName
 * isDeleteable
 */
export const runDeleteable = {
  name: language.t('actionMenu.delete'),
  enabled: ({ containerUuid, containerManager }) => {
    const { is_deleteable, table_name } = store.getters.getStoredBrowser(containerUuid)
    if (!is_deleteable || isEmptyValue(table_name)) {
      return false
    }
    const selection = containerManager.getSelection({
      containerUuid
    })

    return !isEmptyValue(selection)
  },
  svg: false,
  icon: 'el-icon-delete',
  actionName: 'deleteRecordOfBrowser',
  uuid: null,
  deleteRecordOfBrowser: ({ containerUuid, containerManager }) => {
    const selection = containerManager.getSelection({
      containerUuid
    })
    if (isEmptyValue(selection)) {
      showNotification({
        title: language.t('data.selectionRequired'),
        type: 'warning'
      })
      return
    }
    store.dispatch('deleteRecordOfBrowser', {
      containerUuid,
      selection
    })
  }
}

export const clearQueryCriteria = {
  name: language.t('smartBrowser.clearFields.title'),
  description: language.t('smartBrowser.clearFields.description'),
  enabled: ({ containerUuid }) => {
    return true
  },
  isSvgIcon: true,
  icon: 'layers-clear',
  actionName: 'clearQueryCriteria',
  uuid: null,
  clearQueryCriteria: ({ containerUuid }) => {
    store.dispatch('setBrowserDefaultValues', {
      containerUuid
    })

    const emptyMandatory = store.getters.getBrowserFieldsEmptyMandatory({
      containerUuid
    })
    if (isEmptyValue(emptyMandatory)) {
      store.dispatch('getBrowserSearch', {
        containerUuid
      })
    }
  }
}

/**
 * Zoom in on the window associated with the smart browser
 * @param {string} uuid of window
 */
export const zoomWindow = {
  name: language.t('actionMenu.zoomWindow'),
  enabled: ({ containerUuid }) => {
    const browser = store.getters.getStoredBrowser(containerUuid)
    if (!isEmptyValue(browser)) {
      return !isEmptyValue(browser.window)
    }
    return false
  },
  svg: false,
  icon: 'el-icon-zoom-in',
  type: 'zoom',
  actionName: 'zoomWindow',
  uuid: null,
  zoomWindow: ({ uuid, containerUuid }) => {
    let filters
    const browser = store.getters.getStoredBrowser(containerUuid)
    const selection = store.getters.getBrowserSelectionsList({ containerUuid })
    if (!isEmptyValue(selection) && !isEmptyValue(browser)) {
      const keyColumn = browser.keyColumn
      const elementColumn = browser.elementsList[keyColumn]
      const listRecord = selection.map(list => list[keyColumn])
      filters = [{
        columnName: elementColumn,
        values: listRecord,
        operator: OPERATOR_IN.operator
      }]
    }
    zoomIn({
      query: {
        filters
      },
      uuid
    })
  }
}

/**
 * Manage the browser panel
 */
export const containerManager = {
  getPanel({ containerUuid }) {
    return store.getters.getStoredBrowser(containerUuid)
  },
  changePanelAttribute({
    containerUuid,
    attributeName,
    attributeValue
  }) {
    store.commit('changeBrowserAttribute', {
      uuid: containerUuid,
      attributeName,
      attributeValue
    })
  },
  getFieldsList({ containerUuid }) {
    return store.getters.getStoredFieldsFromBrowser(containerUuid)
  },
  getFieldsToHidden: ({ containerUuid, showedMethod, isEvaluateDefaultValue, isTable, fieldsList }) => {
    return store.getters.getBrowserFieldsListToHidden({
      containerUuid,
      fieldsList,
      showedMethod,
      isEvaluateDefaultValue,
      isTable
    })
  },

  actionPerformed({ field, value, valueTo, containerUuid }) {
    return store.dispatch('browserActionPerformed', {
      containerUuid,
      field,
      value,
      valueTo
    })
  },

  setDefaultValues: ({ parentUuid, containerUuid }) => {
    store.dispatch('setBrowserDefaultValues', {
      parentUuid,
      containerUuid
    })
  },

  /**
   * Is displayed field in panel single record
   */
  isDisplayedField,
  isDisplayedDefault: ({ is_mandatory }) => {
    // add is showed from user
    if (is_mandatory) {
      return true
    }
    return false
  },
  isDisplayedColumn,
  isDisplayedDefaultTable: ({ is_mandatory, is_key }) => {
    if (is_mandatory && !is_key) {
      return true
    }
    return false
  },

  isMandatoryField,
  isMandatoryColumn,

  isReadOnlyField,

  changeFieldShowedFromUser({ containerUuid, fieldsShowed }) {
    store.dispatch('changeBrowserFieldShowedFromUser', {
      containerUuid,
      fieldsShowed
    })
  },
  changeColumnShowedFromUser({ parentUuid, containerUuid, fieldsShowed }) {
    store.dispatch('changeBrowseColumnShowedFromUser', {
      parentUuid,
      containerUuid,
      fieldsShowed
    })
  },

  setSelection: ({
    containerUuid,
    recordsSelected
  }) => {
    store.commit('setBrowserSelectionsList', {
      containerUuid,
      selectionsList: recordsSelected
    })
  },
  getSelection: ({
    containerUuid
  }) => {
    return store.getters.getBrowserSelectionsList({
      containerUuid
    })
  },
  getRecordCount({ containerUuid }) {
    return store.getters.getBrowserRecordCount({
      containerUuid
    })
  },

  setRow: ({ containerUuid, rowIndex, row }) => {
    return store.commit('setBrowserRow', {
      containerUuid,
      rowIndex,
      row
    })
  },
  getRow: ({ containerUuid, rowIndex }) => {
    return store.getters.getBrowserRowData({
      containerUuid,
      rowIndex
    })
  },

  setCell: ({ containerUuid, rowIndex, columnName, value }) => {
    return store.commit('setBrowserCell', {
      containerUuid,
      rowIndex,
      columnName,
      value
    })
  },
  getCell: ({ containerUuid, rowIndex, columnName }) => {
    return store.getters.getBrowserCellData({
      containerUuid,
      rowIndex,
      columnName
    })
  },

  setPageNumber: ({ containerUuid, pageNumber, pageSize }) => {
    store.dispatch('getBrowserSearch', {
      containerUuid,
      pageSize,
      pageNumber
    })
  },
  getPageNumber({ containerUuid }) {
    return store.getters.getBrowserPageNumber({
      containerUuid
    })
  },
  setPageSize: ({ containerUuid, pageSize, pageNumber = 1 }) => {
    store.dispatch('getBrowserSearch', {
      containerUuid,
      pageNumber,
      pageSize
    })
  },
  getPageSize({ containerUuid }) {
    return store.getters.getBrowserPageSize({
      containerUuid
    })
  },

  /**
   * @returns Promisse with value and displayedValue
   */
  getDefaultValue({ parentUuid, containerUuid, name, uuid, id, contextColumnNames, columnName, value }) {
    return store.dispatch('getDefaultValueFromServer', {
      parentUuid,
      containerUuid,
      contextColumnNames,
      browseFieldId: id,
      browseFieldUuid: uuid,
      uuid,
      // id,
      //
      columnName,
      value
    }).then(response => {
      if (!isEmptyValue(response.value)) {
        const field = store.getters.getStoredBrowserFieldFromColumnName({
          containerUuid,
          columnName
        })

        // update element column name
        if (!field.isSameColumnElement) {
          store.commit('updateValueOfField', {
            containerUuid,
            columnName: field.element_name,
            value: response.value
          })

          store.commit('updateValueOfField', {
            containerUuid,
            columnName: DISPLAY_COLUMN_PREFIX + field.element_name,
            value: response.displayedValue
          })
        }

        if (field.isGetServerValue) {
          store.dispatch('browserActionPerformed', {
            containerUuid,
            field,
            value: response.value
          })
        }
      }
      return response
    })
  },
  getLookupList({ parentUuid, containerUuid, contextColumnNames, uuid, id, searchValue, isAddBlankValue = false, blankValue }) {
    return store.dispatch('getLookupListFromServer', {
      parentUuid,
      containerUuid,
      contextColumnNames,
      browseFieldId: id,
      browseFieldUuid: uuid,
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
      browseFieldId: id,
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
    uuid,
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
      browseFieldUuid: uuid,
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
    return requestSaveBrowseCustomization({
      browseId: containerUuid,
      levelType,
      levelValue,
      fieldAttributes
    })
  }
}
