/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 * Contributor(s): Elsio Sanchez elsiosanchez15@outlook.com https://github.com/Elsiosanchez
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

export const DEFAULT_RESOURCES = [
  {
    id: 'a',
    title: 'CARRUSEL',
    eventColor: '#67C23A',
    children: [
      { id: 'a1', title: '1-SLIDE', eventColor: '#67C23A' },
      { id: 'a2', title: '2-SLIDE', eventColor: '#67C23A' },
      { id: 'a3', title: '3-SLIDE' },
      { id: 'a4', title: '4-SLIDE' },
      { id: 'a5', title: '5-SLIDE' },
      { id: 'a6', title: '6-SLIDE' },
      { id: 'a7', title: '7-SLIDE' },
      { id: 'a8', title: '8-SLIDE' },
      { id: 'a9', title: '9-SLIDE' }
    ]
  },
  { id: 'b', title: 'STEALER', eventColor: '#f57c00' },
  { id: 'c', title: 'BANNER SEARCH', eventColor: '#e91e63', backgroundColor: '#e91e63' },
  { id: 'd', title: 'FULL CATEGORY', eventColor: '#4caf50' },
  { id: 'e', title: 'ALMACEN', eventColor: '#4caf50' },
  { id: 'f', title: 'ENDULZANTES', eventColor: '#409EFF' },
  { id: 'g', title: 'ADEREZOS', eventColor: '#409EFF' },
  { id: 'h', title: 'INFUSIONES', eventColor: '#409EFF' },
  { id: 'i', title: 'CONSERVAS', eventColor: '#409EFF' },
  { id: 'j', title: 'ENCORTIDOS', eventColor: '#409EFF' }
]

