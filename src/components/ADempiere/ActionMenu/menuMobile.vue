<!--
  ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
  Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
  Contributor(s): Edwin Betancourt EdwinBetanc0urt@outlook.com https://github.com/EdwinBetanc0urt
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
  <div :class="isClassOptions">
    <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      style="display: block;width: -webkit-fill-available;"
      @select="runAction"
    >
      <span
        v-for="(action, index) in actionsList"
        :key="index"
      >
        <span v-if="isEmptyValue(action.childs)">
          <el-menu-item
            :key="index"
            :index="action.actionName"
            :disabled="!action.enabled({
              root: $root,
              parentUuid,
              containerUuid,
              containerManager
            })"
          >
            <b>
              <svg-icon
                v-if="action.isSvgIcon || action.svg === true"
                :icon-class="action.icon"
                style="font-size: 18;color: black;"
              />
              <i
                v-else
                :class="action.icon"
                style="font-size: 18;color: black;"
              />
            </b>
            <b class="label">
              {{ action.name }}
            </b>
          </el-menu-item>
        </span>
        <span v-else>
          <el-submenu
            :index="action.actionName"
            style="padding-left: 20px;"
            :disabled="!action.enabled({
              root: $root,
              parentUuid,
              containerUuid,
              containerManager
            })"
          >
            <template slot="title">
              <b>
                <svg-icon
                  v-if="action.isSvgIcon || action.svg === true"
                  :icon-class="action.icon"
                  style="font-size: 18"
                />
                <i
                  v-else
                  :class="action.icon"
                  style="font-size: 18"
                />
              </b>
              <b class="label">
                {{ action.name }}
              </b>
            </template>
            <el-menu-item
              v-for="(actionChild, key) in action.childs"
              :key="key"
              :index="action.actionName"
              style="padding-left: 15px;"
            >
              <b>
                <svg-icon
                  v-if="actionChild.isSvgIcon || actionChild.svg === true"
                  :icon-class="actionChild.icon"
                  style="font-size: 18"
                />
                <i
                  v-else
                  :class="actionChild.icon"
                  style="font-size: 18"
                />
              </b>
              <b class="label">
                {{ actionChild.name }}
              </b>
            </el-menu-item>
          </el-submenu>
        </span>
      </span>
    </el-menu>
  </div>
</template>

<script>
import { computed, defineComponent } from '@vue/composition-api'

import lang from '@/lang'
import store from '@/store'

// Utils and Helper Methods
import { isEmptyValue, getTypeOfValue } from '@/utils/ADempiere/valueUtils'

