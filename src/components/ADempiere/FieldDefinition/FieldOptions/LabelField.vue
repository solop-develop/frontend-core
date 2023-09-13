<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 Contributor(s): Leonel Matos lmatos@erpya.com
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
  <div v-if="!isFieldOnly" :style="labelStyle" class="label-field">
    <span class="field-title-name">
      {{ label }}
    </span>

    <span v-if="isMandatory" style="color: #f34b4b"> * </span>

    <i :class="cssClassName" :style="iconStyle" />
  </div>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'

export default defineComponent({
  name: 'LabelField',

  props: {
    isMandatory: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ''
    },
    isFieldOnly: {
      type: Boolean,
      default: false
    },
    isButton: {
      type: Boolean,
      default: false
    }
  },

  setup(props, { root }) {
    const isMobile = computed(() => {
      return root.$store.state.app.device === 'mobile'
    })

    const labelStyle = computed(() => {
      let displayStyle = 'display: block;'
      if (isMobile.value) {
        displayStyle = 'display: flex; width: auto;'
      }

      if (props.isButton) return displayStyle + ' margin-left: 3px;color: transparent;'

      return displayStyle + ' margin-left: 3px;'
    })

    const cssClassName = computed(() => {
      const iconClass = 'el-icon-info '
      if (isMobile.value) {
        return iconClass + 'icon-mobile'
      }
      return iconClass + 'icon-desktop'
    })

    const iconStyle = computed(() => {
      if (props.isButton) return 'color: transparent;'
      return ''
    })

    return {
      cssClassName,
      labelStyle,
      iconStyle
    }
  }
})
</script>

<style lang="scss">
.el-popover {
  .el-icon-info.icon-desktop {
    margin-left: 0px !important;
  }
}
</style>
<style lang="scss" scoped>
.label-field {
  .field-title-name {
    color: #909399 !important;
    &:hover {
      color: #303133 !important;
    }
  }

  .el-icon-info {
    font-size: 11px;
    color: #008fd3;

    &.icon-mobile {
      margin-left: 5px;
      margin-top: 7px;
    }

    &.icon-desktop {
      margin-left: -5px;
      padding-bottom: 6px;
    }
  }
}
</style>
