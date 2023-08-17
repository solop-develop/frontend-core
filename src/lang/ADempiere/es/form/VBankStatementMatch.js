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
    confirmImport: 'Confirmar / Importar'
  },
  searchMode: {
    title: 'Modo de Búsqueda',
    matched: 'Asignado',
    notMatched: 'No Asignado'
  },
  field: {
    bankAccount: 'Cuenta Bancaria',
    bankStatement: 'Estado de Cuenta Bancaria',
    businessPartner: 'Socio de Negocio',
    searchMode: 'Modo de Búsqueda',
    matchesPayment: 'Pagos Coindidentes',
    totalPayment: 'Total del Pago',
    transactionDate: 'Fecha de la Transacción',
    selectNotMatched: 'No Coincide',
    selectMatched: 'Coincidentes',
    simulateMatch: 'Simular Conciliación',
    assignedMatch: 'Asignar Conciliación',
    unassignedMatch: 'Desasignar Conciliación'
  },
  bankStatement: {
    name: 'Nombre',
    documentNo: 'Nro. Documento',
    bankStatementDate: 'Fecha de Estado de Cuenta',
    bank: 'Banco',
    bankAccount: 'Cuenta Bancaria',
    currentBalance: 'Saldo Actual',
    beginningBalance: 'Saldo Inicial',
    statementDifference: 'Diferencia de Cuenta',
    endingBalance: 'Saldo Final'
  },
  automaticMatch: {
    title: 'Coincidencia Automatica',
    table: {
      date: 'Fecha',
      transactionDate: 'Fecha de la Transacción',
      receipt: 'Cobros',
      documentNo: 'Documento No.',
      businessPartner: 'Socio del Negocio',
      tenderType: 'Tipo de Pago',
      currency: 'Moneda',
      amount: 'Monto',
      description: 'Descripción',
      referenceNo: 'No. de Referencia',
      memo: 'Memo',
      match: 'Coincidencia',
      total: 'Total'
    },
    withoutAutomaticMatch: 'Sin Coincidencia Automática'
  },
  bankMovements: {
    title: 'Movimientos Bancarios',
    table: {
      date: 'Fecha',
      transactionDate: 'Fecha de la Transacción',
      receipt: 'Cobros',
      referenceNo: 'No. de Referencia',
      businessPartner: 'Socio del Negocio',
      currency: 'Moneda',
      amount: 'Monto',
      memo: 'Memo',
      match: 'Coincidencia',
      total: 'Total'
    }
  },
  systemPayments: {
    title: 'Pagos del Sistema',
    table: {
      date: 'Fecha',
      transactionDate: 'Fecha de la Transacción',
      paymentDate: 'Fecha del Pago',
      receipt: 'Cobros',
      documentNo: 'Documento No.',
      businessPartner: 'Socio del Negocio',
      tenderType: 'Tipo de Pago',
      currency: 'Moneda',
      amount: 'Monto',
      description: 'Descripción',
      match: 'Coincidencia',
      total: 'Total'
    }
  },
  result: 'Resultado'
}

export default VBankStatementMatch
