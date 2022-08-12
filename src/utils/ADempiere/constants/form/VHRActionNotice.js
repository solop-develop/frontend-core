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

export const HEADER_TABLE = [
  {
    label: language.t('payrollActionNotice.organization'),
    key: 'DisplayColumn_AD_Org_ID'
  },
  {
    label: language.t('payrollActionNotice.conceptPayroll'),
    key: 'DisplayColumn_HR_Movement_ID'
  },
  {
    label: language.t('payrollActionNotice.validFrom'),
    key: 'ValidFrom'
  },
  {
    label: language.t('payrollActionNotice.quantity'),
    key: 'Qty'
  },
  {
    label: language.t('payrollActionNotice.amount'),
    key: 'Amount'
  },
  {
    label: language.t('payrollActionNotice.textMessage'),
    key: 'TextMsg'
  },
  {
    label: language.t('payrollActionNotice.serviceDate'),
    key: 'ServiceDate'
  },
  {
    label: language.t('payrollActionNotice.description'),
    key: 'Description'
  }
]

export const DATA_ATRIBUTES = [
  {
    key: 'AD_Org_ID',
    value: 0
  },
  {
    key: 'HR_Process_ID',
    value: 0
  },
  {
    key: 'C_BPartner_ID',
    value: 0
  },
  {
    key: 'HR_Concept_ID',
    value: 0
  },
  {
    key: 'HR_Movement_ID',
    value: 0
  },
  {
    key: 'Description',
    value: 0
  },
  {
    key: 'Qty',
    value: 0
  },
  {
    key: 'Amount',
    value: 0
  },
  {
    key: 'TextMsg',
    value: ''
  },
  {
    key: 'ValidFrom',
    value: ''
  },
  {
    key: 'ServiceDate',
    value: ''
  }
]
