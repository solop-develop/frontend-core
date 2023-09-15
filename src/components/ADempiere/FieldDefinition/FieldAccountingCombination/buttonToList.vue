<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 Contributor(s): Elsio Sanchez elsiosanches@gmail.com https://github.com/elsiosanchez
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
    ref="tableQueryCriteriaPopover"
    v-model="showedPopoverGeneralInfoPanel"
    placement="top"
    width="1200"
    trigger="click"
  >
    <table-query-criteria
      v-if="showedPopoverGeneralInfoPanel"
      :show-popover="showedPopoverGeneralInfoPanel"
      :metadata="parentMetadata"
      :container-manager="containerManager"
    />

    <el-button
      slot="reference"
      class="button-search"
      :disabled="isDisabled"
    >
      <svg-icon icon-class="balance" />
    </el-button>
  </el-popover>
</template>

<script>
import store from '@/store'

// Components and Mixins
import TableQueryCriteria from './tableQueryCriteria.vue'

export default {
  name: 'ButtonToList',

  components: {
    TableQueryCriteria
  },

  props: {
    parentMetadata: {
      type: Object,
      default: () => {
        return {
          parentUuid: undefined,
          containerUuid: undefined
        }
      }
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    icon: {
      type: Object,
      default: () => {
        return {
          type: 'svg',
          class: 'search'
        }
      }
    },
    containerManager: {
      type: Object,
      required: true
    }
  },

  computed: {
    uuidForm() {
      if (!this.isEmptyValue(this.parentMetadata.containerUuid)) {
        return this.parentMetadata.columnName + '_' + this.parentMetadata.containerUuid
      }
      return this.parentMetadata.columnName
    },
    showedPopoverGeneralInfoPanel: {
      get() {
        return store.getters.getAccountCombinationsShow({
          containerUuid: this.uuidForm
        })
      },
      set(value) {
        store.commit('setAccountCombinationsShow', {
          containerUuid: this.uuidForm,
          show: value
        })
      }
    }
  }
}
</script>

<style lang="scss">
.button-search {
  padding-left: 9px !important;
  padding-right: 0px !important;

  i, svg {
    font-size: 20px !important;
  }
}
</style>
