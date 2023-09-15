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
  <el-tag
    :size="size"
    :type="tagStatus.type"
    :effect="tagStatus.effect"
    disable-transitions
  >
    {{ displayText }}
  </el-tag>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { tagRender } from '@/utils/ADempiere/dictionary/workflow'

export default defineComponent({
  name: 'DocumentStatusTag',

  props: {
    value: {
      type: String,
      default: ''
    },
    displayedValue: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: 'medium'
    }
  },

  setup(props) {
    /**
     * Get tag type of the document status
     * add a tab depending on the status of the document
     * @param {string} status, document status key
     */
    const tagStatus = computed(() => {
      return tagRender(props.value)
    })

    const displayText = computed(() => {
      if (!isEmptyValue(props.displayedValue)) {
        return props.displayedValue
      }
      return props.value
    })

    return {
      // computeds
      displayText,
      tagStatus
    }
  }
})
</script>
