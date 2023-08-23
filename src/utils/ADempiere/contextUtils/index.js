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

import router from '@/router'
import store from '@/store'

// Constants
import {
  ACCOUNTING_COLUMNS,
  IS_SO_TRX,
  SALES_TRANSACTION_COLUMNS
} from '@/utils/ADempiere/constants/systemColumns'

// Utils and Helper Methods
import {
  convertBooleanToString, convertStringToBoolean
} from '@/utils/ADempiere/formatValue/booleanFormat.js'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'

/**
 * Prefix context of global prefix (#)
 */
export const GLOBAL_CONTEXT_PREFIX = '#' // evaluator.GLOBAL_CONTEXT_PREFIX

/**
 * Prefix context of accounting prefix ($)
 */
export const ACCOUNTING_CONTEXT_PREFIX = '$' // evaluator.ACCOUNTING_CONTEXT_PREFIX

/**
 * Prefix context of preference prefix (P|)
 */
export const PREFERENCE_CONTEXT_PREFIX = 'P|' // evaluator.PREFERENCE_CONTEXT_PREFIX

/**
 * Get context state from vuex store
 * @param {string} parentUuid UUID Window
 * @param {string} containerUuid  UUID Tab, Process, SmartBrowser, Report and Form
 * @param {boolean} isBooleanToString if convert true to 'Y', or return string
 * @param {boolean} isForceBoolean if convert boolean to string force 'Example' to true
 * @param {boolean} isForceSession find into global (#) and accounting ($) context
 * @param {string} columnName (context)  Entity to search
 * @returns
 */
export const getContext = ({
  parentUuid,
  containerUuid,
  isBooleanToString = false,
  isForceBoolean = true,
  isForceSession = false,
  columnName
}) => {
  let value
  const isPreferenceValue = columnName.startsWith(ACCOUNTING_CONTEXT_PREFIX) ||
    columnName.startsWith(GLOBAL_CONTEXT_PREFIX) ||
    columnName.startsWith(PREFERENCE_CONTEXT_PREFIX)

  // get value by session context
  if (isPreferenceValue) {
    value = store.getters.getSessionContext({
      parentUuid,
      containerUuid,
      columnName
    })
  } else {
    // get value by container view
    value = store.getters.getValueOfField({
      parentUuid,
      containerUuid,
      columnName
    })

    // get by global and accounting context
    if (isForceSession && isEmptyValue(value)) {
      value = store.getters.getSessionContext({
        parentUuid,
        containerUuid,
        columnName: GLOBAL_CONTEXT_PREFIX + columnName
      })
      if (isEmptyValue(value)) {
        value = store.getters.getSessionContext({
          parentUuid,
          containerUuid,
          columnName: ACCOUNTING_CONTEXT_PREFIX + columnName
        })
      }
    }
  }

  // get by menu sales transaction
  if (isEmptyValue(value) && SALES_TRANSACTION_COLUMNS.includes(columnName)) {
    value = isSalesTransactionMenu()
  }

  if (isBooleanToString) {
    return convertBooleanToString(value, isForceBoolean)
  }

  return value
}

/**
 *  Get Preference.
 *  <pre>
 *      0)  Current Setting
 *      1)  Window Preference
 *      2)  Global Preference
 *      3)  Login settings
 *      4)  Accounting settings
 *  </pre>
 *  @param  {string} parentUuid UUID Window
 *  @param  {string} containerUuid  UUID Tab, Process, SmartBrowser, Report and Form
 *  @param  {string}  columnName (context)  Entity to search
 *  @return preference value
 */
export function getPreference({
  parentUuid,
  containerUuid,
  columnName
}) {
  let value
  if (isEmptyValue(columnName)) {
    console.warn('Require Context ColumnName')
    return value
  }

  // USER PREFERENCES
  // View Preferences
  // TODO: Verify it, never gets values
  if (parentUuid) {
    value = getContext({
      parentUuid: PREFERENCE_CONTEXT_PREFIX + parentUuid,
      containerUuid: PREFERENCE_CONTEXT_PREFIX + containerUuid,
      columnName
    })
    if (!isEmptyValue(value)) {
      return value
    }
  }

  // Global Preferences
  value = getContext({
    columnName: PREFERENCE_CONTEXT_PREFIX + columnName
  })
  if (!isEmptyValue(value)) {
    return value
  }

  // SYSTEM PREFERENCES
  // Login setting
  // get # globals context only window
  value = getContext({
    columnName: GLOBAL_CONTEXT_PREFIX + columnName
  })
  if (!isEmptyValue(value)) {
    return value
  }

  // Accounting setting
  value = getContext({
    columnName: ACCOUNTING_CONTEXT_PREFIX + columnName
  })

  return value
} // get preference value

/**
 * Parse Context String
 * @param {string} value: (REQUIRED) String to parsing
 * @param {string} parentUuid: (REQUIRED from Window) UUID Window
 * @param {string} containerUuid: (REQUIRED) UUID Tab, Process, SmartBrowser, Report and Form
 * @param {string} columnName: (Optional if exists in value) Column name to search in context
 * @param {boolean} isBooleanToString, convert boolean values to string ('Y' or 'N')
 * @param {boolean} isSQL
 * @param {boolean} isSOTrxMenu
 */
