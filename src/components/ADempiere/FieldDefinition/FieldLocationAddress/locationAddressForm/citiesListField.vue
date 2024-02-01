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
    :required="isMandatory"
  >
    <template slot="label">
      <span class="field-title-name">
        {{ $t('field.locationsAddress.city') }}
      </span>
    </template>

    <el-select
      v-model="currentCityId"
      style="width: 100%;"
      filterable
      clearable
      size="mini"
      :default-first-option="true"
      @visible-change="showCity"
    >
      <empty-option-select
        :current-value="currentCityId"
        :is-allows-zero="false"
      />
      <el-option
        v-for="(item, key) in citiesList"
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

// Components and Mixins
import EmptyOptionSelect from '@/components/ADempiere/FieldDefinition/FieldSelect/emptyOptionSelect.vue'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

export default defineComponent({
  name: 'CitiesListField',

  components: {
    EmptyOptionSelect
  },

  props: {
    locationAddress: {
      type: Object,
      default: () => {}
    },
    isMandatory: {
      type: Boolean,
      default: false
    }
  },

  setup(props) {
    const storedCountriesList = computed(() => {
      return store.getters.getListCities
    })

    const citiesList = computed(() => {
      const list = storedCountriesList.value
      if (!isEmptyValue(list)) {
        return list
      }
      // fill list with current address values
      const storedLocation = props.locationAddress
      if (!isEmptyValue(storedLocation) && storedLocation.id > 0) {
        return [{
          id: storedLocation.city_id,
          name: storedLocation.city_name
        }]
      }
      return []
    })

    const currentCityId = computed({
      get() {
        return store.getters.getAttributeFieldLocations({
          attribute: 'city_id'
        })
      },
      // setter
      set(value) {
        store.commit('setAttributeFieldLocations', {
          attribute: 'city_id',
          value
        })
      }
    })

    function showCity(show) {
      if (!show) {
        return
      }
      store.dispatch('getCitiesListFromServer')
    }

    return {
      // Computed
      currentCityId,
      citiesList,
      // Methods
      showCity
    }
  }
})
</script>
