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
        {{ $t('field.locationsAddress.city') }}
      </span>
    </template>
    <el-select
      v-model="city"
      style="width: 100%;"
      filterable
      clearable
      size="mini"
      :default-first-option="true"
      @visible-change="showCity"
    >
      <el-option
        v-for="(item, key) in listCities"
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
  name: 'City',
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

    const listCities = computed(() => {
      return store.getters.getAttributeFieldCustomer({
        attribute: 'listCities'
      })
    })

    const city = computed({
      get() {
        return store.getters.getAttributeFieldLocationsCustomers({
          typeLocations: fieldsLocation.value,
          attribute: 'cityId'
        })
      },
      // setter
      set(value) {
        store.commit('setAttributeFieldLocationsCustomers', {
          typeLocations: fieldsLocation.value,
          attribute: 'cityId',
          value
        })
      }
    })

    function showCity(show) {
      if (!show || !isEmptyValue(listCities.value)) return
      store.dispatch('citiesCustomers', fieldsLocation.value)
    }

    return {
      // Computed
      city,
      listCities,
      fieldsLocation,
      // Methods
      showCity
    }
  }
})
</script>