export function parseContext({
  parentUuid,
  containerUuid,
  columnName = '',
  value,
  isSQL = false,
  isBooleanToString = false,
  isSOTrxMenu
}) {
  let isError = false
  const errorsList = []

  if (isEmptyValue(value)) {
    value = undefined
    if (ACCOUNTING_COLUMNS.includes(columnName)) {
      value = getContext({
        columnName: ACCOUNTING_CONTEXT_PREFIX + columnName
      })
    } else if (columnName.startsWith(ACCOUNTING_CONTEXT_PREFIX)) {
      value = getContext({
        columnName
      })
    }

    return {
      value,
      isError: true,
      errorsList
    }
  }
  value = String(value).replace('@SQL=', '')
  // const instances = value.length - value.replace('@', '').length
  // if ((instances > 0) && (instances % 2) !== 0) { // could be an email address
  //   return value
  // }

  let token, contextInfo
  let inString = value
  let outString = ''

  let firstIndexTag = inString.indexOf('@')

  if (firstIndexTag === -1) {
    if (columnName.startsWith(ACCOUNTING_CONTEXT_PREFIX) || columnName.startsWith(GLOBAL_CONTEXT_PREFIX)) {
      outString = getContext({
        columnName
      })
    }
  }
  while (firstIndexTag !== -1) {
    outString = outString + inString.substring(0, firstIndexTag) // up to @
    inString = inString.substring(firstIndexTag + 1, inString.length) // from first @
    const secondIndexTag = inString.indexOf('@') // next @
    // no exists second tag
    if (secondIndexTag < 0) {
      console.info(`No second tag: ${inString}`)
      return {
        value: undefined,
        isError: true,
        errorsList,
        isSQL
      }
    }

    token = inString.substring(0, secondIndexTag)
    columnName = token

    contextInfo = getContext({
      parentUuid,
      containerUuid,
      columnName
    }) // get context

    if (isEmptyValue(contextInfo)) {
      // get global context
      if (token.startsWith(GLOBAL_CONTEXT_PREFIX) || token.startsWith(ACCOUNTING_CONTEXT_PREFIX)) {
        contextInfo = getContext({
          columnName
        })
      } else {
        // get accounting context
        if (ACCOUNTING_COLUMNS.includes(columnName)) {
          contextInfo = getContext({
            columnName: ACCOUNTING_CONTEXT_PREFIX + columnName
          })
        }
      }
    }

    // menu attribute isEmptyValue isSOTrx
    if (!isEmptyValue(isSOTrxMenu) && isEmptyValue(contextInfo) && SALES_TRANSACTION_COLUMNS.includes(token)) {
      contextInfo = isSOTrxMenu
    }

    if ((isBooleanToString || isSQL) && typeof contextInfo === 'boolean') {
      contextInfo = convertBooleanToString(contextInfo)
    }

    if (isEmptyValue(contextInfo)) {
      // console.info(`No Context for: ${token}`)
      isError = true
      errorsList.push(token)
    } else {
      if (['object', 'boolean'].includes(typeof contextInfo)) {
        outString = contextInfo
      } else {
        outString = outString + contextInfo // replace context with Context
      }
    }

    inString = inString.substring(secondIndexTag + 1, inString.length) // from second @
    firstIndexTag = inString.indexOf('@')
  } // end while loop

  if (!['object', 'boolean'].includes(typeof contextInfo)) {
    outString = outString + inString // add the rest of the string
  }
  if (isSQL) {
    return {
      errorsList,
      isError,
      isSQL,
      query: outString,
      value: contextInfo
    }
  }
  return {
    errorsList,
    isError,
    isSQL,
    value: outString
  }
} // parseContext

/**
 * Get Is Sales Transaction on tab, window or container
 * @param {string} parentUuid
 * @param {containerUuid} containerUuid
 * @returns {boolean}
 */
export function isSalesTransaction({ parentUuid, containerUuid }) {
  // get value from container view
  let isSOTrx = isSalesTransactionContainer({
    parentUuid,
    containerUuid
  })
  if (isEmptyValue(isSOTrx)) {
    // get value from menu
    isSOTrx = isSalesTransactionMenu()
  }

  return convertStringToBoolean(isSOTrx)
}

export function isSalesTransactionContainer({
  parentUuid, containerUuid
}) {
  // get value from container view
  const isSOTrx = store.getters.getValueOfField({
    parentUuid,
    containerUuid,
    columnName: IS_SO_TRX
  })

  return convertStringToBoolean(isSOTrx)
}

export function isSalesTransactionWindow({
  parentUuid
}) {
  if (isEmptyValue(parentUuid)) {
    return undefined
  }
  const currentRoute = router.app._route
  if (currentRoute.meta.type !== 'window') {
    return undefined
  }
  const storedWindow = store.getters.getStoredWindow(parentUuid)
  if (isEmptyValue(storedWindow)) {
    return undefined
  }

  return storedWindow.isSalesTransaction
}

export function isSalesTransactionMenu() {
  // get value from menu
  const currentRoute = router.app._route
  const isSOTrx = currentRoute.meta.isSalesTransaction
  return isSOTrx
}
