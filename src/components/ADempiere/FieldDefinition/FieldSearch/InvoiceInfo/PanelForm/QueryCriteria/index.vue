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
  <el-form label-position="top" size="mini" class="form-base">
    <el-row :gutter="10">
      <el-col :span="8">
        <document-field />
      </el-col>
      <el-col :span="8">
        <business-partner-field />
      </el-col>
      <el-col :span="8">
        <sale-transaction-field />
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <description-field />
      </el-col>
      <el-col :span="8">
        <paid-field />
      </el-col>
      <el-col :span="8">
        <invoice-field />
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="12">
        <billing-date-field />
      </el-col>
      <el-col :span="12">
        <grand-total-field />
      </el-col>
    </el-row>
  </el-form>
</template>
<script>
import { defineComponent } from '@vue/composition-api'

// Components and Mixins
import DocumentField from './documentField.vue'
import BusinessPartnerField from './businessPartnerField.vue'
import SaleTransactionField from './SaleTransactionField.vue'
import PaidField from './PaidFieldInvoice.vue'
import BillingDateField from './billingDateField.vue'
import DescriptionField from './descriptionField.vue'
import InvoiceField from './InvoiceField.vue'
import GrandTotalField from './grandTotalField.vue'

export default defineComponent({
  name: 'QueryCriteria',

  components: {
    DocumentField,
    BusinessPartnerField,
    SaleTransactionField,
    PaidField,
    BillingDateField,
    DescriptionField,
    InvoiceField,
    GrandTotalField
  }
})
</script>
