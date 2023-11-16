<!--
ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
Contributor(s): Edwin Betancourt EdwinBetanc0urt@outlook.com https://github.com/EdwinBetanc0urt
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
    class="customer-data"
  >
    <div slot="header" class="clearfix">
      <span style="font-size: 15px;">
        {{ $t('form.pos.order.BusinessPartnerCreate.billingAddress') }}
      </span>
    </div>
    <el-row :gutter="20">
      <el-form
        label-position="top"
        size="small"
        class="location-address"
      >
        <el-col :span="spanCol">
          <el-card
            shadow="never"
            :body-style="{ padding: '5px' }"
            class="customer-data"
          >
            <el-col :span="12">
              <location-name />
            </el-col>
            <el-col
              v-for="(fieldAttributes, key) in billingLocationField"
              :key="key"
              :span="12"
            >
              <component
                :is="fieldAttributes.component"
              />
            </el-col>
          </el-card>
        </el-col>
        <el-col v-if="!isCopyShippingAddress" :span="12">
          <el-card
            shadow="never"
            :body-style="{ padding: '5px' }"
            class="customer-data"
          >
            <el-col :span="12">
              <location-name :is-shipping="true" />
            </el-col>
            <el-col
              v-for="(fieldAttributes, key) in shippingLocationField"
              :key="key"
              :span="12"
            >
              <component
                :is="fieldAttributes.component"
                :is-shipping="true"
              />
            </el-col>
          </el-card>
        </el-col>
      </el-form>
    </el-row>
  </el-card>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'
import store from '@/store'
import locationName from '@/components/ADempiere/Form/VPOS2/HeaderOrder/Customer/NewCustomer/AddAddress/Fields/locationName.vue'
// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'

export default defineComponent({
  name: 'AddAddress',
  components: {
    locationName
  },
  props: {
    isCopyShippingAddress: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    // Country
    const country = computed(() => {
      return store.getters.getAttributeFieldLocationsBillind({
        attribute: 'countryId'
      })
    })

    const spanCol = computed(() => {
      if (!props.isCopyShippingAddress) return 12
      return 24
    })

    const billingLocationField = computed(() => {
      const { secuenceComponent } = store.getters.getAttributeFieldLocationsCustomers({
        typeLocations: 'billingAddress',
        attribute: 'countries'
      })
      if (!isEmptyValue(secuenceComponent)) return secuenceComponent
      return [
        {
          component: () => import('@/components/ADempiere/Form/VPOS2/HeaderOrder/Customer/NewCustomer/AddAddress/Fields/Address')
        },
        {
          component: () => import('@/components/ADempiere/Form/VPOS2/HeaderOrder/Customer/NewCustomer/AddAddress/Fields/Address2')
        },
        {
          component: () => import('@/components/ADempiere/Form/VPOS2/HeaderOrder/Customer/NewCustomer/AddAddress/Fields/Address3')
        },
        {
          component: () => import('@/components/ADempiere/Form/VPOS2/HeaderOrder/Customer/NewCustomer/AddAddress/Fields/Address4')
        },
        {
          component: () => import('@/components/ADempiere/Form/VPOS2/HeaderOrder/Customer/NewCustomer/AddAddress/Fields/CityLabel')
        },
        {
          component: () => import('@/components/ADempiere/Form/VPOS2/HeaderOrder/Customer/NewCustomer/AddAddress/Fields/Regions')
        },
        {
          component: () => import('@/components/ADempiere/Form/VPOS2/HeaderOrder/Customer/NewCustomer/AddAddress/Fields/PostalCode')
        },
        {
          component: () => import('@/components/ADempiere/Form/VPOS2/HeaderOrder/Customer/NewCustomer/AddAddress/Fields/PostalCodeAdditional')
        },
        {
          component: () => import('@/components/ADempiere/Form/VPOS2/HeaderOrder/Customer/NewCustomer/AddAddress/Fields/Country')
        }
      ]
    })

    const shippingLocationField = computed(() => {
      const { secuenceComponent } = store.getters.getAttributeFieldLocationsCustomers({
        typeLocations: 'shippingAddress',
        attribute: 'countries'
      })
      if (!isEmptyValue(secuenceComponent)) return secuenceComponent
      return [
        {
          component: () => import('@/components/ADempiere/Form/VPOS2/HeaderOrder/Customer/NewCustomer/AddAddress/Fields/Address')
        },
        {
          component: () => import('@/components/ADempiere/Form/VPOS2/HeaderOrder/Customer/NewCustomer/AddAddress/Fields/Address2')
        },
        {
          component: () => import('@/components/ADempiere/Form/VPOS2/HeaderOrder/Customer/NewCustomer/AddAddress/Fields/Address3')
        },
        {
          component: () => import('@/components/ADempiere/Form/VPOS2/HeaderOrder/Customer/NewCustomer/AddAddress/Fields/Address4')
        },
        {
          component: () => import('@/components/ADempiere/Form/VPOS2/HeaderOrder/Customer/NewCustomer/AddAddress/Fields/CityLabel')
        },
        {
          component: () => import('@/components/ADempiere/Form/VPOS2/HeaderOrder/Customer/NewCustomer/AddAddress/Fields/Regions')
        },
        {
          component: () => import('@/components/ADempiere/Form/VPOS2/HeaderOrder/Customer/NewCustomer/AddAddress/Fields/PostalCode')
        },
        {
          component: () => import('@/components/ADempiere/Form/VPOS2/HeaderOrder/Customer/NewCustomer/AddAddress/Fields/PostalCodeAdditional')
        },
        {
          component: () => import('@/components/ADempiere/Form/VPOS2/HeaderOrder/Customer/NewCustomer/AddAddress/Fields/Country')
        }
      ]
    })

    return {
      country,
      spanCol,
      billingLocationField,
      shippingLocationField
    }
  }
})
</script>

<style scoped lang="scss">
  .location-address {
    .el-form-item {
        margin-bottom: 0px !important;
    }
  }
</style>
<style lang="scss">
.location-address {
  .el-form-item--small .el-form-item__label {
    line-height: 22px !important;
  }
  .el-form-item--small.el-form-item {
    margin-bottom: 5px !important;
  }
}
</style>
