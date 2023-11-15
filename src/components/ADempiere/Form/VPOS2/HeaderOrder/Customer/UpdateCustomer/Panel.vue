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
  <el-row :gutter="20">
    <el-col
      v-for="(address, key) in allCustomerAddresses"
      :key="key"
      :span="8"
    >
      <el-card
        shadow="never"
        :body-style="{ padding: '5px' }"
        class="customer-data"
      >
        <div slot="header" class="clearfix">
          <b style="font-size: 15px;">
            {{ address.location_name }}
          </b>
          <el-button
            style="float: right; padding: 3px 0"
            type="text"
            @click="openEditAddress(address)"
          >
            {{ $t('businessPartner.edit') }}
          </el-button>
        </div>
        <el-scrollbar wrap-class="scroll-customer-description">
          <el-descriptions class="margin-top" :title="$t('form.pos.order.BusinessPartnerCreate.address.managementDescription')" :column="1">
            <el-descriptions-item :label="$t('form.pos.order.BusinessPartnerCreate.address.addressType')">
              <el-tag size="small" :type="typeTag(address)">
                {{ labelDirecction(address) }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item :label="$t('form.pos.order.BusinessPartnerCreate.address.region')">
              {{ displayCountries(address) }}
            </el-descriptions-item>
            <el-descriptions-item :label="$t('form.pos.order.BusinessPartnerCreate.address.city')">
              {{ labelCity(address) }}
            </el-descriptions-item>
            <el-descriptions-item :label="$t('form.pos.order.BusinessPartnerCreate.address.address')">
              {{ address.display_value }}
            </el-descriptions-item>
            <el-descriptions-item :label="$t('form.pos.order.BusinessPartnerCreate.address.postCode')">
              {{ address.postal_code }}
            </el-descriptions-item>
          </el-descriptions>
        </el-scrollbar>
      </el-card>
    </el-col>
    <el-dialog
      :center="true"
      :modal="true"
      :visible.sync="showEditAddress"
      :modal-append-to-body="false"
      :custom-class="'option-customer'"
      class="panel-customer-new"
      width="75%"
    >
      <address-edti-constumers
        :type-locations="labelDirecction(currentAddress)"
        :address-edti="currentAddress"
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
              @click="updateAddress()"
            />
          </samp>
        </el-col>
      </el-row>
    </el-dialog>
  </el-row>
</template>

<script>
import {
  defineComponent,
  computed,
  ref
} from '@vue/composition-api'
import language from '@/lang'
import store from '@/store'
import AddressEdtiConstumers from '@/components/ADempiere/Form/VPOS2/HeaderOrder/Customer/UpdateCustomer/Fields/AddressEdit/index.vue'
import { isEmptyValue } from '@/utils/ADempiere'

export default defineComponent({
  name: 'Panel',
  components: {
    AddressEdtiConstumers
  },
  props: {
    allCustomerAddresses: {
      type: Array,
      default: []
    }
  },
  setup(props) {
    const showEditAddress = ref(false)
    const isLoading = ref(false)
    const currentAddress = ref({})
    function displayCountries(address) {
      const { contries } = address
      if (contries && contries.name) return contries.name
      return ''
    }

    const addressEdti = computed(() => {
      return [store.getters.getAttributeEditAddress].map(list => {
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

    function labelDirecction(address) {
      const {
        is_default_billing,
        is_default_shipping
      } = address
      if (is_default_billing && !is_default_shipping) {
        return language.t('form.pos.order.BusinessPartnerCreate.billingAddress')
      } else if (is_default_shipping) {
        return language.t('form.pos.order.BusinessPartnerCreate.shippingAddress')
      }
      return language.t('form.pos.order.BusinessPartnerCreate.withoutSetting')
    }

    function typeTag(address) {
      const {
        is_default_billing,
        is_default_shipping
      } = address
      if (is_default_shipping) {
        return 'warning'
      } else if (is_default_billing) {
        return 'success'
      }
      return ''
    }

    function labelCity(address) {
      const { cityLabel, city } = address
      if (cityLabel) {
        return cityLabel
      } else if (city) {
        return city.name
      }
      return ''
    }

    function openEditAddress(address) {
      currentAddress.value = address
      showEditAddress.value = true
      const {
        postal_code_additional,
        country_id,
        region,
        city,
        location_name,
        postal_code,
        address1,
        address2,
        address3,
        address4,
        email,
        phone
      } = address
      store.commit('setValuesEditAddress', {
        address1,
        address2,
        address3,
        address4,
        email,
        phone,
        countryId: country_id,
        regionId: isEmptyValue(region) ? undefined : region.id,
        cityId: isEmptyValue(city) ? undefined : city.id,
        cityLabel: isEmptyValue(city) ? undefined : city.name,
        postalCode: postal_code,
        locationName: location_name,
        posalCodeAdditional: postal_code_additional
      })
    }

    function close() {
      showEditAddress.value = false
    }

    function updateAddress() {
      isLoading.value = true
      store.dispatch('UpdateCustomer', {
        addresses: props.allCustomerAddresses.map(list => {
          if (list.id === currentAddress.value.id) {
            return {
              ...list,
              ...addressEdti.value[0]
            }
          }
          return list
        })
      })
        .finally(() => {
          isLoading.value = false
          store.commit('setShowCustomerList', false)
          close()
        })
    }

    return {
      isLoading,
      currentAddress,
      showEditAddress,
      addressEdti,
      // Methdos
      close,
      typeTag,
      labelCity,
      updateAddress,
      labelDirecction,
      openEditAddress,
      displayCountries
    }
  }
})
</script>

<style lang="scss" scoped>
.label {
  display: contents;
}
</style>

<style lang="scss">
.customer-data {
  .el-card {
    border: 1px solid #dbdcdd !important;
    border-radius: 10px !important;
    padding: 10px !important;
  }
  .el-card__header {
    padding: 10px !important;
  }
}

</style>
