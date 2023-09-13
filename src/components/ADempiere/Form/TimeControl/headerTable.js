// ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
// Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
// Contributor(s): Elsio Sanchez elsiosanches@gmail.com https://github.com/elsiosanchez
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

export default [
  {
    label: language.t('timeControl.type'),
    columnName: 'resourceNameType',
    align: 'resource',
    size: 'auto'
  },
  {
    label: language.t('timeControl.name'),
    columnName: 'name',
    align: 'center',
    size: 'auto'
  },
  {
    label: language.t('timeControl.description'),
    columnName: 'description',
    align: 'center',
    size: 'auto'
  },
  {
    label: language.t('timeControl.input'),
    columnName: 'dateFrom',
    align: 'center',
    size: 'auto'
  },
  {
    label: language.t('timeControl.output'),
    columnName: 'dateTo',
    align: 'center',
    size: 'auto'
  },
  {
    label: language.t('timeControl.duration'),
    columnName: 'quantity',
    align: 'right',
    size: 'auto'
  },
  {
    label: language.t('timeControl.processed'),
    columnName: 'is_confirmed',
    align: 'center',
    size: '100px'
  }
]
