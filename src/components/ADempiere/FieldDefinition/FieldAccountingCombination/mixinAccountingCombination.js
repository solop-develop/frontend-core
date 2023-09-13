/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 * Contributor(s): Elsio Sanchez elsiosanches@gmail.com https://github.com/elsiosanchez
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

// Components and Mixins
import fieldWithDisplayColumn from '@/components/ADempiere/FieldDefinition/mixin/mixinWithDisplayColumn.js'

// Constants
import { COLUMN_NAME } from '@/utils/ADempiere/dictionary/field/accoutingCombination.js'
import { ORGANIZATION } from '@/utils/ADempiere/constants/systemColumns'
import {
  DISPLAY_COLUMN_PREFIX
} from '@/utils/ADempiere/dictionaryUtils'

export default {
  name: 'mixinAccountingCombination',

  mixins: [
    fieldWithDisplayColumn
  ],

  props: {
    metadata: {
      type: Object,
      default: () => {
        return {
          parentUuid: undefined,
          containerUuid: undefined,
          columnName: COLUMN_NAME,
          elementName: COLUMN_NAME
        }
      }
    }
  },

  computed: {
    blankValues() {
      return {
        [this.metadata.columnName]: undefined,
        [this.metadata.elementName]: undefined,
        [DISPLAY_COLUMN_PREFIX + this.metadata.columnName]: undefined,
        [DISPLAY_COLUMN_PREFIX + this.metadata.elementName]: undefined,
        uuid: undefined,
        UUID: undefined
      }
    },
    recordsList() {
      return store.getters.getAccountCombinationsRecordsList({
        containerUuid: this.uuidForm
      })
    },
    // context attributes values
    acctSchemaId() {
      return store.getters.getValueOfField({
        containerUuid: this.uuidForm,
        columnName: 'C_AcctSchema_ID'
      })
    },
    organizationId() {
      return store.getters.getValueOfField({
        containerUuid: this.uuidForm,
        columnName: ORGANIZATION
      })
    },
    accoutId() {
      return store.getters.getValueOfField({
        containerUuid: this.uuidForm,
        columnName: 'Account_ID'
      })
    },
    contextAttributesList() {
      return [
        { columnName: 'C_AcctSchema_ID', value: this.acctSchemaId },
        { columnName: ORGANIZATION, value: this.organizationId },
        { columnName: 'Account_ID', value: this.accoutId }
      ]
    }
  },

  methods: {
    clearValues() {
      this.setValues(this.blankValues)
    },
    /**
     * @overwrite
     * Get custom displayed value
     * @returns {string}
     */
    generateDisplayedValue(recordRow) {
      // generate with standard columns
      const { Combination } = recordRow

      return Combination
    },
    /**
     * @overwrite
     * Set custom row on fields values
     * @returns {string}
     */
    setValues(rowData) {
      const { C_ValidCombination_ID: value, UUID: uuid } = rowData
      const displayedValue = this.generateDisplayedValue(rowData)

      // set ID value
      this.value = value
      // set display column (name) value
      this.displayedValue = displayedValue
      // set UUID value
      this.uuidValue = uuid

      store.dispatch('notifyFieldChange', {
        containerUuid: this.metadata.containerUuid,
        containerManager: this.containerManager,
        field: this.metadata,
        columnName: this.metadata.columnName,
        newValue: value
      })
    }
  }
}
