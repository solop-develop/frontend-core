<template>
  <div class="drawer-container">
    <div>
      <el-form label-position="top" :inline="true">
        <el-form-item
          :label="$t('settings.theme')"
        >
          <theme-picker @change="themeChange" />
        </el-form-item>
        <el-form-item
          :label="$t('settings.fixedHeader')"
        >
          <el-switch v-model="fixedHeader" />
        </el-form-item>
        <el-form-item
          :label="$t('settings.tagsView')"
        >
          <el-switch v-model="tagsView" />
        </el-form-item>
        <el-form-item
          :label="$t('settings.fixedHeader')"
        >
          <el-switch v-model="showNavar" />
        </el-form-item>
        <el-form-item
          :label="$t('settings.showContextMenu')"
        >
          <el-switch v-model="showContextMenu" />
        </el-form-item>
        <el-form-item
          :label="$t('settings.isShowTitle')"
        >
          <el-switch v-model="isShowTitleForm" />
        </el-form-item>
        <el-form-item
          :label="$t('settings.isShowMenu')"
        >
          <el-switch v-model="showMenu" />
        </el-form-item>
        <el-form-item
          :label="$t('settings.sidebarLogo')"
        >
          <el-switch v-model="sidebarLogo" />
        </el-form-item>
        <el-form-item
          :label="$t('settings.autoSave')"
        >
          <el-switch v-model="showAutoSave" />
        </el-form-item>
        <el-form-item
          :label="$t('settings.fullGridMode')"
        >
          <el-switch v-model="showFullGridMode" />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { computed, ref } from '@vue/composition-api'

import store from '@/store'

// components and mixins
import ThemePicker from '@theme/components/ThemePicker'

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
        return store.state.settings.showNavar
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
        return store.state.settings.fixedHeader
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
        return store.state.settings.showContextMenu
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
        return store.state.settings.sidebarLogo
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
        return store.state.settings.autoSave
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
        return store.state.settings.fullGridMode
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
      isShowTitleForm,
      showNavar,
      fixedHeader,
      showMenu,
      tagsView,
      showContextMenu,
      sidebarLogo,
      supportPinyinSearch,
      showAutoSave,
      lang,
      isShowJob,
      showFullGridMode,
      // methods
      themeChange,
      changeDisplatedTitle
    }
  }
}
</script>

<style lang="scss" scoped>
.drawer-container {
  padding: 24px;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;

  .drawer-title {
    margin-bottom: 12px;
    color: rgba(0, 0, 0, .85);
    font-size: 14px;
    line-height: 22px;
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
