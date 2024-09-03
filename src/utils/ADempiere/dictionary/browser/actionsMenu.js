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
import language from '@/lang'

// Constants
import { OPERATOR_IN } from '@/utils/ADempiere/dataUtils.js'
import { EXPORT_SUPPORTED_TYPES } from '@/utils/ADempiere/exportUtil.js'
import { BUTTON } from '@/utils/ADempiere/references.js'

// Utils and Helpers Methods
import { showNotification } from '@/utils/ADempiere/notification.js'
import { zoomIn } from '@/utils/ADempiere/coreUtils.js'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import { exportFileFromJson } from '@/utils/ADempiere/exportUtil.js'
import { clientDateTime } from '@/utils/ADempiere/formatValue/dateFormat'
import { decodeHtmlEntities } from '@/utils/ADempiere/formatValue/stringFormat'
import { formatField } from '@/utils/ADempiere/valueFormat'

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

/**
 * Export records selected on table Window/Smart Browse
 */
export const exportAllRecords = {
  name: language.t('smartBrowser.exportAllRecords.title'),
  description: language.t('smartBrowser.exportAllRecords.description'),
  enabled: ({ containerUuid, containerManager }) => {
    const emptyMandatory = store.getters.getBrowserFieldsEmptyMandatory({
      containerUuid
    })
    if (!isEmptyValue(emptyMandatory)) {
      return false
    }
    const recordCount = store.getters.getBrowserRecordCount({
      containerUuid
    })
    if (isEmptyValue(recordCount) || recordCount <= 0) {
      return false
    }
    return true
  },
  svg: false,
  icon: 'el-icon-download',
  actionName: 'exportAllRecords',
  exportAllRecords: () => null,
  // generate export formats
  childs: Object.keys(EXPORT_SUPPORTED_TYPES).map(format => {
    return {
      name: EXPORT_SUPPORTED_TYPES[format],
      enabled: ({ containerUuid, containerManager }) => {
        return true
      },
      svg: false,
      icon: 'el-icon-download',
      actionName: 'exportAllRecords',
      exportAllRecords: ({ root, parentUuid, containerUuid, containerManager }) => {
        store.dispatch('getBrowserExportRecords', {
          containerUuid
        }).then(response => {
          const currentSelection = response

          const fieldsList = containerManager.getFieldsList({
            containerUuid
          })

          const fieldsListAvailable = fieldsList.filter(fieldItem => {
            const {
              isShowedTableFromUser,
              display_type, is_encrypted
            } = fieldItem
            // Hide encrypted fields
            if (is_encrypted) {
              return false
            }
            // Hide simple button fields without a value
            if (display_type === BUTTON.id) { // && fieldItem.referenceValue === 0) {
              return false
            }

            if (containerManager.isDisplayedColumn(fieldItem)) {
              const isMandatoryGenerated = containerManager.isMandatoryColumn(fieldItem)
              const isDisplayedDefault = containerManager.isDisplayedDefaultTable({
                ...fieldItem,
                is_mandatory: isMandatoryGenerated
              })
              // madatory, not parent column and without default value to window, mandatory or with default value to others
              if (isDisplayedDefault) {
                return true
              }
              // showed by user
              return isShowedTableFromUser
            }

            return false
          }).sort((a, b) => a.sequence - b.sequence)

          const headerList = fieldsListAvailable.map(fieldItem => {
            // decode html entities
            return decodeHtmlEntities(fieldItem.name)
          })

          // filter only showed columns
          const data = currentSelection.map(row => {
            const newRow = {}
            fieldsListAvailable.forEach(field => {
              const { column_name, displayColumnName, display_type } = field
              const value = formatField({
                displayType: display_type,
                value: row[column_name],
                displayedValue: row[displayColumnName]
              })
              newRow[column_name] = value
            })
            return newRow
          })

          const title = containerManager.getPanel({
            parentUuid,
            containerUuid
          }).name
          exportFileFromJson({
            header: headerList,
            data,
            fileName: `${title} ${clientDateTime()}`,
            exportType: format
          })
        })
      }
    }
  })
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
    store.commit('setBrowserProcessAll', {
      uuid: containerUuid,
      isAll: false
    })
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

export const runProcessOfBrowserAllRecords = {
  name: language.t('smartBrowser.processAllRecords.title'),
  description: language.t('smartBrowser.processAllRecords.description'),
  enabled: ({ containerUuid, containerManager }) => {
    const emptyMandatory = store.getters.getBrowserFieldsEmptyMandatory({
      containerUuid
    })
    if (!isEmptyValue(emptyMandatory)) {
      return false
    }
    const recordCount = store.getters.getBrowserRecordCount({
      containerUuid
    })
    if (isEmptyValue(recordCount) || recordCount <= 0) {
      return false
    }
    return true
  },
  svg: false,
  icon: 'el-icon-setting',
  actionName: 'runProcessOfBrowser',
  uuid: null,
  runProcessOfBrowser: ({ containerUuid, containerManager }) => {
    const recordCount = store.getters.getBrowserRecordCount({
      containerUuid
    })
    if (isEmptyValue(recordCount) || recordCount <= 0) {
      showNotification({
        title: language.t('smartBrowser.processAllRecords.withoutResults'),
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

    store.commit('setBrowserProcessAll', {
      uuid: containerUuid,
      isAll: true
    })

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
