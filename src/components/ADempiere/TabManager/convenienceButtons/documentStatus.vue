<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
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
  <el-popover
    v-if="!isEmptyValue(recordUuid) && !isEmptyValue(currentDocStatus) && !isEmptyValue(displayDocStatus)"
    v-model="isShowedStatus"
    trigger="click"
    :width="withPopover"
  >
    <el-descriptions
      v-if="isShowedStatus"
      :title="$t('workflow.documentStatus')"
      direction="vertical"
      :column="2"
      border
    >
      <template slot="extra">
        <document-status-tag
          key="document-status"
          size="small"
          :displayed-value="displayDocStatus"
        />
      </template>
      <el-descriptions-item :label="$t('workflow.documentActions')">
        <workflow-status-bar
          :container-uuid="containerUuid"
          :space="100"
        />
      </el-descriptions-item>
    </el-descriptions>
    <el-button
      slot="reference"
      plain
      size="small"
      :type="tagStatusType"
      class="document-status-tag-button"
    >
      {{ displayDocStatus }}
    </el-button>
  </el-popover>

  <document-status-tag
    v-else
    key="document-status"
    size="small"
    class="document-status-tag-empty"
    :displayed-value="displayDocStatus"
  />
</template>

<script>
import { defineComponent, computed, ref } from '@vue/composition-api'

import store from '@/store'

// Constants
import { DOCUMENT_STATUS } from '@/utils/ADempiere/constants/systemColumns'
import { DISPLAY_COLUMN_PREFIX } from '@/utils/ADempiere/dictionaryUtils'

// Components and Mixins
import DocumentStatusTag from '@/components/ADempiere/ContainerOptions/DocumentStatusTag/index.vue'
import WorkflowStatusBar from '@/components/ADempiere/WorkflowManager/WorkflowStatusBar.vue'

// Utils and Helper Methods
import { tagRender } from '@/utils/ADempiere/dictionary/workflow'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

export default defineComponent({
  name: 'DocumentStatus',

  components: {
    DocumentStatusTag,
    WorkflowStatusBar
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
    tableName: {
      type: String,
      required: true
    }
  },

  setup(props) {
    const isShowedStatus = ref(false)

    const recordUuid = computed(() => {
      return store.getters.getUuidOfContainer(props.containerUuid)
    })

    const currentDocStatus = computed(() => {
      return store.getters.getValueOfFieldOnContainer({
        parentUuid: props.parentUuid,
        containerUuid: props.containerUuid,
        columnName: DOCUMENT_STATUS
      })
    })

    // find form document statuese list
    const documentStatusesList = computed(() => {
      return store.getters.getStoredDocumentStatusesList({
        tableName: props.tableName,
        recordUuid: recordUuid.value,
        documentStatus: currentDocStatus.value
      })
    })

    const displayDocStatus = computed(() => {
      // find from context
      const displayValue = store.getters.getValueOfFieldOnContainer({
        parentUuid: props.parentUuid,
        containerUuid: props.containerUuid,
        columnName: DISPLAY_COLUMN_PREFIX + DOCUMENT_STATUS
      })
      if (!isEmptyValue(displayValue)) {
        return displayValue
      }

      if (!isEmptyValue(documentStatusesList.value)) {
        const documentStatus = documentStatusesList.value.find(docStatus => {
          return docStatus === currentDocStatus.value
        })
        if (!isEmptyValue(documentStatus)) {
          return documentStatus.name
        }
      }
      return ''
    })

    const tagStatusType = computed(() => {
      const { type } = tagRender(currentDocStatus.value)
      return type
    })

    const withPopover = computed(() => {
      if (store.state.app.device === 'mobile') return 'auto'
      if (!isEmptyValue(documentStatusesList.value)) {
        return documentStatusesList.value.length * 100
      }
      return 400
    })

    // watch(withPopover, (newValue, oldValue) => {
    //   if (!isSameValues(newValue, oldValue)) {
    //     const instance = getCurrentInstance()
    //     instance.proxy.forceUpdate()
    //   }
    // })

    return {
      isShowedStatus,
      currentDocStatus,
      displayDocStatus,
      recordUuid,
      withPopover,
      tagStatusType
    }
  }
})
</script>

<style lang="scss">
.document-status-tag-empty {
  // padding: 9px;
  // margin: 9px;
  font-size: 14px;
  height: 32px;
  min-width: 40px;
  // line-height: 32px;
}
</style>
