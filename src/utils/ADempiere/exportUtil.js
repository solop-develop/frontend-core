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

// Constants
import { BUTTON } from '@/utils/ADempiere/references.js'

// utils and helper methods
import { convertBooleanToTranslationLang } from '@/utils/ADempiere/formatValue/booleanFormat.js'
import { clientDateTime } from '@/utils/ADempiere/formatValue/dateFormat'
import { decodeHtmlEntities } from '@/utils/ADempiere/formatValue/stringFormat'
import { export_json_to_excel } from '@/vendor/Export2Excel'
import { export_txt_to_zip } from '@/vendor/Export2Zip'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { formatField } from '@/utils/ADempiere/valueFormat'

// export file with records
export const supportedTypes = {
  csv: language.t('extensionFile.csv'),
  html: language.t('extensionFile.html'),
  json: language.t('extensionFile.json'),
  ods: language.t('extensionFile.ods'),
  rtf: language.t('extensionFile.rtf'),
  txt: language.t('extensionFile.txt'),
  xls: language.t('extensionFile.xls'),
  xlsx: language.t('extensionFile.xlsx')
}

/**
 * Convert json data to array
 * @param {array} header
 * @param {array} data
 * @returns array
 */
export function cellFromJson({
  data,
  isFormat = false
}) {
  return data.map(row => {
    // Object.value not working if value in property is undefined
    // return Object.values(row)

    // loop header convert as value
    Object.keys(row).forEach(column => {
      const currentValue = row[column]
      // translate boolean
      if (isFormat && typeof row[column] === 'boolean') {
        row[column] = convertBooleanToTranslationLang(currentValue)
      }

      row[column] = currentValue
    })

    return row
  })
}

/**
 * Export data from json
 * @param {array} header
 * @param {array} data array of object (json format)
 * @param {string} exportType, supportedTypes json, xlsx, xlsm, xlsb, xls, xla, biff8, biff5, biff2, xlml, ods, fods, csv, txt, sylk, html, dif, rtf, prn, eth
 * @param {string} fileName .json file name
 */
export function exportFileFromJson({
  header,
  data,
  isFormat = false,
  exportType,
  fileName = 'xlsx'
}) {
  let newData = data
  if (isFormat) {
    newData = cellFromJson({
      isFormat,
      data
    })
  }

  if (exportType === 'json') {
    const dataValues = JSON.stringify(data)

    const blobFile = new Blob(
      [dataValues],
      { type: 'text/plain' }
    )

    const link = document.createElement('a')
    link.href = URL.createObjectURL(blobFile)
    link.download = `${fileName}.json`
    link.click()

    return
  }

  // flat array
  const newData2 = newData.map(row => {
    return Object.values(row)
  })

  // TODO: Convert header ascii values
  export_json_to_excel({
    header,
    data: newData2,
    filename: fileName,
    bookType: exportType
  })
}

/**
 * Export txt data into zip file
 * @autor Edwin Betancourt <EdwinBetanc0urt@outlook.com>
 * @param {array} header
 * @param {array} data
 * @param {string} txtName .txt text file name
 * @param {string} zipName .zip compressed file name
 */
export function exportZipFile({
  header,
  data,
  txtName = '',
  zipName = ''
}) {
  const jsonData = data.map(row => {
    Object.keys(row).forEach(column => {
      if (typeof row[column] === 'boolean') {
        row[column] = convertBooleanToTranslationLang(row[column])
      }
    })
    return row
  })

  if (isEmptyValue(zipName)) {
    zipName = txtName
  }
  if (isEmptyValue(txtName)) {
    txtName = zipName
  }

  export_txt_to_zip(
    header,
    jsonData,
    txtName,
    zipName
  )
}

/**
 * Export records
 * @param {string} parentUuid
 * @param {string} containerUuid
 * @param {object} containerManager
 * @param {string} formatToExport
 * @param {array} formatToExport
 */
export const exportRecords = ({ parentUuid, containerUuid, containerManager, formatToExport = 'json', currrentRecord = { }}) => {
  let selection = [currrentRecord]
  if (isEmptyValue(currrentRecord)) {
    selection = containerManager.getSelection({
      containerUuid
    })
  }
  const fieldsListAvailable = containerManager.getFieldsList({
    parentUuid,
    containerUuid
  }).filter(fieldItem => {
    // TODO: Verify with containerManager.isDisplayedColumn
    // Hide not displayed fields
    if (!(fieldItem.isDisplayed && fieldItem.isDisplayedGrid)) {
      return false
    }
    // Hide encrypted fields
    if (fieldItem.isEncrypted) {
      return false
    }
    // Hide simple button fields without a value
    if (fieldItem.displayType === BUTTON.id) { // && fieldItem.referenceValue === 0) {
      return false
    }
    if (fieldItem.isActive && !fieldItem.isKey && fieldItem.sequence > 0) {
      return true
    }
    return false
  }).sort((a, b) => a.sequence - b.sequence)

  const headerList = fieldsListAvailable.map(fieldItem => {
    // decode html entities
    return decodeHtmlEntities(fieldItem.name)
  })

  // filter only showed columns
  const data = selection.map(row => {
    const newRow = {}
    fieldsListAvailable.forEach(field => {
      const { columnName, displayColumnName, displayType } = field
      const value = formatField({
        displayType,
        value: row[columnName],
        displayedValue: row[displayColumnName]
      })

      newRow[columnName] = value
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
    exportType: formatToExport
  })
}
