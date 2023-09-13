<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 Contributor(s): Elsio Sanchez elsiosanches@gmail.com https://github.com/elsiosanchez
 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program.  If not, see <https:www.gnu.org/licenses/>.
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
// utils and helper methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

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
      let fieldRender = () => import('@/components/ADempiere/FieldDefinition/FieldSearch/GeneralInfoSearch')
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
        //   fieldRender = () => import('@/components/ADempiere/FieldDefinition/FieldSearch/GeneralInfoSearch')
        //   break
      }

      return fieldRender
    },
    iconComponentRender() {
      let icon = {
        type: 'svg',
        class: 'search'
      }
      if (this.isEmptyValue(this.metadata.reference)) {
        return icon
      }
      switch (this.metadata.reference.tableName) {
        case 'A_Asset':
          icon = {
            type: 'i',
            class: 'el-icon-office-building'
          }
          break
        // case 'C_BPartner':
        //   icon = {
        //     type: 'i',
        //     class: 'el-icon-user-solid'
        //   }
        //   break
        case 'C_Invoice':
          icon = {
            type: 'i',
            class: 'el-icon-s-order'
          }
          break
        case 'C_CashLine':
          icon = {
            type: 'svg',
            class: 'el-icon-coin'
          }
          break
        case 'C_Order':
          icon = {
            type: 'svg',
            class: 'clipboard'
          }
          break
        case 'C_Payment':
          icon = {
            type: 'i',
            class: 'el-icon-money'
          }
          break
        case 'M_InOut':
          icon = {
            type: 'i',
            class: 'el-icon-truck'
          }
          break
        case 'M_Product':
          icon = {
            type: 'svg',
            class: 'shopping'
          }
          break
        case 'S_ResourceAssigment':
          icon = {
            type: 'i',
            class: 'el-icon-data-analysis'
          }
          break
      }

      return icon
    }
  }
}
</script>
