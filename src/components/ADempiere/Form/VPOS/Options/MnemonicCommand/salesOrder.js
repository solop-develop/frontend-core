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
import { isEmptyValue } from '@/utils/ADempiere'

const {
  isAllowsPreviewDocument,
  isAllowsPrintDocument,
  isAllowsCreateOrder,
  isAllowsReturnOrder,
  currentOrder
} = store.getters.posAttributes.currentPointOfSales

function processed(order) {
  if (!isEmptyValue(order) && isEmptyValue(order.documentStatus.value) && currentOrder.documentStatus.value === 'CO') return true
  return false
}

export default [
  {
    nameOption: language.t('form.pos.optionsPoinSales.salesOrder.newOrder'),
    class: 'el-icon-news',
    isIcon: true,
    command: 'newOrder',
    visible: isAllowsCreateOrder
  },
  {
    nameOption: language.t('form.pos.optionsPoinSales.salesOrder.ordersHistory'),
    class: 'list',
    isIcon: false,
    command: 'ordersHistory',
    visible: true
  },
  {
    nameOption: language.t('timeControl.addResource'),
    class: 'list',
    isIcon: false,
    command: 'addResource',
    visible: true
  },
  {
    nameOption: language.t('form.pos.optionsPoinSales.salesOrder.generateImmediateInvoice'),
    class: 'el-icon-document-add',
    isIcon: true,
    command: 'generateImmediateInvoice',
    visible: true
  },
  {
    nameOption: language.t('form.pos.optionsPoinSales.salesOrder.completePreparedOrder'),
    class: 'el-icon-success',
    isIcon: true,
    command: 'completePreparedOrder',
    visible: true
  },
  {
    nameOption: language.t('form.pos.optionsPoinSales.salesOrder.cancelSaleTransaction'),
    class: 'el-icon-error',
    isIcon: true,
    command: 'cancelSaleTransaction',
    visible: isAllowsReturnOrder
  },
  {
    nameOption: language.t('form.pos.optionsPoinSales.salesOrder.print'),
    class: 'el-icon-printer',
    isIcon: true,
    command: 'print',
    visible: isAllowsPrintDocument
  },
  {
    nameOption: language.t('form.pos.optionsPoinSales.salesOrder.preview'),
    class: 'el-icon-printer',
    isIcon: true,
    command: 'preview',
    visible: isAllowsPreviewDocument
  },
  {
    nameOption: language.t('form.pos.optionsPoinSales.salesOrder.createNewReturnOrder'),
    class: 'el-icon-refresh-left',
    isIcon: true,
    command: 'createNewReturnOrder',
    visible: true
  },
  {
    nameOption: language.t('form.pos.optionsPoinSales.salesOrder.copyOrder'),
    class: 'el-icon-document-copy',
    isIcon: true,
    command: 'copyOrder',
    visible: !isEmptyValue(currentOrder)
  },
  {
    nameOption: language.t('form.pos.optionsPoinSales.salesOrder.cancelOrder'),
    class: 'el-icon-close',
    isIcon: true,
    command: 'cancelOrder',
    visible: !isEmptyValue(currentOrder)
  },
  {
    nameOption: language.t('form.pos.optionsPoinSales.salesOrder.confirmDelivery'),
    class: 'shopping',
    isIcon: false,
    command: 'confirmDelivery',
    visible: processed(currentOrder)
  },
  {
    nameOption: language.t('form.pos.optionsPoinSales.salesOrder.deliverAllProducts'),
    class: 'shopping',
    isIcon: false,
    command: 'deliverAllProducts',
    visible: processed(currentOrder)
  },
  {
    nameOption: language.t('form.pos.applyDiscountOnOrder'),
    class: 'el-icon-document-remove',
    isIcon: true,
    command: 'applyDiscountOnOrder',
    visible: !isEmptyValue(currentOrder)
  }
]
