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
    v-if="isUndoChanges"
    plain
    size="small"
    type="warning"
    class="undo-changes-button"
    @click="undoChanges()"
  >
    <svg-icon icon-class="undo" />
    <span v-if="!isMobile">
      {{ $t('actionMenu.undo') }}
    </span>
  </el-button>
</template>

<script>
import { computed, defineComponent } from '@vue/composition-api'

import store from '@/store'
import language from '@/lang'

// Utils and Melper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { undoChange } from '@/utils/ADempiere/dictionary/window'

export default defineComponent({
  name: 'UndoChangeButton',

  props: {
    parentUuid: {
      type: [String, Number],
      required: false
    },
    containerUuid: {
      type: [String, Number],
      required: true
    }
  },

  setup(props) {
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

    const isUndoChanges = computed(() => {
      if (!isEmptyValue(recordUuid.value)) {
        return isExistsChanges.value
      }

      // without old record
      const oldRecordUuid = store.getters.getCurrentRecordOnPanel(props.containerUuid)
      return !isEmptyValue(oldRecordUuid) || isExistsChanges.value
    })

    function undoChanges() {
      // store.dispatch('fieldListInfo', {
      //   fieldsList: props.tabAttributes.fieldsList,
      //   option: language.t('actionMenu.undo')
      // })
      const info = {
        fieldsList: tabAttributes.value.fieldsList,
        option: language.t('actionMenu.undo')
      }

      store.dispatch('fieldListInfo', { info })
      undoChange.undoChange({
        parentUuid: props.parentUuid,
        containerUuid: props.containerUuid
      })
    }

    return {
      isMobile,
      isUndoChanges,
      // Methods
      undoChanges
    }
  }
})
</script>
