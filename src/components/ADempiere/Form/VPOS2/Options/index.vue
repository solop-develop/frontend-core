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
        </div>
      </el-card>
    </el-header>
    <el-divider />
    <el-main>
      <div style="width: 97%;float: left;">
        <el-collapse
          accordion
        >
          <el-collapse-item :title="$t('form.pos.optionsPoinSales.salesOrder.title')" name="salesOrder">
            <sales-order />
          </el-collapse-item>
          <el-collapse-item :title="$t('form.pos.optionsPoinSales.cashManagement.title')" name="cashManagement">
            <cash-management />
          </el-collapse-item>
          <el-collapse-item :title="$t('form.pos.optionsPoinSales.generalOptions.title')" name="generalOptions" />
        </el-collapse>
      </div>
      <div style="position: absolute;left: 27.5%;top: 42%;">
        <el-button
          v-if="isShowOptions"
          circle
          type="primary"
          :icon="iconsButtons"
          class="buttons-options"
          @click="isShowOptions = !isShowOptions"
        />
      </div>
    </el-main>
  </el-container>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'
import store from '@/store'

// Components and Mixins
import SalesOrder from './salesOrder.vue'
import CashManagement from './cashManagement'
// import InfoOrder from './InfoOrder.vue'

export default defineComponent({
  name: 'Options',
  components: {
    SalesOrder,
    CashManagement
  //   InfoOrder
  },
  setup() {
    const iconsButtons = computed(() => {
      if (isShowOptions.value) return 'el-icon-arrow-left'
      return 'el-icon-arrow-right'
    })
    const isShowOptions = computed({
      get() {
        return store.getters.getShowOptions
      },
      // setter
      set(show) {
        store.commit('setShowOptions', show)
      }
    })
    return {
      isShowOptions,
      iconsButtons
    }
  }
})
</script>
