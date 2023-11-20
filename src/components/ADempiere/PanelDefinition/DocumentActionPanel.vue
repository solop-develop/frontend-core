<!--
  ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
  Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
  Contributor(s): Elsio Sanchez Elsiosanchez15@outlook.com https://github.com/Elsiosanchez
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
  <div>
    <h3> {{ $t('workflow.changeDocumentAction') }} </h3>
    <span v-if="!isEmptyValue(documentAction)" class="justify-text">
      {{ documentAction.description }}
    </span>
    <br><br>

    <el-steps :space="200" simple>
      <el-step icon="el-icon-d-arrow-right">
        <template slot="title">
          <document-status-tag
            size="medium"
            class="tag-status"
            :value="currentRecordDocumentStatus"
            :displayed-value="documentStatusDisplayedValue"
          />
        </template>
      </el-step>

      <el-step v-if="isEnableRunDocumentAction" icon="el-icon-d-arrow-right">
        <template slot="title">
          <!-- <document-status-tag
            size="medium"
            class="tag-status"
            :value="currentRecordDocumentStatus"
            :displayed-value="documentStatusDisplayedValue"
          /> -->
          <el-select
            v-model="nextDocumentAction"
            value-key="value"
            size="large"
          >
            <!-- <template v-if="documentAction" slot="prefix">
              <span class="el-input__icon" style="margin-left: 3px;">
                {{ documentAction.value }}
              </span>
            </template> -->

            <el-option
              v-for="(item, key) in documentActionsList"
              :key="key"
              :value="item.value"
              :label="item.name"
              class="custom-option-document-status"
            >
              <div style="width: 100%;">
                <!-- <span class="displayed-value">
                  {{ item.name }}
                </span> -->
                <document-status-tag
                  size="medium"
                  class="tag-status"
                  :value="item.value"
                  :displayed-value="item.name"
                />
              </div>
            </el-option>
          </el-select>
        </template>
      </el-step>

      <el-step v-else icon="el-icon-d-arrow-right">
        <template slot="title">
          <document-status-tag
            size="medium"
            class="tag-status"
            :value="currentRecordDocumentAction"
            :displayed-value="currentRecordDocumentActionDisplayValue"
          />
        </template>
      </el-step>
    </el-steps>
  </div>
</template>

<script>
import store from '@/store'

import { defineComponent, computed } from '@vue/composition-api'

// Component and Mixins
import DocumentStatusTag from '@/components/ADempiere/ContainerOptions/DocumentStatusTag/index.vue'

// Constants
import { DISPLAY_COLUMN_PREFIX } from '@/utils/ADempiere/dictionaryUtils'
import {
  DOCUMENT_ACTION, DOCUMENT_STATUS
} from '@/utils/ADempiere/constants/systemColumns'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import {
  isRunableDocumentAction
} from '@/utils/ADempiere/dictionary/workflow'

/**
 * Based on:
 * org.compiere.grid.ed.VDocAction
 * org.adempiere.webui.panel.WDocActionPanel
 */
export default defineComponent({
  name: 'DocumentActionPanel',

  components: {
    DocumentStatusTag
  },

  props: {
    parentUuid: {
      type: [String, Number],
      default: undefined
    },
    containerUuid: {
      type: [String, Number],
      required: true
    },
    containerManager: {
      type: Object,
      required: true
    }
  },

  setup(props) {
    // Computed
    const recordUuid = computed(() => {
      return store.getters.getUuidOfContainer(props.parentUuid)
    })

    const tableName = computed(() => {
      return store.getters.getStoredTableNameByTab(props.parentUuid)
    })

    const currentRecordDocumentStatus = computed(() => {
      return store.getters.getValueOfFieldOnContainer({
        parentUuid: props.parentUuid,
        containerUuid: props.containerUuid,
        columnName: DOCUMENT_STATUS
      })
    })

    const currentRecordDocumentAction = computed(() => {
      return store.getters.getValueOfFieldOnContainer({
        containerUuid: props.parentUuid, // tab uuid
        // containerUuid,
        columnName: DOCUMENT_ACTION
      })
    })

    const currentRecordDocumentActionDisplayValue = computed(() => {
      return store.getters.getValueOfFieldOnContainer({
        containerUuid: props.parentUuid, // tab uuid
        // containerUuid,
        columnName: DISPLAY_COLUMN_PREFIX + DOCUMENT_ACTION
      })
    })

    const documentStatusDisplayedValue = computed(() => {
      // find from context
      const displayValue = store.getters.getValueOfFieldOnContainer({
        parentUuid: props.parentUuid,
        containerUuid: props.parentUuid,
        columnName: DISPLAY_COLUMN_PREFIX + DOCUMENT_STATUS
      })
      if (!isEmptyValue(displayValue)) {
        return displayValue
      }

      const currentValue = currentRecordDocumentStatus.value
      // find form document statuese list
      const documentStatusesList = store.getters.getStoredDocumentStatusesList({
        tableName: props.tableName,
        recordUuid: recordUuid.value,
        documentStatus: currentValue
      })
      if (!isEmptyValue(documentStatusesList)) {
        const documentStatus = documentStatusesList.find(docStatus => {
          return docStatus === currentValue
        })
        if (!isEmptyValue(documentStatus)) {
          return documentStatus.name
        }
      }
      return currentValue
    })

    const nextDocumentAction = computed({
      set(newValue) {
        store.commit('updateValueOfField', {
          containerUuid: props.containerUuid,
          columnName: 'DocAction',
          value: newValue
        })
      },
      get() {
        return store.getters.getValueOfFieldOnContainer({
          parentUuid: props.parentUuid,
          containerUuid: props.containerUuid,
          columnName: 'DocAction'
        })
      }
    })

    const documentActionsList = computed(() => {
      return store.getters.getStoredDocumentActionsList({
        tableName: tableName.value,
        recordUuid: recordUuid.value,
        documentStatus: currentRecordDocumentStatus.value
      })
    })

    // Set Value
    const documentAction = computed(() => {
      const currentVale = nextDocumentAction.value
      return documentActionsList.value.find(action => {
        if (action.value === currentVale) {
          return action
        }
      })
    })

    const isEnableRunDocumentAction = computed(() => {
      return isRunableDocumentAction({
        containerUuid: props.parentUuid // tab uuid
      })
    })

    return {
      // Computed
      tableName,
      recordUuid,
      nextDocumentAction,
      documentAction,
      documentActionsList,
      isEnableRunDocumentAction,
      currentRecordDocumentStatus,
      documentStatusDisplayedValue,
      currentRecordDocumentAction,
      currentRecordDocumentActionDisplayValue
    }
  }
})
</script>

<style lang="scss">
.el-step.is-simple .el-step__head {
  width: auto;
  font-size: 0;
  padding-right: 10px;
  padding-top: 12px;
}
</style>