export default defineComponent({
  name: 'menuMobile',

  props: {
    parentUuid: {
      type: [String, Number],
      default: undefined
    },
    containerUuid: {
      type: [String, Number],
      required: true
    },
    containerManager: {
      type: Object,
      required: true
    },
    actionsManager: {
      type: Object,
      default: () => {},
      required: true
    }
  },

  setup(props, { root }) {
    const currentTab = computed(() => {
      return store.getters.getContainerInfo.currentTab
    })

    const {
      containerUuid,
      tableName
    } = currentTab.value

    const isMobile = computed(() => {
      return store.getters.device === 'mobile'
    })

    const size = computed(() => {
      if (isMobile.value) {
        return 'mini'
      }
      return 'small'
    })

    const instanceUuid = root.$route.params.instanceUuid
    // set initial value
    const actionsList = computed(() => {
      if (props.actionsManager && props.actionsManager.getActionList) {
        return props.actionsManager.getActionList()
      }
      return []
    })

    const isWithDefaultAction = computed(() => {
      return !props.actionsManager.withoutDefaulAction
    })

    const recordUuid = computed(() => {
      return store.getters.getUuidOfContainer(containerUuid)
    })

    const isWithRecord = computed(() => {
      return !isEmptyValue(recordUuid.value) && recordUuid.value !== 'create-new'
    })

    const isUndoAction = computed(() => {
      if (!isEmptyValue(tableName)) {
        if (!isWithRecord.value) {
          return true
        }
      }
      return false
    })

    const defaultActionToRun = computed(() => {
      if (isUndoAction.value) {
        return actionsList.value.at(1)
      }
      return actionsList.value.at()
    })

    const defaultActionName = computed(() => {
      if (!isEmptyValue(props.actionsManager.defaultActionName)) {
        if (getTypeOfValue(props.actionsManager.defaultActionName) === 'FUNCTION') {
          return props.actionsManager.defaultActionName()
        }
        return props.actionsManager.defaultActionName
      }
      if (!isEmptyValue(actionsList.value)) {
        return actionsList.value.at().name
      }
      return lang.t('actionMenu.runProcess')
    })

    const isClassOptions = computed(() => {
      const { isShowedTableRecords } = store.getters.getStoredTab(
        props.parentUuid,
        props.containerUuid
      )
      if (isShowedTableRecords) return 'auxiliary-menu auxiliary-menu-mobile-table'
      return 'auxiliary-menu auxiliary-menu-mobile'
    })

    /**
     * Run default action with last parameters
     */
    function runDefaultAction() {
      if (isWithDefaultAction.value) {
        runAction(defaultActionToRun.value)
      }
    } // end runAction

    /**
     * Run selected action
     * @param {object} action
     */
    function runAction(action) {
      const currentAction = actionsList.value.find(list => list.actionName === action)
      const { actionName } = currentAction
      currentAction[actionName]({
        root,
        parentUuid: currentTab.value.parentUuid,
        containerUuid: currentTab.value.containerUuid,
        tableName: currentTab.value.tableName,
        instanceUuid,
        containerManager: props.containerManager,
        recordUuid: recordUuid.value,
        uuid: currentAction.uuid,
        currentTab: currentTab.value
      })
      store.commit('setShowMenuMobile', false)
    }

    /**
     * Index SpactabAttributese
     */

    function indexSpace(index, menuList) {
      return index === (menuList - 1)
    }

    return {
      currentTab,
      //
      size,
      isMobile,
      actionsList,
      isClassOptions,
      defaultActionName,
      isWithDefaultAction,
      // methods
      runAction,
      indexSpace,
      runDefaultAction
    }
  }
})
</script>

<style lang="scss">
.auxiliary-menu {
  z-index: 1;

  .el-dropdown-menu {
    &.el-popper {
      max-height: 250px;
      overflow: auto;
    }

    max-height: 250px;
    overflow: auto;
  }
}

.auxiliary-menu-mobile {
  height: 39px !important;
  right: 0%;
  top: 0;
  display: flex;
}

.auxiliary-menu-mobile-table {
  height: 39px !important;
  position: absolute;
  right: 28px;
  top: 5px;
}

.scroll-child {
  // max-height: 30px;
  overflow-x: hidden;
}
.el-dropdown .el-button-group {
  display: inline-flex !important;
}
</style>

<style scoped lang="scss" src="./common-style.scss">
</style>
<style scoped lang="scss">
.action-container {
  .el-button-group {
    display: inline-flex;
  }
}

.action-dropdown-menu {
  .auxiliary-menu-icon {
    margin-right: 4px !important;

    >i {
      font-size: 18px;
    }
  }

  // height, and font size of the prefix icons of menu items
  .el-dropdown-menu__item {
    line-height: 17px;
    padding: 0 17px;
    padding-left: 10px !important;
    display: grid;
    font-size: 14px;

    // additional space on top of the first item in the list
    // &:first-child {
    //   margin-top: 10px;
    // }
    // additional space on bottom of the last item in the list
    &:last-child {
      margin-bottom: 10px;
    }
  }
}
</style>
<style lang="scss">
.action-container {
  &.without-defualt-action {
    .el-button {
      padding-left: 5px;
      padding-right: 8px;
    }
  }

  .el-button-group {
    // light blue style of the first section of the menu button
    // >.el-button::first-child {
    >.el-button:not(:last-child) {
      :not(.without-defualt-action) {
        min-width: 105px;
      }
      font-weight: bold;
      // margin-right: -1px;
      color: #0080ff;
      border-color: #0080ff;
      background: #ecf5ff;
    }

    // light blue style of the drop down menu section
    .el-button--primary:last-child {
      // margin-right: 2px;
      color: #0080ff;
      border-color: #0080ff;
      background: #e6f1fd;
      border-left-color: #000000 !important;
    }

    // dark blue style when pointing to the menu
    .el-button--primary:hover {
      background: #1890ff;
      border-color: #1890ff;
      color: #FFFFFF;
    }
    // background: #c4cbd1;
  }
}
</style>
