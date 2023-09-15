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
import {
  DISPLAY_COLUMN_PREFIX,
  UNIVERSALLY_UNIQUE_IDENTIFIER_COLUMN_SUFFIX
} from '@/utils/ADempiere/dictionaryUtils'

// Utils and Helper Methods
import { isEmptyValue, isSameValues } from '@/utils/ADempiere/valueUtils'
import { IMAGE } from '@/utils/ADempiere/references'

export default {
  name: 'MixinWithDisplayColumn',

  computed: {
    value: {
      get() {
        const { columnName, containerUuid, inTable } = this.metadata
        // table records values
        if (inTable) {
          // implement container manager row
          if (this.containerManager && this.containerManager.getCell) {
            const value = this.containerManager.getCell({
              containerUuid,
              rowIndex: this.metadata.rowIndex,
              columnName
            })
            if (!isEmptyValue(value)) {
              return value
            }
          }
        }

        return store.getters.getValueOfFieldOnContainer({
          parentUuid: this.metadata.parentUuid,
          containerUuid,
          columnName
        })
      },
      set(newValue) {
        const { columnName, containerUuid, inTable } = this.metadata

        // table records values
        if (inTable) {
          // implement container manager row
          if (this.containerManager && this.containerManager.setCell) {
            this.containerManager.setCell({
              containerUuid,
              rowIndex: this.metadata.rowIndex,
              columnName,
              value: newValue
            })
          }
        }

        store.commit('updateValueOfField', {
          parentUuid: this.metadata.parentUuid,
          containerUuid,
          columnName,
          value: newValue
        })
        // update element column name
        if (!this.metadata.isSameColumnElement) {
          store.commit('updateValueOfField', {
            parentUuid: this.metadata.parentUuid,
            containerUuid,
            columnName: this.metadata.elementName,
            value: newValue
          })
        }
      }
    },
    displayedValue: {
      get() {
        // if (isEmptyValue(this.value)) {
        //   return undefined
        // }
        const storedDefaultValue = this.storedDefaultValue
        if (!isEmptyValue(storedDefaultValue)) {
          if (!isEmptyValue(storedDefaultValue.displayedValue)) {
            return storedDefaultValue.displayedValue
          }
        }

        const { displayColumnName: columnName, containerUuid, inTable, displayType } = this.metadata

        if (isEmptyValue(this.value) && displayType === IMAGE.id) {
          return undefined
        }

        // DisplayColumn_'ColumnName'
        // table records values
        if (inTable) {
          // implement container manager row
          if (this.containerManager && this.containerManager.getCell) {
            const value = this.containerManager.getCell({
              containerUuid,
              rowIndex: this.metadata.rowIndex,
              columnName
            })
            if (!isEmptyValue(value)) {
              return value
            }
          }
        }

        // return store.getters.getValueOfFieldOnContainer({
        //   parentUuid: this.metadata.parentUuid,
        //   containerUuid,
        //   columnName
        // })
        return store.getters.getValueOfField({
          // parentUuid: this.metadata.parentUuid,
          containerUuid,
          columnName
        })
      },
      set(newValue) {
        const { displayColumnName, containerUuid, inTable } = this.metadata

        // table records values
        if (inTable) {
          // implement container manager row
          if (this.containerManager && this.containerManager.setCell) {
            this.containerManager.setCell({
              containerUuid,
              rowIndex: this.metadata.rowIndex,
              columnName: displayColumnName,
              value: newValue
            })
          }
        }

        store.commit('updateValueOfField', {
          parentUuid: this.metadata.parentUuid,
          containerUuid,
          // DisplayColumn_'ColumnName'
          columnName: displayColumnName,
          value: newValue
        })
        // update element column name
        if (!this.metadata.isSameColumnElement) {
          store.commit('updateValueOfField', {
            parentUuid: this.metadata.parentUuid,
            containerUuid,
            columnName: DISPLAY_COLUMN_PREFIX + this.metadata.elementName,
            value: newValue
          })
        }
      }
    },

    uuidValue: {
      get() {
        return store.getters.getValueOfFieldOnContainer({
          parentUuid: this.metadata.parentUuid,
          containerUuid: this.metadata.containerUuid,
          // 'ColumnName'_UUID
          columnName: this.metadata.columnName + UNIVERSALLY_UNIQUE_IDENTIFIER_COLUMN_SUFFIX
        })
      },
      set(value) {
        const { parentUuid, containerUuid } = this.metadata

        store.commit('updateValueOfField', {
          parentUuid,
          containerUuid,
          // 'ColumnName'_UUID
          columnName: this.metadata.columnName + UNIVERSALLY_UNIQUE_IDENTIFIER_COLUMN_SUFFIX,
          value
        })
        // update element column name
        if (!this.metadata.isSameColumnElement) {
          store.commit('updateValueOfField', {
            parentUuid,
            containerUuid,
            columnName: this.metadata.elementName + UNIVERSALLY_UNIQUE_IDENTIFIER_COLUMN_SUFFIX,
            value
          })
        }
      }
    }
  },

  data() {
    return {
      controlDisplayed: ''
    }
  },

  methods: {
    setNewDisplayedValue() {
      const displayValue = this.displayedValue
      if (!isSameValues(this.controlDisplayed, displayValue)) {
        this.controlDisplayed = displayValue
      }
    },
    setOldDisplayedValue() {
      if (!isSameValues(this.controlDisplayed, this.displayedValue)) {
        this.displayedValue = this.controlDisplayed
      }
    }
  }

}
