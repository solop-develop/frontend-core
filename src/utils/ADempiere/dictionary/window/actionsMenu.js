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
import router from '@/router'
import store from '@/store'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import { copyWindowContextOnBrowser } from '@/utils/ADempiere/contextUtils/contextBrowser'
import { zoomIn } from '@/utils/ADempiere/coreUtils'

/**
 * Run process associated on table or button field
 * @param {string} parentUuid
 * @param {string} containerUuid
 * @param {number} recordId
 * @param {string} recordUuid
 */
export const openSequenceTab = {
  name: language.t('window.tab.sequenceTab'),
  enabled: ({ parentUuid, containerUuid }) => {
    const recordUuid = store.getters.getUuidOfContainer(containerUuid)
    return !isEmptyValue(recordUuid)
  },
  svg: false,
  icon: 'el-icon-sort',
  actionName: 'openSequenceTab',
  openSequenceTab: ({ parentUuid, containerUuid, uuid, contextColumnNames }) => {
    const currentTab = store.getters.getStoredTab(parentUuid, containerUuid)
    const { sequenceTabsList } = currentTab
    const sequenceTab = sequenceTabsList.find(itemTab => {
      return itemTab.uuid === uuid
    })

    store.commit('setSelectProcessWindows', sequenceTab.uuid)

    store.commit('setShowedModalDialog', {
      parentUuid,
      containerUuid: sequenceTab.uuid,
      isShowed: true
    })
  }
}

/**
 * Open Smart Browser Associated in Process
 */
export const openBrowserAssociated = {
  name: language.t('actionMenu.openSmartBrowser'),
  enabled: ({ parentUuid, containerUuid }) => {
    const recordUuid = store.getters.getUuidOfContainer(containerUuid)
    return !isEmptyValue(recordUuid)
  },
  isSvgIcon: true,
  icon: 'search',
  actionName: 'openBrowserAssociated',
  openBrowserAssociated: function({ parentUuid, containerUuid, uuid, browserId }) {
    if (isEmptyValue(browserId) || browserId <= 0) {
      const process = store.getters.getStoredProcessFromTab({
        windowUuid: parentUuid,
        tabUuid: containerUuid,
        processUuid: uuid
      })
      browserId = process.browser.id
    }
    const browserUuid = store.getters.getStoredBrowserUuidById(browserId)
    const storedBrowser = store.getters.getStoredBrowser(browserUuid)
    if (!isEmptyValue(storedBrowser)) {
      // overwrite values
      store.dispatch('setBrowserDefaultValues', {
        containerUuid: browserUuid
      })

      // copy context values
      copyWindowContextOnBrowser({
        browserUuid,
        fieldsList: storedBrowser.fieldsList,
        windowUuid: parentUuid,
        tabUuid: containerUuid
      })

      // clear resutls
      store.dispatch('clearBrowserData', {
        containerUuid: browserUuid
      })
    }

    // set record id from window
    const storedTab = store.getters.getStoredTab(parentUuid, containerUuid)
    const { keyColumn } = storedTab

    // Set Record ID
    const recordId = store.getters.getValueOfField({
      parentUuid,
      containerUuid,
      columnName: keyColumn
    })

    const containerIdentifier = 'browser_' + browserId
    const inMenu = zoomIn({
      attributeValue: containerIdentifier,
      attributeName: 'containerKey',
      query: {
        parentUuid,
        containerUuid,
        recordId
      },
      isShowMessage: false
    })

    if (!inMenu) {
      router.push({
        name: 'Smart Browser',
        params: {
          browserId: browserId
          // browserUuid
        },
        query: {
          parentUuid,
          containerUuid,
          recordId
        }
      }, () => {})
    }
  }
}
