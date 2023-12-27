// ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
// Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
// Contributor(s): Elsio Sanchez elsiosanchez15@outlook.com https://github.com/elsiosanchez
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
import store from '@/store'
const {
  isAllowsCashOpening,
  isAllowsAllocateSeller,
  isAllowsCashClosing
} = store.getters.posAttributes.currentPointOfSales

export default [
  {
    nameOption: language.t('form.pos.optionsPoinSales.cashManagement.cashOpening'),
    class: 'el-icon-sell',
    isIcon: true,
    command: 'cashOpening',
    visible: isAllowsCashOpening
  },
  {
    nameOption: language.t('form.pos.optionsPoinSales.cashManagement.closeBox'),
    class: 'el-icon-sold-out',
    isIcon: true,
    command: 'closeBox',
    visible: isAllowsCashClosing
  },
  {
    nameOption: language.t('form.pos.optionsPoinSales.cashManagement.assignSeller'),
    class: 'peoples',
    isIcon: false,
    command: 'assignSeller',
    visible: isAllowsAllocateSeller
  },
  {
    nameOption: language.t('form.pos.optionsPoinSales.cashManagement.unassignSeller'),
    class: 'peoples',
    isIcon: false,
    command: 'unassignSeller',
    visible: isAllowsAllocateSeller
  }
]
