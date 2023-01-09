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

import language from '@/lang'
import store from '@/store'

// Utils and Helpers Methods
import { isHiddenField, BUTTON } from '@/utils/ADempiere/references'
import { showMessage, showNotification } from '@/utils/ADempiere/notification.js'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import { OPERATOR_IN } from '@/utils/ADempiere/dataUtils.js'
import { zoomIn } from '@/utils/ADempiere/coreUtils.js'

/**
 * Is displayed field in panel query criteria
 */
export function isDisplayedField({ displayType, isActive, isQueryCriteria, displayLogic, isDisplayedFromLogic }) {
  // button field not showed
  if (isHiddenField(displayType)) {
    return false
  }

  return isActive && isQueryCriteria && (isEmptyValue(displayLogic) || isDisplayedFromLogic)
}

/**
 * Default showed field from user
 */
export function evaluateDefaultFieldShowed({
  displayType, isQueryCriteria, isShowedFromUser,
  defaultValue, parsedDefaultValue,
  isMandatory, isMandatoryFromLogic, mandatoryLogic
}) {
  const isMandatoryGenerated = isMandatoryField({
    displayType, isQueryCriteria, isMandatory, isMandatoryFromLogic, mandatoryLogic
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
 * Smart Browser not manager mandatory logic, used as query
 * @param {boolean} isMandatoryFromLogic
 * @returns {boolean}
 */
export function isMandatoryField({ displayType, isQueryCriteria, isMandatory, isMandatoryFromLogic, mandatoryLogic }) {
  if (displayType === BUTTON.id) {
    return false
  }
  return isQueryCriteria && (isMandatory || (!isEmptyValue(mandatoryLogic) && isMandatoryFromLogic))
}

export function isReadOnlyField({ isQueryCriteria, isReadOnlyFromLogic }) {
  return isQueryCriteria && isReadOnlyFromLogic
}

/**
 * Is displayed column in table multi record
 */
export function isDisplayedColumn({ displayType, isActive, isDisplayed, isKey }) {
  // column check to selection or button field not showed
  if (isKey || isHiddenField(displayType)) {
    return false
  }

  return isActive && isDisplayed
}

export function isMandatoryColumn({ displayType, isMandatory, isMandatoryFromLogic, mandatoryLogic }) {
  if (displayType === BUTTON.id) {
    return false
  }
  return isMandatory || (!isEmptyValue(mandatoryLogic) && isMandatoryFromLogic)
}

/**
 * Read only column in table multi record
 * @param {boolean} isReadOnly
 * @returns {boolean}
 */
export function isReadOnlyColumn({ isReadOnly }) {
  return isReadOnly
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
    const fieldsEmpty = store.getters.getBrowserFieldsEmptyMandatory({
      containerUuid
    })
    if (!isEmptyValue(fieldsEmpty)) {
      showMessage({
        message: language.t('notifications.mandatoryFieldMissing') + fieldsEmpty,
        type: 'info'
      })
      return
    }

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
 * isDeleteable
 */
export const runDeleteable = {
  name: language.t('actionMenu.delete'),
  enabled: ({ containerUuid, containerManager }) => {
    const { isDeleteable, tableName } = store.getters.getStoredBrowser(containerUuid)
    if (!isDeleteable || isEmptyValue(tableName)) {
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
  isDisplayedDefault: ({ isMandatory, defaultValue }) => {
    // add is showed from user
    if (isMandatory || !isEmptyValue(defaultValue)) {
      return true
    }
    return false
  },

  isMandatoryField,

  isReadOnlyField,

  changeFieldShowedFromUser({ containerUuid, fieldsShowed }) {
    store.dispatch('changeBrowserFieldShowedFromUser', {
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

  panelMain() {
    return 'mainBrowser'
  },

  getPageNumber({ containerUuid }) {
    return store.getters.getBrowserPageNumber({
      containerUuid
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
      browseFieldUuid: uuid,
      id,
      //
      columnName,
      value
    })
  },
  getLookupList({ parentUuid, containerUuid, contextColumnNames, uuid, searchValue, isAddBlankValue = false, blankValue }) {
    return store.dispatch('getLookupListFromServer', {
      parentUuid,
      containerUuid,
      contextColumnNames,
      browseFieldUuid: uuid,
      searchValue,
      // app attributes
      isAddBlankValue,
      blankValue
    })
  },
  getSearchInfoList({ parentUuid, containerUuid, contextColumnNames, tableName, columnName, uuid, filters, searchValue, pageNumber }) {
    return store.dispatch('searchInfoList', {
      parentUuid,
      containerUuid,
      contextColumnNames,
      browseFieldUuid: uuid,
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
    uuid,
    searchValue,
    tableName,
    columnName,
    pageNumber
  }) {
    return store.dispatch('searchInfoList', {
      containerUuid,
      contextColumnNames,
      filters,
      browseFieldUuid: uuid,
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
  }
}
