/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 * Contributor(s): Elsio Sanchez elsiosanchez15@outlook.com https://github.com/elsiosanchez
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

const VAllocation = {
  title: 'Asignación de Pagos',
  step: {
    searchCriteria: 'Criterio de Búsqueda',
    selectionPaymentsInvoice: 'Selección de Pagos y Factura',
    summaryAndAdjustment: 'Resumen y Ajuste'
  },
  searchCriteria: {
    businessPartner: 'Socio de Negocio',
    organization: 'Organización',
    currency: 'Moneda',
    date: 'Fecha',
    transactionType: 'Tipo de Transacción',
    option: {
      assignFromOrder: 'Assignar desde Orden',
      fullAmount: 'Monto Completo',
      autoAssign: 'Auto-Asignar',
      manual: 'Manual',
      closingBalance: 'Cierre de Saldo'
    }
  },
  payment: {
    title: 'Pagos',
    table: {
      date: 'Fecha',
      apAr: 'CP - CC',
      organization: 'Organización',
      documentNo: 'No Documento',
      description: 'Descripción',
      converted: 'Convertido',
      open: 'Abierto',
      applied: 'Aplicado'
    }
  },
  invoice: {
    title: 'Factura',
    table: {
      date: 'Fecha',
      apAr: 'CP - CC',
      organization: 'Organización',
      documentNo: 'No Documento',
      description: 'Descripción',
      converted: 'Convertido',
      open: 'Abierto',
      tradeDiscount: 'Descuentos',
      writeOff: 'Ajuste',
      applied: 'Aplicado',
      overUnderPay: 'Pago Sobre/ Por debajo'
    }
  },
  description: {
    difference: 'Diferencia',
    charge: 'Cargo',
    organization: 'Organización',
    description: 'Descripción'
  }
}

export default VAllocation
