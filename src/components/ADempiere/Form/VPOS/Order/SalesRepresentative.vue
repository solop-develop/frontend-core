<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
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
  <el-dropdown
    trigger="click"
    class="info-pos"
    @command="changeSalesRepresentative"
  >
    <span style="font-size: 16px;">
      <i class="el-icon-s-custom" />
      {{ $t('form.pos.order.seller') }}:
      <b style="cursor: pointer">
        {{ currentSalesRepresentative.name }}
      </b>
    </span>

    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item
        v-for="item in salesRepresentativeList"
        :key="item.uuid"
        :command="item"
      >
        {{ item.name }}
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { defineComponent, ref, watch } from '@vue/composition-api'

import store from '@/store'

// api request methods
import { availableSellers } from '@/api/ADempiere/form/point-of-sales.js'

// utils and helper methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'

export default defineComponent({
  name: 'SalesRepresentative',

  props: {
    pointOfSales: {
      type: Object,
      require: true
    },
    salesOrder: {
      type: Object,
      default: () => {}
    }
  },

  setup(props) {
    const salesRepresentativeList = ref([
      props.salesOrder.salesRepresentative
    ])
    const currentSalesRepresentative = ref(props.salesOrder.salesRepresentative)

    function listAvailableSellers() {
      const posUuid = props.pointOfSales.uuid
      if (isEmptyValue(posUuid)) {
        return
      }

      availableSellers({
        posUuid,
        isOnlyAllocated: false
      })
        .then(response => {
          salesRepresentativeList.value = response.records
        })
        .catch(error => {
          this.$message({
            message: error.message,
            isShowClose: true,
            type: 'error'
          })
          console.warn(`Error: ${error.message}. Code: ${error.code}.`)
        })
    }

    function changeSalesRepresentative(salesRepresentative) {
      store.dispatch('updateOrder', {
        orderUuid: props.salesOrder.uuid,
        posUuid: props.pointOfSales.uuid,
        salesRepresentativeUuid: salesRepresentative.uuid
      })

      currentSalesRepresentative.value = salesRepresentative
    }

    watch(() => props.salesOrder, (newSalesOrder, oldValue) => {
      if (!isEmptyValue(newSalesOrder.salesRepresentative)) {
        currentSalesRepresentative.value = newSalesOrder.salesRepresentative
      }
    })

    watch(() => props.pointOfSales, (newPos, oldPos) => {
      if (newPos.uuid !== oldPos.uuid) {
        listAvailableSellers()
      }
    })
    if (isEmptyValue(salesRepresentativeList.value) || !isEmptyValue(salesRepresentativeList.value) && salesRepresentativeList.value.length <= 1) {
      listAvailableSellers()
    }

    return {
      currentSalesRepresentative,
      salesRepresentativeList,
      changeSalesRepresentative,
      listAvailableSellers
    }
  }
})
</script>
