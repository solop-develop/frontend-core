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
      <span v-if="!isEmptyValue(regionName)" class="field-title-name">
        {{ regionName }}
      </span>
      <span v-else class="field-title-name">
        {{ $t('field.locationsAddress.region') }}
      </span>
    </template>
    <el-select
      v-model="region"
      style="width: 100%;"
      filterable
      clearable
      size="mini"
      :default-first-option="true"
      @visible-change="showRegions"
    >
      <el-option
        v-for="(item, key) in listRegions"
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
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'

export default defineComponent({
  name: 'Regions',
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
    const listRegions = computed(() => {
      return store.getters.getAttributeFieldCustomer({
        attribute: 'listRegions'
      })
    })

    const regionName = computed(() => {
      const countries = store.getters.getAttributeAddressEdit({
        attribute: 'countries'
      })
      if (countries) return countries.region_name
      return ''
    })

    const region = computed({
      get() {
        return store.getters.getAttributeAddressEdit({
          attribute: 'regionId'
        })
      },
      // setter
      set(value) {
        store.commit('setAttributeEditAddress', {
          attribute: 'regionId',
          value
        })
      }
    })

    function showRegions(show) {
      if (!show || !isEmptyValue(listRegions.value)) return
      store.dispatch('regionsCustomers', 'addressEdit')
    }

    return {
      // Computed
      region,
      regionName,
      listRegions,
      fieldsLocation,
      // Methods
      showRegions
    }
  }
})
</script>
