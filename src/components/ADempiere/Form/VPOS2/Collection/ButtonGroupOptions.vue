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
      style="text-align: right;padding-top: 5px;"
    >
      <el-button
        type="success"
        icon="el-icon-plus"
        class="button-base-icon"
        :disabled="isLoading"
        :loading="isLoading"
        @click="addPayment"
      />
      <el-button
        type="primary"
        icon="el-icon-shopping-cart-full"
        class="button-base-icon"
      />
    </el-col>
  </el-row>
</template>

<script>
import { defineComponent, ref } from '@vue/composition-api'
import store from '@/store'
// Utils and Helper Methods
import { getPaymentValues } from '@/utils/ADempiere/dictionary/form/VPOS'
// import { defaultValueCollections } from '@/utils/ADempiere/dictionary/form/VPOS'

export default defineComponent({
  name: 'ButtonGroupOptions',
  setup() {
    const isLoading = ref(false)
    function addPayment() {
      isLoading.value = true
      const params = getPaymentValues({})
      store.dispatch('addPayment', params)
        .then(() => {
          isLoading.value = false
          // defaultValueCollections()
        })
    }

    return {
      isLoading,
      addPayment
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
