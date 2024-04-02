/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
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

// API Request Methods
import { getLocationAddress } from '@/api/ADempiere/field/location.js'

// Constants
import FieldsList from './fieldsList.js'
import { DISPLAY_COLUMN_PREFIX } from '@/utils/ADempiere/dictionaryUtils'

// Utils and Helpers Methods
import { getSequenceAsList } from '@/utils/ADempiere/dictionary/field/locationAddress'
import {
  getLookupList,
  isDisplayedField,
  isDisplayedDefault,
  getSearchRecordsList,
  isMandatoryField,
  isReadOnlyField,
  changeFieldShowedFromUser
} from '@/components/ADempiere/Form/VPOS/containerManagerPos.js'

export default {
  name: 'MixinLocationField',

  props: {
    containerManager: {
      type: Object,
      default: () => ({
        actionPerformed: () => {},
        getFieldsLit: () => {},
        setDefaultValues: () => {}
      })
    }
  },

  data() {
    return {
      localValues: {},
      isGettingLocation: false
    }
  },

  computed: {
    countryId() {
      return this.$store.getters.getValueOfField({
        containerUuid: 'Add-Location-Address',
        columnName: 'C_Country_ID'
      })
    },
    currentCountryDefinition() {
      return this.$store.getters.getStoredCountryFromId({
        id: this.countryId
      })
    },
    isShowedLocationForm: {
      get() {
        return this.$store.getters.getIsShowedLocation
      },
      set(value) {
        this.$store.commit('setShowedLocation', Boolean(value))
      }
    }
  },

  methods: {
    getLookupList,
    isDisplayedField,
    isDisplayedDefault,
    getSearchRecordsList,
    isMandatoryField,
    isReadOnlyField,
    changeFieldShowedFromUser,
    getLocationAddress,
    toggleShowedLocationForm() {
      this.isShowedLocationForm = !this.isShowedLocationForm
    },
    /**
     * Displayed sequence location
     * @param {object} entityValues
     */
    getDisplayedValue(entityValues) {
      let displayValue = ''

      if (this.isEmptyValue(entityValues)) {
        return displayValue
      }

      let displaySequence = this.$store.getters.getDisplaySequence
      const country = this.currentCountryDefinition
      if (!this.isEmptyValue(country)) {
        displaySequence = country.displaySequence
      }
      const locationDisplayedSequence = getSequenceAsList(displaySequence)

      const newFieldsList = FieldsList.map(item => {
        const { sequenceFields } = item.overwriteDefinition
        if (locationDisplayedSequence.includes(sequenceFields)) {
          return {
            ...item,
            is_displayed: true,
            sequenceFields,
            index: locationDisplayedSequence.indexOf(sequenceFields)
          }
        }
        return {
          ...item,
          sequenceFields,
          is_displayed: false
        }
      }).filter(field => {
        return field.is_displayed
      }).sort((itemA, itemB) => {
        return itemA.index - itemB.index
      })

      const addDisplayValue = (value) => {
        if (this.isEmptyValue(value)) {
          value = ''
        }
        if (!this.isEmptyValue(displayValue)) {
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
        if (!this.isEmptyValue(entityValues[displayColumnName])) {
          currrentValue = entityValues[displayColumnName]
        }

        if (this.isEmptyValue(currrentValue)) {
          if (columnName === 'C_City_ID') {
            currrentValue = entityValues['City']
          }
          if (columnName === 'C_Region_ID') {
            currrentValue = entityValues['RegionName']
          }

          if (this.isEmptyValue(currrentValue)) {
            currrentValue = this.$store.getters.getValueOfField({
              containerUuid: 'Add-Location-Address',
              columnName: displayColumnName
            })
          }
        }
        if (this.isEmptyValue(currrentValue)) {
          currrentValue = entityValues[columnName]
        }

        addDisplayValue(currrentValue)
      })

      return displayValue
    }
  }
}
