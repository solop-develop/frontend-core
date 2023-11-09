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
  <el-steps :active="indexStepActions" :direction="direction" :space="space" align-center finish-status="success">
    <el-step
      v-for="(actions, key) in documentStatuesList"
      :key="key"
      :title="actions.name"
    />
  </el-steps>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'

import store from '@/store'

// Constants
import { DOCUMENT_STATUS } from '@/utils/ADempiere/constants/systemColumns'

// Utils and Melper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

export default defineComponent({
  name: 'WorkflowStatusBar',

  props: {
    containerUuid: {
      type: String,
      required: true
    },
    space: {
      type: Number,
      defaul: 500
    }
  },

  setup(props) {
    const tableName = computed(() => {
      return store.getters.getStoredTableNameByTab(props.containerUuid)
    })

    const recordUuid = computed(() => {
      return store.getters.getUuidOfContainer(props.containerUuid)
    })
    const recordId = computed(() => {
      return store.getters.getIdOfContainer({
        containerUuid: props.containerUuid,
        tableName: tableName.value
      })
    })

    const currentDocStatus = computed(() => {
      return store.getters.getValueOfFieldOnContainer({
        containerUuid: props.containerUuid,
        columnName: DOCUMENT_STATUS
      })
    })

    const documentStatuesList = computed(() => {
      return store.getters.getStoredDocumentStatusesList({
        tableName: tableName.value,
        recordUuid: recordUuid.value,
        documentStatus: currentDocStatus.value
      })
    })

    const indexStepActions = computed(() => {
      if (isEmptyValue(documentStatuesList.value)) {
        return 0
      }
      return documentStatuesList.value.findIndex(docs => {
        return docs.value === currentDocStatus.value
      })
    })
    const direction = computed(() => {
      if (store.state.app.device === 'mobile') {
        return 'vertical'
      }
      return 'horizontal'
    })

    if (isEmptyValue(documentStatuesList.value)) {
      store.dispatch('getDocumentStatusesListFromServer', {
        tableName: tableName.value,
        recordId: recordId.value,
        recordUuid: recordUuid.value,
        documentStatus: currentDocStatus.value
      })
    }

    return {
      direction,
      currentDocStatus,
      documentStatuesList,
      indexStepActions
    }
  }
})
</script>
