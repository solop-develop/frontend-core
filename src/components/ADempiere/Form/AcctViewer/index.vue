<!--
  ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
  Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A.
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
  <!-- <el-container> -->
  <div style="height: 84% !important;overflow: auto;">
    <query-criteria
      :table-name="tableName"
      :record-id="recordId"
    />

    <div style="padding: 0px;height: fit-content !important;">
      <table-records />
    </div>
    <div style="/*height: 6% !important;*/">
      <actions-footer
        :table-name="tableName"
        :record-id="recordId"
        :record-uuid="recordUuid"
      />
    </div>
  </div>
  <!-- </el-container> -->
</template>

<script>
import { defineComponent, computed, watch, onUnmounted } from '@vue/composition-api'

import store from '@/store'

// Components and Mixins
import ActionsFooter from './ActionsFooter'
import QueryCriteria from './QueryCriteria'
import TableRecords from './TableRecords'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

/**
 * org.compiere.acct.AcctViewer
 * org.adempiere.webui.acct.WAcctViewer
 */
export default defineComponent({
  name: 'AcctViewer',

  components: {
    ActionsFooter,
    QueryCriteria,
    TableRecords
  },

  props: {
    containerUuid: {
      type: String,
      default: () => ''
    },
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
    const ACCOUTING_FACT_FORM = 'Accouting-Fact-Form'

    // Computed
    const uuidForm = computed(() => {
      return ACCOUTING_FACT_FORM + '_' + props.containerUuid
    })

    const showContainerInfo = computed(() => {
      return store.getters.getShowLogs
    })

    // Watch
    // watch(accoutingSchemas, (newValue) => {
    //   findAccountingFacts(newValue)
    // })
    // watch(postingType, (newValue) => {
    //   findAccountingFacts(newValue)
    // })
    watch(showContainerInfo, (newValue) => {
      // clearData()
    })

    // findAccountingFacts(accoutingFilters.value)

    function subscribeAccoutingFacts() {
      return store.subscribe((mutation, state) => {
        const enabledMutations = ['setAccountSchemaId', 'setPostingTypeValue']
        if (enabledMutations.includes(mutation.type)) {
          if (mutation.type === 'setAccountSchemaId' && isEmptyValue(mutation.payload)) {
            return
          }
          store.dispatch('getAccoutingFactsFromServer', {
            searchValue: '',
            tableName: props.tableName,
            recordUuid: props.recordUuid,
            recordId: props.recordId
          })
        }
      })
    }

    const unsubscribeAccoutingFacts = subscribeAccoutingFacts()

    onUnmounted(() => {
      unsubscribeAccoutingFacts()
    })

    return {
      // computed
      uuidForm,
      showContainerInfo
    }
  }

})
</script>
