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
    <add-address
      v-if="isVisibleAddress"
      :is-copy-shipping-address="copyShippingAddress"
    />
    <el-row :gutter="24">
      <el-col :span="24">
        <samp style="float: right; padding-top: 5px;">
          <el-checkbox
            v-model="isVisibleAddress"
            :label="$t('form.pos.order.BusinessPartnerCreate.addBillingAddress')"
            :border="true"
            style="float: right;margin: 0px;"
          />
          <el-checkbox
            v-if="isVisibleAddress"
            v-model="copyShippingAddress"
            :label="$t('form.byInvoice.copyShippingAddress')"
            :border="true"
            style="float: right;margin-right: 5px;"
          />
        </samp>
      </el-col>
    </el-row>
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
            :disabled="isDisabled || isLoading"
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
import CustomerData from './CustomerData.vue'
import AddAddress from './AddAddress/index.vue'
// utils and helper methods
import { isEmptyValue } from '@/utils/ADempiere'

export default defineComponent({
  name: 'NewCustomer',
  components: {
    CustomerData,
    AddAddress
  },
  setup() {
    // Ref

    const activeNames = ref(['1', '2'])
    const isVisibleAddress = ref(false)
    const copyShippingAddress = ref(true)
    const isLoading = ref(false)

    // Computed

    const isDisabled = computed(() => {
      const code = store.getters.getAttributeFieldCustomer({
        attribute: 'code'
      })
      const name = store.getters.getAttributeFieldCustomer({
        attribute: 'name'
      })
      const countryBilling = store.getters.getAttributeFieldLocationsCustomers({
        typeLocations: 'billingAddress',
        attribute: 'countryId'
      })
      const countryShipping = store.getters.getAttributeFieldLocationsCustomers({
        typeLocations: 'shippingAddress',
        attribute: 'countryId'
      })
      if (isVisibleAddress.value) {
        if (copyShippingAddress.value) {
          return isEmptyValue(countryShipping) || isEmptyValue(countryBilling) || isEmptyValue(name) || isEmptyValue(code)
        }
        return isEmptyValue(countryBilling) || isEmptyValue(name) || isEmptyValue(code)
      }
      return isEmptyValue(name) || isEmptyValue(code)
    })

    const addresses = computed(() => {
      const billingAddress = store.getters.getAttributeBillingAddress

      const shippingAddress = store.getters.getAttributeShippingAddress

      const phone = store.getters.getAttributeFieldCustomer({
        attribute: 'phone'
      })

      const email = store.getters.getAttributeFieldCustomer({
        attribute: 'email'
      })

      if (isVisibleAddress.value && copyShippingAddress.value) {
        return [
          {
            ...billingAddress,
            phone,
            email,
            is_default_billing: true,
            is_default_shipping: false,
            location_name: billingAddress.locationName
          },
          {
            ...billingAddress,
            phone,
            email,
            is_default_billing: true,
            is_default_shipping: true,
            location_name: shippingAddress.locationName
          }
        ]
      }
      if (isVisibleAddress.value) {
        return [
          {
            ...billingAddress,
            phone,
            email,
            is_default_billing: true,
            is_default_shipping: false,
            location_name: billingAddress.locationName
          },
          {
            ...shippingAddress,
            phone,
            email,
            is_default_billing: true,
            is_default_shipping: true,
            location_name: shippingAddress.locationName
          }
        ]
      }
      return [
        {
          ...billingAddress,
          phone,
          email,
          is_default_billing: true,
          is_default_shipping: false,
          city_name: billingAddress.cityLabel,
          location_name: billingAddress.locationName
        },
        {
          ...shippingAddress,
          phone,
          email,
          is_default_billing: false,
          is_default_shipping: true,
          location_name: shippingAddress.locationName
        }
      ]
    })

    // Methods

    /**
     * Close Panel Create New Customer
     */
    function close() {
      store.commit('setShowCustomerList', false)
      store.dispatch('clearDataFormCustomer')
    }

    function createBusinessParter() {
      isLoading.value = true
      store.dispatch('createCustomer', {
        addresses: addresses.value.map(list => {
          return {
            ...list,
            city_id: list.cityId,
            region_id: list.regionId,
            city_name: list.cityLabel,
            country_id: list.countryId,
            postal_code: list.postalCode,
            location_name: list.locationName,
            postal_code_additional: list.posalCodeAdditional
          }
        })
      })
        .finally(() => {
          isLoading.value = false
          close()
        })
    }

    return {
      // Ref
      isLoading,
      activeNames,
      isVisibleAddress,
      copyShippingAddress,
      // Computed
      addresses,
      isDisabled,
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
