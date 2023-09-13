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
    label: language.t('accounting.organization'),
    columnName: 'DisplayColumn_AD_Org_ID',
    align: 'center'
  },
  {
    label: language.t('accounting.product'),
    columnName: 'DisplayColumn_M_Product_ID',
    align: 'center'
  },
  {
    label: language.t('listStoreProduct.warehouse'),
    columnName: 'DisplayColumn_M_Warehouse_ID',
    align: 'center'
  },
  {
    label: language.t('listStoreProduct.location'),
    columnName: 'M_Locator_ID',
    align: 'right'
  },
  {
    label: language.t('listStoreProduct.instanceAttributeSet'),
    columnName: 'DisplayColumn_M_AttributeSet_ID',
    align: 'center'
  },
  {
    label: language.t('listStoreProduct.quantityinStock'),
    columnName: 'QtyOnHand',
    align: 'right'
  },
  {
    label: language.t('listStoreProduct.orderedQuantity'),
    columnName: 'QtyOrdered',
    align: 'right'
  },
  {
    label: language.t('listStoreProduct.reservedQuantity'),
    columnName: 'QtyReserved',
    align: 'right'
  },
  {
    label: language.t('listStoreProduct.quantityOnHand'),
    columnName: 'QtyAvailable',
    align: 'right'
  },
  {
    label: language.t('listStoreProduct.lastInventoryCountDate'),
    columnName: 'DateLastInventory',
    align: 'center'
  }
]
