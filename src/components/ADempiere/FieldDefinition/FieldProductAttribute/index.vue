<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
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
  <span>
    <el-popover
      ref="productAttribute"
      v-model="isShowProductAttribute"
      placement="top-end"
      width="600"
      trigger="click"
      popper-class="product-attribute-popover"
    >
      <panel-product-attribute
        class="product-attribute-form"
        :parent-uuid="parentUuid"
        :container-uuid="containerUuid"
        :container-manager="containerManager"
        :metadata="metadata"
      />
    </el-popover>

    <el-input
      v-model="displayedValueNotEdit"
      v-bind="properties"
      @clear="clearValues"
    >
      <el-button
        slot="append"
        v-popover:productAttribute
        class="button-show-popover"
        :disabled="isDisabled"
      >
        <svg-icon
          icon-class="setAttribute"
          style="font-size: 20px;"
        />
      </el-button>
    </el-input>
  </span>
</template>

<script>
import store from '@/store'

// Components and Mixins
import fieldMixin from '@/components/ADempiere/FieldDefinition/mixin/mixinField.js'
import fieldWithDisplayColumn from '@/components/ADempiere/FieldDefinition/mixin/mixinWithDisplayColumn.js'
import panelProductAttribute from './panelProductAttribute'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

export default {
  name: 'FieldProductAttribute',

  components: {
    panelProductAttribute
  },

  mixins: [
    fieldMixin,
    fieldWithDisplayColumn
  ],

  props: {
    parentUuid: {
      type: String,
      default: undefined
    },
    containerUuid: {
      type: String,
      required: true
    },
    containerManager: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      metadataList: [],
      isLoadingFields: false,
      timeOutFields: null,
      isCustomForm: true,
      unsubscribe: () => {}
    }
  },

  computed: {
    cssClassCustomField() {
      return ' custom-field-product-attribute '
    },
    productId() {
      return store.getters.getValueOfField({
        containerUuid: this.containerUuid,
        columnName: 'M_Product_ID'
      })
    },
    isDisabled() {
      if (this.metadata.readonly || this.metadata.disabled) {
        return true
      }
      if (isEmptyValue(this.productId) || this.productId <= 0) {
        return true
      }
      return false
    },
    isShowProductAttribute: {
      get() {
        return store.getters.getShowProductAttribute
      },
      set(value) {
        if (value && this.isEmptyValue(this.attributeSet) && this.metadata.tabTableName === 'M_Product') {
          this.$message({
            message: this.$t('field.productAttribute.emptySetAttribute'),
            type: 'info',
            showClose: value
          })
          store.commit('setShowProductAttribute', !value)
          this.$refs.productAttribute.showPopper = !value
          return
        }
        store.commit('setShowProductAttribute', value)
      }
    },
    displayedValueNotEdit: {
      get() {
        return this.displayedValue
      },
      set(value) {
        // emty, dont edit
      }
    },
    properties() {
      return {
        ...this.commonsProperties,
        disabled: true
      }
    },
    popoverPlacement() {
      return this.metadata.popoverPlacement || 'top'
    },
    attributeSet() {
      return store.getters.getValueOfFieldOnContainer({
        parentUuid: this.metadata.parentUuid,
        containerUuid: this.metadata.containerUuid,
        columnName: 'M_AttributeSet_ID'
      })
    }
  },

  watch: {
    productId(newValue, oldValue) {
      if (isEmptyValue(newValue)) {
        this.clearValues()
      }
    }
  },

  methods: {
    clearValues() {
      // TODO: Clear values into form
      this.value = undefined
      this.displayedValue = undefined
      this.uuidValue = undefined

      store.dispatch('clearValuesOnContainer', {
        containerUuid: this.uuidForm
      })
    }
  }
}
</script>

<style lang="scss">
.product-attribute-popover {
  margin: 0px;
  padding: 0px;
}
</style>
