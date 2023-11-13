<!--
  ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
  Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A.www.erpya.com
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
  <!-- <el-card style="height: 100% !important;padding: 0px 10px;"> -->
  <el-collapse v-model="collapseName">
    <el-collapse-item name="info">
      <div slot="title" class="clearfix" style="text-align: center; width: 100%;">
        {{ $t('form.VBankStatementMatch.field.bankStatement') }}
        <b>
          ({{ storedBankStatement.name }} - {{ storedBankStatement.documentNo }})
        </b>
      </div>

      <el-form @submit="notSubmitForm">
        <el-col :span="12">
          <el-col :span="24">
            <el-form-item
              :label="$t('form.VBankStatementMatch.bankStatement.bankStatementDate')"
              class="form-item-criteria"
            >
              <b style="font-size: 16px;">
                {{ formatDate({
                  value: storedBankStatement.statementDate,
                  isDate: true
                }) }}
              </b>
            </el-form-item>
          </el-col>

          <!-- <el-col :span="24">
            <el-form-item
              :label="$t('form.VBankStatementMatch.bankStatement.name')"
              class="form-item-criteria"
            >
              <b style="font-size: 16px;">
                {{ storedBankStatement.name }}
              </b>
            </el-form-item>
          </el-col> -->

          <!-- <el-col :span="24">
            <el-form-item
              :label="$t('form.VBankStatementMatch.bankStatement.documentNo')"
              class="form-item-criteria"
            >
              <b style="font-size: 16px;">
                {{ storedBankStatement.documentNo }}
              </b>
            </el-form-item>
          </el-col> -->

          <el-col :span="24">
            <el-form-item
              :label="$t('form.VBankStatementMatch.bankStatement.beginningBalance')"
              class="form-item-criteria"
            >
              <b style="font-size: 16px;">
                {{ formatPrice({
                  value: storedBankStatement.beginningBalance,
                  currency: storedBankStatement.bankAccount.currency.iso_code
                }) }}
              </b>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item
              :label="$t('form.VBankStatementMatch.bankStatement.statementDifference')"
              class="form-item-criteria"
            >
              <b style="font-size: 16px;">
                {{ formatPrice({
                  value: storedBankStatement.statementDifference,
                  currency: storedBankStatement.bankAccount.currency.iso_code
                }) }}
              </b>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item
              :label="$t('form.VBankStatementMatch.bankStatement.endingBalance')"
              class="form-item-criteria"
            >
              <b style="font-size: 16px;">
                {{ formatPrice({
                  value: storedBankStatement.endingBalance,
                  currency: storedBankStatement.bankAccount.currency.iso_code
                }) }}
              </b>
            </el-form-item>
          </el-col>
        </el-col>

        <el-col :span="12">
          <el-col :span="24">
            <el-form-item
              :label="$t('form.VBankStatementMatch.bankStatement.bank')"
              class="form-item-criteria"
            >
              <b style="font-size: 16px;">
                {{ storedBankStatement.bankAccount.bank.name }}
                -
                {{ storedBankStatement.bankAccount.bank.routing_no }}
              </b>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item
              :label="$t('form.VBankStatementMatch.bankStatement.bankAccount')"
              class="form-item-criteria"
            >
              <b style="font-size: 16px;">
                {{ storedBankStatement.bankAccount.account_no_mask }}
              </b>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item
              :label="$t('form.VBankStatementMatch.bankStatement.currentBalance')"
              class="form-item-criteria"
            >
              <b style="font-size: 16px;">
                {{ formatPrice({
                  value: storedBankStatement.bankAccount.current_balance,
                  currency: storedBankStatement.bankAccount.currency.iso_code
                }) }}
              </b>
            </el-form-item>
          </el-col>
        </el-col>

      </el-form>
    </el-collapse-item>
  </el-collapse>
  <!-- </el-card> -->
</template>

<script>
import { defineComponent, computed, ref } from '@vue/composition-api'

import store from '@/store'

// Utils and Helper Methods
import { formatDate } from '@/utils/ADempiere/formatValue/dateFormat'
import { formatPrice } from '@/utils/ADempiere/formatValue/numberFormat'

export default defineComponent({
  name: 'BankStatementInfo',

  setup() {
    const collapseName = ref('info')

    const storedBankStatement = computed(() => {
      const currentValue = store.getters.getCurrentBankStatement
      return currentValue
    })

    return {
      // Refs
      collapseName,
      // Computeds
      storedBankStatement,
      // Methods
      formatDate,
      formatPrice
    }
  }
})
</script>
