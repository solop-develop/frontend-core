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

/**
 * Suppoerted render files
 */
export const viewerSupportedFormats = [
  'csv',
  'html',
  'pdf',
  'ssv',
  'txt',
  'xls',
  'xlsx',
  'xml'
]

export const reportFormatsList = [
  'arxml',
  'csv',
  'pdf',
  'ps',
  'ssv',
  'txt',
  'xls',
  'xlsx',
  'xml'
]

/**
 * Documents mime type
 */
export const mimeTypeOfReport = {
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  dot: 'application/msword',
  dotx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.template',
  csv: 'text/csv;charset=utf-8',
  htm: 'text/html;charset=utf-8',
  html: 'text/html;charset=utf-8',
  md: 'text/markdown;charset=utf-8',
  odt: 'application/vnd.oasis.opendocument.text',
  pdf: 'application/pdf',
  ps: 'application/postscript',
  rtf: 'application/rtf',
  ssv: 'application/vnd.shade-save-file',
  txt: 'text/plain;charset=utf-8',
  xls: 'application/vnd.ms-excel; ',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  xml: 'application/xml'
}

/**
 * Default report type to generate
 */
export const DEFAULT_REPORT_TYPE = 'pdf'

export const runReport = {
  name: language.t('actionMenu.generateReport'),
  description: language.t('actionMenu.generateDefaultReport'),
  enabled: () => {
    // TODO: Verify mandatory with report view
    // always active
    return true
  },
  svg: false,
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
  svg: false,
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
  enabled: ({ containerUuid }) => {
    return !isEmptyValue(store.getters.getPrintFormatList(containerUuid))
  },
  svg: false,
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
  enabled: ({ containerUuid }) => {
    return !isEmptyValue(store.getters.getReportViewList(containerUuid))
  },
  svg: false,
  icon: 'el-icon-data-analysis',
  actionName: 'runReportAsView',
  uuid: null,
  childs: [],
  runReportAsView: ({ containerUuid }) => {
    store.dispatch('buildReport', {
      containerUuid
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
    if (root.$route.name === 'Report Viewer') {
      return true
    }
    return false
  },
  svg: false,
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
