// ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
// Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
// Contributor(s): Elsio Sanchez esanchez@erpya.com www.erpya.com
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
    label: language.t('form.productInfo.code'),
    columName: 'value',
    align: 'center',
    minWidth: ''
  },
  {
    label: language.t('form.productInfo.name'),
    columName: 'name',
    align: 'center',
    minWidth: ''
  },
  {
    label: language.t('field.product.standardPrice'),
    columName: 'standard_price',
    align: 'right',
    minWidth: ''
  },
  {
    label: language.t('field.product.upc'),
    columName: 'uom',
    align: 'center',
    minWidth: ''
  },
  {
    label: language.t('field.product.stocked'),
    columName: 'is_stocked',
    align: 'center',
    minWidth: ''
  },
  {
    label: language.t('field.product.productCategory'),
    columName: 'product_category',
    align: 'center',
    minWidth: '120'
  },
  {
    label: language.t('field.product.productGroup'),
    columName: 'product_group',
    align: 'center',
    minWidth: ''
  },
  {
    label: language.t('field.product.productClass'),
    columName: 'product_class',
    align: 'center',
    minWidth: ''
  },
  {
    label: language.t('field.product.vendor'),
    columName: 'vendor',
    align: 'center',
    minWidth: '120'
  },
  {
    label: language.t('form.productInfo.quantityOnHand'),
    columName: 'quantity_on_hand',
    align: 'right',
    minWidth: ''
  }
]
