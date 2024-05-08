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
  <div class="wrapper">
    <el-card
      shadow="never"
      :body-style="{ padding: '5px' }"
      style="width: 360px !important;"
    >
      <el-form
        v-shortkey="{ closeForm: ['esc'] }"
        label-position="left"
        size="small"
        label-width="185px"
        @shortkey.native="keyAction"
      >
        <el-row :gutter="0">
          <!-- List Fields -->
          <el-col
            v-for="(captureItem) in fieldSequenceLocations"
            :key="captureItem.sequence"
            :span="24"
          >
            <component
              :is="captureItem.component"
              :is-mandatory="captureItem.isMandatory"
              :location-address="currentAddressLocationValues"
            />
          </el-col>
          <!-- <el-col>
            <el-collapse accordion>
              <el-collapse-item name="1">
                <template slot="title">
                  <b style="padding-right: 10px;">
                    {{ $t('field.coordination') }}
                  </b>
                  <svg-icon icon-class="international" />
                </template>
                <el-form-item
                  :label="$t('field.locationsAddress.latitude')"
                  class="field-standard"
                  style="margin: 0px; width: 100%"
                >
                  <el-input v-model="latitude" size="mini" />
                </el-form-item>
                <el-form-item
                  :label="$t('field.locationsAddress.logitude')"
                  class="field-standard"
                  style="margin: 0px; width: 100%"
                >
                  <el-input v-model="longitude" size="mini" />
                </el-form-item>
                <el-form-item
                  :label="$t('field.locationsAddress.altitude')"
                  class="field-standard"
                  style="margin: 0px; width: 100%"
                >
                  <el-input size="mini" />
                </el-form-item>
              </el-collapse-item>
            </el-collapse>
          </el-col> -->
          <el-col :span="24" class="location-address-footer">
            <samp style="float: right; padding-top: 4px;">
              <el-button
                type="info"
                class="button-base-icon"
                plain
              >
                <svg-icon icon-class="layers-clear" />
              </el-button>

              <el-button
                class="button-base-icon"
                type="info"
                @click="openCoordinatesMap()"
              >
                <svg-icon icon-class="international" />
              </el-button>

              <el-button
                type="danger"
                class="button-base-icon"
                icon="el-icon-close"
                @click="close()"
              />

              <el-button
                class="button-base-icon"
                type="primary"
                icon="el-icon-check"
                :disabled="isEmptyMandatory"
                @click="sendValue()"
              />
            </samp>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { defineComponent, computed, ref } from '@vue/composition-api'

import store from '@/store'

// Components and Mixins
import useDisplayedColumn from '@/components/ADempiere/FieldDefinition/useDisplayedColumn.js'

// Constants
import { ATTRIBUTES_BY_CAPTURE } from '@/utils/ADempiere/dictionary/field/locationAddress'
import {
  URL_BASE_MAP
} from '@/utils/ADempiere/dictionary/field/locationAddress'

// Utils and Helper Methods
import { isEmptyValue, isIdentifierEmpty } from '@/utils/ADempiere/valueUtils.js'
import { setDefaultComponentSequence } from '@/utils/ADempiere/dictionary/field/locationAddress'
import { formatCoordinateByDecimal } from '@/utils/ADempiere/dictionary/field/locationAddress'

