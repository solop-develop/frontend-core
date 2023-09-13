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
    ref="generalSearchListPopover"
    v-model="showedPopoverGeneralInfoPanel"
    placement="top"
    width="900"
    trigger="click"
  >
    <panel-general-info-search
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
      <i v-if="icon.type === 'i'" :class="icon.class" />
      <svg-icon v-else :icon-class="icon.class" />
    </el-button>
  </el-popover>
</template>

<script>
import { defineComponent, computed, watch, ref } from '@vue/composition-api'

import store from '@/store'

// Components and Mixins
import PanelGeneralInfoSearch from './panel.vue'

// Constants
import { GENERAL_INFO_SEARCH_LIST_FORM } from '@/utils/ADempiere/dictionary/field/generalInfoSearch'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

export default defineComponent({
  name: 'GeneralInfoSearch',

  components: {
    PanelGeneralInfoSearch
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

  setup(props) {
    const generalSearchListPopover = ref(null)

    const uuidForm = computed(() => {
      if (!isEmptyValue(props.parentMetadata.containerUuid)) {
        return props.parentMetadata.columnName + '_' + props.parentMetadata.containerUuid
      }
      return GENERAL_INFO_SEARCH_LIST_FORM
    })

    const fieldsListQuery = computed(() => {
      const fieldsList = store.getters.getQueryFieldsList({
        containerUuid: uuidForm.value
      })
      if (isEmptyValue(fieldsList)) {
        return []
      }
      return fieldsList.map(header => {
        return {
          columnName: header.columnName,
          value: undefined
        }
      })
    })

    const listHeader = computed(() => {
      return store.getters.getQueryFieldsList({
        containerUuid: uuidForm.value
      })
    })

    const showedPopoverGeneralInfoPanel = computed({
      get() {
        return store.getters.getGeneralInfoShow({
          containerUuid: uuidForm.value
        })
      },
      set(value) {
        store.commit('setGeneralInfoShow', {
          containerUuid: uuidForm.value,
          show: value
        })
      }
    })

    function getHeader() {
      if (!isEmptyValue(listHeader.value)) return
      store.dispatch('searchTableHeader', {
        containerUuid: uuidForm.value,
        tableName: props.parentMetadata.reference.tableName
      })
    }
    getHeader()

    /**
     * Wacht
     */

    watch(fieldsListQuery, (newValue, oldValue) => {
      if (!isEmptyValue(newValue)) {
        store.commit('updateValuesOfContainer', {
          containerUuid: uuidForm.value,
          attributes: newValue
        })
      }
    })

    // getHeader()

    return {
      generalSearchListPopover,
      // computeds
      uuidForm,
      showedPopoverGeneralInfoPanel,
      fieldsListQuery,
      listHeader,
      // Methods
      getHeader
    }
  }
})
</script>

<style lang="scss">
.button-search {
  padding-left: 9px !important;
  padding-right: 0px !important;

  i, svg {
    font-size: 20px !important;

    // M_InOut icon
    &.el-icon-truck {
      font-size: 26px !important;
    }
  }
}
</style>
