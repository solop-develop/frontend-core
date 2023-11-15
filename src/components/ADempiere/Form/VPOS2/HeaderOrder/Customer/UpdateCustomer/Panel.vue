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
  </el-row>
</template>

<script>
import {
  defineComponent
} from '@vue/composition-api'
import language from '@/lang'

export default defineComponent({
  name: 'Panel',
  props: {
    allCustomerAddresses: {
      type: Array,
      default: []
    }
  },
  setup(props) {
    function displayCountries(address) {
      const { contries } = address
      if (contries && contries.name) return contries.name
      return ''
    }

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

    return {
      // Methdos
      typeTag,
      labelCity,
      labelDirecction,
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