export const DEFAULT_EVENTS = [
  {
    id: '1',
    title: 'CORONA',
    start: parse('2024-01-01T08:00:00'),
    end: parse('2024-02-09T10:00:00'),
    resourceId: 'a',
    textColor: '#000000'
  },
  {
    id: 'a1',
    title: 'GETORADE',
    start: parse('2024-02-01T08:00:00'),
    end: parse('2024-02-07T10:00:00'),
    resourceId: 'a1',
    textColor: '#000000'
  },
  {
    id: 'a2',
    title: 'CERVEA S/A',
    start: parse('2024-02-01T08:00:00'),
    end: parse('2024-02-07T10:00:00'),
    resourceId: 'a2',
    textColor: '#000000'
  },
  {
    id: 'a1',
    title: 'CCU 3x2',
    start: parse('2024-01-15T08:00:00'),
    end: parse('2024-01-20T10:00:00'),
    resourceId: 'a1',
    textColor: '#000000',
    backgroundColor: '#C9ADFB'
  },
  {
    id: 'a2',
    title: 'COLGATE',
    start: parse('2024-01-20'),
    end: parse('2024-01-26'),
    resourceId: 'a2',
    backgroundColor: '#00E16D',
    textColor: '#000000'
  },
  {
    id: 'a4',
    title: 'YOGURISIMO',
    start: parse('2024-01-20T12:00:00'),
    end: parse('2024-01-26T12:00:00'),
    resourceId: 'a4',
    backgroundColor: '#B58DFB',
    textColor: '#000000'
  },
  {
    id: 'a5',
    title: 'LEVITE',
    start: parse('2024-01-01T12:00:00'),
    end: parse('2024-02-11T12:00:00'),
    resourceId: 'a5',
    backgroundColor: '#D1B9FB',
    textColor: '#000000'
  },
  {
    id: 'a1',
    title: 'LARIDO',
    start: parse('2024-01-13T00:00:00'),
    end: parse('2024-01-21T12:00:00'),
    resourceId: 'a6',
    backgroundColor: '#FBEBB9',
    textColor: '#000000'
  },
  {
    id: 'a1',
    title: 'MC CAIN',
    start: parse('2024-02-12T00:00:00'),
    end: parse('2024-02-24T12:00:00'),
    resourceId: 'a6',
    backgroundColor: '#FBEBB9',
    textColor: '#000000'
  },
  {
    id: 'a7',
    title: 'MASTELLONE',
    start: parse('2024-01-09T00:00:00'),
    end: parse('2024-01-16T12:00:00'),
    resourceId: 'a7',
    backgroundColor: '#42E866',
    textColor: '#000000'
  },
  {
    id: 'a7',
    title: 'MASTELLONE',
    start: parse('2024-01-21T00:00:00'),
    end: parse('2024-01-27T12:00:00'),
    resourceId: 'a7',
    backgroundColor: '#42E866',
    textColor: '#000000'
  },
  {
    id: 'a7',
    title: 'MASTELLONE',
    start: parse('2024-02-01T08:00:00'),
    end: parse('2024-02-09T10:00:00'),
    resourceId: 'a7',
    backgroundColor: '#42E866',
    textColor: '#000000'
  },
  {
    title: 'DOVE',
    start: parse('2024-01-09T00:00:00'),
    end: parse('2024-01-14T12:00:00'),
    resourceId: 'a8',
    backgroundColor: '#E8428D',
    textColor: '#000000'
  },
  {
    title: 'OF',
    start: parse('2024-01-27T12:00:00'),
    end: parse('2024-02-02T12:00:00'),
    resourceId: 'a8',
    backgroundColor: '#E8428D',
    textColor: '#000000'
  },
  {
    title: 'DOVE',
    start: parse('2024-02-04T12:00:00'),
    end: parse('2024-02-14T12:00:00'),
    resourceId: 'a8',
    backgroundColor: '#E8428D',
    textColor: '#000000'
  },
  {
    title: 'HELLMANNS',
    start: parse('2024-02-08T12:00:00'),
    end: parse('2024-02-14T12:00:00'),
    resourceId: 'a9',
    backgroundColor: '#E8428D',
    textColor: '#000000'
  },
  {
    title: 'COLGATE',
    start: parse('2024-01-09T00:00:00'),
    end: parse('2024-01-16T12:00:00'),
    resourceId: 'b',
    backgroundColor: '#00E16D',
    textColor: '#000000'
  },
  {
    title: 'UNILEVER',
    start: parse('2024-01-16T00:00:00'),
    end: parse('2024-01-26T12:00:00'),
    resourceId: 'b',
    backgroundColor: '#E8428D',
    textColor: '#000000'
  },
  {
    title: 'UNILEVER',
    start: parse('2024-01-16T00:00:00'),
    end: parse('2024-01-26T12:00:00'),
    resourceId: 'c',
    backgroundColor: '#E8428D',
    textColor: '#000000'
  },
  {
    title: 'NESTLE',
    start: parse('2024-01-26T00:00:00'),
    end: parse('2024-02-02T12:00:00'),
    resourceId: 'b',
    backgroundColor: '#D0EA27',
    textColor: '#000000'
  },
  {
    title: 'SC JOHNSON',
    start: parse('2024-01-26T00:00:00'),
    end: parse('2024-02-02T12:00:00'),
    resourceId: 'd',
    backgroundColor: '#9C1CF1',
    textColor: '#000000'
  },
  {
    title: 'MASTELLONE',
    start: parse('2024-02-02T12:00:00'),
    end: parse('2024-02-14T12:00:00'),
    resourceId: 'b',
    backgroundColor: '#42E866',
    textColor: '#000000'
  },
  {
    title: 'UNILEVER',
    start: parse('2024-02-02T12:00:00'),
    end: parse('2024-02-14T12:00:00'),
    resourceId: 'c',
    backgroundColor: '#E8428D',
    textColor: '#000000'
  },
  {
    title: 'SOFTYS',
    start: parse('2024-02-14T12:00:00'),
    end: parse('2024-02-19T12:00:00'),
    resourceId: 'b',
    backgroundColor: '#5445BA',
    textColor: '#000000'
  },
  {
    title: 'UNILEVER',
    start: parse('2024-02-19T00:00:00'),
    end: parse('2024-02-23T12:00:00'),
    resourceId: 'b',
    backgroundColor: '#E8428D',
    textColor: '#000000'
  },
  {
    title: 'UNILEVER',
    start: parse('2024-02-23T00:00:00'),
    end: parse('2024-02-27T12:00:00'),
    resourceId: 'b',
    backgroundColor: '#E8428D',
    textColor: '#000000'
  },

  {
    title: 'NESTLE',
    start: parse('2024-02-27T00:00:00'),
    end: parse('2024-03-02T12:00:00'),
    resourceId: 'b',
    backgroundColor: '#D0EA27',
    textColor: '#000000'
  },
  {
    title: 'MASTELLONE',
    start: parse('2024-01-26T00:00:00'),
    end: parse('2024-02-02T12:00:00'),
    resourceId: 'd',
    backgroundColor: '#42E866',
    textColor: '#000000'
  }
]
export function createEventId() {
  return String(eventGuid++)
}

function parse(dateToParse) {
  const parts = dateToParse.split('T')[0].split('-')
  return `${parts[0]}-${parts[1]}-${parts[2]}`
}
