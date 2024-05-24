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

import { computed, nextTick, ref } from '@vue/composition-api'

import store from '@/store'

// Constants
import {
  DISPLAY_COLUMN_PREFIX,
  UNIVERSALLY_UNIQUE_IDENTIFIER_COLUMN_SUFFIX
} from '@/utils/ADempiere/dictionaryUtils'
import {
  INVOICES_LIST_FORM
} from '@/utils/ADempiere/dictionary/field/search/invoice.js'
import { ROWS_OF_RECORDS_BY_PAGE } from '@/utils/ADempiere/tableUtils'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { isSalesTransaction } from '@/utils/ADempiere/contextUtils'
import { generateDisplayedValue } from '@/utils/ADempiere/dictionary/field/search/invoice.js'

/**
 * Use Invoces as mixin
 * @param {*} recordRow
 * @returns
 */
export default ({
  uuidForm = INVOICES_LIST_FORM,
  parentUuid,
  containerUuid,
  containerManager,
  fieldAttributes
}) => {
  const timeOutRecords = ref(null)

  const blankValues = computed(() => {
    return {
      documentNo: undefined,
      isSalesTransaction: undefined,
      businessPartnerId: undefined,
      isPaid: undefined,
      description: undefined,
      invoiceDateFrom: undefined,
      invoiceDateTo: undefined,
      orderId: undefined,
      grandTotalFrom: undefined,
      grandTotalTo: undefined
    }
  })

  const invoiceData = computed(() => {
    return store.getters.getInvoceData({
      containerUuid: uuidForm
    })
  })

  const isLoadedRecords = computed(() => {
    const { isLoaded } = invoiceData.value
    return isLoaded
  })

  const isLoadingRecords = computed(() => {
    const { isLoading } = invoiceData.value
    return isLoading
  })

  const currentRow = computed({
    set(rowSelected) {
      store.commit('setInvoiceFieldSelectedRow', {
        containerUuid: uuidForm,
        currentRow: rowSelected
      })
    },
    get() {
      return store.getters.getInvoiceCurrentRow({
        containerUuid: uuidForm
      })
    }
  })

  const showQueryFields = computed({
    set(newValue) {
      store.commit('setInvoiceFieldShowQueryFields', {
        containerUuid: uuidForm,
        showQueryFields: newValue
      })
    },
    get() {
      return store.getters.getInvoiceShowQueryFields({
        containerUuid: uuidForm
      })
    }
  })

  const isSalesTransactionContext = computed(() => {
    return isSalesTransaction({
      parentUuid: fieldAttributes.parentUuid,
      containerUuid: fieldAttributes.containerUuid
    })
  })

  function clearValues() {
    setValues(
      blankValues.value
    )
  }

  function closeList() {
    store.commit('setInvoiceFieldShow', {
      containerUuid: uuidForm,
      show: false
    })
  }

  function setValues(recordRow) {
    const { columnName, elementName, isSameColumnElement } = fieldAttributes
    const { uuid, id } = recordRow

    const displayValue = generateDisplayedValue(recordRow)

    store.commit('updateValueOfField', {
      parentUuid,
      containerUuid,
      columnName,
      value: id
    })
    // set display column (name) value
    store.commit('updateValueOfField', {
      parentUuid,
      containerUuid,
      // DisplayColumn_'ColumnName'
      columnName: DISPLAY_COLUMN_PREFIX + columnName,
      value: displayValue
    })
    // set UUID value
    store.commit('updateValueOfField', {
      parentUuid,
      containerUuid,
      columnName: columnName + UNIVERSALLY_UNIQUE_IDENTIFIER_COLUMN_SUFFIX,
      value: uuid
    })
    // update element column name (smart browse)
    if (!isSameColumnElement) {
      store.commit('updateValueOfField', {
        parentUuid,
        containerUuid,
        columnName: elementName,
        value: id
      })
      // set display column (name) value
      store.commit('updateValueOfField', {
        parentUuid,
        containerUuid,
        columnName: DISPLAY_COLUMN_PREFIX + elementName,
        value: displayValue
      })
    }

    // implement container manager row
    if (fieldAttributes.inTable && containerManager && containerManager.setCell) {
      containerManager.setCell({
        containerUuid,
        rowIndex: fieldAttributes.rowIndex,
        columnName,
        value: id
      })
      containerManager.setCell({
        containerUuid,
        rowIndex: fieldAttributes.rowIndex,
        columnName: DISPLAY_COLUMN_PREFIX + columnName,
        value: displayValue
      })
    }

    store.dispatch('notifyFieldChange', {
      containerUuid,
      containerManager,
      field: fieldAttributes,
      columnName,
      newValue: id
    })
  }

  function loadRecordsList({ pageNumber = 0, pageSize = ROWS_OF_RECORDS_BY_PAGE }) {
    let parentUuid = fieldAttributes.parentUuid
    if (isEmptyValue(parentUuid)) {
      parentUuid = fieldAttributes.containerUuid
    }

    // isLoadingRecords.value = true
    clearTimeout(timeOutRecords.value)
    timeOutRecords.value = setTimeout(() => {
      // search on server
      containerManager.getSearchRecordsList({
        parentUuid,
        containerUuid: uuidForm,
        contextColumnNames: fieldAttributes.reference.context_column_names,
        tableName: fieldAttributes.referenceTableName,
        uuid: fieldAttributes.uuid,
        id: fieldAttributes.id,
        // filters,
        pageNumber,
        pageSize
      })
        .then(() => {
          nextTick(() => {})
        })
    }, 500)
  }

  function keyAction(event) {
    switch (event.srcKey) {
      case 'toggleQuery':
        showQueryFields.value = !showQueryFields.value
        break
      case 'refreshList':
        /**
         * TODO: When refreshing you are making 2 list requests, you can be the
         * observer that activates the second request
        */
        loadRecordsList({})
        break

      case 'close':
        closeList()
        break
    }
  }

  return {
    blankValues,
    invoiceData,
    currentRow,
    isLoadedRecords,
    isLoadingRecords,
    isSalesTransactionContext,
    showQueryFields,
    //
    clearValues,
    closeList,
    // generateDisplayedValue,
    keyAction,
    setValues,
    loadRecordsList
  }
}
