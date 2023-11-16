<!--
ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
Contributor(s): Elsio Sanchez elsiosanchez15@outlook.com https://github.com/elsiosanchez
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.
This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.
You should have received a copy of the GNU General Public License
along with this program. If not, see <https:www.gnu.org/licenses/>.
-->

<template>
  <el-row>
    <el-col
      :span="24"
    >
      <el-button
        :disabled="true"
        plain
        type="info"
        icon="el-icon-top"
        style="font-size: 16px;"
      />
      <el-button
        :disabled="true"
        plain
        type="info"
        icon="el-icon-bottom"
        style="font-size: 16px;"
      />
      <el-button
        v-show="!isEmptyValue(order)"
        type="danger"
        icon="el-icon-delete"
      />
      <el-button
        v-show="!isEmptyValue(order)"
        type="primary"
        icon="el-icon-document-checked"
        @click="releaseOrder(order)"
      >
        {{ $t('form.pos.releaseOrder') }}
      </el-button>
      <el-button
        v-show="!isEmptyValue(order)"
        type="success"
        icon="el-icon-bank-card"
        @click="openShowCollections"
      >
        {{ $t('form.pos.order.collect') }}
      </el-button>
    </el-col>
  </el-row>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'
import store from '@/store'

export default defineComponent({
  name: 'ButtonGroupOptions',
  setup() {
    const order = computed(() => {
      return store.getters.getCurrentOrder
    })

    function releaseOrder(order) {
      store.dispatch('releaseCurrentOrder', { order })
    }

    function openShowCollections() {
      store.commit('setShowCollection', true)
      store.dispatch('findRate', {
        currencyToId: store.getters.getVPOS.display_currency.id
      })
    }

    return {
      order,
      releaseOrder,
      openShowCollections
    }
  }
})
</script>

<style lang="scss" scoped>
.buttons-and-options {
  text-align: left;
}
.order-info {
  text-align: right;
}
</style>
