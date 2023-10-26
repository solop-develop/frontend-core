<!--
ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
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
  <el-row :gutter="5">
    <el-col :span="8">
      <div @click="newOrder">
        <el-card
          shadow="never"
          class="custom-card"
          :body-style="{ padding: '10px' }"
        >
          <p
            style="cursor: pointer; text-align: center !important; color: black;min-height: 50px;"
          >
            <i class="el-icon-news" />
            <br>
            {{ $t('form.pos.optionsPoinSales.salesOrder.newOrder') }}
          </p>
        </el-card>
      </div>
    </el-col>
    <el-col :span="8">
      <div @click="listOrders">
        <el-card
          shadow="never"
          class="custom-card"
          :body-style="{ padding: '10px' }"
        >
          <p
            style="cursor: pointer; text-align: center !important; color: black;min-height: 50px;"
          >
            <i class="el-icon-news" />
            <br>
            {{ $t('form.pos.optionsPoinSales.salesOrder.ordersHistory') }}
          </p>
        </el-card>
      </div>
    </el-col>
    <el-col :span="8">
      <div @click="addResource">
        <el-card
          shadow="never"
          class="custom-card"
          :body-style="{ padding: '10px' }"
        >
          <p
            style="cursor: pointer; text-align: center !important; color: black;min-height: 50px;"
          >
            <i class="el-icon-news" />
            <br>
            {{ $t('timeControl.addResource') }}
          </p>
        </el-card>
      </div>
    </el-col>
    <!-- completePreparedOrder -->
    <el-col :span="8">
      <div @click="completePreparedOrder">
        <el-card
          shadow="never"
          class="custom-card"
          :body-style="{ padding: '10px' }"
        >
          <p
            style="cursor: pointer; text-align: center !important; color: black;min-height: 50px;"
          >
            <i class="el-icon-success" />
            <br>
            {{ $t('form.pos.optionsPoinSales.salesOrder.completePreparedOrder') }}
          </p>
        </el-card>
      </div>
    </el-col>
    <!-- cancelSaleTransaction -->
    <el-col v-if="isAllowsReturnOrder" :span="8">
      <el-popover
        v-model="isShowCancelSaleTransaction"
        placement="bottom"
        width="400"
        trigger="click"
      >
        <el-row v-if="!isLoadingCancelSaleTransaction" :gutter="24" class="container-reverse">
          <el-col :span="24" class="container-reverse">
            <p class="container-popover">
              <b class="container-popover">
                {{ $t('data.addDescription') }}
              </b>
            </p>
          </el-col>
          <el-col :span="24">
            <el-input
              v-model="messageReverseSales"
              type="textarea"
              :rows="2"
              :placeholder="$t('data.addDescription')"
              style=""
            />
          </el-col>
          <el-col :span="24" style="text-align: end;">
            <samp class="spam-button">
              <el-button
                type="danger"
                icon="el-icon-close"
                class="button-base-icon"
                @click="closeReverseSales()"
              />
              <el-button
                type="primary"
                icon="el-icon-check"
                class="button-base-icon"
                :disabled="isLoadingCancelSaleTransaction"
                :loading="isLoadingCancelSaleTransaction"
                @click="cancelSaleTransaction()"
              />
            </samp>
          </el-col>
        </el-row>
        <div
          v-else
          key="form-loading"
          v-loading="isLoadingCancelSaleTransaction"
          :element-loading-text="$t('notifications.loading')"
          :element-loading-spinner="'el-icon-loading'"
          element-loading-background="rgba(255, 255, 255, 0.8)"
          class="view-loading"
        />
        <div slot="reference">
          <el-card
            shadow="never"
            class="custom-card"
            :body-style="{ padding: '10px' }"
          >
            <p
              style="cursor: pointer; text-align: center !important; color: black;min-height: 50px;"
            >
              <i class="el-icon-error" />
              <br>
              {{ $t('form.pos.optionsPoinSales.salesOrder.cancelSaleTransaction') }}
            </p>
          </el-card>
        </div>
      </el-popover>
    </el-col>
  </el-row>
</template>

<script>
import { defineComponent, computed, ref } from '@vue/composition-api'
import lang from '@/lang'
import store from '@/store'
// Components and Mixins
// import ButtonGroupOptions from './ButtonGroupOptions.vue'
// import OptionsList from './OptionsList.vue'
// import InfoOrder from './InfoOrder.vue'
// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

export default defineComponent({
  name: 'SalesOrder',
  setup() {
    const isShowCancelSaleTransaction = ref(false)
    const isLoadingCancelSaleTransaction = ref(false)
    const messageReverseSales = ref('')

    const currentPointOfSales = computed(() => {
      return store.getters.getVPOS
    })

    const currentOrder = computed(() => {
      return store.getters.getCurrentOrder
    })

    const isAllowsReturnOrder = computed(() => {
      const { is_allows_return_order } = currentPointOfSales.value
      if (is_allows_return_order) {
        // const { document_status } = currentOrder.value
        if (!isEmptyValue(currentOrder.value) && currentOrder.value.document_status.value === 'CO') return true
        return false
      }
      return is_allows_return_order
    })

    function newOrder() {
      const {
        is_allows_create_order
      } = currentPointOfSales.value
      if (!is_allows_create_order) {
        store.dispatch('setModalPin', {
          title: lang.t('form.pos.pinMessage.pin') + lang.t('form.pos.pinMessage.newOrder'),
          doneMethod: () => {
            store.dispatch('newOrder')
          },
          requestedAccess: 'IsAllowsCreateOrder',
          isShowed: true
        })
        return
      }
      store.dispatch('newOrder')
    }

    function listOrders() {
      console.info('Unsupported method')
    }

    function addResource() {
      console.info('Unsupported method')
    }

    function completePreparedOrder() {
      store.dispatch('process', {})
    }

    function cancelSaleTransaction() {
      isLoadingCancelSaleTransaction.value = true
      store.dispatch('reverseSales', {
        description: messageReverseSales.value
      })
        .then(() => {
          isLoadingCancelSaleTransaction.value = false
          messageReverseSales.value = ''
        })
    }

    function closeReverseSales() {
      messageReverseSales.value = ''
      isShowCancelSaleTransaction.value = false
    }

    return {
      // Ref
      messageReverseSales,
      isShowCancelSaleTransaction,
      isLoadingCancelSaleTransaction,
      // Computed
      currentOrder,
      currentPointOfSales,
      isAllowsReturnOrder,
      //  Methods
      newOrder,
      listOrders,
      addResource,
      closeReverseSales,
      completePreparedOrder,
      cancelSaleTransaction
    }
  }
})
</script>
