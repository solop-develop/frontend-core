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
  <el-card class="box-card" style="padding-left: 0px;padding-right: 0px;">
    <!-- <div slot="header" class="clearfix">
      <span
        style="float: left;padding: 0px;width: 30%;"
      >
        <el-form
          :inline="true"
          label-position="top"
          class="form-base"
          @submit.native.prevent="notSubmitForm"
        >
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
            >
              <el-option
                v-for="item in listSellers"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </span>
    </div> -->
    <el-scrollbar wrap-class="scroll-seller">
      <el-row :gutter="1">
        <el-col
          v-for="(seller, key) in listSellers"
          :key="key"
          :span="6"
        >
          <el-card
            :shadow="(!isEmptyValue(currentSeller) && seller.id === currentSeller.id) ? 'always' : 'never'"
            :class="(!isEmptyValue(currentSeller) && seller.id === currentSeller.id) ? 'custom-card-select' : 'custom-card'"
            :body-style="{ padding: '10px' }"
          >
            <div
              style="text-align: center;"
              @click="changeSeller(seller)"
            >
              <div class="image-profile">
                <el-avatar
                  shape="circle"
                  :size="100"
                  fit="fill"
                  :src="avatarResize(seller.image)"
                />
              </div>
              <div class="footer-product">
                <p class="label">
                  <b> {{ seller.name }} </b>
                </p>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-scrollbar>
  </el-card>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'
// import lang from '@/lang'
import store from '@/store'
// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere'
export default defineComponent({
  name: 'Seller',
  setup() {
    // Computed
    const listSellers = computed(() => {
      return store.getters.getListSellers
    })

    const currentSeller = computed({
      get() {
        return store.getters.getCurrentSeller
      },
      set(value) {
        store.commit('setCurrentSeller', value)
      }
    })

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

    function changeSeller(seller) {
      currentSeller.value = seller
    }

    function avatarResize(image) {
      if (isEmptyValue(image)) {
        return require('@/image/ADempiere/avatar/no-avatar.png')
      }
      return image
    }

    function remoteMethod(query) {
      store.dispatch('listAvailableSellers', query)
    }

    return {
      listSellers,
      currentSeller,
      collectionAgent,
      // Methods
      changeSeller,
      remoteMethod,
      avatarResize
    }
  }
})
</script>

<style lang="scss">
.card-options-buttons {
  cursor: pointer;
  text-align: center !important;
  color: black;
  min-height: 50px;
}
.custom-card-options {
  margin: 0px 5px;
  cursor: pointer;
}
.custom-card-options:hover {
  background-color: #eaf5fe;
  border: 1px solid #36a3f7;
}
.custom-card-select {
  margin: 1px;
  cursor: pointer;
  border: 1px solid #36a3f7;
  background: hsl(206, 100%, 87%);
}
.scroll-seller {
  max-height: 400px;
}
</style>
