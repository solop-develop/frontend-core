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
    <el-form
      v-shortkey="{ closeForm: ['esc'] }"
      label-position="top"
      size="small"
      class="location-address"
      @shortkey.native="keyAction"
    >
      <el-row :gutter="0">
        <template v-if="!isLoadingFields">
          <el-col v-for="(fieldAttributes) in fieldDefaultLocation" :key="fieldAttributes.columnName" :span="24">
            <field-definition
              :parent-uuid="parentUuid"
              :container-uuid="containerUuid"
              :container-manager="containerManagerLocation"
              :metadata-field="{
                ...fieldAttributes,
                sizeCol: 24
              }"
            />
          </el-col>
        </template>

        <div
          v-else
          key="form-loading"
          v-loading="isLoadingFields"
          :element-loading-text="$t('notifications.loading')"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(255, 255, 255, 0.8)"
          style="min-height: calc(50vh - 84px)"
          class="loading-panel"
        />

        <el-col>
          <el-collapse accordion>
            <el-collapse-item name="1">
              <template slot="title">
                <b style="padding-right: 10px;">
                  {{ $t('field.coordination') }}
                </b>
                <svg-icon icon-class="international" />
              </template>
              <template v-if="!isLoadingFields">
                <el-col v-for="(fieldAttributes) in fieldCoordination" :key="fieldAttributes.columnName" :span="24">
                  <field-definition
                    :parent-uuid="parentUuid"
                    :container-uuid="containerUuid"
                    :container-manager="containerManagerLocation"
                    :metadata-field="fieldAttributes"
                  />
                </el-col>
              </template>

              <div
                v-else
                key="form-loading"
                v-loading="isLoadingFields"
                :element-loading-text="$t('notifications.loading')"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(255, 255, 255, 0.8)"
                style="min-height: calc(50vh - 84px)"
                class="loading-panel"
              />
            </el-collapse-item>
          </el-collapse>
        </el-col>

        <el-col :span="24" class="location-address-footer">
          <samp style="float: right; padding-top: 4px;">
            <el-button
              type="info"
              class="button-base-icon"
              plain
              @click="clearFormValues();"
            >
              <svg-icon icon-class="layers-clear" />
            </el-button>

            <el-button
              :disabled="isLoadingFields"
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
              @click="cancelChanges"
            />

            <el-button
              :disabled="isLoadingFields"
              class="button-base-icon"
              type="primary"
              icon="el-icon-check"
              @click="sendValuesToServer"
            />
          </samp>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import store from '@/store'

// Components and Mixins
import FieldDefinition from '@/components/ADempiere/FieldDefinition/index.vue'
import fieldWithDisplayColumn from '@/components/ADempiere/FieldDefinition/mixin/mixinWithDisplayColumn.js'
import mixinLocation from './mixinLocationAddress.js'

// Constants
import FieldsList from './fieldsList.js'
import {
  DISPLAY_COLUMN_PREFIX, UNIVERSALLY_UNIQUE_IDENTIFIER_COLUMN_SUFFIX
} from '@/utils/ADempiere/dictionaryUtils'
import {
  COLUMN_NAME, LOCATION_ADDRESS_FORM, MANDATORY_CHAR,
  URL_BASE_MAP, COORDENATES_COLUMN_NAMES,
  COLUMNNAME_City, COLUMNNAME_C_City_ID,
  COLUMNNAME_RegionName, COLUMNNAME_C_Region_ID, COLUMNNAME_C_Country_ID
} from '@/utils/ADempiere/dictionary/field/locationAddress'
import { LOG_COLUMNS_NAME_LIST } from '@/utils/ADempiere/constants/systemColumns'

// API Request Methods
import { getLocationAddress } from '@/api/ADempiere/field/location.js'
import {
  createLocationAddress,
  updateLocationAddress
} from '@/api/ADempiere/field/location.js'

// Utils and Helper Methods
import { createFieldFromDictionary } from '@/utils/ADempiere/lookupFactory'
import { showNotification } from '@/utils/ADempiere/notification.js'
import { formatCoordinateByDecimal, getSequenceAsList } from '@/utils/ADempiere/dictionary/field/locationAddress'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

/**
 * Location Address form to field
 */
