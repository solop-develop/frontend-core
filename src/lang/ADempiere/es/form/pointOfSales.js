/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 * Contributor(s): Edwin Betancourt EdwinBetanc0urt@outlook.com https://github.com/EdwinBetanc0urt
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

const pointOfSales = {
  customer: {
    listCustomers: 'Listar Clientes',
    listBusinessPartners: 'Listar Socios de Negocios',
    newCustomer: 'Nuevo Cliente',
    newBusinessPartner: 'Nuevo Socio de Negocio',
    updateCustomer: 'Actualizar Cliente',
    updateBusinessPartner: 'Actualizar Socio de Negocio'
  },
  collection: {
    chargeAmount: 'Cargo',
    creditAmount: 'Abono',
    others: 'Otros',
    customerAccount: 'Cuenta de Cliente',
    recipientBank: 'Banco Receptor',
    issuingBank: 'Banco Emisor',
    bank: 'Banco',
    creditMemo: 'Nota de crédito'
  },
  conversionRate: {
    withoutConversionRate: 'No existe tasa de cambio registrada al día '
  },
  keyLayout: {
    quantity: 'Cantidad'
  },
  order: {
    dateOfOrder: 'Fecha de Orden',
    documentType: 'Tipo de Documento',
    showHistoryOrdersList: 'Ver Histórico de Órdenes'
  },
  orderLine: {
    edit: 'Editar Línea',
    updateSuccess: 'Linea de la Orden Actualizada Exitosamente'
  },
  permissions: {
    previewDocumentNotAllowed: 'No está permitido "Vista Previa de Documento" para su usuario'
  },
  pin: {
    validatePin: 'Validar PIN',
    validateSuccessfully: 'PIN Validado Exitosamente'
  },
  print: {
    cloudNotConnectPirnter: 'No se ha podido conectar con la impresora'
  },
  withoutPOSTerminal: 'Sin Terminal POS',
  withoutPriceList: 'Sin Lista de Precios'
}

export default pointOfSales
