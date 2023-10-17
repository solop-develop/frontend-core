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
  <span>
    <el-collapse v-model="activeNames">
      <el-collapse-item
        :title="$t('form.pos.order.BusinessPartnerCreate.customerData')"
        name="1"
      >
        <el-form
          label-position="top"
          inline
          style="border: 1px solid #d3d4d6;border-radius: 10px;padding: 10px;"
        >
          <el-form-item
            :label="$t('form.pos.order.BusinessPartnerCreate.code')"
          >
            <el-input
              v-model="code"
            />
          </el-form-item>
          <el-form-item
            :label="$t('form.pos.order.BusinessPartnerCreate.identificationNumber')"
          >
            <el-input
              v-model="code"
            />
          </el-form-item>
          <el-form-item
            :label="$t('form.pos.order.BusinessPartnerCreate.personType')"
          >
            <el-select
              v-model="personType"
              style="width: 100%;"
              default-first-option
              filterable
              clearable
              @visible-change="searchPersonType"
            >
              <el-option
                v-for="item in personTypeList"
                :key="item.ValueColumn"
                :label="item.DisplayColumn"
                :value="item.ValueColumn"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('form.pos.order.BusinessPartnerCreate.taxpayer')"
          >
            <el-switch
              v-model="taxpayer"
              :active-text="$t('components.switchActiveText')"
              :inactive-text="$t('components.switchInactiveText')"
              active-color="#13ce66"
              inactive-color="#ff4949"
            />
          </el-form-item>
          <el-form-item
            :label="$t('form.pos.order.BusinessPartnerCreate.taxpayerType')"
          >
            <el-select
              v-model="taxpayerType"
              style="width: 100%;"
              default-first-option
              filterable
              clearable
              @visible-change="searchTaxpayerType"
            >
              <el-option
                v-for="item in taxpayerTypeList"
                :key="item.ValueColumn"
                :label="item.DisplayColumn"
                :value="item.ValueColumn"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('form.pos.order.BusinessPartnerCreate.name')"
          >
            <el-input
              v-model="name"
            />
          </el-form-item>
          <el-form-item
            :label="$t('form.pos.order.BusinessPartnerCreate.name2')"
          >
            <el-input
              v-model="name2"
            />
          </el-form-item>
          <el-form-item
            :label="$t('form.pos.order.BusinessPartnerCreate.phone')"
          >
            <el-input
              v-model="phone"
            />
          </el-form-item>
        </el-form>
        <el-checkbox
          v-model="isVisibleAddress"
          :label="$t('form.pos.order.BusinessPartnerCreate.addBillingAddress')"
          :border="true"
          style="float: right;margin-top: 5px;"
        />
      </el-collapse-item>
      <el-collapse-item
        v-if="isVisibleAddress"
        :title="$t('form.pos.order.BusinessPartnerCreate.billingManagement')"
        name="2"
      >
        <el-checkbox
          v-model="copyShippingAddress"
          :label="$t('form.byInvoice.copyShippingAddress')"
          :border="true"
          style="float: right;"
        />
      </el-collapse-item>
    </el-collapse>
    <el-row :gutter="24">
      <el-col :span="24">
        <samp style="float: right; padding-top: 5px;">
          <el-button
            type="danger"
            class="button-base-icon"
            icon="el-icon-close"
            @click="closeCustomer()"
          />
          <el-button
            type="primary"
            class="button-base-icon"
            icon="el-icon-check"
            @click="createBusinessParter()"
          />
        </samp>
      </el-col>
    </el-row>
  </span>
</template>

<script>
import {
  defineComponent,
  // computed,
  // watch,
  ref
} from '@vue/composition-api'
import store from '@/store'
// Components and Mixins
// import ProductListTable from './ProductListTable'
// utils and helper methods
// import {lan
//   formatPrice,
//   formatQuantity
// } from '@/utils/ADempiere/formatValue/numberFormat'
// import { isEmptyValue } from '@/utils/ADempiere'
// api request methods
import { requestLookupList } from '@/api/ADempiere/window.js'

export default defineComponent({
  name: 'NewCustomer',
  setup() {
    // Ref
    const code = ref('')
    const name = ref('')
    const name2 = ref('')
    const phone = ref('')
    const taxpayer = ref('')
    const personType = ref('')
    const activeNames = ref('')
    const taxpayerType = ref('')
    const personTypeList = ref([])
    const taxpayerTypeList = ref('')
    const isVisibleAddress = ref(false)
    const copyShippingAddress = ref(false)

    // Methods
    function searchPersonType(isFind) {
      if (!isFind) return
      requestLookupList({
        pageSize: 50,
        tableName: 'AD_Ref_List',
        columnName: 'TaxpayerType',
        searchValue: personType.value,
        fieldUuid: 'e699d070-8e2e-11e9-a13e-6ba4b8556bd1'
      })
        .then(responseLookupItem => {
          const { recordsList } = responseLookupItem
          personTypeList.value = recordsList.map(list => list.values)
        })
    }

    function searchTaxpayerType(isFind) {
      if (!isFind) return
      requestLookupList({
        pageSize: 50,
        tableName: 'AD_Ref_List',
        columnName: 'TaxpayerType',
        searchValue: taxpayerType.value,
        fieldUuid: 'fc86d8ec-b415-42d0-a32c-a66a22e76553'
      })
        .then(responseLookupItem => {
          const { recordsList } = responseLookupItem
          taxpayerTypeList.value = recordsList.map(list => list.values)
        })
    }

    function createBusinessParter() {
      const additionalAttributes = [
        {
          key: 'IsTaxpayer',
          value: taxpayer.value
        },
        {
          key: 'TaxpayerType',
          value: taxpayerType.value
        },
        {
          key: 'PersonType',
          value: personType.value
        }
      ]

      const addresses = [
        {
          is_default_billing: true,
          is_default_shipping: false,
          phone: phone.value
        },
        {
          is_default_billing: true,
          is_default_shipping: false,
          phone: phone.value
        }
      ]
      store.dispatch('newCustomer', {
        addresses,
        name: name.value,
        value: code.value,
        taxId: code.value,
        additionalAttributes,
        lastName: name2.value
      })
        .finally(() => {
          closeCustomer()
        })
    }

    function closeCustomer() {
      store.commit('setShowCustomer', false)
    }

    return {
      copyShippingAddress,
      taxpayerTypeList,
      isVisibleAddress,
      personTypeList,
      taxpayerType,
      activeNames,
      personType,
      taxpayer,
      name2,
      phone,
      code,
      name,
      // Methods
      closeCustomer,
      searchPersonType,
      searchTaxpayerType,
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
