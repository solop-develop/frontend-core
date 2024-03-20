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
    v-if="!isEmptyValue(process) && isDocument"
    plain
    type="info"
    size="small"
    style="margin-left: 5px;padding-top: 1px;padding-right: 5px;padding-bottom: 8px;padding-left: 5px;"
    @click="printProcess()"
  >
    <svg-icon
      style="font-size: 21px;"
      icon-class="print"
    />
  </el-button>
</template>

<script>
import { defineComponent } from '@vue/composition-api'

import store from '@/store'

export default defineComponent({
  name: 'PrintProcess',

  props: {
    parentUuid: {
      type: [String, Number],
      required: false
    },
    containerManager: {
      type: Object,
      required: true
    },
    tabAttributes: {
      type: Object,
      default: () => ({})
    }
  },

  setup(props) {
    /**
     * Const
     */
    const containerUuid = props.tabAttributes.uuid
    const { process } = props.tabAttributes
    const { isDocument } = props.tabAttributes
    /**
     * Methods
     */

    function printProcess() {
      const { uuid } = process
      store.commit('setSelectProcessWindows', uuid)

      store.commit('setShowedModalDialog', {
        parentUuid: containerUuid,
        containerUuid: uuid,
        isShowed: true
      })
    }
    return {
      // Const
      process,
      isDocument,
      // Methods
      printProcess
    }
  }
})
</script>
