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

const match = {
  title: {
    invoice: 'Factura',
    deliveryReceipt: 'Entrega / Recibo'
  },
  searchCriteria: {
    assignFrom: 'Asignar Desde',
    assignTo: 'Asignar Hasta',
    searchMode: 'Modo de Búsqueda',
    businessPartner: 'Socio de Negocio',
    product: 'Producto',
    dateFrom: 'Fecha desde',
    dateTo: 'Fecha Hasta'
  },
  description: {
    searchCriteria: 'Seleccione un Socio de Negocio para verificar los documentos pendientes por asignar',
    invoice: 'Seleccione una Factura para asignar las Entrega/Recibo correspondiente',
    deliveryReceipt: 'Seleccione al menos una Entrega/Recibo a la cual requiere asignar la factura seleccionada'
  },
  field: {
    toAssigned: 'Para ser Asignadas',
    assigning: 'Asignando',
    difference: 'Diferencia'
  },
  filtersSearch: {
    sameBusinessPartner: 'Mismo Socio del Negocio',
    sameProduct: 'Mismo Producto ',
    sameQuantity: 'Misma Cantidad '
  },
  table: {
    nrDocument: 'Nr Docuemnto'
  }
}

export default match
