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

import { computed, nextTick, ref } from '@vue/composition-api'

import store from '@/store'

// Constants
import {
  DISPLAY_COLUMN_PREFIX,
  UNIVERSALLY_UNIQUE_IDENTIFIER_COLUMN_SUFFIX
} from '@/utils/ADempiere/dictionaryUtils'
import {
  PRODUCT_LIST_FORM,
  COLUMN_NAME
} from '@/utils/ADempiere/dictionary/field/search/product.ts'
import { ROWS_OF_RECORDS_BY_PAGE } from '@/utils/ADempiere/tableUtils'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { generateDisplayedValue } from '@/utils/ADempiere/dictionary/field/search/product.ts'
import { isSalesTransaction } from '@/utils/ADempiere/contextUtils'

/**
 * Use Product Field Search as mixin
 * @param {*} recordRow
 * @returns
 */
export default ({
  uuidForm = PRODUCT_LIST_FORM,
  parentUuid,
  containerUuid,
  containerManager,
  fieldAttributes
}) => {
  const timeOutRecords = ref(null)

  const blankValues = computed(() => {
    const { columnName, elementName } = fieldAttributes
    return {
      [columnName]: undefined,
      [elementName]: undefined,
      [COLUMN_NAME]: undefined,
      id: undefined,
      uuid: undefined,
      [DISPLAY_COLUMN_PREFIX + columnName]: undefined,
      [DISPLAY_COLUMN_PREFIX + elementName]: undefined,
      value: undefined,
      tax_id: undefined,
      name: undefined,
      name2: undefined,
      description: undefined
    }
  })

  const fieldSearchData = computed(() => {
    return store.getters.getProductSearchFieldData({
      containerUuid: uuidForm
    })
  })

  const isLoadedRecords = computed(() => {
    const { isLoaded } = fieldSearchData.value
    return isLoaded
  })

  const isLoadingRecords = computed(() => {
    const { isLoading } = fieldSearchData.value
    return isLoading
  })

  const pageNumber = computed(() => {
    const { pageNumber } = fieldSearchData.value
    return pageNumber
  })

  const pageSize = computed(() => {
    const { pageSize } = fieldSearchData.value
    return pageSize
  })

  const currentRow = computed({
    set(rowSelected) {
      store.commit('setProductSearchFieldSelectedRow', {
        containerUuid: uuidForm,
        currentRow: rowSelected
      })
    },
    get() {
      return store.getters.getProductSearchFieldCurrentRow({
        containerUuid: uuidForm
      })
    }
  })

  const showQueryFields = computed({
    set(newValue) {
      store.commit('setProductSearchFieldShowQueryFields', {
        containerUuid: uuidForm,
        showQueryFields: newValue
      })
    },
    get() {
      return store.getters.getProductSearchFieldShowQueryFields({
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
    store.commit('setProductSearchFieldShow', {
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
        // DisplayColumn_'ColumnName'
        columnName: DISPLAY_COLUMN_PREFIX + elementName,
        value: displayValue
      })
    }

    // implement container manager row
    if (fieldAttributes.inTable) {
      containerManager.setCell({
        containerUuid,
        rowIndex: fieldAttributes.rowIndex,
        rowUid: fieldAttributes.rowUid,
        columnName,
        value: id
      })
      containerManager.setCell({
        containerUuid,
        rowUid: fieldAttributes.rowUid,
        rowIndex: fieldAttributes.rowIndex,
        columnName: DISPLAY_COLUMN_PREFIX + columnName,
        value: displayValue
      })
      return
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
        .then(response => {
          // store.commit('setFiltersList', {
          //   containerUuid: uuidForm,
          //   isSOTrx: this.isSOTrx
          // })
          if (isEmptyValue(response)) {
            // this.$message({
            //   type: 'warning',
            //   showClose: true,
            //   message: this.$t('product.notFound')
            // })
          }

          nextTick(() => {
            // if (this.$refs.businessPartnerTable) {
            //   this.$refs.businessPartnerTable.setCurrentRow(this.currentRow)
            // }
          })
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
    fieldSearchData,
    currentRow,
    isLoadedRecords,
    isLoadingRecords,
    isSalesTransactionContext,
    pageSize,
    pageNumber,
    showQueryFields,
    //
    clearValues,
    closeList,
    generateDisplayedValue,
    keyAction,
    setValues,
    loadRecordsList
  }
}
