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

import lang from '@/lang'
import store from '@/store'
import moment from 'moment'

// utils and helper methods
import { isEmptyValue, getTypeOfValue } from '@/utils/ADempiere/valueUtils.js'
import { zeroPad } from '@/utils/ADempiere/formatValue/numberFormat.js'

/**
 * This function just convert all java date format to moment format.
 * For know about java format pattern see:
 * https://docs.oracle.com/javase/7/docs/api/java/text/SimpleDateFormat.html
 * Also you can read moment docus: https://momentjs.com/docs/
 * @param {string} dateFormat
 * @returns
 */
export function convertDateFormat(dateFormat) {
  return dateFormat
    //	Year
    .replace(/\byy\b/g, 'YY')
    .replace(/\byyyy\b/g, 'YYYY')
    //	Short Day of month
    .replace(/\bdd\b/g, 'DD')
    // Week of Year
    .replace(/\bw\b/g, 'W')
    // Long Day
    .replace(/\bEEE\b/g, 'ddd')
    .replace(/\bu\b/g, 'dddd')
    // Hour
    .replace(/\bhh\b/g, 'h')
    .replace(/\bK\b/g, 'h')
    .replace(/\baaa\b/g, 'a')
    // Hour 24
    .replace(/\bk\b/g, 'HH')
    // Day of Year
    .replace(/\bD\b/g, 'DDD')
    // Day of Week
    .replace(/\bF\b/g, 'R')
    // Time zone
    .replace(/\bz\b/g, 'Z')
}

/**
 * Get default format or optional
 * @param {string} format
 * @param {boolean} isTime
 */
export function getDateFormat({
  format,
  isTime,
  isDate
}) {
  if (format) {
    return format
  }
  //  Else
  const languageDefinition = store.getters['getCurrentLanguageDefinition']
  if (languageDefinition) {
    if (isDate && isTime) {
      return languageDefinition.datePattern + languageDefinition.timePattern
    }
    return isTime ? languageDefinition.timePattern : languageDefinition.datePattern
  }
}

/**
 * Get default format without format pattern
 * @param {boolean} isTime
 */
export function getDefaultFormat(isTime) {
  return getDateFormat({
    isTime
  })
}

/**
 * Format a date with specific format, if format is void use default date format for language
 * @param {string|date} object
 * @param {boolean} isTime
 */
export function formatDate({ value, isTime = false, isDate = false, format }) {
  if (isEmptyValue(value)) {
    return undefined
  }
  if (getTypeOfValue(value) === 'DATE') {
    value = value.getTime()
  }

  return moment.utc(value).format(
    getDateFormat({
      format,
      isTime,
      isDate
    })
  )
}

export function dateTimeFormats(date, format) {
  if (isEmptyValue(date)) {
    return undefined
  }
  return moment(date).format(format)
}

/**
 * Get date and time from client in a object value
 * @param {string} type Type value of return
 * @returns {object|string}
 */
export function clientDateTime(date = null, type = '') {
  if (date == null || date === undefined || (typeof date === 'string' && date.trim() === '')) {
    // instance the objet Data with current date from client
    date = new Date()
  } else {
    // instance the objet Data with date or time send
    date = new Date(date)
  }

  const currentDate = date.getFullYear() +
    '-' + zeroPad(date.getMonth() + 1) +
    '-' + zeroPad(date.getDate() + 1)

  const currentTime = date.getHours() +
    ':' + date.getMinutes() +
    ':' + date.getSeconds()
  const currentDateTime = {
    date: currentDate,
    time: currentTime
  }

  if (type.toLowerCase() === 't') {
    // time format HH:II:SS
    return currentDateTime.time
  } else if (type.toLowerCase() === 'd') {
    // date format YYYY-MM-DD
    return currentDateTime.date
  } else if (type.toLocaleLowerCase() === 'o') {
    // object format
    return currentDateTime
  }
  return currentDateTime.date + ' ' + currentDateTime.time
}

/**
 * Send date to server
 * @param {string} date
 * @returns
 */
export function formatDateToSend(date) {
  if (isEmptyValue(date)) {
    return undefined
  }
  return date.slice(0, 10)
}

/**
 * Get valid Date object
 * @param {number|string} value
 */
export function getValidDate(value) {
  let date = value
  if (isEmptyValue(date)) {
    date = new Date()
  } if (typeof value === 'string') {
    // TODO: Verify it time zone
    if (value.length <= 10) {
      value += 'T00:00:00' // without time zone
    }
    date = new Date(value)
  } else if (typeof value === 'number') {
    date = new Date(value)
  }
  return date
}

/**
 * Translate date value
 * @param {number} value
 * @param {string} format
 * @returns {string}
 */
export function translateDate({ value, format = 'short' }) {
  const date = getValidDate(value)

  const language = store.getters.language
  const translatedDate = lang.d(date, format, language)
  return translatedDate
}

/**
 * Translate date by long value
 * @deprecated use {@link #translateDate} instead
 * @param {number} value
 * @returns {string}
 */
export function translateDateByLong(value) {
  return translateDate({
    value: new Date(value),
    format: 'long'
  })
}

/**
 * Get web browser time zone
 * @returns {string}
 */
export function getBrowserTimeZone() {
  const dateFormat = new Intl.DateTimeFormat('default', {})
  const usedOptions = dateFormat.resolvedOptions()
  return usedOptions.timeZone
}

/**
 * Or get a Date object with the specified Time zone
 * @param {date|string|number} value of date
 * @param {string} timeZone
 * @returns {date}
 */
export function changeTimeZone({
  value,
  timeZone
}) {
  if (isEmptyValue(timeZone)) {
    timeZone = getBrowserTimeZone()
  }
  const date = getValidDate(value)

  return new Date(
    date.toLocaleString('en-US', {
      timeZone
    })
  )
}

/**
 * Format date to time with hours, minutes, and seconds
 * @param {date|string|number} value
 * @param {string} timeZone
 * @returns {string} hh:mm:ss a (01:35:08 pm)
 */
export function timeFormat({
  value,
  timeZone
}) {
  if (isEmptyValue(timeZone)) {
    timeZone = getBrowserTimeZone()
  }
  const date = getValidDate(value)

  return date.toLocaleString('en-US', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}
