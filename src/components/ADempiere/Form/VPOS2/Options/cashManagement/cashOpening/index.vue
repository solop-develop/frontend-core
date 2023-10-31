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
    <el-col :span="8" style="width: 100% !important;">
      <div @click="openCahs">
        <el-card
          shadow="never"
          class="custom-card-options"
          :body-style="{ padding: '10px' }"
        >
          <p
            class="card-options-buttons"
          >
            <i class="el-icon-sell" />
            <br>
            {{ $t('form.pos.optionsPoinSales.cashManagement.cashOpening') }}
          </p>
        </el-card>
      </div>
    </el-col>
  </el-row>
</template>
<script>
import { defineComponent } from '@vue/composition-api'
import lang from '@/lang'
import store from '@/store'
import { isEmptyValue } from '@/utils/ADempiere'
export default defineComponent({
  name: 'cashOpening',
  setup() {
    function openCahs() {
      store.dispatch('listPaymentsOpen')
      store.dispatch('setModalDialogVPOS', {
        title: lang.t('form.pos.optionsPoinSales.cashManagement.cashOpening'),
        doneMethod: () => {
          store.dispatch('cashOpening')
        },
        isDisabledDone: () => {
          return isEmptyValue(store.getters.getAttributeCashOpenFields({
            attribute: 'collectionAgent'
          }))
        },
        componentPath: () => import('@/components/ADempiere/Form/VPOS2/Options/cashManagement/cashOpening/panel.vue'),
        isShowed: true
      })
    }
    return {
      openCahs
    }
  }
})
</script>

<style lang="scss" scoped>
.card-options-buttons {
  cursor: pointer;
  text-align: center !important;
  color: black;
  min-height: 50px;
}
.custom-card-options {
  margin: 1px;
  cursor: pointer;
}
.custom-card-options:hover {
  background-color: #eaf5fe;
  border: 1px solid #36a3f7;
}
</style>
