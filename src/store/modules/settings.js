import variables from '@/styles/element-variables.scss'
import defaultSettings from '@/settings'
import { isEmptyValue } from '@/utils/ADempiere'
import { convertStringToBoolean } from '@/utils/ADempiere/formatValue/booleanFormat.js'

const { showSettings, tagsView, fixedHeader, showNavar, sidebarLogo, supportPinyinSearch, showContextMenu, autoSave, fullGridMode } = defaultSettings

const state = {
  theme: variables.theme,
  colNum: 8,
  showSettings,
  tagsView,
  fixedHeader: !isEmptyValue(localStorage.getItem('fixedHeader')) ? convertStringToBoolean(localStorage.getItem('fixedHeader')) : fixedHeader,
  sidebarLogo: !isEmptyValue(localStorage.getItem('sidebarLogo')) ? convertStringToBoolean(localStorage.getItem('sidebarLogo')) : sidebarLogo,
  supportPinyinSearch,
  showContextMenu: !isEmptyValue(localStorage.getItem('showContextMenu')) ? convertStringToBoolean(localStorage.getItem('showContextMenu')) : showContextMenu,
  showNavar: !isEmptyValue(localStorage.getItem('showNavar')) ? convertStringToBoolean(localStorage.getItem('showNavar')) : showNavar,
  autoSave: !isEmptyValue(localStorage.getItem('autoSave')) ? convertStringToBoolean(localStorage.getItem('autoSave')) : autoSave,
  fullGridMode: !isEmptyValue(localStorage.getItem('fullGridMode')) ? convertStringToBoolean(localStorage.getItem('fullGridMode')) : fullGridMode,
  showMenu: true,
  panelLeft: ['PC', 'userfavorites'],
  panelRight: ['BC', 'LC', 'notices']
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
    return state.autoSave
  },
  getFullGridMode: (state) => {
    return state.fullGridMode
  },
  getFixedHeader: (state) => {
    return state.fixedHeader
  },
  getShowTitleForm: (state, getters) => {
    return !isEmptyValue(localStorage.getItem('ShowTitleForm')) ? convertStringToBoolean(localStorage.getItem('ShowTitleForm')) : getters.getIsShowTitleForm
  },
  getShowContextMenu: (state) => {
    return state.showContextMenu
  },
  getShowNavar: (state) => {
    return state.showNavar
  },
  getSidebarLogo: (state) => {
    return state.sidebarLogo
  },
  getPanelLeft: (state) => {
    return state.panelLeft
  },
  getPanelRight: (state) => {
    return state.panelRight
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
