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
  <el-container
    style="height: 90vh;"
  >
    <el-header>
      <el-card
        shadow="never"
        :body-style="{ padding: '20px' }"
        style="border: 0px;"
      >
        <div style="text-align: center">
          <b>{{ $t('form.pos.title') }}</b>
          <br>
          {{ $t('form.pos.optionsPoinSales.title') }}
          <hr>
        </div>
      </el-card>
    </el-header>
    <el-main>
      <el-collapse
        accordion
      >
        <el-collapse-item :title="$t('form.pos.optionsPoinSales.salesOrder.title')" name="salesOrder">
          <sales-order />
        </el-collapse-item>
        <el-collapse-item :title="$t('form.pos.optionsPoinSales.cashManagement.title')" name="cashManagement" />
        <el-collapse-item :title="$t('form.pos.optionsPoinSales.generalOptions.title')" name="generalOptions" />
      </el-collapse>
    </el-main>
  </el-container>
</template>

<script>
import { defineComponent } from '@vue/composition-api'

// Components and Mixins
import SalesOrder from './salesOrder.vue'
// import OptionsList from './OptionsList.vue'
// import InfoOrder from './InfoOrder.vue'

export default defineComponent({
  name: 'Options',
  components: {
    SalesOrder
  //   OptionsList,
  //   InfoOrder
  }
})
</script>
