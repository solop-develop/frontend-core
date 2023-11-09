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
      :span="12"
      class="buttons-and-options"
    >
      <button-group-options
        class="button-group-options"
      />
      <!-- <br /> -->
      <options-list />
    </el-col>
    <br>
    <el-col
      :span="12"
      class="order-info"
    >
      <info-order />
    </el-col>
  </el-row>
</template>

<script>
import { defineComponent } from '@vue/composition-api'

// Components and Mixins
import ButtonGroupOptions from './ButtonGroupOptions.vue'
import OptionsList from './OptionsList.vue'
import InfoOrder from './InfoOrder.vue'

export default defineComponent({
  name: 'footerOrder',
  components: {
    ButtonGroupOptions,
    OptionsList,
    InfoOrder
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
  border: 1px solid #d3d4d6;
  border-radius: 10px;
}
</style>
