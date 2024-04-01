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
  <el-row>
    <el-col :span="24">
      <el-card
        shadow="never"
        class="custom-card-options"
        :body-style="{ padding: '10px' }"
      >
        <el-form
          :inline="true"
          label-position="top"
          class="form-base"
          @submit.native.prevent="notSubmitForm"
        >
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item
                :label="$t('pointOfSales.collection.field.code')"
                class="form-item-criteria"
                style="margin: 0px;width: 100%;"
              >
                <el-input
                  v-model="code"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                :label="$t('pointOfSales.collection.field.typeCard.label')"
                class="form-item-criteria"
                style="margin: 0px;width: 100%;"
              >
                <el-select
                  v-model="cardType"
                  style="width: 100%;"
                  filterable
                  clearable
                >
                  <el-option
                    v-for="item in optionsList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col
              v-if="!isEmptyValue(cardType) && cardType === 1"
              :span="6"
            >
              <el-form-item
                :label="$t('pointOfSales.collection.field.bankAccountType.label')"
                class="form-item-criteria"
                style="margin: 0px;width: 100%;"
              >
                <el-select
                  v-model="accountType"
                  style="width: 100%;"
                  filterable
                  clearable
                >
                  <el-option
                    v-for="item in listBankAccountType"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                :label="$t('pointOfSales.collection.field.fullPayment')"
                class="form-item-criteria"
                style="margin: 0px;width: 100%;"
              >
                <field-amount
                  :value-amount="amount"
                  :value-display="amount"
                  :handle-change="updateAmount"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import { defineComponent, computed, ref } from '@vue/composition-api'
import store from '@/store'
import lang from '@/lang'
// Component and Mixins
import fieldAmount from '@/components/ADempiere/Form/VPOS2/MainOrder/OptionLine/editLine/fieldAmount.vue'
// Utils and Helper Methods
// import { isEmptyValue } from '@/utils/ADempiere'

export default defineComponent({
  name: 'OnlinePayments',
  components: {
    fieldAmount
  },
  setup() {
    // Ref

    const typeCard = ref(null)

    const optionsList = ref([
      {
        label: lang.t('pointOfSales.collection.field.typeCard.debit'),
        value: 1
      },
      {
        label: lang.t('pointOfSales.collection.field.typeCard.credit'),
        value: 2
      }
    ])

    const listBankAccountType = ref([
      {
        value: 1,
        label: lang.t('pointOfSales.collection.field.bankAccountType.checking')
      },
      {
        value: 2,
        label: lang.t('pointOfSales.collection.field.bankAccountType.currentAccount')
      }
    ])

    // Computed

    const amount = computed(() => {
      return store.getters.getPayAmount
    })

    const code = computed({
      get() {
        return store.getters.getAttributeFieldOnlinePayments({
          field: 'field',
          attribute: 'value'
        })
      },
      // setter
      set(value) {
        store.commit('setAttributeFieldOnlinePayments', {
          field: 'field',
          attribute: 'value',
          value
        })
      }
    })

    const accountType = computed({
      get() {
        return store.getters.getAttributeFieldOnlinePayments({
          field: 'field',
          attribute: 'accountType'
        })
      },
      // setter
      set(value) {
        store.commit('setAttributeFieldOnlinePayments', {
          field: 'field',
          attribute: 'accountType',
          value
        })
      }
    })

    const cardType = computed({
      get() {
        return store.getters.getAttributeFieldOnlinePayments({
          field: 'field',
          attribute: 'cardType'
        })
      },
      // setter
      set(value) {
        store.commit('setAttributeFieldOnlinePayments', {
          field: 'field',
          attribute: 'cardType',
          value
        })
      }
    })

    // Methods

    /**
     * Update Amount
     * @param {Number} amount
     */
    function updateAmount(amount) {
      store.commit('setPayAmount', amount)
    }

    return {
      // Ref
      typeCard,
      optionsList,
      listBankAccountType,
      // Computed
      accountType,
      cardType,
      amount,
      code,
      // Methods
      updateAmount
    }
  }
})
</script>

<style lang="scss" scoped>
.buttons-and-options {
  text-align: left;
}
.order-info {
  text-align: right;
}
</style>