export default defineComponent({
  name: 'LocationAddressForm',

  props: {
    containerManager: {
      type: Object,
      required: true
    },
    metadata: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props) {
    const { columnName, containerUuid, parentUuid } = props.metadata
    const latitude = ref('')
    const longitude = ref('')

    function openCoordinatesMap() {
      let baseUrlMap = URL_BASE_MAP
      if (!isEmptyValue(latitude.value) && !isEmptyValue(longitude.value)) {
        const latitudeFormat = formatCoordinateByDecimal(latitude.value)
        const longitudeFormat = formatCoordinateByDecimal(longitude.value)
        baseUrlMap += latitudeFormat + ',' + longitudeFormat
      } else {
        baseUrlMap += setLocation.value
      }
      window.open(baseUrlMap, '_blank')
    }

    const setLocation = computed(() => {
      const location = currentAddressLocationValues.value
      let addres = ''
      if (!isEmptyValue(location)) {
        if (location.address1) {
          addres = location.address1
        }
        if (location.address2) {
          addres += location.address2
        }
        if (location.address3) {
          addres += location.address3
        }
        if (location.address4) {
          addres += location.address4
        }
        if (location.city) {
          addres += ' , ' + location.city
        }
        if (location.state) {
          addres += ' , ' + location.state
        }
        if (location.postal_code) {
          addres += ' , ' + location.postal_code
        }
        if (location.posal_code_additional) {
          addres += ' , ' + location.posal_code_additional
        }
        if (location.country_name) {
          addres += ' , ' + location.country_name
        }
        return addres
      } else {
        return addres
      }
    })
    const countryId = computed(() => {
      return store.getters.getAttributeFieldLocations({
        attribute: 'country_id'
      })
    })

    // Country
    const fieldSequenceLocations = computed(() => {
      const countryDefinition = store.getters.getStoredCountryDefinition(countryId.value)
      if (!isEmptyValue(countryDefinition)) {
        const { secuenceComponent } = countryDefinition
        if (!isEmptyValue(secuenceComponent)) {
          return secuenceComponent
        }
      }
      return setDefaultComponentSequence()
    })
    const currentAddressLocationValues = computed(() => {
      return store.getters.getStoredAddressLocation
    })

    const isEmptyMandatory = computed(() => {
      if (isEmptyValue(countryId.value)) {
        return true
      }

      let isAllowCities = true
      const countryDefinition = store.getters.getStoredCountryDefinition(countryId.value)
      if (!isEmptyValue(countryDefinition)) {
        isAllowCities = countryDefinition.is_allow_cities_out_of_list
      }

      const isAnyEmpty = fieldSequenceLocations.value.some(sequeceCaptureItem => {
        if (isEmptyValue(currentAddressLocationValues.value)) {
          true
        }
        if (sequeceCaptureItem.isMandatory) {
          const properties = ATTRIBUTES_BY_CAPTURE[sequeceCaptureItem.capture]
          console.log(properties)
          for (const property of properties) {
            if (isAllowCities && property === 'city_id') {
              continue
            }
            const value = currentAddressLocationValues.value[property]
            if (isEmptyValue(value)) {
              return true
            }
          }
        }
        return false
      })

      return isAnyEmpty
    })

    /**
     * Options Buttons
     */
    function close() {
      store.commit('setShowedLocation', false)
    }

    function sendValue() {
      const { columnName, containerUuid, parentUuid } = props.metadata
      const id = store.getters.getValueOfFieldOnContainer({
        containerUuid,
        parentUuid,
        columnName
      })
      if (isEmptyValue(id)) {
        return store.dispatch('newLocation')
          .then(response => {
            setParentValues(response)
          })
          .finally(() => {
            close()
          })
      }
      return store.dispatch('updateLocation', {
        locationId: id
      })
        .then(response => {
          setParentValues(response)
        })
        .finally(() => {
          close()
        })
    }
    const id = computed(() => {
      return store.getters.getValueOfFieldOnContainer({
        containerUuid,
        parentUuid,
        columnName
      })
    })

    const {
      displayedValue
    } = useDisplayedColumn({
      containerManager: props.containerManager,
      fieldMetadata: props.metadata
    })

    /**
     * set context values to parent continer
     * @param {object} values
     */
    function setParentValues(rowData) {
      displayedValue.value = rowData.display_value
      store.dispatch('notifyFieldChange', {
        containerUuid,
        containerManager: props.containerManager,
        field: props.metadata,
        columnName,
        newValue: rowData.id
      })
    }

    const isEmptyLocation = isIdentifierEmpty({
      value: id.value,
      columnName: props.metadata.columnName
    })
    if (!isEmptyLocation) {
      store.dispatch('getLocationAddressFromServer', {
        locationId: id.value
      })
        .then(response => {
          const { country_id } = response

          // delay to load only if country field is not render by capture sequence
          setTimeout(() => {
            const countryDefinition = store.getters.getStoredCountryDefinition(country_id)
            if (isEmptyValue(countryDefinition)) {
              // change sequence
              store.dispatch('getCountryDefinitionFromServer', {
                countryId: country_id
              })
            }
          }, 500)
        })
    } else {
      store.dispatch('clearAddressLocation')
    }

    return {
      // Ref
      // latitude,
      // longitude,
      //
      currentAddressLocationValues,
      countryId,
      fieldSequenceLocations,
      isEmptyMandatory,
      // Actions Buttons
      close,
      sendValue,
      openCoordinatesMap
      // Atribute
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
