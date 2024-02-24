<!--
  ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
  Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
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
  <el-collapse
    v-model="activeAccordion"
    accordion
    class="business-partners-query-criteria"
  >
    <el-collapse-item name="query-criteria" class="business-partners-query-criteria-collapse">
      <template slot="title">
        {{ title }}
      </template>

      <el-form
        label-position="top"
        size="mini"
        class="form-base"
        @submit.native.prevent="notSubmitForm"
      >
        <el-row :gutter="10">
          <el-col :span="6">
            <value-field />
          </el-col>

          <el-col :span="6">
            <contact-field />
          </el-col>

          <el-col :span="6">
            <phone-field />
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :span="6">
            <name-field />
          </el-col>

          <el-col :span="6">
            <email-field />
          </el-col>

          <el-col :span="6">
            <postal-code-field />
          </el-col>
        </el-row>
      </el-form>
    </el-collapse-item>
  </el-collapse>
</template>

<script>
import { defineComponent, computed, ref } from '@vue/composition-api'

import lang from '@/lang'

// Constants
import { BUSINESS_PARTNERS_LIST_FORM } from '@/utils/ADempiere/dictionary/field/search/businessPartner.ts'

// Components and Mixins
import ContactField from './contactField.vue'
import EmailField from './eMailField.vue'
import NameField from './nameField.vue'
import PhoneField from './phoneField.vue'
import PostalCodeField from './postalCodeField.vue'
import ValueField from './valueField.vue'

// Utils and Helper Methods
import { isEmptyValue, isSameValues } from '@/utils/ADempiere/valueUtils'

export default defineComponent({
  name: 'QueryCriteria',

  components: {
    ContactField,
    EmailField,
    NameField,
    PhoneField,
    PostalCodeField,
    ValueField
  },

  props: {
    metadata: {
      type: Object,
      default: () => {
        return {
          containerUuid: BUSINESS_PARTNERS_LIST_FORM,
          columnName: 'C_BPartner_ID'
        }
      }
    }
  },

  setup(props) {
    const activeAccordion = ref('query-criteria')

    const title = computed(() => {
      let title = lang.t('form.pos.order.BusinessPartnerCreate.businessPartner')
      if (!isEmptyValue(props.metadata.panelName) && !isSameValues(props.metadata.panelName, props.metadata.name)) {
        title += ` (${props.metadata.panelName})`
      }
      return title
    })

    return {
      activeAccordion,
      title
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
