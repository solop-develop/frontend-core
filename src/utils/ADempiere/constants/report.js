/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 * Contributor(s): Elsio Sanchez elsiosanches@gmail.com https://github.com/elsiosanchez
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
 * along with this program. If not, see <https:www.gnu.org/licenses/>.
 */

import language from '@/lang'

const today = new Date()

export const REPORT_VIEWER_NAME = 'Report Viewer'

export const staticReportRoutes = [
  {
    uuid: '92b9a696-adba-4409-a200-7df0ba74cb63',
    action: 'processOption',
    tabChild: undefined,
    parametersList: [{ columnName: 'ValidFrom', value: today }]
  },
  {
    uuid: '78b249ee-613e-4241-a2c1-00243fa36470',
    action: 'processOption',
    tabChild: undefined,
    parametersList: [{ columnName: 'ValidFrom', value: today }, { columnName: 'MustBeStocked', value: false }]
  }
]

export const REPORT_EXPORT_TYPES = [
  {
    name: language.t('report.reportExportTypes.ps.name'),
    description: language.t('report.reportExportTypes.ps.description'),
    type: language.t('report.reportExportTypes.ps.type')
  },
  {
    name: language.t('report.reportExportTypes.xml.name'),
    description: language.t('report.reportExportTypes.xml.description'),
    type: language.t('report.reportExportTypes.xml.type')
  },
  {
    name: language.t('report.reportExportTypes.pdf.name'),
    description: language.t('report.reportExportTypes.pdf.description'),
    type: language.t('report.reportExportTypes.pdf.type')
  },
  {
    name: language.t('report.reportExportTypes.html.name'),
    description: language.t('report.reportExportTypes.html.description'),
    type: language.t('report.reportExportTypes.html.type')
  },
  {
    name: language.t('report.reportExportTypes.txt.name'),
    description: language.t('report.reportExportTypes.txt.description'),
    type: language.t('report.reportExportTypes.txt.type')
  },
  {
    name: language.t('report.reportExportTypes.ssv.name'),
    description: language.t('report.reportExportTypes.ssv.description'),
    type: language.t('report.reportExportTypes.ssv.type')
  },
  {
    name: language.t('report.reportExportTypes.csv.name'),
    description: language.t('report.reportExportTypes.csv.description'),
    type: language.t('report.reportExportTypes.csv.type')
  },
  {
    name: language.t('report.reportExportTypes.xls.name'),
    description: language.t('report.reportExportTypes.xls.description'),
    type: language.t('report.reportExportTypes.xls.type')
  },
  {
    name: language.t('report.reportExportTypes.xlsx.name'),
    description: language.t('report.reportExportTypes.xlsx.description'),
    type: language.t('report.reportExportTypes.xlsx.type')
  },
  {
    name: language.t('report.reportExportTypes.arxml.name'),
    description: language.t('report.reportExportTypes.arxml.description'),
    type: language.t('report.reportExportTypes.arxml.type')
  }
]
