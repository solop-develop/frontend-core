<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 Contributor(s): Elsio Sanchez elsiosanches@gmail.com https://github.com/elsiosanchez
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
    :is="templateDevice"
    :table-name="tableName"
    :record-id="recordId"
    :record-uuid="recordUuid"
    :is-selectable="isSelectable"
    :is-loading="isLoading"
    :container-manager="containerManager"
  />
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'

import store from '@/store'

export default defineComponent({
  name: 'AttachmentManager',

  props: {
    tableName: {
      type: String,
      default: ''
    },
    recordId: {
      type: Number,
      default: 0
    },
    containerManager: {
      type: Object,
      default: () => {}
    },
    recordUuid: {
      type: String,
      default: ''
    },
    isSelectable: {
      type: Boolean,
      default: false
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },

  setup(props) {
    const isMobile = computed(() => {
      return store.state.app.device === 'mobile'
    })

    const templateDevice = computed(() => {
      if (isMobile.value) {
        return () => import('@/components/ADempiere/PanelInfo/Component/AttachmentManager/modeMobile.vue')
      }
      return () => import('@/components/ADempiere/PanelInfo/Component/AttachmentManager/modeDesktop.vue')
    })
    return {
      // Computed
      templateDevice
    }
  }
})
</script>

<style scoped>
  .image-slot-error {
    text-align: center;
    padding-top: 20%;
  }
  .image-card-attachment {
    width: 100%;
    height: 150px;
  }
</style>
<style lang="scss" scoped src="./attchment.scss" />
