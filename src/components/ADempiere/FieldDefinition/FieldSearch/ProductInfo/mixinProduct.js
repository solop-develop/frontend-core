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

import store from '@/store'

// Constants
import {
  COLUMN_NAME,
  PRODUCT_LIST_FORM
} from '@/utils/ADempiere/dictionary/field/search/product.ts'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { generateDisplayedValue } from '@/utils/ADempiere/dictionary/field/search/product.ts'

export default {
  name: 'MixinProduct',

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
      const { columnName, elementName } = this.metadata
      return {
        [columnName]: undefined,
        [elementName]: undefined,
        [COLUMN_NAME]: undefined,
        id: undefined,
        uuid: undefined,
        value: undefined,
        name: undefined,
        description: undefined
      }
    },
    uuidForm() {
      if (!isEmptyValue(this.metadata.containerUuid)) {
        return this.metadata.columnName + '_' + this.metadata.containerUuid
      }
      return PRODUCT_LIST_FORM
    },
    recordsList() {
      return store.getters.getProductSearchFieldRecordsList({
        containerUuid: this.uuidForm
      })
    }
  },

  methods: {
    /**
     * @overwrite
     * Get custom displayed value
     * @returns {string}
     */
    generateDisplayedValue
  }
}
