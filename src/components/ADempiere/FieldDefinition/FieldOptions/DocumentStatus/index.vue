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
  <el-card v-if="fieldAttributes.isColumnDocumentStatus" class="field-option-card document-status-option">
    <div slot="header">
      <span>
        {{ $t('field.field') }}:
        <b> {{ fieldAttributes.name }} </b>
      </span>
    </div>

    <p>
      {{ fieldAttributes.description }}
    </p>

    <el-row :gutter="10">
      <el-col :span="16">
        <el-select
          v-model="valueActionDocument"
          size="mini"
          class="custom-select-document-status"
          :popper-append-to-body="true"
          :disabled="!isRunableDocumentAction"
          @change="documentActionChange"
          @visible-change="loadDocumentActions"
        >
          <!-- Current selected docuemnt status -->
          <el-option
            :label="displayedValue"
            :value="value"
            disabled
            class="custom-option-document-status"
          >
            <span class="displayed-value">
              {{ displayedValue }}
            </span>
            <document-status-tag
              size="mini"
              class="tag-status"
              :value="value"
              :displayed-value="value"
            />
          </el-option>

          <!-- Available document status -->
          <el-option
            v-for="(item, key) in documentActionsList"
            :key="key"
            :label="item.name"
            :value="item.value"
            class="custom-option-document-status"
          >
            <div style="width: 100%;">
              <span class="displayed-value">
                {{ item.name }}
              </span>
              <document-status-tag
                size="mini"
                class="tag-status"
                :value="item.value"
                :displayed-value="item.value"
              />
            </div>
            <!-- {{ item.description }} -->

            <!-- TODO: Add description legend info -->
            <!--
            <div class="info">
              {{ item.description }}
            </div>
            -->
          </el-option>
        </el-select>
      </el-col>

      <el-col :span="8">
        <document-status-tag
          :style="{
            width: '100%',
            'text-align': 'center'
          }"
          :value="value"
          :displayed-value="displayedValue"
        />
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import { defineComponent, computed, ref } from '@vue/composition-api'

import store from '@/store'

// Constants
import { PROCESSING } from '@/utils/ADempiere/constants/systemColumns'

// Components and Mixins
import DocumentStatusTag from '@/components/ADempiere/ContainerOptions/DocumentStatusTag/index.vue'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { convertStringToBoolean } from '@/utils/ADempiere/formatValue/booleanFormat.js'
import {
  refreshRecord
} from '@/utils/ADempiere/dictionary/window'

export default defineComponent({
  name: 'DocumentStatus',

  components: {
    DocumentStatusTag
  },

  props: {
    fieldAttributes: {
      type: Object,
      required: true
    }
  },

  setup(props, { root }) {
    const displayedValue = computed(() => {
      const { parentUuid, containerUuid, displayColumnName } = props.fieldAttributes
      return store.getters.getValueOfFieldOnContainer({
        parentUuid,
        containerUuid,
        columnName: displayColumnName
      })
    })

    const recordUuid = computed(() => {
      return store.getters.getUuidOfContainer(props.fieldAttributes.containerUuid)
    })

    const value = computed(() => {
      const { parentUuid, containerUuid, columnName } = props.fieldAttributes
      return store.getters.getValueOfFieldOnContainer({
        parentUuid,
        containerUuid,
        columnName
      })
    })
    const valueActionDocument = ref(value.value)

    const withoutRecord = computed(() => {
      if (isEmptyValue(recordUuid.value) || recordUuid.value === 'create-new') {
        return true
      }
      return false
    })

    const defaultDocumentAction = computed(() => {
      const { tabTableName } = props.fieldAttributes
      return store.getters.getStoredDefaultDocumentAction({
        tableName: tabTableName,
        recordUuid: recordUuid.value,
        documentStatus: value.value
      })
    })

    const documentActionsList = computed(() => {
      const { tabTableName } = props.fieldAttributes
      return store.getters.getStoredDocumentActionsList({
        tableName: tabTableName,
        recordUuid: recordUuid.value,
        documentStatus: value.value
      })
    })

    const currentActionNode = computed(() => {
      return documentActionsList.value.find(element => {
        if (element.value === valueActionDocument.value) {
          return element
        }
      })
    })

    const isDisabledDocument = computed(() => {
      const { parentUuid, containerUuid } = props.fieldAttributes
      const processing = store.getters.getValueOfFieldOnContainer({
        parentUuid,
        containerUuid,
        columnName: PROCESSING
      })
      return convertStringToBoolean(processing)
    })

    const isRunableDocumentAction = computed(() => {
      if (isDisabledDocument.value) {
        // workflow is runing on server
        return false
      }
      // if (getCurrentTab.value.isShowedTableRecords) {
      //   // table as multi record
      //   return false
      // }
      if (withoutRecord.value) {
        // default values as new record
        return false
      }
      const isEmptyDocAction = isEmptyValue(defaultDocumentAction.value)
      if (isEmptyDocAction) {
        // get list first
        return false
      }
      if (!isEmptyDocAction && isEmptyValue(documentActionsList.value)) {
        // document is closed
        return false
      }
      return true
    })

    const labelDocumentActions = computed(() => {
      if (root.isEmptyValue(currentActionNode.value)) {
        return displayedValue.value
      }
      return currentActionNode.value.name
    })

    const timeOut = ref(null)
    function loadDocumentActions(isShowList) {
      if (!isShowList) {
        return
      }
      if (!withoutRecord.value) {
        if (isEmptyValue(defaultDocumentAction.value)) {
          clearTimeout(timeOut.value)
          timeOut.value = setTimeout(() => {
            const { tabTableName } = props.fieldAttributes
            store.dispatch('getDocumentActionsListFromServer', {
              tableName: tabTableName,
              recordUuid: recordUuid.value,
              documentStatus: value.value
            })
          }, 200)
        }
      }
    }

    function documentActionChange(docActionValue) {
      if (docActionValue === value.value) {
        return
      }
      const { tabTableName: tableName, containerUuid } = props.fieldAttributes

      store.commit('setShowFieldOption', false)

      store.dispatch('runDocumentAction', {
        tableName,
        recordUuid: recordUuid.value,
        docAction: docActionValue,
        containerUuid
      }).finally(() => {
        refreshRecord.refreshRecord({
          parentUuid: props.fieldAttributes.parentUuid,
          containerUuid
        })
      })
    }

    return {
      valueActionDocument,
      // Computeds
      value,
      displayedValue,
      labelDocumentActions,
      documentActionsList,
      isRunableDocumentAction,
      // Methods
      loadDocumentActions,
      documentActionChange
    }
  }

})
</script>

<style lang="scss" src="../common-style.scss">
</style>
<style lang="scss">
.document-status-option {
  &.el-card {
    max-width: 300px;
  }
}

.custom-option-document-status {
  width: 295px !important;

  .displayed-value {
    float: left;
    font-size: 13px !important;
  }

  .tag-status {
    float: right;
    font-size: 13px !important;
  }
}
</style>
