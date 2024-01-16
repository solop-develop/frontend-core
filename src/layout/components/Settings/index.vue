<template>
  <div class="drawer-container">
    <!-- <div> -->
    <el-form label-position="top" :inline="true">
      <el-form-item
        :label="$t('page.settings.theme')"
        class="drawer-title"
      >
        <theme-picker @change="themeChange" />
      </el-form-item>
      <el-form-item
        :label="$t('page.settings.fixedHeader')"
        class="drawer-title"
      >
        <el-switch v-model="fixedHeader" />
      </el-form-item>
      <el-form-item
        :label="$t('page.settings.tagsView')"
        class="drawer-title"
      >
        <el-switch v-model="tagsView" />
      </el-form-item>
      <el-form-item
        :label="$t('page.settings.fixedHeader')"
        class="drawer-title"
      >
        <el-switch v-model="showNavar" />
      </el-form-item>
      <el-form-item
        :label="$t('page.settings.showContextMenu')"
        class="drawer-title"
      >
        <el-switch v-model="showContextMenu" />
      </el-form-item>
      <el-form-item
        :label="$t('page.settings.isShowTitle')"
        class="drawer-title"
      >
        <el-switch v-model="isShowTitleForm" />
      </el-form-item>
      <el-form-item
        :label="$t('page.settings.isShowMenu')"
        class="drawer-title"
      >
        <el-switch v-model="showMenu" />
      </el-form-item>
      <el-form-item
        :label="$t('page.settings.sidebarLogo')"
        class="drawer-title"
      >
        <el-switch v-model="sidebarLogo" />
      </el-form-item>
      <el-form-item
        :label="$t('page.settings.autoSave')"
        class="drawer-title"
      >
        <el-switch v-model="showAutoSave" />
      </el-form-item>
      <el-form-item
        :label="$t('page.settings.fullGridMode')"
        class="drawer-title"
      >
        <el-switch v-model="showFullGridMode" />
      </el-form-item>
      <el-form-item
        :label="$t('page.settings.mainDashboardCard')"
        class="drawer-title"
      >
        <el-select
          v-model="panelMain"
        >
          <el-option
            v-for="item in listDashboard"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        :label="$t('page.settings.numberColumnsDashboard')"
        class="drawer-title"
      >
        <el-select
          v-model="colNum"
        >
          <el-option
            v-for="item in numColDashboard"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <!-- </div> -->
  </div>
</template>

<script>
import { computed, ref } from '@vue/composition-api'
import language from '@/lang'
import store from '@/store'

// components and mixins
import ThemePicker from '@/components/ThemePicker'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'

export default {
  name: 'GeneralSettings',

  components: {
    ThemePicker
  },

  setup(props) {
    const activeName = ref('1')

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

    const supportPinyinSearch = computed({
      // getter
      get() {
        return store.state.settings.supportPinyinSearch
      },
      // setter
      set(newValue) {
        // Note: we are using destructuring assignment syntax here.
        store.dispatch('settings/changeSetting', {
          key: 'supportPinyinSearch',
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

    const lang = computed(() => {
      return store.getters.language
    })

    const isShowJob = computed(() => {
      return store.getters.language === 'zh'
    })

    function themeChange(val) {
      store.dispatch('settings/changeSetting', {
        key: 'theme',
        value: val
      })
    }

    function changeDisplatedTitle() {
      store.commit('changeShowTitleForm', !isShowTitleForm.value)
    }

    return {
      // data
      activeName,
      // Computed
      lang,
      colNum,
      showMenu,
      tagsView,
      isShowJob,
      panelMain,
      showNavar,
      sidebarLogo,
      fixedHeader,
      panelNotice,
      showAutoSave,
      mainDashboard,
      listDashboard,
      dashboardsList,
      showContextMenu,
      isShowTitleForm,
      numColDashboard,
      showFullGridMode,
      supportPinyinSearch,
      // methods
      themeChange,
      changeDisplatedTitle
    }
  }
}
</script>

<style lang="scss" scoped>
.drawer-container {
  padding: 0px;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;

  .drawer-title {
    margin-bottom: 17px;
    color: rgba(0, 0, 0, .85);
    font-size: 14px;
    line-height: 18px;
  }

  .drawer-item {
    color: rgba(0, 0, 0, .65);
    font-size: 14px;
    padding: 12px 0;
  }

  .drawer-switch {
    float: right
  }

  .job-link{
    display: block;
    position: absolute;
    width: 100%;
    left: 0;
    bottom: 0;
  }
}
</style>
