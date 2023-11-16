<!--
ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A.
Contributor(s): Elsio Sanchez elsiosanchez15@outlook.com https://github.com/elsiosanchez
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
    :label="$t('form.pos.collect.isCashWith')"
    class="form-item-criteria"
    style="margin: 0px;width: 100%;"
  >
    <el-select
      v-model="cashBank"
      style="width: 100%;"
      @visible-change="findSeller"
    >
      <el-option
        v-for="item in listCash"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      />
    </el-select>
  </el-form-item>
</template>

<script>
import { computed, defineComponent, ref } from '@vue/composition-api'
import store from '@/store'
// API Request Methods
import {
  listAvailableCash
} from '@/api/ADempiere/form/VPOS'
// Utils and Helper Methods
import { showMessage } from '@/utils/ADempiere/notification'
// import { isEmptyValue } from '@/utils/ADempiere'

export default defineComponent({
  name: 'CashBank',
  props: {
    isRefund: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const listCash = ref([])

    const cashBank = computed({
      get() {
        const collectionAgent = store.getters.getAttributeCashOpenFields({
          attribute: 'cashBank'
        })
        if (collectionAgent) return collectionAgent.id
        return ''
      },
      // setter
      set(value) {
        let cash
        if (value) {
          cash = listCash.value.find(list => list.id === value)
        }
        store.commit('setAttributeCashOpenFields', {
          attribute: 'cashBank',
          value: cash
        })
      }
    })

    function findSeller(isFindOrder) {
      if (!isFindOrder) return
      const currentPos = store.getters.getVPOS
      listAvailableCash({
        posId: currentPos.id
      })
        .then(response => {
          const { cash } = response
          listCash.value = cash
        })
        .catch(error => {
          showMessage({
            message: error.message,
            type: 'error'
          })
        })
    }

    return {
      cashBank,
      listCash,
      // Methods
      findSeller
    }
  }
})
</script>
