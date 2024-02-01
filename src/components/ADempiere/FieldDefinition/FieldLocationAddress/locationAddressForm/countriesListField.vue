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
      v-model="currentCountryId"
      style="width: 100%;"
      filterable
      clearable
      size="mini"
      :default-first-option="true"
      no-data-text=" "
      @visible-change="showCountry"
      @change="changeCountry"
    >
      <empty-option-select
        :current-value="currentCountryId"
        :is-allows-zero="false"
      />
      <el-option
        v-for="(item, key) in countriesList"
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

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere'

// Components and Mixins
import EmptyOptionSelect from '@/components/ADempiere/FieldDefinition/FieldSelect/emptyOptionSelect.vue'

export default defineComponent({
  name: 'CountriesListField',

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
      return store.getters.getStoredAddressLocationCountries
    })

    const currentCountryId = computed({
      get() {
        return store.getters.getAttributeFieldLocations({
          attribute: 'country_id'
        })
      },
      // setter
      set(value) {
        store.commit('setAttributeFieldLocations', {
          attribute: 'country_id',
          value
        })
      }
    })

    const storedCountryDefinition = computed(() => {
      return store.getters.getStoredCountryDefinition(currentCountryId.value)
    })

    const countriesList = computed(() => {
      const list = storedCountriesList.value
      if (!isEmptyValue(list)) {
        return list
      }
      // fill list with current address values
      const storedLocation = props.locationAddress
      if (!isEmptyValue(storedLocation) && storedLocation.id > 0) {
        return [{
          id: storedLocation.country_id,
          name: storedLocation.country_name
        }]
      }
      // fill list current country definition
      const countryDefinition = storedCountryDefinition.value
      if (!isEmptyValue(countryDefinition)) {
        return [{
          id: countryDefinition.id,
          name: countryDefinition.name
        }]
      }
      return []
    })

    function changeCountry(countryId) {
      if (isEmptyValue(countryId) || countryId <= 0) {
        return
      }
      const countryDefinition = storedCountryDefinition.value
      if (isEmptyValue(countryDefinition)) {
        store.dispatch('getCountryDefinitionFromServer', {
          countryId
        })
          .then(response => {
            // clear dependents fields
            store.commit('setAttributeFieldLocations', {
              attribute: 'region_id',
              value: undefined
            })
            store.commit('setAttributeFieldLocations', {
              attribute: 'region_name',
              value: ''
            })
            store.commit('setAttributeFieldLocations', {
              attribute: 'city_id',
              value: undefined
            })
            store.commit('setAttributeFieldLocations', {
              attribute: 'city_name',
              value: ''
            })
            store.commit('setAttributeFieldLocations', {
              attribute: 'city',
              value: undefined
            })
          })
      }
    }

    function showCountry(show) {
      if (!show) {
        return
      }
      if (!isEmptyValue(storedCountriesList.value)) {
        return
      }
      store.dispatch('getCountriesListFromServer')
    }

    if (!isEmptyValue(currentCountryId.value) && currentCountryId.value > 0) {
      const countryDefinition = storedCountryDefinition.value
      if (isEmptyValue(countryDefinition)) {
        // change sequence
        store.dispatch('getCountryDefinitionFromServer', {
          countryId: currentCountryId.value
        })
      }
    }

    return {
      // Computed
      currentCountryId,
      countriesList,
      storedCountriesList,
      // Methods
      showCountry,
      changeCountry
    }
  }
})
</script>
