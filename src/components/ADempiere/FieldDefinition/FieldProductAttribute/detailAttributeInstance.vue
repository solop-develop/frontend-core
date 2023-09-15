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
  <el-form
    ref="formDetail"
    v-shortkey="{ closeForm: ['esc'] }"
    :model="detailValues"
    size="mini"
    class="product-attribute-detail"
  >
    <el-row v-if="!isEmptyValue(panelAttribute)" :gutter="0">
      <el-col v-for="attribute in panelAttribute" :key="attribute.uuid" :span="24">
        <el-form-item
          :required="attribute.is_mandatory"
        >
          <template slot="label">
            {{ attribute.name }}
          </template>

          <!-- v-model="detailValues[attribute.uuid]" -->
          <el-input
            v-if="attribute.value_type === VALUE_STRING"
            v-model="attribute.value"
            style="width: 100%;"
            :required="attribute.is_mandatory"
            :class="{ 'empty-required': attribute.is_mandatory && isEmptyValue(attribute.value)}"
            clearable
          />
          <el-input-number
            v-else-if="attribute.value_type === VALUE_NUMBER"
            v-model="attribute.value"
            controls-position="right"
            style="width: 100%;"
            :required="attribute.is_mandatory"
            :class="{ 'empty-required': attribute.is_mandatory && isEmptyValue(attribute.value)}"
            clearable
          />
          <el-select
            v-else-if="attribute.value_type === VALUE_LIST"
            v-model="attribute.value"
            style="display: flex; width: 100%;"
            :required="attribute.is_mandatory"
            :class="{ 'empty-required': attribute.is_mandatory && isEmptyValue(attribute.value)}"
            clearable
          >
            <el-option
              v-for="item in attribute.product_attribute_values"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :span="24">
        <el-form-item>
          <template slot="label">
            {{ $t('field.productAttribute.description') }}
          </template>

          <el-input
            style="width: 100%;"
            readonly
            disabled
            :value="isEmptyValue(currentAttributeSetInstance) ? '' : currentAttributeSetInstance.description"
          />
        </el-form-item>
      </el-col>

      <el-col :span="24" class="product-attribute-detail-footer">
        <samp style="float: right; padding-top: 4px;">
          <el-button
            type="info"
            class="button-base-icon"
            size="small"
            plain
            @click="clearValues(); clearForm();"
          >
            <svg-icon icon-class="layers-clear" />
          </el-button>
          <el-button
            type="danger"
            class="button-base-icon"
            size="small"
            icon="el-icon-close"
            @click="clearValues(); clearForm(); close();"
          />
          <el-button
            type="primary"
            class="button-base-icon"
            size="small"
            icon="el-icon-check"
            :loading="isLoadingSave"
            :disabled="isEmptyMandatory"
            @click="save()"
          />
        </samp>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { defineComponent, computed, onMounted, ref } from '@vue/composition-api'

import lang from '@/lang'
import store from '@/store'

// Components and Mixins
import useProductAttribute from './useProductAttribute.js'

// API Request Methods
import {
  requestGetProductAttributeSet,
  requestGetProductAttributeSetInstace,
  requestSaveAttributeSetInstance
} from '@/api/ADempiere/field/productAttribute'

// Constants
import {
  PRODUCT_ATTRIBUTE_FORM,
  VALUE_LIST, VALUE_NUMBER, VALUE_STRING
} from '@/utils/ADempiere/dictionary/field/productAttribute'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { showMessage } from '@/utils/ADempiere/notification.js'

