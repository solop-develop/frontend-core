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
  <el-container
    class="v-pos"
  >
    <el-aside :width="widthAside" class="panel-options">
      <el-card
        shadow="never"
      >
        <options
          v-if="isShowOptions"
        />
        <el-button
          v-if="!isShowOptions"
          circle
          type="primary"
          :icon="iconsButtons"
          class="buttons-options"
          @click="isShowOptions = !isShowOptions"
        />
      </el-card>
    </el-aside>
    <el-main class="panel-main">
      <el-header style="height: auto !important;margin-bottom: 10px;">
        <header-order />
        <!-- {{ 'Header Order' }} -->
      </el-header>
      <el-main style="padding: 0px 20px;">
        <main-order />
        <dialog-info />
        <modal-pin />
        <el-drawer
          title="Cobranza"
          :visible.sync="showCollection"
          :with-header="false"
          :before-close="handleClose"
          size="50%"
        >
          <collection
            key="collection-component"
          />
        </el-drawer>
      </el-main>
      <el-footer style="height: auto !important;padding-top: 5px;">
        <footer-order />
      </el-footer>
    </el-main>
  </el-container>
</template>

<script>
import { defineComponent, computed, watch } from '@vue/composition-api'

// import lang from '@/lang'
import store from '@/store'
// import router from '@/router'
// Component and Mixins
import HeaderOrder from './HeaderOrder'
import MainOrder from './MainOrder'
import FooterOrder from './FooterOrder'
import Collection from './Collection'
import DialogInfo from './DialogInfo'
import ModalPin from './DialogInfo/pin.vue'
import Options from './Options'
// Utils and Helper Methods
// import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

export default defineComponent({
  name: 'NewVPOS',
  components: {
    HeaderOrder,
    MainOrder,
    ModalPin,
    FooterOrder,
    Collection,
    Options,
    DialogInfo
  },
  setup() {
    store.dispatch('searchPointOfSaleData')

    const showCollection = computed({
      get() {
        return store.getters.getOpenCollection
      },
      // setter
      set(show) {
        if (show) {
          store.dispatch('getListPayments')
        }
        store.commit('setShowCollection', show)
      }
    })

    const iconsButtons = computed(() => {
      if (isShowOptions.value) return 'el-icon-arrow-left'
      return 'el-icon-arrow-right'
    })

    const widthAside = computed(() => {
      if (isShowOptions.value) return '30%'
      return '2%'
    })

    const isShowOptions = computed({
      get() {
        return store.getters.getShowOptions
      },
      // setter
      set(show) {
        store.commit('setShowOptions', show)
      }
    })

    function handleClose() {
      showCollection.value = false
    }

    watch(showCollection, (newValue, oldValue) => {
      if (newValue) store.dispatch('getListPayments')
    })

    return {
      showCollection,
      isShowOptions,
      iconsButtons,
      widthAside,
      handleClose
    }
  }
})
</script>

<style lang="scss" scoped>
.v-pos {
  height: 90% !important;
  .buttons-and-options {
    text-align: left;
  }
  .order-info {
    text-align: right;
  }
}
.buttons-options {
  position: absolute;
  top: 45%;
}
.panel-options {
  padding: 0px;
}
.panel-main {
  padding-left: 0px;
}
</style>
