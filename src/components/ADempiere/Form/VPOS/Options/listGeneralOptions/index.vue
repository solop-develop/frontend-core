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
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https:www.gnu.org/licenses/>.
-->
<template>
  <el-row :gutter="12" style="padding-right: 10px;">
    <el-empty v-if="isEmptyValue(isListRender)" :image-size="200" />
    <el-col
      v-for="(list, key) in isListRender"
      v-else
      :key="key"
      :span="8"
      style="padding-left: 12px;padding-right: 12px;padding-bottom: 10px;"
    >
      <el-card
        shadow="never"
        class="custom-card"
        :body-style="{ padding: '10px' }"
      >
        <p
          style="padding-left: 10px; font-size: 18px;text-align: center;"
        >
          <i v-if="!list.icon.isSvg" :class="list.icon.class" />
          <svg-icon v-else :icon-class="list.icon.class" />
          <br>
          <br>
          {{ list.name }}
        </p>
      </el-card>
    </el-col>
    <el-col :span="24">
      <samp class="spam-button" style="float: right;">
        <el-button
          type="primary"
          icon="el-icon-check"
          class="button-base-icon"
          style="float: right; margin: 10px;"
        />
        <el-button
          type="danger"
          icon="el-icon-close"
          style="float: right;margin-top: 10px;"
          class="button-base-icon"
          @click="close()"
        />
      </samp>
    </el-col>
  </el-row>
</template>

<script>
import store from '@/store'
import { defineComponent, computed } from '@vue/composition-api'
// Component
// Utils and Helper Methods

export default defineComponent({
  name: 'listGeneralOptions',
  props: {
    metadata: {
      type: Object,
      default: () => {}
    }
  },
  setup() {
    /**
     * Component
     */
    const pointOfSalesList = computed(() => {
      return store.getters.posAttributes.pointOfSalesList
    })
    const warehousesList = computed(() => {
      return store.getters.posAttributes.currentPointOfSales.warehousesList
    })
    const pricesList = computed(() => {
      return store.getters.posAttributes.currentPointOfSales.pricesList
    })
    const currentCommand = computed(() => {
      return store.getters.getCurrentCommand
    })

    const isIconRender = computed(() => {
      let icon = []
      switch (currentCommand.value.command) {
        case 'changePos':
          icon = {
            class: 'el-icon-mobile-phone',
            isSvg: false
          }
          break
        case 'listProducts':
          icon = {
            class: 'shopping',
            isSvg: true
          }
          break
        case 'changeWarehouseList':
          icon = {
            class: 'tree-table',
            isSvg: true
          }
          break
        case 'changePriceList':
          icon = {
            class: 'list',
            isSvg: true
          }
          break
      }
      return icon
    })

    const isListRender = computed(() => {
      let list = []
      switch (currentCommand.value.command) {
        case 'changePos':
          list = pointOfSalesList.value.map(point => {
            return {
              ...point,
              icon: isIconRender.value
            }
          })
          break
        case 'changeWarehouseList':
          list = warehousesList.value.map(point => {
            return {
              ...point,
              icon: isIconRender.value
            }
          })
          break
        case 'changePriceList':
          list = pricesList.value.map(point => {
            return {
              ...point,
              icon: isIconRender.value
            }
          })
          break
      }
      return list
    })
    /**
     * Methods
     */
    function close() {
      store.commit('setDialogoComponent', false)
    }

    return {
      // Component
      pointOfSalesList,
      warehousesList,
      currentCommand,
      isListRender,
      isIconRender,
      pricesList,
      // Methods
      close
    }
  }
})
</script>

<style lang="scss">
.dialogo-component{
  .el-dialog__body {
    max-height: 100%;
  }
}
.custom-card {
  margin: 1px;
  cursor: pointer;
}
.custom-card:hover {
  background-color: #eaf5fe;
  border: 1px solid #36a3f7;
}
</style>
