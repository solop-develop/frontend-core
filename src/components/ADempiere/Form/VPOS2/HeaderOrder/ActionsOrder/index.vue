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
  <span>
    <el-form
      label-position="top"
      class="form-min-label"
      inline
      @submit.native.prevent="notSubmitForm"
    >
      <el-form-item
        style="width: 100% !important;display: contents;"
      >
        <b slot="label" style="color: transparent !important;">
          {{ $t('form.pos.optionsPoinSales.salesOrder.newOrder') }}
        </b>
        <el-dropdown
          split-button
          type="primary"
          @click="newOrder"
          @command="selectedSearchOptions"
        >
          {{ $t('form.pos.optionsPoinSales.salesOrder.newOrder') }}
          <el-dropdown-menu slot="dropdown">
            <template v-for="(option, key) in quickOptions">
              <el-dropdown-item
                v-show="option.isShow"
                :key="key"
                :command="option"
              >
                {{ option.title }}
              </el-dropdown-item>
            </template>
          </el-dropdown-menu>
        </el-dropdown>
      </el-form-item>
    </el-form>
    <el-dialog
      v-if="!isEmptyValue(currentOptions)"
      :title="currentOptions.title"
      :visible.sync="isShowQuickOptions"
      :custom-class="'option-order-list'"
      :center="true"
      :modal="false"
      width="75%"
    >
      <!-- Filters -->
      <el-collapse v-model="activeNames">
        <el-collapse-item title="Parametros de Busqueda" name="1">
          <el-form
            :inline="true"
            label-position="top"
            class="form-base"
          >
            <el-row :gutter="20">
              <el-col :span="6">
                <el-form-item
                  label="No. del Documento"
                  class="form-item-criteria"
                  style="margin: 0px;width: 100%;"
                >
                  <el-input
                    v-model="documentNo"
                    style="margin: 0px;width: 100%;"
                    maxlength="30"
                    @input="filterdocumentNo"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item
                  label="Socio de Negocio"
                  class="form-item-criteria"
                  style="margin: 0px;width: 100%;"
                >
                  <el-select
                    v-model="businessPartner"
                    remote
                    clearable
                    filterable
                    :loading="isLoading"
                    :remote-method="remoteMethod"
                    @change="filterdocumentNo"
                  >
                    <el-option
                      v-for="item in BPartnerList"
                      :key="item.id"
                      :label="item.value + ' - ' + item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item
                  label="Fecha Desde"
                  class="form-item-criteria"
                  style="margin: 0px;width: 100%;"
                >
                  <el-date-picker
                    v-model="dateOrderedFrom"
                    type="date"
                    :picker-options="pickerOptions"
                    @change="filterDate"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item
                  label="Fecha Hasta"
                  class="form-item-criteria"
                  style="margin: 0px;width: 100%;"
                >
                  <el-date-picker
                    v-model="dateOrderedTo"
                    type="date"
                    :picker-options="pickerOptions"
                    @change="filterDate"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-collapse-item>
      </el-collapse>
      <!-- Tables Records Ordes -->
      <list-orders
        :data-list="dataListOrders"
        :search-parameters="{
          ...currentOptions.params,
          document_no: documentNo,
          business_partner_id: businessPartner,
          date_ordered_from: dateOrderedFrom,
          date_ordered_to: dateOrderedTo
        }"
      />
    </el-dialog>
  </span>
</template>

<script>
import {
  defineComponent,
  computed,
  watch,
  ref
} from '@vue/composition-api'
import store from '@/store'
import language from '@/lang'
// Components and Mixins
import ListOrders from '@/components/ADempiere/Form/VPOS2/HeaderOrder/ActionsOrder/ListOrders.vue'
// Utils and Helper Methods
import { formatDate } from '@/utils/ADempiere/formatValue/dateFormat'
import { formatPrice } from '@/utils/ADempiere/formatValue/numberFormat'
// import { isEmptyValue } from '@/utils/ADempiere'

