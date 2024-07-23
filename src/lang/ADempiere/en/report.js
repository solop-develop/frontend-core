/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
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
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

const report = {
  clearParameters: {
    title: 'Clear Parameters',
    description: 'Clears the values by setting the default values'
  },
  typeReport: 'Report Type',
  reportViews: 'ReportViews',
  printFormats: 'Print Formats',
  reportOptions: 'Report Options',
  preference: 'Preference',
  reportSettings: 'Report Settings',
  summary: 'Summary',
  reportExportTypes: {
    ps: {
      name: 'ps - Postscript file',
      description: 'ps - Postscript file',
      type: 'ps'
    },
    xml: {
      name: 'xml - XML file',
      description: 'xml - XML file',
      type: 'xml'
    },
    pdf: {
      name: 'pdf - Acrobat PDF file',
      description: 'pdf - Acrobat PDF file',
      type: 'pdf'
    },
    html: {
      name: 'html - HTML file',
      description: 'html - HTML file',
      type: 'html'
    },
    txt: {
      name: 'txt - Tab delimited file',
      description: 'txt - Tab delimited file',
      type: 'txt'
    },
    ssv: {
      name: 'ssv - Semicolon Separated Values file',
      description: 'ssv - Semicolon Separated Values file',
      type: 'ssv'
    },
    csv: {
      name: 'csv - Excel Comma Separated Values file',
      description: 'csv - Excel Comma Separated Values file',
      type: 'csv'
    },
    xls: {
      name: 'xls - Excel file',
      description: 'xls - Excel file',
      type: 'xls'
    },
    xlsx: {
      name: 'xlsx - XLSX file',
      description: 'xlsx - XLSX file',
      type: 'xlsx'
    },
    arxml: {
      name: 'arxml - Adempiere Report Definition',
      description: 'arxml - Adempiere Report Definition',
      type: 'arxml'
    }
  },
  reportEnginer: {
    summation: 'Summation (Σ):',
    average: 'Average (μ):',
    Count: 'Count (№):',
    min: 'Minimum (↓):',
    max: 'Maximum (↑):',
    variance: 'Variance (σ²):',
    standardDeviation: 'Standard Deviation (σ):',
    share: 'Share / Download',
    optionsImport: {
      title: 'Import and Share Options',
      format: 'Format Options',
      actualPage: 'Current Page',
      fullReport: 'Full Report',
      sendDownload: 'Send / Download',
      download: 'Download',
      send: 'Send',
      copyLink: 'Copy Link',
      typeNotify: 'Type of Notification',
      contactsSend: 'Contacts to Send'
    },
    printFormat: 'Print Format',
    viewReport: 'Report View',
    Detail: 'View Detailed',
    summary: 'View Summary'
  }
}

export default report
