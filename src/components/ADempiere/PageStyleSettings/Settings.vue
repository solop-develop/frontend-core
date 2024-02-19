<!--
  ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
  Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
  Contributor(s): Elsio Sanchez elsiosanches@gmail.com https://github.com/elsiosanchez
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
    shadow="never"
    class="custom-card-options"
    :body-style="{ padding: '5px 15px' }"
  >
    <el-descriptions
      class="class-descriptions"
      :column="1"
    >
      <el-descriptions-item
        content-class-name="setting-line"
      >
        <template slot="label">
          <b>
            {{ $t('page.settings.theme') }}
          </b>
        </template>
        <theme-picker
          style="margin-left: 5%;"
          @change="themeChange"
        />
      </el-descriptions-item>
      <el-descriptions-item
        content-class-name="setting-line"
      >
        <template slot="label">
          <b>
            {{ $t('page.settings.isShowTitle') }}
          </b>
        </template>
        <el-switch v-model="isShowTitleForm" />
        <br>
        <br>
      </el-descriptions-item>
      <el-descriptions-item
        content-class-name="setting-line"
      >
        <template slot="label">
          <b>
            {{ $t('page.settings.isShowMenu') }}
          </b>
        </template>
        <el-switch v-model="showMenu" />
        <br>
        <br>
      </el-descriptions-item>
      <el-descriptions-item
        content-class-name="setting-line"
      >
        <template slot="label">
          <b>
            {{ $t('page.settings.tagsView') }}
          </b>
        </template>
        <el-switch v-model="tagsView" />
        <br>
        <br>
      </el-descriptions-item>
      <el-descriptions-item
        content-class-name="setting-line"
      >
        <template slot="label">
          <b>
            {{ $t('page.settings.autoSave') }}
          </b>
        </template>
        <el-switch v-model="showAutoSave" />
        <br>
        <br>
      </el-descriptions-item>
      <el-descriptions-item
        content-class-name="setting-line"
      >
        <template slot="label">
          <b>
            {{ $t('page.settings.fullGridMode') }}
          </b>
        </template>
        <el-switch v-model="showFullGridMode" />
        <br>
        <br>
      </el-descriptions-item>
      <el-descriptions-item
        content-class-name="setting-line"
      >
        <template slot="label">
          <b>
            {{ $t('page.settings.sidebarLogo') }}
          </b>
        </template>
        <el-switch v-model="sidebarLogo" />
        <br>
        <br>
      </el-descriptions-item>
      <el-descriptions-item
        content-class-name="setting-line"
      >
        <template slot="label">
          <b>
            {{ $t('page.settings.showContextMenu') }}
          </b>
        </template>
        <el-switch
          v-model="showContextMenu"
          style="margin-left: 5%;"
        />
        <br>
        <br>
      </el-descriptions-item>
      <!-- <el-descriptions-item
        content-class-name="setting-line"
      >
        <template slot="label">
          <b>
            {{ $t('page.settings.mainDashboardCard') }}
          </b>
        </template>
        <el-select
          v-model="panelMain"
          size="mini"
        >
          <el-option
            v-for="item in listDashboard"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <br>
        <br>
      </el-descriptions-item> -->
      <el-descriptions-item
        content-class-name="setting-line"
      >
        <template slot="label">
          <b>
            {{ $t('page.settings.numberColumnsDashboard') }}
          </b>
        </template>
        <el-select
          v-model="colNum"
          size="mini"
        >
          <el-option
            v-for="item in numColDashboard"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <br>
        <br>
      </el-descriptions-item>
      <el-descriptions-item
        content-class-name="setting-line"
      >
        <template slot="label">
          <b>
            {{ $t('page.settings.leftPanelContent') }}
          </b>
        </template>
        <el-select
          v-model="panelRight"
          multiple
          collapse-tags
          size="mini"
          style="margin-left: 20px;"
        >
          <el-option
            v-for="item in optionsPanelRight"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <br>
        <br>
      </el-descriptions-item>
      <el-descriptions-item
        content-class-name="setting-line"
      >
        <template slot="label">
          <b>
            {{ $t('page.settings.rightPanelContent') }}
          </b>
        </template>
        <el-select
          v-model="panelLeft"
          multiple
          size="mini"
          collapse-tags
          style="margin-left: 20px;"
        >
          <el-option
            v-for="item in optionsPanelLeft"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <br>
        <br>
      </el-descriptions-item>
    </el-descriptions>
  </el-card>
