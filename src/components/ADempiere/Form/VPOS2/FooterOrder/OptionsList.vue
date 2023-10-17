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
      class="list-col"
    >
      <el-dropdown
        trigger="click"
        class="info-pos"
        @command="changePos"
      >
        <span>
          <i class="el-icon-mobile-phone" />
          {{ $t('form.pos.order.pointSale') }}: <b style="cursor: pointer"> {{ pointName }} </b>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="item in listPoint"
            :key="item.id"
            :command="item"
          >
            {{ item.name }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-col>
    <el-col
      :span="24"
      class="list-col"
    >
      <el-dropdown
        trigger="click"
        class="info-pos"
        @command="changeDocumentType"
      >
        <span>
          <el-icon class="el-icon-document" />
          {{ $t('pointOfSales.order.documentType') }}:
          <b style="cursor: pointer"> {{ pointDocumentType }} </b>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="(item, index) in listDocumentTypes"
            :key="index"
            :command="item"
          >
            {{ item.name }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-col>
    <el-col
      :span="24"
      class="list-col"
    >
      <el-dropdown
        trigger="click"
        class="info-pos"
        @command="changeWarehouses"
      >
        <span>
          <svg-icon icon-class="tree" />
          {{ $t('route.warehouse') }}:
          <b style="cursor: pointer"> {{ pointWarehouses }} </b>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="(item, index) in listWarehouses"
            :key="index"
            :command="item"
          >
            {{ item.name }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-col>
    <el-col
      :span="24"
    >
      <el-dropdown
        trigger="click"
        class="info-pos"
        @command="changePrices"
      >
        <span>
          <svg-icon icon-class="tree-table" />
          {{ $t('form.pos.priceList') }}:
          <b style="cursor: pointer"> {{ pointPrices }} </b>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="(item, index) in listPrices"
            :key="index"
            :command="item"
          >
            {{ item.name }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-col>
  </el-row>
</template>

<script>
import { defineComponent, computed, watch } from '@vue/composition-api'

// import lang from '@/lang'
import store from '@/store'
// Utils and Helper Methods
// import { Persona } from '@/utils/ADempiere/form/PonitOfSales/instructure.ts'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

export default defineComponent({
  name: 'OptionsList',
  setup() {
    // Computed
    const currentPointOfSales = computed(() => {
      return store.getters.getVPOS
    })
    const pointUuid = computed(() => {
      if (isEmptyValue(currentPointOfSales.value)) return ''
      const { id } = currentPointOfSales.value
      return id
    })

    const pointName = computed(() => {
      if (isEmptyValue(currentPointOfSales.value)) return ''
      const { name } = currentPointOfSales.value
      return name
    })

    const listPoint = computed(() => {
      return store.getters.getLisVPOS
    })

    const pointDocumentType = computed(() => {
      if (isEmptyValue(currentPointOfSales.value)) return ''
      const { document_type } = currentPointOfSales.value
      return document_type.name
    })

    const listDocumentTypes = computed(() => {
      return store.getters.getListDocumentTypes
    })

    const pointPrices = computed(() => {
      if (isEmptyValue(currentPointOfSales.value)) return ''
      const { price_list } = currentPointOfSales.value
      return price_list.name
    })

    const listPrices = computed(() => {
      return store.getters.getListPrices
    })

    const pointWarehouses = computed(() => {
      if (isEmptyValue(currentPointOfSales.value)) return ''
      const { warehouse } = currentPointOfSales.value
      return warehouse.name
    })

    const listWarehouses = computed(() => {
      return store.getters.getListWarehouses
    })

    // Methods

    /**
     * Change Pos
     * @param {Object} point
     */
    function changePos(point) {
      updateListAvalibles(point)
    }

    function changeDocumentType(documentType) {
      store.commit('setUpdatePointVPOS', {
        attribute: 'documentType',
        value: documentType
      })
    }

    function changeWarehouses(warehouse) {
      store.commit('setUpdatePointVPOS', {
        attribute: 'warehouse',
        value: warehouse
      })
    }

    function changePrices(price) {
      store.commit('setUpdatePointVPOS', {
        attribute: 'priceList',
        value: price
      })
    }

    function updateListAvalibles(point) {
      store.dispatch('listAvailablePrices')
      store.dispatch('listAvailableWarehouse')
      store.dispatch('listAvailableDocumentTypes')
    }

    watch(pointUuid, (newValue, oldValue) => {
      if (!isEmptyValue(newValue) && newValue !== oldValue) {
        updateListAvalibles(newValue)
      }
    })

    return {
      pointName,
      listPoint,
      pointPrices,
      listPrices,
      currentPointOfSales,
      pointDocumentType,
      listDocumentTypes,
      pointWarehouses,
      listWarehouses,
      // Methods
      changePos,
      changeDocumentType,
      changeWarehouses,
      changePrices
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
.list-col {
  margin-bottom: 5px;
}
</style>
