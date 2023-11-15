<!--
ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
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
  <el-card
    shadow="never"
    :body-style="{ padding: '5px' }"
  >
    <customer-data />
    <br>
    <panel
      :all-customer-addresses="currentCustomer.addresses"
    />
    <el-row :gutter="24">
      <el-col :span="24">
        <samp style="float: right; padding-right: 10px;">
          <el-button
            type="danger"
            class="button-base-icon"
            icon="el-icon-close"
            @click="close()"
          />
          <el-button
            type="primary"
            class="button-base-icon"
            icon="el-icon-check"
            :disabled="isLoading"
            :loading="isLoading"
            @click="createBusinessParter"
          />
        </samp>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import {
  defineComponent,
  computed,
  // watch,
  ref
} from '@vue/composition-api'

import store from '@/store'

// Components and Mixins
import CustomerData from '../NewCustomer/CustomerData.vue'
import Panel from './Panel.vue'
// Utils and Helper Methods
// import { isEmptyValue } from '@/utils/ADempiere'
// /AddAddress/index.vue
// API Request Methods
// import { requestLookupList } from '@/api/ADempiere/userInterface/lookups.ts'

export default defineComponent({
  name: 'UpdateCustomer',
  components: {
    CustomerData,
    Panel
  },
  setup() {
    // Ref

    const isLoading = ref(false)

    // Computed

    const addresses = computed(() => {
      const billingAddress = store.getters.getAttributeBillingAddress
      const shippingAddress = store.getters.getAttributeShippingAddress
      return [
        {
          ...billingAddress,
          is_default_billing: true,
          is_default_shipping: false
        },
        {
          ...shippingAddress,
          is_default_billing: false,
          is_default_shipping: true
        }
      ]
    })

    const currentCustomer = computed(() => {
      return store.getters.getCurrentOrder.customer
    })

    // Methods

    /**
     * Close Panel Create New Business Parter
     */
    function close() {
      store.commit('setShowCustomerList', false)
      store.dispatch('clearDataFormCustomer')
    }

    /**
     * Send Create New Business Parter
     */

    function createBusinessParter() {
      close()
      // isLoading.value = true
      // store.dispatch('createCustomer', {
      //   addresses: addresses.value
      // })
      //   .finally(() => {
      //     isLoading.value = false
      //     close()
      //   })
    }

    return {
      // Ref
      isLoading,
      // Computed
      addresses,
      currentCustomer,
      // Methods
      close,
      createBusinessParter
    }
  }
})
</script>

<style lang="scss" scoped>
.label {
  display: contents;
}
</style>
