/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 * Contributor(s): Elsio Sanchez elsiosanchez@gmail.com https://github.com/elsiosanchez
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

const VBankStatementMatch = {
  steps: {
    searchCriteria: 'Criterio de Busqueda',
    automaticMatch: 'Coincidencia Automatica',
    pendingMatch: 'Pendiente por Coincidencia',
    summaryAdjustment: 'Resume y Ajuste'
  },
  searchMode: {
    title: 'Modo de Búsqueda',
    matched: 'Asignado',
    notMatched: 'No Asignado'
  },
  field: {
    bankAccount: 'Cuenta Bancaria',
    businessPartner: 'Socio de Negocio',
    searchMode: 'Modo de Búsqueda',
    totalPayment: 'Total del Pago',
    transactionDate: 'Fecha de la Transacción',
    selectNotMatched: 'No Coincide',
    selectMatched: 'Coincidentes'
  },
  automaticMatch: {
    title: 'Coincidencia Automatica',
    table: {
      transactionDate: 'Fecha de la Transacción',
      receipt: 'Cobros',
      documentNo: 'Documento No.',
      businessPartner: 'Socio del Negocio',
      tenderType: 'Tipo de Pago',
      currency: 'Moneda',
      amount: 'Monto',
      description: 'Descripción',
      referenceNo: 'No. de Referencia',
      memo: 'Memo'
    },
    withoutAutomaticMatch: 'Sin Coincidencia Automática'
  },
  importedMovements: {
    title: 'Movimientos Importados',
    table: {
      transactionDate: 'Fecha de la Transacción',
      receipt: 'Cobros',
      referenceNo: 'No. de Referencia',
      businessPartner: 'Socio del Negocio',
      currency: 'Moneda',
      amount: 'Monto',
      memo: 'Memo'
    }
  },
  systemPayments: {
    title: 'Pagos del Sistema',
    table: {
      transactionDate: 'Fecha de la Transacción',
      receipt: 'Cobros',
      documentNo: 'Documento No.',
      businessPartner: 'Socio del Negocio',
      tenderType: 'Tipo de Pago',
      currency: 'Moneda',
      amount: 'Monto',
      description: 'Descripción'
    }
  }
}

export default VBankStatementMatch
