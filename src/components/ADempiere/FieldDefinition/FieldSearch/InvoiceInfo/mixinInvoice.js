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
  COLUMN_NAME
} from '@/utils/ADempiere/dictionary/field/search/invoice.ts'

// Utils and Helper Methods
import { generateDisplayedValue } from '@/utils/ADempiere/dictionary/field/search/invoice.ts'

export default {
  name: 'MixinInvoice',

  props: {
    metadata: {
      type: Object,
      default: () => {
        return {
          parentUuid: undefined,
          containerUuid: undefined,
          column_name: COLUMN_NAME,
          elementColumnName: COLUMN_NAME
        }
      }
    }
  },

  computed: {
    blankValues() {
      const { column_name, elementColumnName } = this.metadata
      return {
        [column_name]: undefined,
        [elementColumnName]: undefined,
        [COLUMN_NAME]: undefined,
        id: undefined,
        uuid: undefined,
        business_partner: undefined,
        date_invoiced: undefined,
        document_no: undefined,
        currency: undefined,
        grand_total: undefined,
        converted_amount: undefined,
        open_amount: undefined,
        payment_term: undefined,
        is_paid: undefined,
        is_sales_transaction: undefined,
        description: undefined,
        po_reference: undefined,
        document_status: undefined
      }
    },
    recordsList() {
      return store.getters.getBusinessPartnerRecordsList({
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
