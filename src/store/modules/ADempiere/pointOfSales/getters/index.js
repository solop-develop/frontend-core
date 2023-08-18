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

/**
 * PointOfSales Getters
 */
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'

const withoutResponse = {
  isLoaded: false,
  isReload: true,
  recordCount: 0,
  nextPageToken: undefined
}

function isProcessed(order) {
  if (!isEmptyValue(order.documentStatus.value) &&
    (order.documentStatus.value === 'CO' ||
     order.documentStatus.value === 'VO' ||
     order.documentStatus.value === 'IP' ||
     order.documentStatus.value === 'IP')) {
    return true
  }
  return false
}
export default {
  /**
   * Point of Sale Attributes
   * List Point Of Sales
   * Current Point Of Sales
   * Current Order
   * List Order Lines
   * List Payment Order
   * Lst Order
   * List Warehouses
   * List Prices
   */
  posAttributes: (state) => {
    return {
      pointOfSalesList: state.pointOfSalesList,
      currentPointOfSales: {
        ...state.currentPointOfSales,
        listOrder: state.listOrder,
        warehousesList: state.warehousesList,
        discountList: state.discount,
        currentWarehouse: state.currentWarehousePos,
        documentTypesList: state.documentTypesList,
        pricesList: state.pricesList,
        currentPriceList: state.currentPriceList,
        currentOrder: {
          ...state.order,
          lineOrder: state.listOrderLine,
          listPayments: state.listPayments,
          isProcessed: isProcessed(state.order)
        }
      }
    }
  },
  getListRefund: (state) => {
    return state.listRefund
  },

  /**
   * visibility of point of sale panels
   * Show Panel Options the Point Of Sales
   * Show Panel Key Layout the Point Of Sales
   * Show Panel Collection the Point Of Sales
   */
  getIsShowPOSOptions: (state) => {
    return state.showPOSOptions
  },
  getShowPOSKeyLayout: (state) => {
    return state.showPOSKeyLayout
  },
  getShowCollectionPos: (state) => {
    return state.showPOSCollection
  },
  /**
   * get Key Layout
   * List Catalog
   */
  getKeyLayout: (state) => {
    if (isEmptyValue(state.keyLayout)) {
      return {
        ...withoutResponse,
        uuid: undefined,
        ordersList: []
      }
    }
    return state.keyLayout
  },
  /**
   * Current Price List
   */
  currentPriceList: (state) => {
    if (!isEmptyValue(state.currentPriceList)) {
      return state.currentPriceList
    }
    return {}
  },
  /**
   * Current Discount List
   */
  currentDiscountList: (state) => {
    if (!isEmptyValue(state.currentDiscountList)) {
      return state.currentDiscountList
    }
    return {}
  },
  /**
   * Current Warehouse
   */
  getCurrentWarehousePos: (state) => {
    if (!isEmptyValue(state.currentWarehousePos)) {
      return state.currentWarehousePos
    }
    return {}
  },

  /**
   * Current Document Type
   */
  getCurrentDocumentTypePos: (state) => {
    if (!isEmptyValue(state.currentDocumentTypePos)) {
      return state.currentDocumentTypePos
    }
    return {}
  },
  // Current POS, it can be s
  getCurrenciesList: (state) => {
    return state.currenciesList
  },
  // get Payment type list
  getPaymentTypeList: (state) => {
    return state.tenderTypes
  },
  getShowList: (state) => {
    return state.listOrder.isShowPopover
  },
  getIsShowResource: (state) => {
    return state.isShowResource
  },
  getNewCustomer: (state) => {
    return state.newCustomer
  },
  getListWarehouseLine: (state) => {
    return state.listWarehouse
  }
}
