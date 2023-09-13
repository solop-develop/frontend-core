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
  <el-button
    v-if="isWithChildsTab"
    type="text"
    style="display: none;"
    @click="changeFullScreen"
  >
    <svg-icon :icon-class="iconFullScreen" />
  </el-button>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'

// components and mixins
import useFullScreenContainer from '@/components/ADempiere/ContainerOptions/FullScreenContainer/useFullScreenContainer'

// utils and helper methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

export default defineComponent({
  name: 'FullScreenContainer',

  props: {
    parentUuid: {
      type: String,
      required: false
    },
    containerUuid: {
      type: String,
      required: false
    }
  },

  setup(props) {
    const {
      iconFullScreen, changeFullScreen, storedWindow
    } = useFullScreenContainer({
      parentUuid: props.parentUuid,
      containerUuid: props.containerUuid
    })

    const isWithChildsTab = computed(() => {
      return !isEmptyValue(storedWindow.value.tabsListChild)
    })

    return {
      isWithChildsTab,
      iconFullScreen,
      changeFullScreen
    }
  }
})
</script>
