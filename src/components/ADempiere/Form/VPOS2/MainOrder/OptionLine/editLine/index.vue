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
  <el-popover
    placement="right-start"
    :title="$t('form.pos.tableProduct.editQuantities')"
    width="850"
    trigger="click"
  >
    <span class="span-current-uom">
      {{ !isEmptyValue(currentUOM) }}
    </span>
    <el-row>
      <el-col :span="24">
        <el-divider>
          {{ '1 ' + editLine.uom.uom.name + ' (' + editLine.uom.uom.symbol + ') ' + ' ~ ' + displayQuantity(editLine) + ' ' + editLine.uom.product_uom.name + ' (' + editLine.uom.product_uom.symbol + ') ' }}
        </el-divider>
      </el-col>
    </el-row>
    <el-card
      shadow="never"
      :body-style="{ padding: '5px' }"
    >
      <el-form
        :inline="true"
        label-position="top"
        class="form-base"
        @submit.native.prevent="notSubmitForm"
      >
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item
              :label="$t('form.productInfo.price')"
              class="form-item-criteria"
              style="margin: 0px;width: 100%;"
            >
              <field-amount
                :value-amount="displayLineProductPriceValue({ row: editLine })"
                :value-display="displayLinePrice({ row: editLine })"
                :handle-change="updatePrice"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              :label="$t('form.pos.tableProduct.unitOfMeasure')"
              class="form-item-criteria"
              style="margin: 0px;width: 100%;"
            >
              <el-select
                v-model="valueUOM"
                @change="updateUOM"
                @visible-change="showListUOM"
              >
                <el-option
                  v-for="item in listUOM"
                  :key="item.id"
                  :label="item.uom.name"
                  :value="item.uom.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              :label="$t('form.pos.tableProduct.quantity')"
              class="form-item-criteria"
              style="margin: 0px;width: 100%;"
            >
              <field-amount
                :value-amount="Number(editLine.quantity.value)"
                :value-display="editLine.quantity.value"
                :precision="editLine.uom.uom.starndard_precision"
                :handle-change="updateQuantity"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              :label="$t('form.pos.tableProduct.basePrice')"
              class="form-item-criteria"
              style="margin: 0px;width: 100%;"
            >
              <el-input
                v-model="basePrice"
                :disabled="true"
                style="text-align-last: end !important;"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              :label="$t('form.pos.tableProduct.baseMeasurementUnit')"
              class="form-item-criteria"
              style="margin: 0px;width: 100%;"
            >
              <el-input
                v-model="editLine.uom.product_uom.name"
                style="text-align-last: end !important;"
                :disabled="true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              :label="$t('form.pos.tableProduct.baseQuantity')"
              class="form-item-criteria"
              style="margin: 0px;width: 100%;"
            >
              <el-input
                v-model="editLine.quantity_ordered.value"
                style="text-align-last: end !important;"
                :disabled="true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              :label="$t('form.pos.tableProduct.displayDiscountAmount')"
              class="form-item-criteria"
              style="margin: 0px;width: 100%;"
            >
              <field-amount
                :value-amount="Number(editLine.discount_rate.value)"
                :value-display="editLine.discount_rate.value"
                :handle-change="updateDiscount"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="$t('route.warehouse')"
              class="form-item-criteria"
              style="margin: 0px;width: 100%;"
            >
              <el-select
                v-model="valueStock"
                style="width: 100%;"
                @change="updateStock"
                @visible-change="showListStock"
              >
                <el-option
                  v-for="item in listStock"
                  :key="item.warehouse_id"
                  :label="item.warehouse_name"
                  :value="item.warehouse_id"
                >
                  <span style="float: left">{{ item.warehouse_name }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ formatQuantity({ value: item.quantity }) }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="$t('listStoreProduct.quantityOnHand')"
              class="form-item-criteria"
              style="margin: 0px;width: 100%;"
            >
              <el-input
                v-model="qtyWarehouseLine"
                style="text-align-last: end !important;"
                :disabled="true"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-button
      slot="reference"
      style="margin-left: 5px;"
      icon="el-icon-edit"
      type="success"
      size="mini"
    />
  </el-popover>
</template>

<script>
import { defineComponent, computed, ref } from '@vue/composition-api'
import lang from '@/lang'
import store from '@/store'
// Components and Mixins
import fieldAmount from '@/components/ADempiere/Form/VPOS2/MainOrder/OptionLine/editLine/fieldAmount.vue'
// Utils and Helper Methods
import { formatQuantity } from '@/utils/ADempiere/formatValue/numberFormat'
import { formatPrice } from '@/utils/ADempiere/valueFormat.js'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { displayLineProductPriceValue, displayLinePrice } from '@/utils/ADempiere/dictionary/form/VPOS'
// import { copyToClipboard } from '@/utils/ADempiere/coreUtils.js'

