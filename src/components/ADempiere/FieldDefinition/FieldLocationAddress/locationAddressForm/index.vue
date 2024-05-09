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
          <el-col>
            <el-collapse accordion>
              <el-collapse-item name="1">
                <template slot="title">
                  <b style="padding-right: 10px;">
                    {{ $t('field.coordination') }}
                  </b>
                  <svg-icon icon-class="international" />
                </template>
                <LatitudeField />
                <LongitudeField />
                <AltitudeField />
              </el-collapse-item>
            </el-collapse>
          </el-col>
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
import { defineComponent, computed } from '@vue/composition-api'

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
import { formatCoordinateByDecimal, removeDecimals } from '@/utils/ADempiere/dictionary/field/locationAddress'

//
import LatitudeField from './latitudeField.vue'
import LongitudeField from './longitudeField.vue'
import AltitudeField from './altitudeField.vue'

export default defineComponent({
  name: 'LocationAddressForm',

  components: {
    LatitudeField,
    LongitudeField,
    AltitudeField
  },
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
    function openCoordinatesMap() {
      let baseUrlMap = URL_BASE_MAP
      if (!isEmptyValue(coordinates.value)) {
        baseUrlMap += coordinates.value
      } if (!isEmptyValue(getCountry.value.name) || !isEmptyValue(setLocation.value)) {
        baseUrlMap += setLocation.value + ',' + getCountry.value.name
      }
      window.open(baseUrlMap, '_blank')
    }

    const getCountry = computed(() => {
      return store.getters.getStoredCountryDefinition(countryId.value)
    })
    const setLocation = computed(() => {
      const location = currentAddressLocationValues.value
      let addres = ''
      if (!isEmptyValue(location)) {
        if (location.address1) {
          addres = location.address1 + ' '
        }
        if (location.address2) {
          addres += location.address2 + ' '
        }
        if (location.address3) {
          addres += location.address3 + ' '
        }
        if (location.address4) {
          addres += location.address4 + ' '
        }
        if (location.city) {
          addres += location.city + ' '
        }
        if (location.state) {
          addres += location.state + ' '
        }
        if (location.region_name) {
          addres += location.region_name + ' '
        }
        if (location.postal_code) {
          addres += location.postal_code + ' '
        }
        if (location.posal_code_additional) {
          addres += location.posal_code_additional + ' '
        }
        return addres
      } else {
        return addres
      }
    })

    const coordinates = computed(() => {
      const { latitude, longitude, altitude } = currentAddressLocationValues.value
      if (!isEmptyValue(latitude) && !isEmptyValue(longitude) && !isEmptyValue(altitude)) {
        return `@${formatCoordinateByDecimal(latitude)},${formatCoordinateByDecimal(longitude)},${removeDecimals(altitude)}z/data=!3m1!4b1?entry=ttu`
      }
      return
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
      currentAddressLocationValues,
      countryId,
      fieldSequenceLocations,
      isEmptyMandatory,
      coordinates,
      setLocation,
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
