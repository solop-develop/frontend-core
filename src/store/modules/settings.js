import variables from '@/styles/element-variables.scss'
import defaultSettings from '@/settings'
import { isEmptyValue } from '@/utils/ADempiere'

const { showSettings, tagsView, fixedHeader, showNavar, sidebarLogo, supportPinyinSearch, showContextMenu, autoSave, fullGridMode } = defaultSettings

const state = {
  theme: variables.theme,
  showSettings,
  tagsView,
  fixedHeader,
  sidebarLogo,
  supportPinyinSearch,
  showContextMenu,
  showNavar,
  autoSave: isEmptyValue(localStorage.getItem('autoSave')) ? Boolean(localStorage.getItem('autoSave')) : autoSave,
  fullGridMode,
  showMenu: true
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    if (Object.prototype.hasOwnProperty.call(state, key)) {
      localStorage.setItem(key, value)
      state[key] = value
    }
  }
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  }
}

const getters = {
  getAutoSave: (state) => {
    return !isEmptyValue(localStorage.getItem('autoSave')) ? Boolean(localStorage.getItem('autoSave')) : state.autoSave
  },
  getFullGridMode: (state) => {
    return !isEmptyValue(localStorage.getItem('fullGridMode')) ? Boolean(localStorage.getItem('fullGridMode')) : state.fullGridMode
  },
  getFixedHeader: (state) => {
    return !isEmptyValue(localStorage.getItem('fixedHeader')) ? Boolean(localStorage.getItem('fixedHeader')) : state.fixedHeader
  },
  getShowTitleForm: (state, getters) => {
    return !isEmptyValue(localStorage.getItem('ShowTitleForm')) ? Boolean(localStorage.getItem('ShowTitleForm')) : getters.getIsShowTitleForm
  },
  getShowContextMenu: (state) => {
    return !isEmptyValue(localStorage.getItem('showContextMenu')) ? Boolean(localStorage.getItem('showContextMenu')) : state.showContextMenu
  },
  getShowNavar: (state) => {
    return !isEmptyValue(localStorage.getItem('showNavar')) ? Boolean(localStorage.getItem('showNavar')) : state.showNavar
  },
  getSidebarLogo: (state) => {
    return !isEmptyValue(localStorage.getItem('sidebarLogo')) ? Boolean(localStorage.getItem('sidebarLogo')) : state.sidebarLogo
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