export default defineComponent({
  name: 'editLine',
  components: {
    fieldAmount
  },
  props: {
    editLine: {
      type: Object,
      default: () => {}
    }
  },
  setup(props) {
    const valueUOM = ref('')
    const valueStock = ref(props.editLine.warehouse.id)
    const basePrice = ref('')

    const currentLine = computed(() => {
      return store.getters.getCurrentLine
    })

    const currentPos = computed(() => {
      return store.getters.getVPOS
    })

    const listUOM = computed(() => {
      return store.getters.getListUOM({
        productId: props.editLine.product.id
      })
    })

    const listStock = computed(() => {
      return store.getters.getListStocks({
        productId: props.editLine.product.id
      })
    })

    valueUOM.value = props.editLine.uom.uom.id

    const currency = computed(() => {
      const { price_list } = store.getters.getCurrentOrder
      if (!isEmptyValue(price_list)) return price_list.currency.iso_code
      return ''
    })

    basePrice.value = formatPrice(Number(props.editLine.price_base.value), currency.value)

    const currentUOM = computed(() => {
      // const existListUOM = listUOM.value.find(uom => uom.id === valueUOM.value)
      if (isEmptyValue(listUOM.value)) {
        showListUOM(true)
        return {}
      }
      return listUOM.value
    })

    const qtyWarehouseLine = computed(() => {
      if (isEmptyValue(listStock.value)) showListStock(true)
      const stock = listStock.value.find(stock => stock.warehouse_id === valueStock.value)
      if ((stock)) {
        return formatQuantity({ value: stock.quantity })
      }
      return formatQuantity({ value: 0 })
    })

    function displayQuantity(line) {
      const { uom } = line
      const {
        divide_rate,
        multiply_rate
      } = uom
      if (Number(divide_rate.value) >= Number(multiply_rate.value)) return formatQuantity({ value: divide_rate.value })
      return formatQuantity({ value: multiply_rate.value })
    }

    function updatePrice(value) {
      const { is_modify_price } = currentPos.value
      if (!is_modify_price) {
        store.dispatch('setModalPin', {
          title: lang.t('form.pos.pinMessage.pin') + lang.t('form.pos.pinMessage.price'),
          doneMethod: () => {
            store.dispatch('updateCurrentLine', {
              lineId: currentLine.value.id,
              price: value
            })
              .then(() => {
                currentLine.value.isEditQtyEntered = false
              })
          },
          requestedAccess: 'IsModifyPrice',
          requestedAmount: value,
          isShowed: true
        })
        return
      }
      store.dispatch('updateCurrentLine', {
        lineId: props.editLine.id,
        price: value
      })
    }

    function showListStock(isVisible) {
      if (!isVisible) return
      if (
        isEmptyValue(currentLine.value) ||
        isEmptyValue(currentLine.value.id) ||
        isEmptyValue(props.editLine.id) ||
        currentLine.value.id !== props.editLine.id
      ) return
      const {
        value,
        sku,
        id
      } = props.editLine.product
      store.dispatch('findListStocks', {
        productId: id,
        value,
        sku
      })
    }

    function showListUOM(isVisible) {
      if (!isVisible) return
      if (
        isEmptyValue(currentLine.value) ||
        isEmptyValue(currentLine.value.id) ||
        isEmptyValue(props.editLine.id) ||
        currentLine.value.id !== props.editLine.id
      ) return
      store.dispatch('findListUOM', {
        productId: props.editLine.product.id
      })
    }

    function updateUOM(uom_id) {
      store.dispatch('updateCurrentLine', {
        lineId: props.editLine.id,
        uom_id
      })
    }

    function updateQuantity(quantity) {
      const { is_allows_modify_quantity } = currentPos.value
      if (!is_allows_modify_quantity) {
        store.dispatch('setModalPin', {
          title: lang.t('form.pos.pinMessage.pin') + lang.t('form.pos.pinMessage.qtyEntered'),
          doneMethod: () => {
            store.dispatch('updateCurrentLine', {
              lineId: currentLine.value.id,
              quantity
            })
              .then(() => {
                currentLine.value.isEditQtyEntered = false
              })
          },
          requestedAccess: 'IsAllowsModifyQuantity',
          requestedAmount: quantity,
          isShowed: true
        })
        return
      }
      store.dispatch('updateCurrentLine', {
        lineId: props.editLine.id,
        quantity
      })
    }

    function updateDiscount(discount_rate) {
      const { is_allows_modify_discount } = currentPos.value
      if (!is_allows_modify_discount) {
        store.dispatch('setModalPin', {
          title: lang.t('form.pos.pinMessage.pin') + lang.t('form.pos.pinMessage.qtyEntered'),
          doneMethod: () => {
            store.dispatch('updateCurrentLine', {
              lineId: currentLine.value.id,
              discount_rate
            })
              .then(() => {
                currentLine.value.isEditQtyEntered = false
              })
          },
          requestedAccess: 'IsAllowsModifyDiscount',
          requestedAmount: discount_rate,
          isShowed: true
        })
        return
      }
      store.dispatch('updateCurrentLine', {
        lineId: props.editLine.id,
        discount_rate
      })
    }

    function updateStock(warehouse_id) {
      store.dispatch('updateCurrentLine', {
        lineId: props.editLine.id,
        warehouse_id
      })
    }

    return {
      listUOM,
      valueUOM,
      currency,
      basePrice,
      listStock,
      currentUOM,
      valueStock,
      currentLine,
      currentPos,
      qtyWarehouseLine,
      updateUOM,
      formatPrice,
      updatePrice,
      showListUOM,
      updateStock,
      showListStock,
      updateQuantity,
      updateDiscount,
      formatQuantity,
      displayQuantity,
      displayLinePrice,
      displayLineProductPriceValue
    }
  }
})
</script>

<style lang="scss" scoped>
.info-value-right {
  float: right;
  margin-left: 15px;
}
.span-current-uom {
  position: absolute;
  color: transparent !important;
}
</style>
