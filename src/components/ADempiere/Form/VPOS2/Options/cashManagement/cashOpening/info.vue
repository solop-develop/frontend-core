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
  <el-card
    shadow="hover"
    :body-style="{ padding: '20px' }"
    class="border-info"
  >
    <el-row>
      <el-col
        :span="24"
        style="margin-top: 0px;"
      >
        <p class="line-info">
          <b
            style="float: left"
          >
            {{ $t('form.pos.collect.collectionAgent') }}:
          </b>
          <b v-if="!isEmptyValue(collectionAgent)" style="float: left; padding-left: 10px;">
            {{ collectionAgent.name }}
          </b>
        </p>
        <p class="line-info">
          <b
            style="float: left"
          >
            {{ $t('pointOfSales.collection.field.description') }}:
          </b>
          <b style="float: left; padding-left: 10px;">
            {{ description }}
          </b>
        </p>
      </el-col>
    </el-row>
    <el-divider />
    <el-row v-if="!isEmptyValue(listPaymentsOpenst)" :gutter="10">
      <el-col
        v-for="(payment, key) in listPaymentsOpenst"
        :key="key"
        :span="8"
        style="margin: 10px 0px;"
      >
        <card-payments
          :payment="payment"
          :readonly="true"
        />
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'
import store from '@/store'
// Component and Mixins
import CardPayments from '@/components/ADempiere/Form/VPOS2/Collection/Payments/CardPayments.vue'
// Utils and Helper Methods
export default defineComponent({
  name: 'InfoCashOpening',
  components: {
    CardPayments
  },
  setup() {
    // Computed
    const collectionAgent = computed(() => {
      return store.getters.getAttributeCashOpenFields({
        attribute: 'collectionAgent'
      })
    })

    const description = computed(() => {
      return store.getters.getAttributeCashOpenFields({
        attribute: 'description'
      })
    })

    const listPaymentsOpenst = computed(() => {
      return store.getters.getCashOpeningPayments
    })

    return {
      listPaymentsOpenst,
      collectionAgent,
      description
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
  cursor: pointer;
}
.custom-card-options:hover {
  background-color: #eaf5fe;
  border: 1px solid #36a3f7;
}
.border-info {
  border: 1px solid rgb(54, 163, 247);
  border-radius: 5px;
  margin: 0px;
  padding: 0px 5px;
}
.line-info {
  width: 100%;
  display: flow-root;
  margin: 10px 0px;
}
</style>
