<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
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
  <el-popover
    ref="warehouseLocatorPopover"
    v-model="isShowedPopover"
    placement="top-end"
    width="550"
    trigger="click"
    popper-class="warehouse-locators-popover"
  >
    <list-warehouse-locators
      v-if="isShowedPopover"
      :parent-uuid="parentMetadata.parentUuid"
      :container-uuid="parentMetadata.containerUuid"
      :container-manager="containerManager"
      :metadata="parentMetadata"
    />

    <el-button
      slot="reference"
      class="button-show-popover"
      :disabled="isDisabled"
    >
      <i class="el-icon-aim" />
    </el-button>
  </el-popover>
</template>

<script>
import { defineComponent } from '@vue/composition-api'

// Components and Mixins
import useLocatorWarehouse from './useLocatorWarehouse.js'

// Components and Mixins
import ListWarehouseLocators from './list.vue'

export default defineComponent({
  name: 'ButtonWarehouseLocator',

  components: {
    ListWarehouseLocators
  },

  props: {
    parentMetadata: {
      type: Object,
      default: () => {
        return {
          parentUuid: undefined,
          containerUuid: undefined,
          columnName: 'M_Locator_ID',
          elementName: 'M_Locator_ID'
        }
      }
    },
    containerManager: {
      type: Object,
      required: true
    },
    isDisabled: {
      type: Boolean,
      default: false
    }
  },

  setup(props) {
    const {
      isShowedPopover
    } = useLocatorWarehouse({
      parentUuid: props.parentMetadata.parentUuid,
      containerUuid: props.parentMetadata.containerUuid,
      containerManager: props.containerManager,
      fieldAttributes: props.parentMetadata
    })

    return {
      isShowedPopover
    }
  }
})
</script>
