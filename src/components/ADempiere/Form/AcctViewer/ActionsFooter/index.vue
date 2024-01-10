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
      :disabled="isEmptyValue(recordsList)"
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
import { defineComponent, computed, ref } from '@vue/composition-api'

import store from '@/store'
import lang from '@/lang'

import {
  requestStartRePost
} from '@/api/ADempiere/form/accouting.js'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import { showMessage } from '@/utils/ADempiere/notification'
// import { parseTime } from '@/utils'
import { exportFileFromJson } from '@/utils/ADempiere/exportUtil.js'

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

    const headerAccounting = computed(() => {
      return [
        {
          label: lang.t('form.accountingViewer.organization'),
          keyColumn: 'DisplayColumn_AD_Org_ID'
        },
        {
          label: lang.t('form.accountingViewer.account'),
          keyColumn: 'DisplayColumn_Account_ID'
        },
        {
          label: lang.t('form.accountingViewer.accountedDebit'),
          keyColumn: 'AmtAcctDr'
        },
        {
          label: lang.t('form.accountingViewer.accountedCredit'),
          keyColumn: 'AmtAcctDr'
        },
        {
          label: lang.t('form.accountingViewer.transactionDate'),
          keyColumn: 'DateTrx'
        },
        {
          label: lang.t('form.accountingViewer.currency'),
          keyColumn: 'DisplayColumn_C_Currency_ID'
        },
        {
          label: lang.t('form.accountingViewer.sourceDebit'),
          keyColumn: 'AmtSourceDr'
        },
        {
          label: lang.t('form.accountingViewer.sourceCredit'),
          keyColumn: 'AmtSourceCr'
        },
        {
          label: lang.t('form.accountingViewer.rate'),
          keyColumn: 'Rate'
        },
        {
          label: lang.t('form.accountingViewer.product'),
          keyColumn: 'M_Product_ID'
        },
        {
          label: lang.t('form.accountingViewer.businessPartner'),
          keyColumn: 'C_BPartner_ID'
        },
        {
          label: lang.t('form.accountingViewer.project'),
          keyColumn: 'C_Project_ID'
        },
        {
          label: lang.t('form.accountingViewer.campaign'),
          keyColumn: 'C_Campaign_ID'
        },
        {
          label: lang.t('form.accountingViewer.salesRegion'),
          keyColumn: 'C_SalesRegion_ID'
        },
        {
          label: lang.t('form.accountingViewer.organizationTransaction'),
          keyColumn: 'AD_OrgTrx_ID'
        },
        {
          label: lang.t('form.accountingViewer.locationFrom'),
          keyColumn: 'C_LocFrom_ID'
        },
        {
          label: lang.t('form.accountingViewer.locationTo'),
          keyColumn: 'C_LocTo_ID'
        },
        {
          label: lang.t('form.accountingViewer.userList1'),
          keyColumn: 'User1_ID'
        },
        {
          label: lang.t('form.accountingViewer.userList2'),
          keyColumn: 'User2_ID'
        },
        {
          label: lang.t('form.accountingViewer.activity'),
          keyColumn: 'C_Activity_ID'
        },
        {
          label: lang.t('form.accountingViewer.subAccount'),
          keyColumn: 'C_SubAcct_ID'
        },
        {
          label: lang.t('form.accountingViewer.userElement1'),
          keyColumn: 'UserElement1_ID'
        },
        {
          label: lang.t('form.accountingViewer.userElement2'),
          keyColumn: 'UserElement2_ID'
        },
        {
          label: lang.t('form.accountingViewer.userList3'),
          keyColumn: 'User1_ID'
        },
        {
          label: lang.t('form.accountingViewer.userList4'),
          keyColumn: 'User4_ID'
        },
        {
          label: lang.t('form.accountingViewer.accountDate'),
          keyColumn: 'DateAcct'
        },
        {
          label: lang.t('form.accountingViewer.period'),
          keyColumn: 'DisplayColumn_C_Period_ID'
        },
        {
          label: lang.t('form.accountingViewer.uom'),
          keyColumn: 'DisplayColumn_C_UOM_ID'
        },
        {
          label: lang.t('form.accountingViewer.quantity'),
          keyColumn: 'Qty'
        },
        {
          label: lang.t('form.accountingViewer.tableRecord'),
          keyColumn: 'DisplayColumn_AD_Table_ID'
        },
        {
          label: lang.t('form.accountingViewer.recordId'),
          keyColumn: 'Record_ID'
        },
        {
          label: lang.t('form.accountingViewer.description'),
          keyColumn: 'Description'
        },
        {
          label: lang.t('form.accountingViewer.postingType'),
          keyColumn: 'DisplayColumn_PostingType'
        }
      ]
    })

    const isShowSourceColumns = computed(() => {
      return store.getters.getIsDisplaySourceInfo
    })

    const isShowQuantityColumns = computed(() => {
      return store.getters.getIsDisplayQuantity
    })

    const isShowDocumentColumns = computed(() => {
      return store.getters.getIsDisplayDocumentInfo
    })

    const recordsList = computed(() => {
      return store.getters.getAccoutingRecordsList
    })

    function exportAccounting() {
      const header = headerAccounting.value
        .filter(list => {
          if (
            isShowSourceColumns.value &&
            [
              lang.t('form.accountingViewer.transactionDate'),
              lang.t('form.accountingViewer.currency'),
              lang.t('form.accountingViewer.sourceDebit'),
              lang.t('form.accountingViewer.sourceCredit'),
              lang.t('form.accountingViewer.rate')
            ].includes(list.label)
          ) {
            return list
          } else if (
            isShowQuantityColumns.value &&
            [
              lang.t('form.accountingViewer.uom'),
              lang.t('form.accountingViewer.quantity')
            ].includes(list.label)
          ) {
            return list
          } else if (
            isShowDocumentColumns.value &&
            [
              lang.t('form.accountingViewer.tableRecord'),
              lang.t('form.accountingViewer.recordId'),
              lang.t('form.accountingViewer.description')
            ].includes(list.label)
          ) {
            return list
          }
          return list
        })
        .map(list => list.label)

      const data = recordsList.value.map((list, index) => {
        return headerAccounting.value
          .map(epa => {
            return list[epa.keyColumn]
          })
      })

      exportFileFromJson({
        header: header,
        data: data,
        fileName: 'test',
        bookType: 'xlsx'
      })
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
      headerAccounting,
      recordsList,
      isShowQuantityColumns,
      isShowDocumentColumns,
      isShowSourceColumns,
      exportAccounting,
      refreshAccount,
      rePost
    }
  }
})
</script>
