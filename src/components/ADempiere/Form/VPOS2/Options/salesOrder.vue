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
  <el-row :gutter="10">
    <el-col :span="8">
      <div @click="newOrder">
        <el-card
          shadow="never"
          class="custom-card-options"
          :body-style="{ padding: '10px' }"
        >
          <p
            class="card-options-buttons"
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
          class="custom-card-options"
          :body-style="{ padding: '10px' }"
        >
          <p
            class="card-options-buttons"
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
          class="custom-card-options"
          :body-style="{ padding: '10px' }"
        >
          <p
            class="card-options-buttons"
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
          class="custom-card-options"
          :body-style="{ padding: '10px' }"
        >
          <p
            :class="isDisableClass"
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
        <span v-if="isEmptyValue(currentOrder.id)">
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
        </span>
        <div slot="reference">
          <el-card
            shadow="never"
            class="custom-card-options"
            :body-style="{ padding: '10px' }"
          >
            <p
              :class="isDisableClass"
            >
              <i class="el-icon-error" />
              <br>
              {{ $t('form.pos.optionsPoinSales.salesOrder.cancelSaleTransaction') }}
            </p>
          </el-card>
        </div>
      </el-popover>
    </el-col>
    <!-- printTicket -->
    <el-col v-if="isAllowsPrintDocument" :span="8">
      <div @click="printTicket">
        <el-card
          shadow="never"
          class="custom-card-options"
          :body-style="{ padding: '10px' }"
        >
          <p
            v-if="!isLoadingPrintTicket"
            :class="isDisableClass"
          >
            <i class="el-icon-printer" />
            <br>
            {{ $t('form.pos.optionsPoinSales.salesOrder.print') }}
          </p>
          <p
            v-else
            class="card-options-buttons"
          >
            <i class="el-icon-loading" />
            <br>
          </p>
        </el-card>
      </div>
    </el-col>
    <!-- printTicketPreviwer -->
    <el-col v-if="IsAllowsPreviewDocument" :span="8">
      <div @click="printPreview">
        <el-card
          shadow="never"
          class="custom-card-options"
          :body-style="{ padding: '10px' }"
        >
          <p
            v-if="!isLoadingPreviewDocument"
            :class="isDisableClass"
          >
            <i class="el-icon-printer" />
            <br>
            {{ $t('form.pos.optionsPoinSales.salesOrder.preview') }}
          </p>
          <p
            v-else
            class="card-options-buttons"
          >
            <i class="el-icon-loading" />
            <br>
          </p>
        </el-card>
      </div>
    </el-col>
    <!-- copyOrder -->
    <el-col v-if="IsCopyOrder" :span="8">
      <div @click="copyOrder">
        <el-card
          shadow="never"
          class="custom-card-options"
          :body-style="{ padding: '10px' }"
        >
          <p
            v-if="!isLoadingCopyOrder"
            :class="isDisableClass"
          >
            <i class="el-icon-document-copy" />
            <br>
            {{ $t('form.pos.optionsPoinSales.salesOrder.copyOrder') }}
          </p>
          <p
            v-else
            class="card-options-buttons"
          >
            <i class="el-icon-loading" />
            <br>
          </p>
        </el-card>
      </div>
    </el-col>
    <!-- cancelOrder -->
    <el-col v-if="IsCancelOrder" :span="8">
      <div @click="cancelOrder">
        <el-card
          shadow="never"
          class="custom-card-options"
          :body-style="{ padding: '10px' }"
        >
          <p
            v-if="!isLoadingCancelOrder"
            :class="isDisableClass"
          >
            <i class="el-icon-close" />
            <br>
            {{ $t('form.pos.optionsPoinSales.salesOrder.cancelOrder') }}
          </p>
          <p
            v-else
            class="card-options-buttons"
          >
            <i class="el-icon-loading" />
            <br>
          </p>
        </el-card>
      </div>
    </el-col>
    <!-- confirmShipment -->
    <el-col v-if="isConfirmShipment" :span="8">
      <div @click="confirmShipment">
        <el-card
          shadow="never"
          class="custom-card-options"
          :body-style="{ padding: '10px' }"
        >
          <p
            v-if="!isLoadingCancelOrder"
            :class="isDisableClass"
          >
            <svg-icon icon-class="shopping" />
            <br>
            {{ $t('form.pos.optionsPoinSales.salesOrder.confirmDelivery') }}
          </p>
          <p
            v-else
            class="card-options-buttons"
          >
            <i class="el-icon-loading" />
            <br>
          </p>
        </el-card>
      </div>
    </el-col>
    <!-- confirmShipmentAllProducts -->
    <el-col v-if="isConfirmShipment" :span="8">
      <div @click="confirmShipmentAllProducts">
        <el-card
          shadow="never"
          class="custom-card-options"
          :body-style="{ padding: '10px' }"
        >
          <p
            v-if="!isLoadingCancelOrder"
            :class="isDisableClass"
          >
            <svg-icon icon-class="shopping" />
            <br>
            {{ $t('form.pos.optionsPoinSales.salesOrder.deliverAllProducts') }}
          </p>
          <p
            v-else
            class="card-options-buttons"
          >
            <i class="el-icon-loading" />
            <br>
          </p>
        </el-card>
      </div>
    </el-col>
    <!-- applyDiscountOnOrder -->
    <el-col v-if="isAllowsApplyDiscount" :span="8">
      <el-popover
        v-model="isShowApplyDiscount"
        placement="bottom"
        width="350"
        :title="$t('form.pos.applyDiscountOnOrder')"
        trigger="click"
      >
        <el-row v-if="!isLoadingApplyDiscountOnOrder" :gutter="24" class="container-reverse">
          <el-col :span="24" class="container-reverse">
            <p class="container-popover">
              <b class="container-popover">
                {{ $t('form.pos.tableProduct.displayDiscountAmount') }}
              </b>
            </p>
          </el-col>
          <el-col :span="24">
            <el-input-number
              ref="applyDiscountOnOrder"
              v-model="applyDiscountAmount"
              :placeholder="$t('form.pos.tableProduct.displayDiscountAmount')"
              controls-position="right"
              :precision="2"
              autofocus
              style="text-align-last: end !important;width: 100%;"
            />
          </el-col>
          <el-col :span="24" style="text-align: end;">
            <samp class="spam-button">
              <el-button
                type="danger"
                icon="el-icon-close"
                class="button-base-icon"
                @click="closeApplyDiscount()"
              />
              <el-button
                type="primary"
                icon="el-icon-check"
                class="button-base-icon"
                :disabled="isLoadingCancelSaleTransaction"
                :loading="isLoadingCancelSaleTransaction"
                @click="applyDiscount()"
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
            class="custom-card-options"
            :body-style="{ padding: '10px' }"
          >
            <p
              :class="isDisableClass"
            >
              <i class="el-icon-document-remove" />
              <br>
              {{ $t('form.pos.applyDiscountOnOrder') }}
            </p>
          </el-card>
        </div>
      </el-popover>
    </el-col>
    <!-- applyDiscountToAllLines -->
    <el-col v-if="isAllowsApplyDiscount" :span="8">
      <el-popover
        v-model="isShowApplyDiscount"
        placement="bottom"
        width="350"
        :title="$t('form.pos.applyDiscountOnOrder')"
        trigger="click"
      >
        <el-row v-if="!isLoadingApplyDiscountOnOrder" :gutter="24" class="container-reverse">
          <el-col :span="24" class="container-reverse">
            <p class="container-popover">
              <b class="container-popover">
                {{ $t('form.pos.tableProduct.displayDiscountAmount') }}
              </b>
            </p>
          </el-col>
          <el-col :span="24">
            <el-input-number
              ref="applyDiscountOnOrder"
              v-model="applyDiscountAmount"
              :placeholder="$t('form.pos.tableProduct.displayDiscountAmount')"
              controls-position="right"
              :precision="2"
              autofocus
              style="text-align-last: end !important;width: 100%;"
            />
          </el-col>
          <el-col :span="24" style="text-align: end;">
            <samp class="spam-button">
              <el-button
                type="danger"
                icon="el-icon-close"
                class="button-base-icon"
                @click="closeApplyDiscount()"
              />
              <el-button
                type="primary"
                icon="el-icon-check"
                class="button-base-icon"
                :disabled="isLoadingCancelSaleTransaction"
                :loading="isLoadingCancelSaleTransaction"
                @click="applyDiscountAll()"
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
            class="custom-card-options"
            :body-style="{ padding: '10px' }"
          >
            <p
              :class="isDisableClass"
            >
              <i class="el-icon-document-remove" />
              <br>
              {{ $t('form.pos.applyDiscountToAllLines') }}
            </p>
          </el-card>
        </div>
      </el-popover>
    </el-col>
    <!-- Create New Order RMA -->
    <el-col v-if="isRMA" :span="8">
      <div @click="returnProduct">
        <el-card
          shadow="never"
          class="custom-card-options"
          :body-style="{ padding: '10px' }"
        >
          <p
            v-if="!isLoadingRMA"
            :class="isDisableClass"
          >
            <i class="el-icon-box" />
            <svg-icon icon-class="undo" />
            <br>
            {{ $t('form.pos.returnProduct') }}
          </p>
          <p
            v-else
            class="card-options-buttons"
          >
            <i class="el-icon-loading" />
            <br>
          </p>
        </el-card>
      </div>
    </el-col>
    <el-col v-if="isNewOrderFromRMA" :span="8">
      <div @click="newOrderRMA">
        <el-card
          shadow="never"
          class="custom-card-options"
          :body-style="{ padding: '10px' }"
        >
          <p
            v-if="!isLoadingRMA"
            :class="isDisableClass"
          >
            <i class="el-icon-document-copy" />
            <br>
            {{ $t('form.pos.optionsPoinSales.salesOrder.newOrderFromRMA') }}
          </p>
          <p
            v-else
            class="card-options-buttons"
          >
            <i class="el-icon-loading" />
            <br>
          </p>
        </el-card>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { defineComponent, computed, ref } from '@vue/composition-api'
