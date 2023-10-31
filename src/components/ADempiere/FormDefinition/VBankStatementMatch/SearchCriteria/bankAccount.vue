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
  <el-form-item
    :label="$t('form.VBankStatementMatch.field.bankAccount')"
    class="form-item-criteria"
    style="width: 100%;"
    required
  >
    <el-input
      v-model="bankAccountValue"
      disabled
    />
  </el-form-item>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'

import store from '@/store'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere'

export default defineComponent({
  name: 'BankAccount',

  setup() {
    const storedBankStatement = computed(() => {
      const bankStatement = store.getters.getCurrentBankStatement
      if (isEmptyValue(bankStatement)) {
        return undefined
      }
      return bankStatement
    })

    const bankAccountValue = computed({
      get() {
        const bankStatement = storedBankStatement.value
        if (isEmptyValue(bankStatement)) {
          return undefined
        }
        return bankStatement.bankAccount.bank.name +
          ' - ' + bankStatement.bankAccount.bank.routing_no +
          '_' + bankStatement.bankAccount.account_no
      },
      set(newValue) {
        // store.commit('setBankAccountId', newValue)
      }
    })

    return {
      bankAccountValue,
      storedBankStatement
    }
  }
})
</script>
