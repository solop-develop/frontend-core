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

// Constants
import { REPORT_VIEWER_NAME } from '@/utils/ADempiere/constants/report'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'

export const runReport = {
  name: language.t('actionMenu.generateReport'),
  description: language.t('actionMenu.generateDefaultReport'),
  enabled: () => {
    // TODO: Verify mandatory with report view
    // always active
    return true
  },
  isSvgIcon: false,
  icon: 'el-icon-document',
  actionName: 'runReport',
  uuid: null,
  runReport: ({ containerUuid }) => {
    store.dispatch('buildReport', {
      containerUuid
    })
  }
}

export const runReportAs = {
  name: language.t('actionMenu.generateReportAs'),
  description: language.t('actionMenu.generateReportAsOtherFormat'),
  enabled: ({ containerUuid }) => {
    return !isEmptyValue(store.getters.getStoredReportExportTypes(containerUuid))
  },
  isSvgIcon: false,
  icon: 'el-icon-document',
  actionName: 'runReportAs',
  uuid: null,
  childs: [],
  runReportAs: ({ containerUuid }) => {
    store.dispatch('buildReport', {
      containerUuid
    })
  }
}

export const runReportAsPrintFormat = {
  name: language.t('actionMenu.printFormats'),
  description: language.t('actionMenu.generateReportWithPrintFormat'),
  enabled: ({ containerId: reportId }) => {
    const printFormatsList = store.getters.getPrintFormatList(reportId)
    return !isEmptyValue(printFormatsList)
  },
  isSvgIcon: false,
  icon: 'el-icon-printer',
  actionName: 'runReportAsPrintFormat',
  uuid: null,
  childs: [],
  runReportAsPrintFormat: ({ containerUuid }) => {
    store.dispatch('buildReport', {
      containerUuid
    })
  }
}

export const runReportAsView = {
  name: language.t('actionMenu.reportViews'),
  description: language.t('actionMenu.generateWithReportView'),
  enabled: ({ containerId: reportId }) => {
    const reportViewsList = store.getters.getReportViewList(reportId)
    return !isEmptyValue(reportViewsList)
  },
  isSvgIcon: false,
  icon: 'el-icon-data-analysis',
  actionName: 'runReportAsView',
  uuid: null,
  childs: [],
  runReportAsView: ({ containerUuid }) => {
    const currentRoute = router.app.$route
    let instanceUuid = 'not-empty'
    if (currentRoute.params && currentRoute.params.instanceUuid) {
      instanceUuid = currentRoute.params.instanceUuid
    }

    store.dispatch('buildReport', {
      containerUuid,
      instanceUuid
    })
  }
}

/**
 * Only used with report viewer
 */
export const changeParameters = {
  name: language.t('actionMenu.changeParameters'),
  description: language.t('actionMenu.changeParameters'),
  // enabled: true,
  enabled: ({ root }) => {
    const currentRoute = router.app.$route
    if (currentRoute.name === REPORT_VIEWER_NAME) {
      return true
    }
    return false
  },
  isSvgIcon: false,
  icon: 'el-icon-set-up',
  actionName: 'changeParameters',
  uuid: null,
  childs: [],
  changeParameters: ({ containerUuid }) => {
    store.commit('setShowedModalDialog', {
      containerUuid,
      isShowed: true
    })
  }
}

export const clearParameters = {
  name: language.t('report.clearParameters.title'),
  description: language.t('report.clearParameters.description'),
  enabled: ({ containerUuid }) => {
    return true
  },
  isSvgIcon: true,
  icon: 'layers-clear',
  actionName: 'clearParameters',
  uuid: null,
  clearParameters: ({ containerUuid }) => {
    store.dispatch('setReportDefaultValues', {
      containerUuid
    })
  }
}
