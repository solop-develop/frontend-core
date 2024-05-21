/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 * Contributor(s): Edwin Betancourt EdwinBetanc0urt@outlook.com https://github.com/EdwinBetanc0urt
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

const product = {
  title: 'Products',
  edit: 'Edit',
  emptyRecords: 'Use the filters to search for a product by Code, Name, SKU',
  notFound: 'Product not found',
  searchWithEnter: 'Enter a value to search for a Products',
  // fields
  value: 'Value',
  name: 'Name',
  upcEan: 'UPC/EAN',
  warehouse: 'Warehouse',
  priceListVersion: 'Pricelist Version',
  productCategory: 'Product Category',
  productClass: 'Product Class',
  productClassification: 'Product Classification',
  productGroup: 'Product Group',
  sku: 'SKU',
  upc: 'UPC/EAN',
  uom: 'UOM',
  attributeSet: 'Attribute Set',
  attributeSetInstance: 'Attribute Set Instance',
  vendor: 'Vendor',
  description: 'Description',
  // amount
  listPrice: 'List Price',
  standardPrice: 'Standard Price',
  limitPrice: 'Limit Price',
  margin: 'Margin',
  // quantity
  stocked: 'Stocked',
  available: 'Available',
  onHandQuantity: 'On Hand Qty',
  reservedQuantity: 'Reserved Qty',
  orderedQuantity: 'Ordered Qty',
  unconfirmedQuantity: 'Unconfirmed Qty',
  unconfirmedMove: 'Unconfirmed Move',
  //
  instanceAttribute: 'Instance Attribute',
  //
  warehouseStocks: 'Warehouse Stocks',
  substitute: 'Substitute',
  relateds: 'Related',
  availableToPromises: 'AvailableToPromises',
  vendorPurchases: 'Vendor Purchases',
  wrehouseTables: {
    name: 'Name',
    availableQuantity: 'AvailableQuantity',
    reservedQuantity: 'Quantity Available',
    orderedQuantity: 'ReservedQuantity',
    onHandQuantity: 'OrderedQuantity'
  },
  substituteTables: {
    name: 'Name',
    value: 'Code',
    warehouse: 'Warehouse',
    availableQuantity: 'Quantity Available',
    reservedQuantity: 'Quantity Available',
    standardPrice: 'Standard Price',
    onHandQuantity: 'Quantity Ordered'
  },
  relatedsTables: {
    name: 'Name',
    value: 'Code',
    warehouse: 'Warehouse',
    availableQuantity: 'Quantity Available',
    reservedQuantity: 'Quantity Available',
    standardPrice: 'Standard Price',
    onHandQuantity: 'Quantity Ordered'
  },
  availableToPromisesTables: {
    name: 'Name',
    value: 'Code',
    locator: 'location',
    availableQuantity: 'Quantity Available',
    onHandQuantity: 'Quantity Ordered',
    expectedChangeQuantity: 'Expected Change Quantity',
    businessPartner: 'Business Partner',
    reservedQuantity: 'Available Quantity',
    standardPrice: 'Standard Price',
    documentNo: 'Document Number',
    attributeSetInstance: 'Attribute'
  },
  vendorPurchasesTables: {
    name: 'Name',
    isCurrentVendor: 'Current Vendor',
    uom: 'UOM'
  },
  infoProduct: {
    infoProductoclassification: 'Classification',
    infoProductCategory: 'Category',
    infoProductClass: 'Class',
    infoProductGroup: 'Groups'
  }
}

export default product