</template>

<script>
import {
  defineComponent,
  computed,
  ref
} from '@vue/composition-api'

import store from '@/store'
import language from '@/lang'

// Components and Mixins
import ThemePicker from '@/components/ThemePicker'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'

export default defineComponent({
  name: 'PageStyleSettings',

  components: {
    ThemePicker
  },

  setup() {
    // Ref
    const showSettings = ref(false)
    const panelRight = computed({
      // getter
      get() {
        return store.getters['settings/getPanelRight']
      },
      // setter
      set(newValue) {
        // Note: we are using destructuring assignment syntax here.
        store.dispatch('settings/changeSetting', {
          key: 'panelRight',
          value: newValue
        })
      }
    })
    const optionsPanelRight = ref([
      {
        value: 'BC',
        label: 'Graficos Tipos Barra'
      },
      {
        value: 'LC',
        label: 'Graficos Tipos Line'
      },
      {
        value: 'notices',
        label: 'Panel de Avisos'
      }
    ])
    const panelLeft = computed({
      // getter
      get() {
        return store.getters['settings/getPanelLeft']
      },
      // setter
      set(newValue) {
        // Note: we are using destructuring assignment syntax here.
        store.dispatch('settings/changeSetting', {
          key: 'panelLeft',
          value: newValue
        })
      }
    })
    const optionsPanelLeft = ref([
      {
        value: 'PC',
        label: 'Graficos Tipos Pie'
      },
      {
        value: 'userfavorites',
        label: 'Panel de Favoritos'
      },
      {
        value: 'todo',
        label: 'Panel de Por Hacer'
      },
      {
        value: 'recentItems',
        label: 'Panel de Últimos documentos'
      }
    ])

    // Computed

    const fixedHeader = computed({
      // getter
      get() {
        return store.getters['settings/getFixedHeader']
      },
      // setter
      set(newValue) {
        // Note: we are using destructuring assignment syntax here.
        store.dispatch('settings/changeSetting', {
          key: 'fixedHeader',
          value: newValue
        })
      }
    })

    const tagsView = computed({
      // getter
      get() {
        return store.state.settings.tagsView
      },
      // setter
      set(newValue) {
        // Note: we are using destructuring assignment syntax here.
        store.dispatch('settings/changeSetting', {
          key: 'tagsView',
          value: newValue
        })
      }
    })

    const isShowTitleForm = computed({
      // getter
      get() {
        return store.getters.getIsShowTitleForm
      },
      // setter
      set(newValue) {
        // Note: we are using destructuring assignment syntax here.
        store.commit('changeShowTitleForm', newValue)
      }
    })

    const showNavar = computed({
      // getter
      get() {
        return store.getters['settings/getShowNavar']
      },
      // setter
      set(newValue) {
        // Note: we are using destructuring assignment syntax here.
        store.dispatch('settings/changeSetting', {
          key: 'showNavar',
          value: newValue
        })
      }
    })

    const showContextMenu = computed({
      // getter
      get() {
        return store.getters['settings/getShowContextMenu']
      },
      // setter
      set(newValue) {
        // Note: we are using destructuring assignment syntax here.
        store.dispatch('settings/changeSetting', {
          key: 'showContextMenu',
          value: newValue
        })
      }
    })

    const showMenu = computed({
      // getter
      get() {
        return store.state.settings.showMenu
      },
      // setter
      set(newValue) {
        // Note: we are using destructuring assignment syntax here.
        store.dispatch('app/toggleSideBar')
        store.dispatch('settings/changeSetting', {
          key: 'showMenu',
          value: newValue
        })
      }
    })

    const sidebarLogo = computed({
      // getter
      get() {
        return store.getters['settings/getSidebarLogo']
      },
      // setter
      set(newValue) {
        // Note: we are using destructuring assignment syntax here.
        store.dispatch('settings/changeSetting', {
          key: 'sidebarLogo',
          value: newValue
        })
      }
    })

    const showAutoSave = computed({
      // getter
      get() {
        return store.getters['settings/getAutoSave']
      },
      // setter
      set(newValue) {
        // Note: we are using destructuring assignment syntax here.
        store.dispatch('settings/changeSetting', {
          key: 'autoSave',
          value: newValue
        })
      }
    })

    const showFullGridMode = computed({
      // getter
      get() {
        return store.getters['settings/getFullGridMode']
      },
      // setter
      set(newValue) {
        // Note: we are using destructuring assignment syntax here.
        store.dispatch('settings/changeSetting', {
          key: 'fullGridMode',
          value: newValue
        })
      }
    })

    const panelMain = computed({
      // getter
      get() {
        return store.getters.getStoredMainDashboard.id
      },
      // setter
      set(dashboard) {
        // Note: we are using destructuring assignment syntax here.
        if (dashboard) {
          const currentDashboard = listDashboard.value.find(list => list.id === dashboard)
          store.dispatch('mainDashboard', currentDashboard)
        }
      }
    })

    const dashboardsList = computed(() => {
      return store.getters.getStoredDashboardsList
    })

    const listDashboard = computed(() => {
      const list = dashboardsList.value
      if (isEmptyValue(list)) {
        return []
      }
      if (!isEmptyValue(mainDashboard.value)) {
        const listDashboardPanel = list.filter(dashboard => {
          if (
            mainDashboard.value.id !== dashboard.id &&
            isEmptyValue(dashboard.chartType)
          ) {
            return dashboard
          }
        })
        if (isEmptyValue(listDashboardPanel.find(list => list.name === 'notices'))) {
          listDashboardPanel.push(panelNotice.value)
        }
        return listDashboardPanel
      }
      return list
    })

    const colNum = computed({
      // getter
      get() {
        return store.state.settings.colNum
      },
      // setter
      set(newValue) {
        // Note: we are using destructuring assignment syntax here.
        store.dispatch('settings/changeSetting', {
          key: 'colNum',
          value: newValue
        })
      }
    })

    const numColDashboard = ref([
      {
        value: 24,
        label: 1
      },
      {
        value: 12,
        label: 2
      },
      {
        value: 8,
        label: 3
      },
      {
        value: 6,
        label: 4
      }
    ])

    const mainDashboard = computed(() => {
      return store.getters.getStoredMainDashboard
    })

    const panelNotice = computed(() => {
      return {
        dashboardType: 'dashboard',
        fileName: 'notices',
        isCollapsible: true,
        name: language.t('profile.notice')
      }
    })

    // Methods
    function themeChange(val) {
      store.dispatch('settings/changeSetting', {
        key: 'theme',
        value: val
      })
    }

    return {
      // Ref
      panelLeft,
      panelRight,
      showSettings,
      optionsPanelLeft,
      optionsPanelRight,
      // Computed
      showFullGridMode,
      isShowTitleForm,
      showContextMenu,
      numColDashboard,
      dashboardsList,
      mainDashboard,
      listDashboard,
      showAutoSave,
      panelNotice,
      sidebarLogo,
      fixedHeader,
      showNavar,
      panelMain,
      showMenu,
      tagsView,
      colNum,
      // Methods
      themeChange
    }
  }
})
</script>

<style lang="scss">
.item-settings {
  // .p {
  margin: 5px;
  padding: 5px;
  .b {
    margin-right: 10%;
  }

  .class-descriptions {
    .el-descriptions-item {
      .el-descriptions-item__container .el-descriptions-item__content {
        display: block !important;
        text-align: end !important;
      }
    }
  }
}
.setting-line {
  display: block !important;
  text-align: end !important;
}
</style>
