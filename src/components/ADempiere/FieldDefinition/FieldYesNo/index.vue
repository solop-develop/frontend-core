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
  <component
    :is="yesNoComponentRender"
    :parent-uuid="parentUuid"
    :container-uuid="containerUuid"
    :container-manager="containerManager"
    :metadata="metadata"
  />
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'

export default defineComponent({
  name: 'FieldYesNo',

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
    },
    metadata: {
      type: Object,
      required: true
    }
  },

  setup(props) {
    const yesNoComponentRender = computed(() => {
      if (props.metadata.isAdvancedQuery || (props.metadata.is_query_criteria && !props.metadata.required) || props.metadata.panelType === 'report') {
        return () => import('@/components/ADempiere/FieldDefinition/FieldYesNo/SelectTemplate.vue')
      }
      return () => import('@/components/ADempiere/FieldDefinition/FieldYesNo/SwitchTemplate.vue')
    })

    return {
      yesNoComponentRender
    }
  }
})
</script>
