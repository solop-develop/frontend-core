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

let eventGuid = 0
const todayStr = new Date().toISOString().replace(/T.*$/, '') // YYYY-MM-DD of today

export const INITIAL_EVENTS = [
  {
    id: createEventId(),
    title: 'All-day event',
    start: todayStr
  },
  // {
  //   id: createEventId(),
  //   title: 'Timed event',
  //   start: todayStr + 'T12:00:00'
  // },
  {
    id: 1234,
    title: 'Governors - Full Paint',
    start: '2023-10-01 13:00-:00',
    end: '2023-10-01 15:00:00'
  },
  {
    id: 1111,
    title: 'Yisel - Cleaning',
    start: '2023-10-03 10:00:00',
    end: '2023-10-03 12:00:00'
  },
  {
    id: 2222,
    title: 'Jennings Place - Housekeeper',
    start: '2023-10-03 14:00:00',
    end: '2023-10-03 16:00:00'
  },
  {
    id: 3333,
    title: 'Angel Cove - Carpet',
    start: '2023-10-05 10:00:00',
    end: '2023-10-05 12:00:00'
  },
  {
    id: 4444,
    title: 'Sterling Hills - Paint',
    start: '2023-10-04 10:00:00',
    end: '2023-10-04 12:00:00'
  },
  {
    id: 5555,
    title: 'Palm Beach - Cleaning',
    start: '2023-10-06 10:00:00',
    end: '2023-10-06 12:00:00'
  }
]

export function createEventId() {
  return String(eventGuid++)
}