export default defineComponent({
  name: 'tableList',
  components: {
    ListOrders
  },
  setup() {
    // Ref
    const documentNo = ref(null)
    const activeNames = ref('')
    const isLoading = ref(false)
    const BPartnerList = ref([])
    const dateOrderedTo = ref(null)
    const businessPartner = ref(null)
    const currentOptions = ref({})
    const dateOrderedFrom = ref(null)
    // Computed
    const pickerOptions = computed(() => {
      return {
        shortcuts: [
          {
            text: 'Today',
            onClick(picker) {
              picker.$emit('pick', new Date())
            }
          },
          {
            text: 'Yesterday',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', date)
            }
          },
          {
            text: 'A week ago',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', date)
            }
          }
        ]
      }
    })
    const dataListOrders = computed(() => {
      return store.getters.getOrderRecords.list
    })

    const isShowQuickOptions = computed({
      get() {
        return store.getters.getShowQuickOptions
      },
      // setter
      set(show) {
        store.commit('setShowQuickOptions', show)
      }
    })

    const allowsConfirmShipment = computed(() => {
      const { is_allows_confirm_shipment } = store.getters.getVPOS
      return is_allows_confirm_shipment
    })

    const quickOptions = computed(() => {
      return [
        {
          title: language.t('form.byInvoice.label'),
          params: {
            is_waiting_for_invoice: true
          },
          isVisible: false,
          isShow: true
        },
        {
          title: language.t('form.byInvoice.aisleSales'),
          params: {
            is_only_aisle_seller: true,
            is_waiting_for_invoice: true
          },
          isVisible: false,
          isShow: true
        },
        {
          title: language.t('form.byInvoice.toCollect'),
          params: {
            is_waiting_for_pay: true
          },
          isVisible: false,
          isShow: true
        },
        {
          title: language.t('form.byInvoice.toDeliver'),
          params: {
            is_waiting_for_shipment: true
          },
          isVisible: false,
          isShow: allowsConfirmShipment.value
        },
        {
          title: language.t('form.byInvoice.searchCompleteOrders'),
          params: {
            is_only_processed: true
          },
          isVisible: false,
          isShow: true
        },
        {
          title: language.t('form.byInvoice.proposals'),
          params: {
            is_binding_offer: true
          },
          isVisible: false,
          isShow: true
        },
        {
          title: language.t('form.byInvoice.cancelled'),
          params: {
            is_nullified: true
          },
          isVisible: false,
          isShow: true
        },
        {
          title: language.t('form.byInvoice.closed'),
          params: {
            is_closed: true
          },
          isVisible: false,
          isShow: true
        },
        {
          title: language.t('form.byInvoice.return'),
          params: {
            is_only_rma: true
          },
          isVisible: false,
          isShow: true
        }
      ]
    })
    //  Methods
    function newOrder() {
      const { is_allows_create_order } = store.getters.getVPOS
      if (!is_allows_create_order) {
        store.dispatch('setModalPin', {
          title: language.t('form.pos.pinMessage.pin') + language.t('form.pos.pinMessage.newOrder'),
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

    /**
     * Selected Search Quick Options
     * @param {object} options
     */

    function selectedSearchOptions(options) {
      currentOptions.value = options
      isShowQuickOptions.value = true
      findListOrdes()
    }

    function findListOrdes() {
      const { params } = currentOptions.value
      store.dispatch('listOrder', {
        ...params,
        document_no: documentNo.value,
        business_partner_id: businessPartner.value,
        date_ordered_from: dateOrderedFrom.value,
        date_ordered_to: dateOrderedTo.value
      })
    }

    function filterdocumentNo() {
      setTimeout(() => {
        findListOrdes()
      }, 500)
    }

    function filterDate() {
      setTimeout(() => {
        findListOrdes()
      }, 500)
    }

    function remoteMethod(search) {
      if (search !== '') {
        isLoading.value = true
        setTimeout(() => {
          BPartnerList.value = []
          store.dispatch('searchCustomersList', {
            searchValue: search
          })
            .then(response => {
              BPartnerList.value = response
              isLoading.value = false
            })
        }, 500)
      } else {
        BPartnerList.value = []
      }
    }

    watch(isShowQuickOptions, (newValue, oldValue) => {
      if (newValue && newValue !== oldValue) {
        documentNo.value = null
        businessPartner.value = null
        dateOrderedFrom.value = null
        dateOrderedTo.value = null
      }
    })

    return {
      // Ref
      isLoading,
      documentNo,
      activeNames,
      BPartnerList,
      dateOrderedTo,
      currentOptions,
      dateOrderedFrom,
      businessPartner,
      // Computed
      quickOptions,
      pickerOptions,
      dataListOrders,
      isShowQuickOptions,
      allowsConfirmShipment,
      // Methods
      newOrder,
      filterDate,
      formatDate,
      formatPrice,
      remoteMethod,
      findListOrdes,
      filterdocumentNo,
      selectedSearchOptions
    }
  }
})
</script>

<style lang="scss" scoped>
.order-info {
  float: right;
}
.total {
  border: 1px solid rgb(54, 163, 247);
  border-radius: 5px;
  margin: 0px;
}
</style>
<style lang="scss">
.option-order-list {
  padding-top: 0px !important;
  .el-dialog__body {
    padding-top: 0px !important;
  }
}
</style>
