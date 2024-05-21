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
  <el-collapse
    v-model="activeAccordion"
    accordion
    class="business-partners-query-criteria"
  >
    <el-collapse-item
      :name="ACCORDION_KEY"
      class="business-partners-query-criteria-collapse"
    >
      <template slot="title">
        {{ title }}
      </template>

      <el-form
        label-position="top"
        size="mini"
        class="form-base"
        @submit.native.prevent="notSubmitForm"
      >
        <el-row v-if="!isLoadingFields" :gutter="10">
          <el-col :span="6">
            <document-no
              :uuid-form="uuidForm"
            />
          </el-col>

          <el-col :span="6">
            <description
              :uuid-form="uuidForm"
            />
          </el-col>

          <el-col :span="6">
            <business-partner
              :uuid-form="uuidForm"
              :parent-uuid="metadata.parentUuid"
              :container-uuid="metadata.containerUuid"
            />
          </el-col>

          <el-col :span="6">
            <sale-transaction-field
              :uuid-form="uuidForm"
              :parent-uuid="metadata.parentUuid"
              :container-uuid="metadata.containerUuid"
              :list-options="YES_NO_OPTIONS_LIST"
            />
          </el-col>

          <el-col :span="6">
            <delivered-field
              :uuid-form="uuidForm"
            />
          </el-col>

          <el-col :span="6">
            <billing-date-field
              :uuid-form="uuidForm"
            />
          </el-col>

          <el-col :span="6">
            <grand-total-field
              :uuid-form="uuidForm"
            />
          </el-col>
        </el-row>
        <el-skeleton v-else />
      </el-form>
    </el-collapse-item>
  </el-collapse>
</template>

<script>
import { defineComponent, computed, ref } from '@vue/composition-api'

// import lang from '@/lang'
import store from '@/store'

// Constants
import {
  BUSINESS_PARTNERS_LIST_FORM,
  COLUMN_NAME
} from '@/utils/ADempiere/dictionary/field/search/businessPartner.ts'
import { YES_NO_OPTIONS_LIST } from '@/utils/ADempiere/dictionary/field/yesNo'

// Components and Mixins
import DocumentNo from './documentNoField.vue'
import Description from './descriptionField.vue'
import BusinessPartner from './businessPartner.vue'
import SaleTransactionField from './SalesTransactionField.vue'
import DeliveredField from './DeliveredField.vue'
import OrderField from './OrderField.vue'
import billingDateField from './billingDateField.vue'
import GrandTotalField from './grandTotalField.vue'

// Utils and Helper Methods
import { isEmptyValue, isSameValues } from '@/utils/ADempiere/valueUtils'

export default defineComponent({
  name: 'QueryCriteria',

  components: {
    DocumentNo,
    Description,
    BusinessPartner,
    SaleTransactionField,
    DeliveredField,
    OrderField,
    billingDateField,
    GrandTotalField
  },

  props: {
    uuidForm: {
      required: true,
      type: String
    },
    metadata: {
      type: Object,
      default: () => {
        return {
          containerUuid: BUSINESS_PARTNERS_LIST_FORM,
          columnName: COLUMN_NAME
        }
      }
    }
  },

  setup(props) {
    const isLoadingFields = ref(false)
    const ACCORDION_KEY = 'query-criteria'

    const title = computed(() => {
      let title = props.metadata.name
      if (!isEmptyValue(props.metadata.panelName) && !isSameValues(props.metadata.panelName, props.metadata.name)) {
        title += ` (${props.metadata.panelName})`
      }
      return title
    })

    const showQueryFields = computed({
      set(newValue) {
        store.commit('setOrderFieldShowQueryFields', {
          containerUuid: props.uuidForm,
          showQueryFields: newValue
        })
      },
      get() {
        return store.getters.getOrderShowQueryFields({
          containerUuid: props.uuidForm
        })
      }
    })

    const activeAccordion = computed({
      set(newValue) {
        showQueryFields.value = !isEmptyValue(newValue)
      },
      get() {
        return showQueryFields.value ? ACCORDION_KEY : null
      }
    })

    function getFields() {
      isLoadingFields.value = true
      setTimeout(() => {
        isLoadingFields.value = false
      }, 500)
    }

    getFields()

    return {
      isLoadingFields,
      ACCORDION_KEY,
      YES_NO_OPTIONS_LIST,
      //
      activeAccordion,
      title,
      getFields
    }
  }
})
</script>

<style lang="scss">
.business-partners-query-criteria {
  .business-partners-query-criteria-collapse {
    .el-form-item {
      &.el-form-item--mini {
        margin-bottom: 6px;
      }
    }
    .el-collapse-item__header {
      height: 40px;
      line-height: 40px;
    }

    .el-collapse-item__wrap {
      .el-collapse-item__content {
        padding-bottom: 5px;
      }
    }
  }
}
</style>
