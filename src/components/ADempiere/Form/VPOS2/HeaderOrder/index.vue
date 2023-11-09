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
  <el-row :gutter="10">
    <el-col :span="10">
      <search-product />
    </el-col>
    <el-col :span="7">
      <customer />
    </el-col>
    <el-col
      v-if="!isEmptyValue(currentOrder)"
      :span="3"
    >
      <el-form
        label-position="top"
        class="form-min-label"
        inline
        @submit.native.prevent="notSubmitForm"
      >
        <el-form-item
          style="width: 100% !important;display: contents;"
        >
          <b slot="label" style="color: transparent !important;">
            {{ $t('form.pos.optionsPoinSales.salesOrder.newOrder') }}
          </b>
          <document-status-tag
            :value="currentOrder.document_status.value"
            :displayed-value="currentOrder.document_status.name"
          />
        </el-form-item>
      </el-form>
    </el-col>
    <el-col :span="4">
      <actions-order />
    </el-col>
  </el-row>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'
import store from '@/store'
// Components and Mixins
import SearchProduct from './ProductInfo/SearchProduct'
import Customer from './Customer'
import ActionsOrder from './ActionsOrder'
import DocumentStatusTag from '@/components/ADempiere/ContainerOptions/DocumentStatusTag/index.vue'
// import { isEmptyValue } from '@/utils/ADempiere'
export default defineComponent({
  name: 'HeaderOrder',
  components: {
    Customer,
    ActionsOrder,
    SearchProduct,
    DocumentStatusTag
  },
  setup() {
    const currentOrder = computed(() => {
      return store.getters.getCurrentOrder
    })
    return {
      currentOrder
    }
  }
})
</script>

<style lang="scss" scoped>
.buttons-and-options {
  text-align: left;
  .button-group-options {
    margin-bottom: 5px;
  }
}
.order-info {
  text-align: right;
}
</style>
