/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 * Contributor(s): Edwin Betancourt EdwinBetanc0urt@outlook.com https://github.com/EdwinBetanc0urt
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

import store from '@/store'

// Constants
import { LOCATION_ADDRESS_FORM } from '@/utils/ADempiere/dictionary/field/locationAddress'
import FieldsList from './fieldsList.js'
import { DISPLAY_COLUMN_PREFIX } from '@/utils/ADempiere/dictionaryUtils.js'

// Utils and Helper Methods
import { getSequenceAsList } from '@/utils/ADempiere/dictionary/field/locationAddress'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'

export default {
  name: 'MixinLocationField',

  props: {
    containerManager: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      localValues: {},
      isGettingLocation: false
    }
  },

  computed: {
    uuidForm() {
      if (!isEmptyValue(this.metadata.containerUuid)) {
        return this.metadata.columnName + '_' + this.metadata.containerUuid
      }
      return LOCATION_ADDRESS_FORM
    },
    countryId() {
      return store.getters.getValueOfField({
        containerUuid: this.uuidForm,
        columnName: 'C_Country_ID'
      })
    },
    currentCountryDefinition() {
      return store.getters.getStoredCountryFromId({
        id: this.countryId
      }) || {}
    },
    blankValues() {
      return {
        [this.metadata.columnName]: undefined,
        [this.metadata.elementName]: undefined,
        id: undefined,
        uuid: undefined,
        UUID: undefined,
        [this.metadata.displayColumnName]: undefined
      }
    },
    isShowedLocationForm: {
      get() {
        return store.getters.getIsShowedLocation
      },
      set(value) {
        store.commit('setShowedLocation', Boolean(value))
      }
    },
    currentTab() {
      if (isEmptyValue(this.metadata.parentUuid) || !this.containerManager.getPanel) {
        return {}
      }
      return this.containerManager.getPanel({
        parentUuid: this.metadata.parentUuid,
        containerUuid: this.metadata.containerUuid
      })
    },
    currentRecord() {
      return store.getters.getTabCurrentRow({
        containerUuid: this.metadata.containerUuid
      })
    }
  },

  watch: {
    isShowedLocationForm(value) {
      this.setContainerInformation(value)
    }
  },

  methods: {
    clearValues() {
      this.setValues({
        values: this.blankValues
      })

      this.clearFormValues()
    },
    clearFormValues() {
      store.dispatch('clearValuesOnContainer', {
        containerUuid: this.uuidForm
      })
    },
    setContainerInformation() {
      if (!isEmptyValue(this.currentTab)) {
        store.dispatch('panelInfo', {
          currentTab: this.currentTab,
          currentRecord: this.currentRecord
        })
      }
    },
    toggleShowedLocationForm() {
      this.isShowedLocationForm = !this.isShowedLocationForm
    },
    /**
     * Displayed sequence location
     * TODO: Evaluate capture sequence or displayed sequence to generate value
     * TODO: Test capture sequence Germany "@A1@ @A2@ @A3@ @A4@ D-@P@ @R@ @C@ @CO@" with D- suffix in postal code
     * @param {object} entityValues
     * @returns {string}
     */
    generateDisplayedValue(entityValues) {
      let displayValue = ''

      if (isEmptyValue(entityValues)) {
        return displayValue
      }

      // TODO: Add DisplayColumnName (primary key) in entities
      const displayColumn = this.metadata.displayColumnName
      if (!isEmptyValue(entityValues[displayColumn])) {
        return entityValues[displayColumn]
      }

      // TODO: Change with current country display sequence
      let displaySequence = store.getters.getDisplaySequence
      const country = this.currentCountryDefinition
      if (!isEmptyValue(country)) {
        displaySequence = country.displaySequence
      }
      const locationDisplayedSequence = getSequenceAsList(displaySequence)

      const newFieldsList = FieldsList.map(item => {
        const { sequenceFields } = item.overwriteDefinition
        if (locationDisplayedSequence.includes(sequenceFields)) {
          return {
            ...item,
            isDisplayed: true,
            sequenceFields,
            index: locationDisplayedSequence.indexOf(sequenceFields)
          }
        }
        return {
          ...item,
          sequenceFields,
          isDisplayed: false
        }
      }).filter(field => {
        return field.isDisplayed
      }).sort((itemA, itemB) => {
        return itemA.index - itemB.index
      })

      const addDisplayValue = (value) => {
        if (isEmptyValue(value)) {
          value = ''
        }
        if (!isEmptyValue(displayValue)) {
          displayValue += ', ' + value
        } else {
          displayValue = value
        }
      }

      // displayed value of Address column names
      Object.keys(entityValues).forEach(columnName => {
        if (columnName.includes('Address')) {
          const currrentValue = entityValues[columnName]
          addDisplayValue(currrentValue)
        }
      })

      newFieldsList.forEach(field => {
        const { columnName } = field
        const displayColumnName = DISPLAY_COLUMN_PREFIX + columnName

        let currrentValue = ''
        if (!isEmptyValue(entityValues[displayColumnName])) {
          currrentValue = entityValues[displayColumnName]
        }

        if (isEmptyValue(currrentValue)) {
          if (columnName === 'C_City_ID') {
            currrentValue = entityValues['City']
          }
          if (columnName === 'C_Region_ID') {
            currrentValue = entityValues['RegionName']
          }

          if (isEmptyValue(currrentValue)) {
            currrentValue = store.getters.getValueOfField({
              containerUuid: this.uuidForm,
              columnName: displayColumnName
            })
          }
        }
        if (isEmptyValue(currrentValue)) {
          currrentValue = entityValues[columnName]
        }

        addDisplayValue(currrentValue)
      })

      return displayValue
    }
  }
}
