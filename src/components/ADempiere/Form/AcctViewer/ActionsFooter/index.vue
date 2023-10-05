<!--
  ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
  Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
  Contributor(s): Edwin Betancourt EdwinBetanc0urt@outlook.com https://github.com/EdwinBetanc0urt
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
  <div style="margin-top: 10px;">
    <el-button
      :loading="isLoadingDataTable"
      type="success"
      class="button-base-icon"
      icon="el-icon-refresh-right"
      style="margin-top: 10px;float: right;"
      @click="refreshAccount"
    />

    <el-button
      plain
      type="primary"
      class="button-base-icon"
      icon="el-icon-download"
      style="margin-top: 10px;margin-right: 10px;float: right;"
      @click="exportAccounting"
    />

    <el-button
      type="primary"
      plain
      style="margin-right: 10px; !important"
      :loading="isLoadingRePost"
      :disabled="isLoadingRePost"
      @click="rePost"
    >
      {{ $t('form.accountingViewer.rePosAccounting') }}
    </el-button>

    <el-checkbox
      v-model="force"
    >
      {{ $t('form.accountingViewer.force') }}
    </el-checkbox>
  </div>
</template>

<script>
import { defineComponent, ref } from '@vue/composition-api'

import store from '@/store'

import {
  requestStartRePost
} from '@/api/ADempiere/form/accouting.js'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import { showMessage } from '@/utils/ADempiere/notification'
// import { parseTime } from '@/utils'
// import { exportFileFromJson } from '@/utils/ADempiere/exportUtil.js'

export default defineComponent({
  name: 'ActionsFooter',

  props: {
    tableName: {
      type: String,
      default: () => ''
    },
    recordId: {
      type: Number,
      default: () => 0
    },
    recordUuid: {
      type: String,
      default: () => ''
    }
  },

  setup(props) {
    const isLoadingDataTable = ref(false)
    const isLoadingRePost = ref(false)
    const force = ref(false)

    // const accountingShemaId = computed(() => {
    //   return store.getters.getCurrentStoredAccoutingSchemaId
    // })

    // const accountingShemasList = computed(() => {
    //   return store.getters.getStoredAccoutingShemasList
    // })

    // function formatJson(filterVal, jsonData) {
    //   return jsonData.map(v => filterVal.map(j => {
    //     if (j === 'timestamp') {
    //       return parseTime(v[j])
    //     } else {
    //       return v[j]
    //     }
    //   }))
    // }

    function exportAccounting() {
      // const fileName = accountingShemasList.value.find(acctSchema => {
      //   return acctSchema.KeyColumn === accountingShemaId.value
      // }).DisplayColumn

      // exportFileFromJson({
      //   header: headerAccounting.value.map(a => a.label),
      //   data: formatJson(
      //     headerAccounting.value.map(a => a.columnName),
      //     tableData.value
      //   ),
      //   fileName,
      //   bookType: 'xlsx'
      // })
    }

    function refreshAccount() {
      store.dispatch('getAccoutingFactsFromServer', {
        searchValue: '',
        tableName: props.tableName,
        recordUuid: props.recordUuid,
        recordId: props.recordId
      })
    }

    function rePost() {
      isLoadingRePost.value = true
      requestStartRePost({
        tableName: props.tableName,
        recordId: props.recordId,
        recordUuid: props.recordUuid,
        isForce: force.value
      })
        .then(response => {
          if (!isEmptyValue(response.errorMsg)) {
            showMessage({
              message: response.errorMsg,
              type: 'error'
            })
          }
        })
        .catch(error => {
          console.warn(`LookupFactory: Get Start Re-Post Facts From Server (State) - Error ${error.code}: ${error.message}.`)
        })
        .finally(() => {
          isLoadingRePost.value = false
          store.dispatch('getAccoutingFactsFromServer', {
            searchValue: ''
          })
        })
    }

    return {
      isLoadingDataTable,
      isLoadingRePost,
      force,
      exportAccounting,
      refreshAccount,
      rePost
    }
  }
})
</script>