export default {
  name: 'LocationAdressFrom',

  components: {
    FieldDefinition
  },

  mixins: [
    mixinLocation,
    fieldWithDisplayColumn
  ],

  props: {
    parentUuid: {
      type: String,
      default: undefined
    },
    containerUuid: {
      type: String,
      required: true
    },
    containerManager: {
      type: Object,
      required: true
    },
    metadata: {
      type: Object,
      default: () => {
        return {
          // TODO: Add container uuid parent
          uuid: LOCATION_ADDRESS_FORM,
          containerUuid: LOCATION_ADDRESS_FORM,
          columnName: COLUMN_NAME
        }
      }
    }
  },

  data() {
    return {
      metadataList: [],
      isLoadingFields: false,
      fieldsList: FieldsList,
      timeOutFields: null,
      isCustomForm: true,
      unsubscribe: () => {}
    }
  },

  computed: {
    fieldCoordination() {
      return this.metadataList.filter(fields => {
        return COORDENATES_COLUMN_NAMES.includes(fields.columnName)
      })
    },
    fieldDefaultLocation() {
      return this.metadataList.filter(fields => {
        return !COORDENATES_COLUMN_NAMES.includes(fields.columnName)
      })
    },
    containerManagerLocation() {
      return {
        ...this.containerManager,

        getFieldsList({ containerUuid }) {
          return store.getters.getFieldLocationAddress({
            containerUuid
          })
        },

        isReadOnlyField({ isReadOnly }) {
          return isReadOnly
        },

        isMandatoryField({ isMandatory }) {
          if (isMandatory) {
            return true
          }
          return false
        },
        isDisplayedField({ isDisplayed, columnName, containerUuid }) {
          if (columnName === COLUMNNAME_City) {
            const cityId = store.getters.getValueOfField({
              containerUuid,
              columnName: COLUMNNAME_C_City_ID
            })
            if (!isEmptyValue(cityId) && cityId > 0) {
              return false
            }
          }
          return isDisplayed
        }
      }
    },
    fieldsListLocationAddress() {
      return this.$store.getters.getFieldLocationAddress({
        containerUuid: this.uuidForm
      })
    },
    locationId() {
      return this.$store.getters.getValueOfField({
        // parentUuid: this.metadata.parentUuid,
        containerUuid: this.metadata.containerUuid,
        columnName: this.metadata.columnName
      })
    },

    latitude() {
      return this.$store.getters.getValueOfField({
        containerUuid: this.uuidForm,
        columnName: 'Latitude'
      })
    },
    longitude() {
      return this.$store.getters.getValueOfField({
        containerUuid: this.uuidForm,
        columnName: 'Longitude'
      })
    },
    isEmptyCoordenates() {
      if (isEmptyValue(this.latitude)) {
        return true
      }
      if (isEmptyValue(this.longitude)) {
        return true
      }
      return false
    }
  },

  mounted() {
    this.unsubscribe()
    this.unsubscribe = this.subscribeChanges()

    this.getLocation()

    clearTimeout(this.timeOutFields)
    this.timeOutFields = setTimeout(() => {
      this.getFieldsList()
    }, 500)
  },

  beforeDestroy() {
    this.unsubscribe()
  },

  methods: {
    keyAction(event) {
      if (event.srcKey === 'closeForm') {
        this.toggleShowedLocationForm()
      }
    },

    setDefaultValues() {
      if (!isEmptyValue(this.locationId) && this.locationId > 0) {
        return
      }

      const parsedDefaultValues = this.$store.getters.getParsedDefaultValues({
        parentUuid: this.metadata.parentUuid,
        containerUuid: this.uuidForm,
        fieldsList: this.metadataList,
        formatToReturn: 'object'
      })
      this.setValues({
        values: parsedDefaultValues
      })
    },

    /**
     * Set values into form
     * TODO: Displayed value not wortking
     */
    setValues({ values }) {
      // let cityName = values[DISPLAY_COLUMN_PREFIX + COLUMNNAME_C_City_ID]
      // if (isEmptyValue(cityName)) {
      //   cityName = values[COLUMNNAME_City]
      //   if (!isEmptyValue(values[COLUMNNAME_C_City_ID]) && values[COLUMNNAME_C_City_ID] > 0) {
      //     // get with default value
      //     cityName = undefined
      //   } else {
      //     // set with empty id
      //     // values[COLUMNNAME_C_City_ID] = -1
      //   }
      // }

      // let regionName = values[DISPLAY_COLUMN_PREFIX + COLUMNNAME_C_Region_ID]
      // if (isEmptyValue(regionName)) {
      //   regionName = values[COLUMNNAME_RegionName]
      //   if (!isEmptyValue(values[COLUMNNAME_C_Region_ID]) && values[COLUMNNAME_C_Region_ID] > 0) {
      //     // get with default value
      //     regionName = undefined
      //   } else {
      //     // set with empty id
      //     // values[COLUMNNAME_C_Region_ID] = -1
      //   }
      // }

      // let countryName = values[DISPLAY_COLUMN_PREFIX + COLUMNNAME_C_Region_ID]
      // if (isEmptyValue(countryName)) {
      //   if (!isEmptyValue(this.currentCountryDefinition)) {
      //     countryName = this.currentCountryDefinition.name
      //     values['C_Region_ID_UUID'] = this.currentCountryDefinition.uuid
      //   }
      // }

      // set context values to form continer
      this.$store.dispatch('updateValuesOfContainer', {
        containerUuid: this.uuidForm,
        attributes: {
          // DisplayColumn_C_City_ID: cityName,
          // DisplayColumn_C_Region_ID: regionName,
          // DisplayColumn_C_Country_ID: countryName,
          // undefined to force get value with default value
          DisplayColumn_C_City_ID: undefined,
          DisplayColumn_C_Region_ID: undefined,
          DisplayColumn_C_Country_ID: undefined,
          ...values
        }
      })
    },
    cancelChanges() {
      // TODO: Set old values
      this.isShowedLocationForm = false
    },
    openCoordinatesMap() {
      let baseUrlMap = URL_BASE_MAP
      if (!this.isEmptyCoordenates) {
        const latitude = formatCoordinateByDecimal(this.latitude)
        const longitude = formatCoordinateByDecimal(this.longitude)
        baseUrlMap += latitude + ',' + longitude
      } else {
        const values = this.$store.getters.getValuesView({
          containerUuid: this.containerUuid,
          format: 'Object'
        })

        baseUrlMap += this.generateDisplayedValue(values)
        // 'DisplayColumn_C_Country_ID'
        let countryName = values[DISPLAY_COLUMN_PREFIX + COLUMNNAME_C_Country_ID]
        if (isEmptyValue(countryName)) {
          countryName = this.currentCountryDefinition.name
        }
        if (!isEmptyValue(countryName)) {
          baseUrlMap += ', ' + countryName
        }
      }
      window.open(baseUrlMap, '_blank')
    },
    sortSequence(itemA, itemB) {
      return itemA.index - itemB.index
    },
    subscribeChanges() {
      return this.$store.subscribe((mutation, state) => {
        // if changed country field
        if (
          mutation.type === 'updateValueOfField' &&
          mutation.payload.containerUuid === this.uuidForm &&
          mutation.payload.columnName === COLUMNNAME_C_Country_ID
        ) {
          // Get country definition to sequence fields and displayed value
          this.changeCaptureSequence(mutation.payload.value)
        }
      })
    },

    /**
     * Change fields order
     * @param {number} countryId
     */
    changeCaptureSequence(countryId) {
      this.$store.dispatch('getCountryDefinition', {
        id: countryId
      })
        .then(responseCountry => {
          const {
            captureSequence, hasRegion, regionName, allowCitiesOutOfList
          } = responseCountry

          // capture sequence by form fields
          const newSequence = getSequenceAsList(captureSequence)
          const newFieldsList = this.fieldsListLocationAddress
            .map((item, indexArray, arrayList) => {
              if (isEmptyValue(item.sequenceFields)) {
                // does not handle capture sequence, keeps the display of the definition in the field
                return {
                  ...item
                }
              }

              // is manage with capture sequence and displayed
              if (newSequence.includes(item.sequenceFields)) {
                let index = newSequence.indexOf(item.sequenceFields)
                index *= 10

                let isMandatory = newSequence.includes(item.sequenceFields + MANDATORY_CHAR)
                // country always is displayed and mandatory
                if (item.columnName === COLUMNNAME_C_Country_ID) {
                  isMandatory = true
                }

                // rename field title in region and hidden/showd if country has region
                if (item.sequenceFields === 'R' && (captureSequence.includes('@R@') || captureSequence.includes('@R!@'))) {
                  return {
                    ...item,
                    index,
                    isDisplayed: hasRegion,
                    isMandatory,
                    name: !isEmptyValue(regionName) ? regionName : item.name
                  }
                }
                // show/hidden city text field
                if (item.columnName === COLUMNNAME_City) {
                  index++
                  return {
                    ...item,
                    index,
                    // displayed/hidden
                    isDisplayed: allowCitiesOutOfList
                  }
                }

                return {
                  ...item,
                  isDisplayed: true,
                  isMandatory,
                  index
                }
              } else {
                // country always is displayed and mandatory
                if (item.columnName === COLUMNNAME_C_Country_ID || item.sequenceFields === 'CO') {
                  if (!(captureSequence.includes('@CO@') || captureSequence.includes('@CO!@'))) {
                    return {
                      ...item,
                      isDisplayed: true,
                      isMandatory: true,
                      index: arrayList.length * 10 // to last index
                    }
                  }
                }
              }
              // is manage with capture sequence and not displayed
              return {
                ...item,
                isDisplayed: false,
                isMandatory: false
              }
            })
            .sort((itemA, itemB) => {
              return itemA.index - itemB.index
            })

          // set new order of fields
          this.$store.commit('setFieldsListLocationAddress', {
            containerUuid: this.uuidForm,
            fieldsList: newFieldsList
          })
          this.metadataList = newFieldsList
        })
        .catch(error => {
          this.$message({
            message: error.message,
            isShowClose: true,
            type: 'error'
          })
          console.warn(`Error getting Country Definition: ${error.message}. Code: ${error.code}.`)
        })
    },

    /**
     * set context values to parent continer
     * @param {object} values
     */
    setParentValues(rowData) {
      const { containerUuid, columnName } = this.metadata
      const { C_Location_ID: value, UUID: uuid } = rowData

      const displayedValue = this.generateDisplayedValue(rowData)

      // let value = rowData[columnName]
      // if (isEmptyValue(value) && !this.metadata.isSameColumnElement) {
      //   value = rowData[elementName]
      // }

      // set ID value
      this.value = value
      // set display column (name) value
      this.displayedValue = displayedValue
      // set UUID value
      this.uuidValue = uuid

      store.dispatch('notifyFieldChange', {
        containerUuid,
        containerManager: this.containerManager,
        field: this.metadata,
        columnName,
        newValue: value
      })
    },

    /**
     * Get attributes list to server
     * @returns {array} attributesToServer
     */
    getAttributesToServer(attributesList) {
      const attributesToServer = attributesList
        .filter(attributeItem => {
          const { columnName } = attributeItem
          if (columnName.startsWith(DISPLAY_COLUMN_PREFIX) || columnName === 'C_Location_ID') {
            return false
          }
          return true
        })

      const cityName = this.$store.getters.getValueOfField({
        containerUuid: this.containerUuid,
        columnName: DISPLAY_COLUMN_PREFIX + COLUMNNAME_C_City_ID // 'DisplayColumn_C_City_ID'
      })
      if (!this.isEmptyValue(cityName)) {
        attributesToServer.push({
          columnName: COLUMNNAME_City,
          value: cityName
        })
      }

      const regionName = this.$store.getters.getValueOfField({
        containerUuid: this.containerUuid,
        columnName: DISPLAY_COLUMN_PREFIX + COLUMNNAME_C_Region_ID // 'DisplayColumn_C_Region_ID'
      })
      if (!this.isEmptyValue(cityName)) {
        attributesToServer.push({
          columnName: COLUMNNAME_RegionName,
          value: regionName
        })
      }

      return attributesToServer
    },

    responseManager(responseLocation) {
      // set form values
      this.setValues({
        values: responseLocation.attributes
      })

      // set field parent values
      this.setParentValues(responseLocation.attributes)
      this.isShowedLocationForm = false

      return responseLocation.attributes
    },

    sendValuesToServer() {
      const emptyMandatoryFields = this.$store.getters.getFieldsListEmptyMandatory({
        containerUuid: this.uuidForm,
        fieldsList: this.fieldsListLocationAddress,
        showedMethod: this.containerManagerLocation.isDisplayedField,
        formatReturn: 'name'
      })

      if (!this.isEmptyValue(emptyMandatoryFields)) {
        showNotification({
          type: 'warning',
          title: this.$t('notifications.emptyValues'),
          name: '<b>' + emptyMandatoryFields + '.</b> ',
          message: this.$t('notifications.fieldMandatory'),
          isRedirect: false
        })
        return
      }

      const attributes = this.$store.getters.getValuesView({
        containerUuid: this.uuidForm
      })
      const attributesToServer = this.getAttributesToServer(attributes)
        .filter(attribute => {
          return !LOG_COLUMNS_NAME_LIST.includes(attribute.columnName) &&
            !attribute.columnName.startsWith(DISPLAY_COLUMN_PREFIX) &&
            !attribute.columnName.endsWith(UNIVERSALLY_UNIQUE_IDENTIFIER_COLUMN_SUFFIX)
        })

      const locationId = this.locationId
      if (this.isEmptyValue(locationId) || locationId === 0) {
        this.createNewLocation(attributesToServer)
        // break to only create
        return
      }
      updateLocationAddress({
        id: locationId,
        attributesList: attributesToServer
      })
        .then(this.responseManager)
        .catch(error => {
          this.$message({
            message: error.message,
            isShowClose: true,
            type: 'error'
          })
          console.warn(`Error update Location Address: ${error.message}. Code: ${error.code}.`)
        })
    },

    createNewLocation(attributesList) {
      attributesList = attributesList
        .filter(attribute => {
          return !isEmptyValue(attribute.value)
        })

      createLocationAddress({
        attributesList
      })
        .then(this.responseManager)
        .catch(error => {
          this.$message({
            message: error.message,
            isShowClose: true,
            type: 'error'
          })
          console.warn(`Error create Location Address: ${error.message}. Code: ${error.code}.`)
        })
    },

    /**
     * TODO: Manage with vuex module
     */
    getLocation() {
      if (this.isGettingLocation) {
        return
      }

      const id = this.locationId
      if (isEmptyValue(id)) {
        this.clearValues()
        this.changeCaptureSequence(this.countryId)
        return
      }

      this.isGettingLocation = true
      getLocationAddress({
        id
      })
        .then(responseLocation => {
          const { attributes } = responseLocation

          this.setValues({
            values: attributes
          })

          const countryId = attributes[COLUMNNAME_C_Country_ID]
          this.changeCaptureSequence(countryId)
        })
        .catch(error => {
          console.warn(`Get Location Address, Form Location - Error ${error.code}: ${error.message}.`)
        })
        .finally(() => {
          this.isGettingLocation = false
        })
    },
    getFieldsList() {
      this.isLoadingFields = true
      const listOfFields = []

      if (!isEmptyValue(this.fieldsListLocationAddress)) {
        this.metadataList = this.fieldsListLocationAddress
        this.changeCaptureSequence(this.countryId)
        this.isLoadingFields = false
        return
      }

      this.fieldsList.forEach(element => {
        // get of server
        createFieldFromDictionary(element)
          .then(responseField => {
            listOfFields.push({
              ...responseField,
              parentUuid: this.metadata.parentUuid,
              containerUuid: this.uuidForm
            })
          }).catch(error => {
            console.warn(`LookupFactory: Get Field From Server (State) - Error ${error.code}: ${error.message}.`)
          })
          .finally(() => {
            if (listOfFields.length === this.fieldsList.length) {
              const fieldsWithDependents = listOfFields
              this.$store.commit('setFieldsListLocationAddress', {
                containerUuid: this.uuidForm,
                fieldsList: fieldsWithDependents
              })

              this.$store.dispatch('addPanel', {
                ...this.metadata,
                isCustomForm: true,
                containerUuid: this.uuidForm,
                uuid: this.uuidForm,
                isSetDefaultValues: false,
                fieldsList: fieldsWithDependents
              })

              this.metadataList = fieldsWithDependents
              this.changeCaptureSequence(this.countryId)

              this.isLoadingFields = false

              if (isEmptyValue(this.locationId) || this.locationId <= 0) {
                this.setDefaultValues()
              }
            }
          })
      })
    }
  }
}
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
