<!--
ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
Contributor(s): Elsio Sanchez elsiosanchez15@outlook.com https://github.com/elsiosanchez
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
  <field-definition
    :key="fieldParameters.columnName"
    :metadata-field="fieldParameters"
    :container-uuid="containerUuid"
    :container-manager="{
      ...containerManagerList
    }"
  />
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'

import store from '@/store'
import router from '@/router'

// Components and Mixins
import FieldDefinition from '@/components/ADempiere/FieldDefinition/index.vue'

// Constants
import { DEFAULT_SIZE, YES_NO } from '@/utils/ADempiere/references.js'

// Utils and Helper Methods
import { camelizeObjectKeys } from '@/utils/ADempiere/transformObject.js'
import { getFieldTemplate } from '@/utils/ADempiere/lookupFactory.js'
import {
  evalutateTypeField
} from '@/utils/ADempiere/dictionaryUtils.js'

export default defineComponent({
  name: 'ChartParameter',

  components: {
    FieldDefinition
  },

  props: {
    metadata: {
      type: Object,
      required: true
    },
    dashboardId: {
      type: Number,
      required: true
    }
  },

  setup(props) {
    /**
     * Const
     */
    const size = DEFAULT_SIZE

    /**
     * Computed
     */
    const containerUuid = computed(() => {
      const currentRoute = router.app._route
      return currentRoute.meta.uuid + 'Parameters' + props.dashboardId
    })

    const field = computed(() => {
      const metadata = camelizeObjectKeys(props.metadata)
      metadata.reference = camelizeObjectKeys(props.metadata.reference)
      return metadata
    })

    const fieldParameters = computed(() => {
      return getFieldTemplate({
        ...field.value,
        containerUuid: containerUuid.value,
        size,
        columnNameTo: isRange(field.value),
        isAdvancedQuery: isBoolean(field.value),
        overwriteDefinition: {
          size
        }
      })
    })

    function getLookupList({ parentUuid, containerUuid, contextColumnNames, columnName, tableName, searchValue, isAddBlankValue, referenceUuid, reference, blankValue }) {
      return store.dispatch('getLookupListFromServer', {
        parentUuid,
        containerUuid,
        contextColumnNames,
        tableName,
        columnName,
        searchValue,
        referenceUuid,
        // app attributes
        isAddBlankValue,
        blankValue
      })
    }
    const containerManagerList = computed(() => {
      return {
        actionPerformed: () => {},
        getFieldsLit: () => {},
        isDisplayedField: () => { return true },
        isDisplayedDefault: () => { return true },
        isReadOnlyColumn: ({ field, row }) => { return true },
        isMandatoryField: () => { return false },
        isReadOnlyField: () => { return false },
        setDefaultValues: () => {},
        getLookupList
      }
    })

    /**
     * Methods
     */

    function isBoolean({ displayType }) {
      return displayType === YES_NO.id
    }

    function isRange({ isRange, columnName }) {
      if (isRange) {
        return columnName + '_To'
      }
      return ''
    }

    return {
      // Computed
      containerManagerList,
      fieldParameters,
      containerUuid,
      field,
      // Methods
      camelizeObjectKeys,
      evalutateTypeField,
      getFieldTemplate,
      isBoolean,
      isRange
    }
  }
})
</script>

<style lang="scss" scoped>
  .custom-title {
    padding: 10px;
  }
  .dashboard-editor-container {
    padding: 32px;
    background-color: rgb(240, 242, 245);
    position: relative;

    .github-corner {
      position: absolute;
      top: 0px;
      border: 0;
      right: 0;
    }

    .chart-wrapper {
      background: #fff;
      padding: 16px 16px 0;
      margin-bottom: 32px;
    }
  }
  .custom-collapse-item.is-disabled {
    .custom-title {
      color: #303133;
    }
  }
  .el-card__header {
    border: 1px solid #36a3f7;
    padding: 0px;
    margin: 0px;
    box-sizing: border-box;
  }
  .dashboard-transitio {
    margin: 0px;
    width: 100%;
    padding-right: 2%;
    border-radius: 4px;
    text-align: center;
    // color: #fff;
    box-sizing: border-box;
    height: 500px;
    overflow: auto;
  }
  .label-dashboard{
    color: black;
    width: 95%;
    text-align: inherit;
    font-weight: 500;
    font-size: large;
    padding-left: 1%;
  }
</style>
<style>
  .el-card__body {
    padding: 5px;
  }
</style>
