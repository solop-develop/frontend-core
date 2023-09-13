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
  <el-button
    v-show="isSaveRecord"
    plain
    size="small"
    type="primary"
    :loading="isSaveRecordLoading"
    :disabled="isSaveRecordLoading"
    :style="isMobile ? 'margin-left: 1px;padding-right: 6px;' : 'margin-left: 8px; padding-right: 9px;'"
    class="undo-changes-button"
    @click="saveChanges()"
  >
    <svg-icon icon-class="save-AD" />
    <span v-if="!isMobile">
      {{ $t('actionMenu.save') }}
    </span>
  </el-button>
</template>

<script>
import { computed, defineComponent, ref } from '@vue/composition-api'

import store from '@/store'
import language from '@/lang'
import router from '@/router'

// Constants
import { LOG_COLUMNS_NAME_LIST } from '@/utils/ADempiere/constants/systemColumns'

// Utils and Melper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { showMessage } from '@/utils/ADempiere/notification'
import { refreshRecord } from '@/utils/ADempiere/dictionary/window'

export default defineComponent({
  name: 'SaveRecordButton',

  props: {
    parentUuid: {
      type: String,
      required: false
    },
    containerUuid: {
      type: String,
      required: true
    }
  },

  setup(props) {
    const isSaveRecordLoading = ref(false)

    const isMobile = computed(() => {
      return store.state.app.device === 'mobile'
    })

    const recordUuid = computed(() => {
      return store.getters.getUuidOfContainer(props.containerUuid)
    })

    const tabAttributes = computed(() => {
      return store.getters.getStoredTab(props.parentUuid, props.containerUuid)
    })

    const isExistsChanges = computed(() => {
      const persistenceValues = store.getters.getPersistenceAttributesChanges({
        parentUuid: props.parentUuid,
        containerUuid: props.containerUuid,
        recordUuid: recordUuid.value
      })
      return !isEmptyValue(persistenceValues)
    })

    const emptyMandatoryFields = computed(() => {
      return store.getters.getTabFieldsEmptyMandatory({
        parentUuid: props.parentUuid,
        containerUuid: props.containerUuid,
        formatReturn: false
      }).filter(itemField => {
        // omit send to server (to create or update) columns manage by backend
        return itemField.isAlwaysUpdateable ||
          !LOG_COLUMNS_NAME_LIST.includes(itemField.columnName)
      }).map(itemField => {
        return itemField.name
      })
    })

    const isSaveRecord = computed(() => {
      if (isEmptyValue(recordUuid.value) || recordUuid.value === 'create-new') {
        return true
      }
      // if (!isEmptyValue(emptyMandatoryFields.value)) {
      //   return false
      // }

      return isExistsChanges.value
    })

    function saveChanges() {
      const emptyMandatory = emptyMandatoryFields.value.join(', ')
      if (!isEmptyValue(emptyMandatory)) {
        showMessage({
          message: language.t('notifications.mandatoryFieldMissing') + emptyMandatory,
          type: 'info'
        })
        return
      }

      const info = {
        fieldsList: tabAttributes.value.fieldsList,
        option: language.t('actionMenu.save')
      }

      store.dispatch('fieldListInfo', { info })
      isSaveRecordLoading.value = true

      const currentRoute = router.app._route

      store.dispatch('flushPersistenceQueue', {
        parentUuid: props.parentUuid,
        containerUuid: props.containerUuid,
        tableName: tabAttributes.value.tableName,
        recordUuid: recordUuid.value
      })
        .then(response => {
          const {
            name,
            query,
            params
          } = currentRoute
          const { id } = response
          // refresh parent tab on document window
          if (!tabAttributes.value.isParentTab) {
            const { firstTabUuid } = tabAttributes.value
            const firstTab = store.getters.getStoredTab(
              props.parentUuid,
              firstTabUuid
            )
            if (!isEmptyValue(firstTab) && firstTab.isDocument) {
              refreshRecord.refreshRecord({
                parentUuid: props.parentUuid,
                containerUuid: firstTabUuid
              })
            }
          }

          router.replace({
            name,
            query: {
              ...query,
              recordId: id,
              filters: []
            },
            params: {
              ...params,
              filters: []
            }
          }, () => {})
        })
        .catch(error => {
          console.error('Error saving record', error.message)
          showMessage({
            message: error.message,
            type: 'error'
          })
        })
        .finally(() => {
          isSaveRecordLoading.value = false
        })
    }

    return {
      isSaveRecordLoading,
      isMobile,
      isSaveRecord,
      // Methods
      saveChanges
    }
  }
})
</script>
