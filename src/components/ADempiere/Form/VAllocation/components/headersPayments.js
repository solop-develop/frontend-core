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

// List of fields to send in search
import lang from '@/lang'

export default [
  {
    label: lang.t('form.VAllocation.payment.table.date'),
    columnName: 'transaction_date',
    width: '145',
    align: 'left'
  },
  {
    label: lang.t('form.VAllocation.payment.table.apAr'),
    columnName: 'transaction_type',
    width: '90',
    align: 'left'
  },
  {
    label: lang.t('form.VAllocation.payment.table.organization'),
    columnName: 'organization',
    width: '130',
    align: 'left'
  },
  {
    label: lang.t('form.VAllocation.payment.table.documentNo'),
    columnName: 'document_no',
    width: '150',
    align: 'left'
  },
  {
    label: lang.t('form.VAllocation.payment.table.description'),
    columnName: 'description',
    width: '150',
    align: 'left'
  },
  {
    label: lang.t('form.VAllocation.payment.table.converted'),
    columnName: 'payment_amount',
    width: '250',
    align: 'right'
  },
  {
    label: lang.t('form.VAllocation.payment.table.open'),
    columnName: 'open_amount',
    width: '250',
    align: 'right'
  },
  {
    label: lang.t('form.VAllocation.payment.table.applied'),
    columnName: 'applied',
    width: '300',
    align: 'right'
  }
]
