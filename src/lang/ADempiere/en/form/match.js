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
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

const match = {
  title: {
    invoice: 'Invoice',
    deliveryReceipt: 'Delivery / Receipt'
  },
  searchCriteria: {
    assignFrom: 'Assign From',
    assignTo: 'Assign To',
    searchMode: 'Search Mode',
    businessPartner: 'Business Partner',
    product: 'Product',
    dateFrom: 'Date From',
    dateTo: 'Date To'
  },
  description: {
    searchCriteria: 'Select a Business Partner to check for pending documents to be assigned',
    invoice: 'Select an Invoice to assign the corresponding Delivery/Receipt',
    deliveryReceipt: 'Select at least one Delivery/Receipt to which you require to assign the selected invoice'
  },
  field: {
    toAssigned: 'To be assigned',
    assigning: 'Assigning',
    difference: 'Difference'
  },
  filtersSearch: {
    sameBusinessPartner: 'Same Business Partner',
    sameProduct: 'Same Product ',
    sameQuantity: 'SameQuantity '
  },
  table: {
    nrDocument: 'Nr Document'
  }
}

export default match
