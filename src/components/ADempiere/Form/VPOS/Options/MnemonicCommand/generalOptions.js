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
export default [
  {
    nameOption: language.t('form.pos.optionsPoinSales.generalOptions.changePos'),
    class: 'el-icon-mobile-phone',
    isIcon: true,
    command: 'changePos'
  },
  {
    nameOption: language.t('form.pos.optionsPoinSales.generalOptions.listProducts'),
    class: 'shopping',
    isIcon: false,
    command: 'listProducts'
  },
  {
    nameOption: language.t('form.pos.optionsPoinSales.generalOptions.changeWarehouseList'),
    class: 'tree-table',
    isIcon: false,
    command: 'changeWarehouseList'
  },
  {
    nameOption: language.t('form.pos.optionsPoinSales.generalOptions.changePriceList'),
    class: 'list',
    isIcon: false,
    command: 'changePriceList'
  }
]
