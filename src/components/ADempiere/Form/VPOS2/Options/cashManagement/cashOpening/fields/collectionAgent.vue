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
    :label="$t('form.pos.collect.collectionAgent')"
    class="form-item-criteria"
    style="margin: 0px;width: 100%;"
  >
    <el-select
      v-model="collectionAgent"
      style="width: 100%;"
      filterable
      clearable
      remote
      :remote-method="remoteMethod"
      @visible-change="findSeller"
    >
      <el-option
        v-for="item in listSellers"
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
  listAvailableSellers
} from '@/api/ADempiere/form/VPOS'
// Utils and Helper Methods
import { showMessage } from '@/utils/ADempiere/notification'
// import { isEmptyValue } from '@/utils/ADempiere'

export default defineComponent({
  name: 'CollectionAgent',
  props: {
    isRefund: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const listSellers = ref([])

    const collectionAgent = computed({
      get() {
        const collectionAgent = store.getters.getAttributeCashOpenFields({
          attribute: 'collectionAgent'
        })
        if (collectionAgent) return collectionAgent.id
        return ''
      },
      // setter
      set(value) {
        let collectionAgent
        if (value) {
          collectionAgent = listSellers.value.find(list => list.id === value)
        }
        store.commit('setAttributeCashOpenFields', {
          attribute: 'collectionAgent',
          value: collectionAgent
        })
      }
    })

    function findSeller(isFindOrder) {
      if (!isFindOrder) return
      const currentPos = store.getters.getVPOS
      listAvailableSellers({
        posId: currentPos.id
      })
        .then(response => {
          const { sellers } = response
          listSellers.value = sellers
        })
        .catch(error => {
          showMessage({
            message: error.message,
            type: 'error'
          })
        })
    }

    function remoteMethod(query) {
      const currentPos = store.getters.getVPOS
      listAvailableSellers({
        posId: currentPos.id,
        searchValue: query
      })
        .then(response => {
          const { sellers } = response
          listSellers.value = sellers
        })
        .catch(error => {
          showMessage({
            message: error.message,
            type: 'error'
          })
        })
    }

    return {
      collectionAgent,
      listSellers,
      // Methods
      findSeller,
      remoteMethod
    }
  }
})
</script>
