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
import router from '@/router'
import store from '@/store'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

/**
 * Using forms and events with the enter key prevents the page from reloading
 * with @submit.native.prevent="notSubmitForm" in el-form component
 */
export function notSubmitForm(event) {
  event.preventDefault()
  return false
}

/**
 * Max number columns per row on layout by component ui
 * https://element.eleme.io/#/es/component/layout
 */
export const LAYOUT_MAX_COLUMNS_PER_ROW = 24

/**
 * Default columns per row on layout
 */
export const DEFAULT_COLUMNS_PER_ROW = 3

/**
 * Focusable Fields List
 */

export const FOCUSABLE_FIELDS_LIST = [
  'FieldText',
  'FieldTextLong',
  'FieldNumber'
]

/**
 * Close all tags view
 * @param {object} currentRoute
 */
export const closeTagView = function(currentRoute) {
  if (isEmptyValue(currentRoute)) currentRoute = router.app._route
  const tabViewsVisited = store.getters.visitedViews
  store.dispatch('tagsView/delView', currentRoute)
  const oldRouter = tabViewsVisited[tabViewsVisited.length - 1]
  if (!isEmptyValue(oldRouter)) {
    router.push({
      path: oldRouter.path
    }, () => {})
  }
}

export const SHORCUTS_DATE = [
  {
    text: lang.t('component.date.today'),
    onClick(picker) {
      picker.$emit('pick', new Date())
    }
  },
  {
    text: lang.t('component.date.yesterday'),
    onClick(picker) {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24)
      picker.$emit('pick', date)
    }
  },
  {
    text: lang.t('component.date.week'),
    onClick(picker) {
      const date = new Date()
      const monthEndDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)
      picker.$emit('pick', monthEndDay)
    }
  }
]

export const SHORCUTS_DATE_RANGE = [
  {
    text: lang.t('component.date.today'),
    onClick(picker) {
      const currentDay = new Date()
      picker.$emit('pick', [currentDay, currentDay])
    }
  },
  {
    text: lang.t('component.date.yesterday'),
    onClick(picker) {
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24)
      picker.$emit('pick', [start, start])
    }
  },
  {
    text: lang.t('component.date.week'),
    onClick(picker) {
      const start_date = new Date()
      start_date.setHours(0, 0, 0, 0)
      const end_date = new Date()
      const date = null
      const currenDate = date ? new Date(date) : new Date()
      const first = currenDate.getDate() - currenDate.getDay('monday')
      const last = first - 7
      start_date.setDate(last)
      end_date.setDate(first - 1)
      picker.$emit('pick', [start_date, end_date])
    }
  }, {
    text: lang.t('component.date.currentWeek'),
    onClick(picker) {
      const start_date = new Date()
      start_date.setHours(0, 0, 0, 0)
      const end_date = new Date()
      const date = null
      const currenDate = date ? new Date(date) : new Date()
      const first = currenDate.getDate() - currenDate.getDay('monday')
      const last = first
      start_date.setDate(last)
      end_date.setDate(first + 6)
      picker.$emit('pick', [start_date, end_date])
    }
  },
  {
    text: lang.t('component.date.lastMonth'),
    onClick(picker) {
      const date = new Date()
      const monthEndDay = new Date(date.getFullYear(), date.getMonth(), 0)
      const monthStartDay = new Date(date.getFullYear(), date.getMonth() - 1, 1)
      picker.$emit('pick', [monthStartDay, monthEndDay])
    }
  },
  {
    text: lang.t('component.date.currentMonth'),
    onClick(picker) {
      const date = new Date()
      const monthEndDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)
      const monthStartDay = new Date(date.getFullYear(), date.getMonth(), 1)
      picker.$emit('pick', [monthStartDay, monthEndDay])
    }
  }
]
