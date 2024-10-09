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
  title: 'Productos',
  edit: 'Editar',
  emptyRecords: 'Utilice los filtros para la búsqueda de producto según su Código, Nombre, SKU',
  notFound: 'Producto no encontrado',
  searchWithEnter: 'Introduzca un valor para buscar productos',
  // fields
  value: 'Código',
  name: 'Nombre',
  upcEan: 'UPC/EAN',
  warehouse: 'Almacén',
  priceListVersion: 'Versión de Lista de Precios',
  productCategory: 'Categoria de Producto',
  productClass: 'Clase de Producto',
  productClassification: 'Clasificación de Producto',
  productGroup: 'Grupo de Producto',
  sku: 'SKU',
  upc: 'UPC/EAN',
  uom: 'UM',
  attributeSet: 'Conjunto de Atributos',
  attributeSetInstance: 'Instancia de Conjunto de Atributos',
  vendor: 'Proveedor',
  description: 'Descripción',
  // amount
  listPrice: 'Precio Lista',
  standardPrice: 'Precio Estándar',
  limitPrice: 'Precio Límite',
  margin: 'Margen',
  // quantity
  stocked: 'Almacenado',
  onlyOnHand: 'Solo Disponible',
  available: 'Cant. Disponible',
  onHandQuantity: 'Cant. Existencia',
  reservedQuantity: 'Cant. Reservada',
  orderedQuantity: 'Cant. Ordenada',
  unconfirmedQuantity: 'Cant. sin Confirmar',
  unconfirmedMove: 'Movimiento sin Confirmar',
  //
  instanceAttribute: 'Atributo de Instancia',
  //
  warehouseStocks: 'Existencias en Almacén',
  substitute: 'Sustituto',
  relateds: 'Relacionados',
  availableToPromises: 'Disponibles para Promesas',
  vendorPurchases: 'Compras de Proveedores',
  searchCriteria: 'Criterios de Búsqueda',
  wrehouseTables: {
    name: 'Nombre',
    availableQuantity: 'Cantidad Disponible',
    reservedQuantity: 'Cantidad Disponible',
    orderedQuantity: 'Cantidad Reservada',
    onHandQuantity: 'Cantidad Pedida'
  },
  substituteTables: {
    name: 'Nombre',
    value: 'Código',
    warehouse: 'Almacén',
    availableQuantity: 'Cantidad Disponible',
    reservedQuantity: 'Cantidad Disponible',
    standardPrice: 'Precio Estandar',
    onHandQuantity: 'Cantidad Pedida'
  },
  relatedsTables: {
    name: 'Nombre',
    value: 'Código',
    warehouse: 'Almacén',
    availableQuantity: 'Cantidad Disponible',
    reservedQuantity: 'Cantidad Disponible',
    standardPrice: 'Precio Estandar',
    onHandQuantity: 'Cantidad Pedida'
  },
  availableToPromisesTables: {
    showDetails: 'Mostrar Detalle',
    warehouse: 'Almacén',
    locator: 'Ubicacion',
    documentNo: 'Número de Documento',
    date: 'Fecha',
    quantityStock: 'Cantidad en Existencia',
    onHandQuantity: 'Cantidad Reservada',
    availableQuantity: 'Cantidad Disponible',
    quantityOrdered: 'Cantidad Ordenada',
    businessPartner: 'Socio de Negocios',
    availablePromise: 'Disponible para Promesa',
    instanceAttributeSet: 'Instancia Conjunto de Atributos'
  },
  vendorPurchasesTables: {
    name: 'Nombre',
    isCurrentVendor: 'Proveedor Actual',
    uom: 'UOM'
  },
  infoProduct: {
    infoProductoclassification: 'Clasificación',
    infoProductCategory: 'Categoría',
    infoProductClass: 'Clase',
    infoProductGroup: 'Grupo'
  }
}

export default product
