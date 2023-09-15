<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
 Contributor(s): Edwin Betancourt EdwinBetanc0urt@outlook.com www.erpya.com
 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program.  If not, see <https:www.gnu.org/licenses/>.
-->

<template>
  <span v-if="isActiveTab && !isEmptyValue(keyColumn)" key="withTooltip" class="lock-record">
    <span :class="{ 'locked-record': isLocked }">
      {{ tabName }}
    </span>

    <!-- <el-tooltip
      :content="tooltipText"
      placement="top"
    >
      <el-button v-if="isLocked" type="text" @click="unLockRecord()">
        <i class="el-icon-unlock icon-font" />
      </el-button>

      <el-button v-else type="text" @click="lockRecord()">
        <i class="el-icon-lock icon-font" />
      </el-button>
    </el-tooltip> -->
  </span>

  <span v-else key="onlyName" :class="{ 'locked-record': isLocked }">
    {{ tabName }}

    <slot name="sufix" />
  </span>
</template>

<script>
import { defineComponent, computed, ref, watch } from '@vue/composition-api'

import language from '@/lang'
import store from '@/store'

// utils and helper methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

export default defineComponent({
  name: 'LockRecord',

  props: {
    parentUuid: {
      type: String,
      required: true
    },
    containerUuid: {
      type: String,
      required: true
    },
    isActiveTab: {
      type: Boolean,
      required: true
    }
  },

  setup(props) {
    const { name: tabName, tableName, keyColumn } = store.getters.getStoredTab(props.parentUuid, props.containerUuid)

    const isLocked = ref(false)

    const recordUuid = computed(() => {
      return store.getters.getUuidOfContainer(props.containerUuid)
    })

    const isValidUuid = (uuidByRecord) => {
      return !isEmptyValue(uuidByRecord) && uuidByRecord !== 'create-new'
    }

    const tooltipText = computed(() => {
      if (isLocked.value) {
        return language.t('recordManager.unlockRecord')
      }
      return language.t('recordManager.lockRecord')
    })

    const storedPrivateAccess = computed(() => {
      return store.getters.getStoredPrivateAccess({
        tableName,
        recordUuid: recordUuid.value
      })
    })

    const lockRecord = () => {
      store.dispatch('lockRecordFromServer', {
        tableName,
        recordUuid: recordUuid.value
      })
        .then(isLockedResponse => {
          isLocked.value = isLockedResponse
        })
    }

    const unLockRecord = () => {
      store.dispatch('unlockRecordFromServer', {
        tableName,
        recordUuid: recordUuid.value
      })
        .then(isUnLockedResponse => {
          isLocked.value = isUnLockedResponse
        })
    }

    const isGettingRecordAccess = ref(false)

    const getPrivateAccess = () => {
      if (isEmptyValue(recordUuid.value)) {
        return
      }

      // get from vuex stored
      if (!isEmptyValue(storedPrivateAccess.value)) {
        isLocked.value = storedPrivateAccess.value.isLocked
        return
      }

      isGettingRecordAccess.value = true

      // get from server
      store.dispatch('getPrivateAccessFromServer', {
        tableName,
        recordUuid: recordUuid.value
      })
        .then(privateAccessResponse => {
          isLocked.value = privateAccessResponse
        })
        .finally(() => {
          isGettingRecordAccess.value = false
        })
    }

    // timer to execute the request between times
    const timeOut = ref(() => {})

    if (!isEmptyValue(keyColumn)) {
      watch(() => recordUuid, (newValue, oldValue) => {
        if (props.isActiveTab && isValidUuid(newValue) && !isGettingRecordAccess.value) {
          clearTimeout(timeOut.value)

          timeOut.value = setTimeout(() => {
            // get records
            getPrivateAccess()
          }, 1000)
        }
      })

      if (props.isActiveTab && isValidUuid(recordUuid.value) && !isGettingRecordAccess.value) {
        getPrivateAccess()
      }
    }

    return {
      tabName,
      isLocked,
      keyColumn,
      // computed
      tooltipText,
      // methods
      lockRecord,
      unLockRecord
    }
  }
})
</script>

<style lang="scss">
.lock-record {
  .locked-record {
    color: red !important;
  }

  .icon-font {
    font-size: 15px;
    color: black;
  }
}
</style>
