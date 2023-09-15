/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 * Contributor(s): Elsio Sanchez elsiosanchez@gmail.com https://github.com/elsiosanchez
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

// List of fields to send in search
import lang from '@/lang'

export default [
  {
    label: lang.t('form.tasks.table.id'),
    key: 'id',
    width: '350'
  },
  {
    label: lang.t('form.tasks.table.group'),
    key: 'group'
  },
  {
    label: lang.t('form.tasks.table.name'),
    key: 'job_name'
  },
  {
    label: lang.t('form.tasks.table.nodeName'),
    key: 'node_name'
  },
  {
    label: lang.t('form.tasks.table.startedAt'),
    key: 'startDate'
  },
  {
    label: lang.t('form.tasks.table.endedIn'),
    key: 'finishedDate'
  },
  {
    label: lang.t('form.tasks.table.success'),
    key: 'success'
  },
  {
    label: lang.t('form.tasks.table.attempt'),
    key: 'attempt',
    align: 'right',
    width: '90'
  }
]
