/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 * Contributor(s): Elsio Sanchez elsiosanchez@gmail.com https://github.com/elsiosanchez
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
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

const VPayPrint = {
  paymentSelection: 'Selección de Pago',
  bankAccount: 'Cuenta Bancaria',
  currentBalance: 'Saldo Actual',
  paymentRule: 'Regla de Pago',
  currency: 'Moneda',
  documentNo: 'Numero de Documento',
  numberPayments: 'Número de Pagos',
  nextSequence: 'Siguiente Secuencia',
  buttons: {
    labelPanel: '¿Qué desea hacer?',
    print: 'Imprimir',
    toExport: 'Exportar',
    processOnLine: 'Transferencia'
  },
  headerTable: {
    title: 'Detalle del Lote',
    provider: 'Proveedor',
    invoice: 'OV/Factura',
    grandTotal: 'Gran Total',
    subscriber: 'Abonado',
    payable: 'Monto a Pagar',
    pending: 'Pendiente'
  },
  message: {
    paymentRule: {
      onCredit: 'A Crédito',
      check: 'Cheque',
      directDeposit: 'Depósito Directo',
      directDebit: 'Débito Directo',
      creditCard: 'Tarjeta De Crédito'
    },
    processMessage: 'Desea Procesar Todos los Pagos tipo ',
    printMessage: 'Desea Imprimir Todos los Pagos tipo ',
    ExportMessage: 'Desea Exportar Todos los Pagos tipo ',
    printRemittanceMessage: '¿ Desea Imprimir Remesa ?',
    confirmPrintMessage: '¿ Desea Confirmar Impresión ?'
  }
}

export default VPayPrint