export default defineComponent({
  name: 'DetaulAttributeInstance',

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
    },
    metadata: {
      type: Object,
      required: true
    }
  },

  setup(props) {
    const {
      productId,
      clearValues,
      setValues,
      close
    } = useProductAttribute({
      parentUuid: props.parentUuid,
      containerUuid: props.containerUuid,
      containerManager: props.containerManager,
      fieldAttributes: props.metadata
    })

    const formDetail = ref(null)
    const isLoadingSave = ref(false)
    const panelAttribute = ref([])
    const currentAttributeSetInstance = ref({})
    const attributeSetInstances = ref([])
    const detailValues = ref({})

    const uuidForm = computed(() => {
      if (!isEmptyValue(props.metadata.containerUuid)) {
        return props.metadata.columnName + '_' + props.metadata.containerUuid
      }
      return PRODUCT_ATTRIBUTE_FORM
    })

    const attributeSetInstanceId = computed(() => {
      return store.getters.getValueOfField({
        containerUuid: props.containerUuid,
        columnName: props.metadata.columnName
      })
    })

    const isEmptyMandatory = computed(() => {
      return panelAttribute.value.some(attribute => {
        return attribute.is_mandatory && isEmptyValue(attribute.value)
      })
    })

    function save() {
      const mandatoryAttributes = panelAttribute.value.filter(attribute => {
        return attribute.is_mandatory && isEmptyValue(attribute.value)
      }).map(attribute => {
        return attribute.name
      })
      if (!isEmptyValue(mandatoryAttributes)) {
        showMessage({
          message: lang.t('notifications.mandatoryFieldMissing') + mandatoryAttributes,
          type: 'warning'
        })
        return
      }

      const attributesList = panelAttribute.value.map(attribute => {
        return {
          value: attribute.value,
          key: attribute.uuid
        }
      })

      isLoadingSave.value = true
      requestSaveAttributeSetInstance({
        attributes: attributesList,
        productId: productId.value,
        id: attributeSetInstanceId.value
      })
        .then(response => {
          getAttributeSetInstace({
            productId: productId.value,
            id: response.id
          })
          setValues(response)
        })
        .catch(error => {
          console.warn(error)
        })
        .finally(() => {
          isLoadingSave.value = false
          close()
        })
    }

    function getAttributesSet() {
      requestGetProductAttributeSet({
        productId: productId.value,
        productattributeSetInstanceId: attributeSetInstanceId.value
      })
        .then(response => {
          const { productAttributes } = response
          panelAttribute.value = productAttributes.map(attribute => {
            return {
              ...attribute,
              value: undefined
            }
          })

          // form model
          productAttributes.forEach(attribute => {
            detailValues.value[attribute.uuid] = null
          })
        })
        .catch(error => {
          console.warn(error)
        })
    }

    function getValueFromInstance(attribute) {
      const { uuid, value_type } = attribute
      const attributeInstance = attributeSetInstances.value.find(attributeSetInstance => {
        return attributeSetInstance.product_attribute_uuid === uuid
      })

      let value
      switch (value_type) {
        case VALUE_LIST:
          value = attributeInstance.product_attribute_value_id
          break
        case VALUE_NUMBER:
          value = attributeInstance.value_number
          break
        case VALUE_STRING:
        default:
          value = attributeInstance.value
          break
      }

      // if (!isEmptyValue(attributeInstance.value_number) && isEmptyValue(attributeInstance.value)) {
      //   value = attributeInstance.value_number
      // } else if (attributeInstance.product_attribute_value_id > 0) {
      //   value = attributeInstance.product_attribute_value_id
      // } else {
      //   value = attributeInstance.value
      // }
      return value
    }

    function getAttributeSetInstace({ productId, id }) {
      requestGetProductAttributeSetInstace({
        id,
        productId
      })
        .then(responseSetInstance => {
          currentAttributeSetInstance.value = responseSetInstance

          const { productAttributeInstances, productAttributeSet } = responseSetInstance
          const { product_attributes } = productAttributeSet

          attributeSetInstances.value = productAttributeInstances

          panelAttribute.value = product_attributes.map(attribute => {
            return {
              ...attribute,
              value: getValueFromInstance(attribute)
            }
          })

          // form model
          product_attributes.forEach(attribute => {
            detailValues.value[attribute.uuid] = getValueFromInstance(attribute)
          })
        })
        .catch(error => {
          console.warn(error)
        })
    }

    function clearForm() {
      panelAttribute.value = panelAttribute.value.map(attribute => {
        return {
          ...attribute,
          value: undefined
        }
      })
      detailValues.value = {}
      currentAttributeSetInstance.value = {}
      formDetail.value.resetFields()
    }

    onMounted(() => {
      if (!isEmptyValue(productId.value) && !isEmptyValue(attributeSetInstanceId.value) && attributeSetInstanceId.value > 0) {
        getAttributeSetInstace({
          productId: productId.value,
          id: attributeSetInstanceId.value
        })
      } else {
        getAttributesSet()
      }
    })

    return {
      currentAttributeSetInstance,
      detailValues,
      formDetail,
      isLoadingSave,
      // Constants
      VALUE_LIST,
      VALUE_NUMBER,
      VALUE_STRING,
      // Computeds
      isEmptyMandatory,
      panelAttribute,
      productId,
      uuidForm,
      // Methods
      clearForm,
      clearValues,
      close,
      save,
      setValues
    }
  }
})
</script>

<style lang="scss">
.product-attribute-detail {
  .el-input-number {
    .el-input__inner {
      text-align-last: end !important;
    }
  }

  .el-form-item {
    margin-bottom: 5px !important;

    .empty-required {
      .el-input__inner {
        border-color: #f55 !important;
      }
    }
  }

  .product-attribute-detail-footer {
    padding-bottom: 10px;
  }
}
</style>
