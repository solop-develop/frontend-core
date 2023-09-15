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
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program.  If not, see <https:www.gnu.org/licenses/>.
-->

<template>
  <el-popover
    ref="businessPartnerListPopover"
    v-model="showedPopoverBusinessPartnerList"
    placement="top"
    width="900"
    trigger="click"
  >
    <business-partners-list
      v-if="showedPopoverBusinessPartnerList"
      :show-popover="showedPopoverBusinessPartnerList"
      :container-manager="containerManager"
      :metadata="parentMetadata"
    />

    <el-button
      slot="reference"
      class="button-search"
      :disabled="isDisabled"
    >
      <i
        class="el-icon-user-solid"
      />
    </el-button>
  </el-popover>
</template>

<script>
import store from '@/store'

// Components and Mixins
import BusinessPartnersList from './businessPartnersList.vue'

// Constants
import { BUSINESS_PARTNERS_LIST_FORM } from '@/utils/ADempiere/dictionary/field/businessPartner.js'

export default {
  name: 'ButtonBusinessPartnersList',

  components: {
    BusinessPartnersList
  },

  props: {
    parentMetadata: {
      type: Object,
      default: () => {
        return {
          parentUuid: undefined,
          containerUuid: undefined,
          columnName: 'C_BPartner_ID',
          elementName: 'C_BPartner_ID'
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

  computed: {
    uuidForm() {
      if (!this.isEmptyValue(this.parentMetadata.containerUuid)) {
        return this.parentMetadata.columnName + '_' + this.parentMetadata.containerUuid
      }
      return BUSINESS_PARTNERS_LIST_FORM
    },
    showedPopoverBusinessPartnerList: {
      get() {
        return store.getters.getBPShow({
          containerUuid: this.uuidForm
        })
      },
      set(value) {
        store.commit('setBusinessPartnerShow', {
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
