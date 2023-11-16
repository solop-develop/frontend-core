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
    class="customer-data"
  >
    <div slot="header" class="clearfix">
      <span style="font-size: 15px;">
        {{ $t('form.pos.order.BusinessPartnerCreate.customerData') }}
      </span>
    </div>
    <el-form
      label-position="top"
      inline
      style="border: 1px solid hsl(220, 100%, 99%);border-radius: 10px;padding: 10px;"
    >
      <el-row :gutter="20">
        <el-col
          v-for="(fieldAttributes, key) in listComponents"
          :key="key"
          :span="8"
        >
          <component
            :is="fieldAttributes.component"
          />
        </el-col>
      </el-row>
    </el-form>
  </el-card>
</template>

<script>
import store from '@/store'
import {
  defineComponent,
  computed
} from '@vue/composition-api'
import { isEmptyValue } from '@/utils/ADempiere'

export default defineComponent({
  name: 'CustomerDataEdit',
  props: {
    customer: {
      type: Object,
      default: {}
    }
  },
  setup(props) {
    const listComponents = computed(() => {
      return [
        {
          component: () => import('@/components/ADempiere/Form/VPOS2/HeaderOrder/Customer/UpdateCustomer/Fields/Code.vue')
        },
        {
          component: () => import('@/components/ADempiere/Form/VPOS2/HeaderOrder/Customer/UpdateCustomer/Fields/IdentificationNumber.vue')
        },
        {
          component: () => import('@/components/ADempiere/Form/VPOS2/HeaderOrder/Customer/UpdateCustomer/Fields/Name.vue')
        },
        {
          component: () => import('@/components/ADempiere/Form/VPOS2/HeaderOrder/Customer/UpdateCustomer/Fields/Name2.vue')
        },
        {
          component: () => import('@/components/ADempiere/Form/VPOS2/HeaderOrder/Customer/UpdateCustomer/Fields/Email.vue')
        },
        {
          component: () => import('@/components/ADempiere/Form/VPOS2/HeaderOrder/Customer/UpdateCustomer/Fields/Phone.vue')
        }
      ]
    })

    function setCustomerData() {
      const {
        last_name,
        addresses,
        value,
        name
      } = props.customer
      let email, phone
      if (!isEmptyValue(addresses[0]) && !isEmptyValue(addresses[0].email)) {
        email = addresses[0].email
      } else if (!isEmptyValue(addresses[1]) && !isEmptyValue(addresses[1].email)) {
        email = addresses[1].email
      }

      if (!isEmptyValue(addresses[0]) && !isEmptyValue(addresses[0].phone)) {
        phone = addresses[0].phone
      } else if (!isEmptyValue(addresses[1]) && !isEmptyValue(addresses[1].phone)) {
        phone = addresses[1].phone
      }

      store.commit('setFieldCustomerEdit', {
        code: value,
        name,
        name2: last_name,
        email,
        phone,
        identificationNumber: value
      })
    }

    setCustomerData()

    return {
      listComponents,
      setCustomerData
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
