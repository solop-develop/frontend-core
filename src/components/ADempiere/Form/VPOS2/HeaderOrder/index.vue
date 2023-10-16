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
    <el-col :span="13">
      <search-product />
    </el-col>
    <el-col :span="7">
      <customer />
    </el-col>
    <el-col :span="4">
      <actions-order />
    </el-col>
  </el-row>
</template>

<script>
import { defineComponent } from '@vue/composition-api'

// Components and Mixins
import SearchProduct from './ProductInfo/SearchProduct'
import Customer from './Customer'
import ActionsOrder from './ActionsOrder'
export default defineComponent({
  name: 'HeaderOrder',
  components: {
    Customer,
    ActionsOrder,
    SearchProduct
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