import lang from '@/lang'
import store from '@/store'
// Components and Mixins
// import Shipments from './Shipments.vue'
// import OptionsList from './OptionsList.vue'
// import InfoOrder from './InfoOrder.vue'
// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

export default defineComponent({
  name: 'SalesOrder',
  setup() {
    const isShowCancelSaleTransaction = ref(false)
    const isShowApplyDiscount = ref(false)
    const isLoadingCancelSaleTransaction = ref(false)
    const isLoadingPrintTicket = ref(false)
    const isLoadingPreviewDocument = ref(false)
    const isLoadingCopyOrder = ref(false)
    const isLoadingCancelOrder = ref(false)
    const isLoadingRMA = ref((false))
    const isLoadingApplyDiscountOnOrder = ref(false)
    const messageReverseSales = ref('')
    const applyDiscountAmount = ref(0)

    const isShowShipment = computed({
      get() {
        return store.getters.getShowShipment
      },
      // setter
      set(show) {
        store.commit('setShowShipment', show)
      }
    })

    const currentPointOfSales = computed(() => {
      return store.getters.getVPOS
    })

    const currentOrder = computed(() => {
      return store.getters.getCurrentOrder
    })

    const isAllowsPrintDocument = computed(() => {
      const { is_allows_print_document } = currentPointOfSales.value
      return is_allows_print_document
    })

    const IsAllowsPreviewDocument = computed(() => {
      const { is_allows_preview_document } = currentPointOfSales.value
      return is_allows_preview_document
    })

    const IsCopyOrder = computed(() => {
      if (isEmptyValue(currentOrder.value)) return false
      const { document_status } = currentOrder.value
      return !['CL', 'VO', 'RE'].includes(document_status.value)
    })

    const IsCancelOrder = computed(() => {
      if (!isEmptyValue(currentOrder.value)) {
        const { document_status } = currentOrder.value
        return document_status.value !== 'CO'
      }
      return false
    })

    const isConfirmShipment = computed(() => {
      const { is_allows_confirm_shipment } = currentPointOfSales.value
      if (is_allows_confirm_shipment) {
        if (!isEmptyValue(currentOrder.value)) {
          const { document_status } = currentOrder.value
          return document_status.value === 'CO'
        }
      }
      // return false
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
    const isAllowsApplyDiscount = computed(() => {
      const { is_allows_apply_discount } = currentPointOfSales.value
      if (is_allows_apply_discount) {
        if (!isEmptyValue(currentOrder.value) && currentOrder.value.document_status.value === 'DR') return is_allows_apply_discount
        return false
      }
      return is_allows_apply_discount
    })

    const isRMA = computed(() => {
      const { is_allows_return_order } = currentPointOfSales.value
      const { is_rma } = currentOrder.value
      if (!isEmptyValue(currentOrder.value.id)) {
        return !is_rma
      }
      return is_allows_return_order
    })

    const isNewOrderFromRMA = computed(() => {
      const { is_allows_return_order } = currentPointOfSales.value
      const { is_rma } = currentOrder.value
      if (!isEmptyValue(currentOrder.value.id)) {
        return is_rma
      }
      return is_allows_return_order
    })

    const isDisableClass = computed(() => {
      if (isEmptyValue(currentOrder.value.id)) return 'is-disabled-option-card'
      return 'card-options-buttons'
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
      if (isEmptyValue(currentOrder.value.id)) return
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

    function closeApplyDiscount() {
      applyDiscountAmount.value = 0
      isShowApplyDiscount.value = false
    }

    function applyDiscount() {
      isLoadingApplyDiscountOnOrder.value = true
      store.dispatch('updateCurrentOrder', {
        discount_amount_off: applyDiscountAmount.value
      })
        .then(() => {
          isLoadingApplyDiscountOnOrder.value = false
          closeApplyDiscount()
        })
    }

    function applyDiscountAll() {
      isLoadingApplyDiscountOnOrder.value = true
      store.dispatch('updateCurrentOrder', {
        discount_rate: applyDiscountAmount.value
      })
        .then(() => {
          isLoadingApplyDiscountOnOrder.value = false
          closeApplyDiscount()
        })
    }

    function printTicket() {
      if (isEmptyValue(currentOrder.value.id)) return
      if (isLoadingPrintTicket.value) return
      isLoadingPrintTicket.value = true
      store.dispatch('printTicketVPOS', {
        orderId: currentOrder.value.id
      })
        .then(() => {
          isLoadingPrintTicket.value = false
        })
    }

    function printPreview() {
      if (isEmptyValue(currentOrder.value.id)) return
      if (isLoadingPreviewDocument.value) return
      isLoadingPreviewDocument.value = true
      store.dispatch('printPreview', {
        orderId: currentOrder.value.id
      })
        .then(() => {
          isLoadingPreviewDocument.value = false
        })
    }

    function copyOrder() {
      if (isEmptyValue(currentOrder.value.id)) return
      if (isLoadingCopyOrder.value) return
      isLoadingCopyOrder.value = true
      store.dispatch('copyOrder', {
        sourceOrderId: currentOrder.id
      })
        .then(() => {
          isLoadingCopyOrder.value = false
        })
    }

    function cancelOrder() {
      if (isEmptyValue(currentOrder.value.id)) return
      if (isLoadingCancelOrder.value) return
      isLoadingCancelOrder.value = true
      store.dispatch('deleteOrder')
        .then(() => {
          isLoadingCancelOrder.value = false
        })
    }

    function confirmShipment() {
      if (isEmptyValue(currentOrder.value.id)) return
      store.dispatch('newShipment', {})
      store.dispatch('setModalDialogVPOS', {
        title: lang.t('form.pos.optionsPoinSales.salesOrder.confirmDelivery'),
        doneMethod: () => {
          store.commit('setShowedModalDialogVPOS', {
            isShowed: false
          })
          setTimeout(() => {
            store.dispatch('setModalDialogVPOS', {
              title: lang.t('form.pos.optionsPoinSales.salesOrder.confirmDelivery'),
              doneMethod: () => {
                store.dispatch('sendProcessShipment')
              },
              isDisabledDone: () => {
                return isEmptyValue(store.getters.getCurrentShipment) || isEmptyValue(store.getters.getShipmentList)
              },
              componentPath: () => import('@/components/ADempiere/Form/VPOS2/Options/Shipments/info.vue'),
              isShowed: true
            })
          })
        },
        componentPath: () => import('@/components/ADempiere/Form/VPOS2/Options/Shipments/index.vue'),
        isShowed: true
      })
    }

    function confirmShipmentAllProducts(params) {
      if (isEmptyValue(currentOrder.value.id)) return
      store.dispatch('newShipment', {
        isCreateLinesFromOrder: true
      })
      store.dispatch('setModalDialogVPOS', {
        title: lang.t('form.pos.optionsPoinSales.salesOrder.confirmDelivery'),
        doneMethod: () => {
          store.commit('setShowedModalDialogVPOS', {
            isShowed: false
          })
          setTimeout(() => {
            store.dispatch('setModalDialogVPOS', {
              title: lang.t('form.pos.optionsPoinSales.salesOrder.confirmDelivery'),
              doneMethod: () => {
                store.dispatch('sendProcessShipment')
              },
              isDisabledDone: () => {
                return isEmptyValue(store.getters.getCurrentShipment) || isEmptyValue(store.getters.getShipmentList)
              },
              componentPath: () => import('@/components/ADempiere/Form/VPOS2/Options/Shipments/info.vue'),
              isShowed: true
            })
          })
        },
        componentPath: () => import('@/components/ADempiere/Form/VPOS2/Options/Shipments/index.vue'),
        isShowed: true
      })
    }

    function returnProduct() {
      if (isEmptyValue(currentOrder.value.id)) return
      store.dispatch('createRMA')
      store.dispatch('setModalDialogVPOS', {
        title: lang.t('form.pos.optionsPoinSales.salesOrder.newOrderFromRMA'),
        doneMethod: () => {
          store.commit('setShowedModalDialogVPOS', {
            isShowed: false
          })
          setTimeout(() => {
            store.dispatch('setModalDialogVPOS', {
              title: lang.t('form.pos.optionsPoinSales.salesOrder.newOrderFromRMA'),
              doneMethod: () => {
                store.dispatch('processRMA')
              },
              componentPath: () => import('@/components/ADempiere/Form/VPOS2/Options/RMA/previwerRMA.vue'),
              isShowed: true
            })
          })
        },
        componentPath: () => import('@/components/ADempiere/Form/VPOS2/Options/RMA'),
        isShowed: true
      })
    }

    function newOrderRMA() {
      if (isEmptyValue(currentOrder.value.id)) return
      store.dispatch('createOrderFromRMA', {
        sourceRmaId: currentOrder.value.id,
        salesRepresentativeId: currentOrder.value.sales_representative.id
      })
    }

    return {
      // Ref
      IsCopyOrder,
      isLoadingRMA,
      isLoadingCopyOrder,
      applyDiscountAmount,
      messageReverseSales,
      isShowApplyDiscount,
      isLoadingPrintTicket,
      isLoadingCancelOrder,
      isLoadingPreviewDocument,
      isShowCancelSaleTransaction,
      isLoadingApplyDiscountOnOrder,
      isLoadingCancelSaleTransaction,
      // Computed
      isRMA,
      currentOrder,
      IsCancelOrder,
      isDisableClass,
      isShowShipment,
      isNewOrderFromRMA,
      isConfirmShipment,
      isAllowsReturnOrder,
      currentPointOfSales,
      isAllowsPrintDocument,
      isAllowsApplyDiscount,
      IsAllowsPreviewDocument,
      //  Methods
      newOrder,
      copyOrder,
      listOrders,
      newOrderRMA,
      returnProduct,
      cancelOrder,
      addResource,
      printTicket,
      printPreview,
      applyDiscount,
      confirmShipment,
      applyDiscountAll,
      closeReverseSales,
      closeApplyDiscount,
      completePreparedOrder,
      cancelSaleTransaction,
      confirmShipmentAllProducts
    }
  }
})
</script>

<style lang="scss" scoped>
.card-options-buttons {
  cursor: pointer;
  text-align: center !important;
  color: black;
  min-height: 50px;
}
.custom-card-options {
  margin: 1px;
  min-height: 125px;
  max-height: 125px;
  cursor: pointer;
}
.custom-card-options:hover {
  background-color: #eaf5fe;
  border: 1px solid #36a3f7;
}
.is-disabled-option-card {
  cursor: not-allowed;
  text-align: center !important;
  color: gray !important;
  min-height: 50px;
}
</style>
