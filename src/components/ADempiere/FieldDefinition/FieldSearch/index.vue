<!--
  ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
  Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
  Contributor(s): Elsio Sanchez elsiosanches@gmail.com https://github.com/elsiosanchez
  Contributor(s): Edwin Betancourt EdwinBetanc0urt@outlook.com https://github.com/EdwinBetanc0urt
  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program. If not, see <https:www.gnu.org/licenses/>.
-->

<template>
  <component
    :is="componentRender"
    :parent-uuid="parentUuid"
    :container-uuid="containerUuid"
    :container-manager="containerManager"
    :metadata="metadata"
    :icon="iconComponentRender"
  />
</template>

<script>
// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { iconSearchFieldByTable } from '@/utils/ADempiere/dictionary/field/search/index.ts'

/**
 * This component emulates the behavior of the search field, contemplating:
 * - Search Field
 * - InfoBPartner
 * - InfoProduct
 * - InfoInvoice
 * - InfoAsset
 * - InfoOrder
 * - InfoInOut
 * - InfoPayment
 * - InfoCashLine
 * - InfoAssignment
 * - InfoGeneral
 *
 * Based on
 * org.compiere.apps.search.Info;
 * org.compiere.apps.search.InfoGeneral;
 */
export default {
  name: 'FieldSearch',

  props: {
    parentUuid: {
      type: String,
      default: undefined
    },
    containerUuid: {
      type: String,
      required: true
    },
    containerManager: {
      type: Object,
      required: true
    },
    // receives the property that is an object with all the attributes
    metadata: {
      type: Object,
      default: () => ({})
    }
  },

  computed: {
    // load the component that is indicated in the attributes of received property
    componentRender() {
      // let fieldRender = () => import('@/components/ADempiere/FieldDefinition/FieldSearch/GeneralInfoSearch')
      let fieldRender = () => import('@/components/ADempiere/FieldDefinition/FieldSelect')
      if (isEmptyValue(this.metadata.reference)) {
        return fieldRender
      }
      switch (this.metadata.reference.tableName) {
        case 'C_BPartner':
          fieldRender = () => import('@/components/ADempiere/FieldDefinition/FieldSearch/BusinessPartnerInfo')
          break
        // case 'C_Invoice':
        // case 'M_Product':
        // case 'A_Asset':
        // case 'C_Order':
        default:
          fieldRender = () => import('@/components/ADempiere/FieldDefinition/FieldSearch/GeneralInfoSearch')
          break
      }

      return fieldRender
    },
    iconComponentRender() {
      const icon = {
        type: 'svg',
        class: 'search'
      }
      if (isEmptyValue(this.metadata.reference)) {
        return icon
      }
      return iconSearchFieldByTable(
        this.metadata.reference.tableName
      )
    }
  }
}
</script>
