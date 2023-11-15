<!--
ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A.
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
  <el-form-item
    class="field-standard"
    style="margin: 0px;width: 100%;"
  >
    <template slot="label">
      <span class="field-title-name">
        {{ $t('field.locationsAddress.country') }}
      </span>
      <span style="color: #f34b4b"> * </span>
    </template>
    <el-select
      v-model="country"
      style="width: 100%;"
      filterable
      clearable
      size="mini"
      :default-first-option="true"
      @visible-change="showCountry"
      @change="changeCountry"
    >
      <el-option
        v-for="(item, key) in listCountry"
        :key="key"
        :label="item.name"
        :value="item.id"
      />
    </el-select>
  </el-form-item>
</template>

<script>
import { computed, defineComponent } from '@vue/composition-api'

import store from '@/store'
import { isEmptyValue } from '@/utils/ADempiere'

export default defineComponent({
  name: 'Country',
  props: {
    isShipping: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const fieldsLocation = computed(() => {
      if (props.isShipping) return 'shippingAddress'
      return 'billingAddress'
    })
    const listCountry = computed(() => {
      return store.getters.getAttributeFieldCustomer({
        attribute: 'listCountries'
      })
    })

    const country = computed({
      get() {
        return store.getters.getAttributeAddressEdit({
          attribute: 'countryId'
        })
      },
      // setter
      set(value) {
        store.commit('setAttributeEditAddress', {
          attribute: 'countryId',
          value
        })
      }
    })

    function changeCountry(countryId) {
      if (isEmptyValue(countryId)) return
      store.dispatch('countrieCustomers', { countryId, typeLocations: fieldsLocation.value })
    }

    function showCountry(show) {
      if (!show || !isEmptyValue(listCountry.value)) return
      store.dispatch('countriesCustomers')
    }

    return {
      // Computed
      country,
      listCountry,
      fieldsLocation,
      // Methods
      showCountry,
      changeCountry
    }
  }
})
</script>
