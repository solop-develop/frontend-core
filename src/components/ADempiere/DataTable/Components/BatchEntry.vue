<!--
ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
Contributor(s): Elsio Sanchez elsiosanches@gmail.com https://github.com/elsiosanchez
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
  <span
    key="field-component"
  >
    <field-definition
      v-for="(fieldAttributes, key) in fieldsList"
      ref="fieldComponent"
      :key="key"
      :parent-uuid="parentUuid"
      :container-uuid="containerUuid + 'Batch_Entry'"
      :metadata-field="fieldAttributes"
      :container-manager="containerManagerBatchEntry"
      :v-model="fieldAttributes.defaultValue"
      :size-col="6"
      @keyup.native.enter="actionKeyEnter(fieldAttributes)"
    />
  </span>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'
import store from '@/store'

// Components and Mixins
import FieldDefinition from '@/components/ADempiere/FieldDefinition/index.vue'

// Utils and Helpers Methods
import {
  isMandatoryField,
  isDisplayedField,
  isDisplayedDefault,
  isReadOnlyField
} from '@/components/ADempiere/DataTable/Components/containerManagerBatchEntry'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import { convertObjectToKeyValue } from '@/utils/ADempiere/formatValue/iterableFormat'
import { convertArrayKeyValueToObject } from '@/utils/ADempiere/formatValue/iterableFormat.js'

export default defineComponent({
  name: 'BatchEntry',

  components: {
    FieldDefinition
  },

  props: {
    parentUuid: {
      type: String,
      required: false
    },
    containerUuid: {
      type: String,
      required: false
    },
    fieldListBatchEntry: {
      type: Array,
      default: () => []
    },
    fieldListAll: {
      type: Array,
      default: () => []
    },
    containerManager: {
      type: Object,
      required: true
    },
    tableName: {
      type: String,
      default: () => ''
    }
  },

  setup(props, { root, refs }) {
    const containerUuid = props.containerUuid + 'Batch_Entry'

    const fieldsList = computed(() => {
      return props.fieldListAll.map(fieldAttributes => {
        return {
          ...fieldAttributes,
          parentUuid: fieldAttributes.parentUuid + 'Batch_Entry',
          containerUuid
        }
      })
    })

    const defaultValues = computed(() => {
      return store.getters.getTabParsedDefaultValue({
        parentUuid: props.parentUuid,
        containerUuid: props.containerUuid,
        isSOTrxMenu: root.$route.meta.isSalesTransaction
      })
    })

    defaultValues.value.forEach(attribute => {
      if (!isEmptyValue(attribute.value)) {
        store.commit('addChangeToPersistenceQueue', {
          ...attribute,
          containerUuid
        })
      }
    })

    store.dispatch('updateValuesOfContainer', {
      // parentUuid: props.parentUuid + 'Batch_Entry',
      containerUuid: props.containerUuid + 'Batch_Entry',
      attributes: defaultValues.value
    })

    const containerManagerBatchEntry = computed(() => {
      return {
        ...props.containerManager,
        isMandatoryField,
        isDisplayedField,
        isDisplayedDefault,
        isReadOnlyField
      }
    })

    function actionKeyEnter(key) {
      const listVisibleFields = fieldsList.value.filter(a => a.isQuickEntry)
      const nextField = listVisibleFields.findIndex(a => a.columnName === key.columnName)
      if (nextField >= listVisibleFields.length - 1) {
        sendValuesToServer()
        return
      }
      const columnNameNextField = listVisibleFields[nextField + 1].columnName
      const indexNextField = fieldsList.value.findIndex(a => a.columnName === columnNameNextField)
      const currentFieldKeyPress = fieldsList.value.find(a => a.columnName === key.columnName)

      if (props.fieldListBatchEntry[props.fieldListBatchEntry.length - 1].columnName !== currentFieldKeyPress.columnNameObject) {
        if (isEmptyValue(refs.fieldComponent[indexNextField].$refs[columnNameNextField].$refs[columnNameNextField])) {
          refs.fieldComponent[indexNextField].$refs[columnNameNextField].$children[0].$refs[columnNameNextField].focus()
          return
        }
        refs.fieldComponent[indexNextField].$refs[columnNameNextField].$refs[columnNameNextField].focus()
        return
      }
    }

    function sendValuesToServer() {
      isLoadingTable(false)
      const changes = convertArrayKeyValueToObject({
        array: store.getters.getPersistenceAttributes({
          containerUuid
        })
      })
      const parsedDefaultValues = convertArrayKeyValueToObject({
        array: defaultValues.value
      })

      const sendFieldServer = convertObjectToKeyValue({
        object: {
          ...parsedDefaultValues,
          ...changes
        }
      })

      store.dispatch('flushPersistenceQueue', {
        parentUuid: props.parentUuid,
        containerUuid: props.containerUuid,
        tableName: props.tableName,
        attributesList: sendFieldServer
      })
      store.dispatch('updateValuesOfContainer', {
        containerUuid,
        attributes: defaultValues.value
      })
        .then(() => {
          isLoadingTable(true)
          initialFocus()
        })
    }

    function isLoadingTable(load) {
      store.dispatch('reloadTableData', {
        isLoaded: load,
        containerUuid
      })
    }

    function initialFocus() {
      const columnName = props.fieldListBatchEntry[0].columnName
      const index = fieldsList.value.findIndex(a => a.columnName === columnName)
      setTimeout(() => {
        if (refs.fieldComponent[index] &&
          refs.fieldComponent[index].$refs[columnName] &&
          refs.fieldComponent[index].$refs[columnName].$refs[columnName]) {
          refs.fieldComponent[index].$refs[columnName].$refs[columnName].focus()
        }
      }, 500)
    }

    initialFocus()

    return {
      fieldsList,
      containerManagerBatchEntry,
      actionKeyEnter,
      sendValuesToServer,
      isLoadingTable,
      initialFocus
    }
  }
})
</script>
