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
  <div class="field-options">
    <el-dropdown
      v-if="isMobile"
      key="options-mobile"
      :tabindex="tabIndex"
      size="mini"
      hide-on-click
      trigger="click"
      :style="'text-overflow: ellipsis; white-space: nowrap; overflow: hidden; width: 100%'"
      @command="handleCommand"
      @click="false"
    >
      <label-field
        :is-mandatory="metadata.required"
        :label="metadata.name"
        :is-field-only="metadata.isFieldOnly"
        :is-mobile="true"
        :is-button="isButton"
      />
      <el-dropdown-menu slot="dropdown" :tabindex="tabIndex">
        <template
          v-for="(option, key) in optionsList"
        >
          <el-dropdown-item
            v-if="option.enabled"
            :key="key"
            :command="option"
            divided
          >
            <label-popover-option :option="option" :is-mobile="true" />
          </el-dropdown-item>
        </template>
      </el-dropdown-menu>
    </el-dropdown>

    <!-- Desktop menu -->
    <el-menu
      v-else-if="!isMobile && (metadata.panelType !== 'form' || metadata.isEnabledOptionsFields)"
      key="options-desktop"
      mode="horizontal"
      unique-opened
      style="z-index: 0"
      :menu-trigger="triggerMenu"
      @open="handleOpen"
      @close="handleClose"
      @select="handleSelect"
    >
      <el-submenu index="menu" :tabindex="tabIndex">
        <template slot="title">
          <label-field
            :is-mandatory="metadata.required"
            :label="metadata.name"
            :is-field-only="metadata.isFieldOnly"
            :is-button="isButton"
          />
        </template>

        <el-popover
          ref="popoverOption"
          v-model="isShowedFieldOption"
          v-shortkey="shortsKey"
          placement="top"
          trigger="click"
          class="popover-field-options"
          style="padding: 0px !important; max-width: 400px"
          @shortkey.native="keyAction"
          @hide="closePopover"
        >
          <component
            :is="currentFieldOption.componentRender"
            v-if="isShowedFieldOption"
            :field-attributes="metadata"
            :field-value="valueField"
            :record-uuid="recordUuid"
            :show="isShowedFieldOption"
            :container-manager="containerManager"
          />
        </el-popover>

        <el-menu-item
          v-for="(option, key) in optionsList"
          :key="key"
          :index="option.name"
        >
          <el-button v-popover:popoverOption type="text" style="color: #606266;">
            <label-popover-option :option="option" style="display: flex;" />
          </el-button>
        </el-menu-item>
      </el-submenu>
    </el-menu>

    <span v-else key="options-form">
      <!-- label or name of field in form -->
      <label-field
        :is-mandatory="metadata.required"
        :label="metadata.name"
        :is-field-only="metadata.isFieldOnly"
        :is-button="isButton"
      />
    </span>
  </div>
</template>

<script>
import { defineComponent, computed, ref, watch, onMounted } from '@vue/composition-api'

import store from '@/store'

// Components and Mixins
import LabelField from './LabelField.vue'
import LabelPopoverOption from './LabelPopoverOption.vue'

// Utils and Helper Methods
import {
  // calculatorOptionItem,
  infoOptionItem, logsOptionItem, hideThisField,
  optionsListStandad,
  documentStatusOptionItem, translateOptionItem,
  refreshLookup, zoomInOptionItem
} from '@/components/ADempiere/FieldDefinition/FieldOptions/fieldOptionsList.js'
import { isSupportLookup } from '@/utils/ADempiere/references.js'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'

export default defineComponent({
  name: 'FieldOptions',

  components: {
    LabelField,
    LabelPopoverOption
  },

  props: {
    metadata: {
      type: Object
    },
    containerManager: {
      type: Object,
      default: () => ({})
    },
    recordUuid: {
      type: String,
      default: undefined
    }
  },

  setup(props, { root }) {
    const popoverOption = ref(null)

    const isShowedFieldOption = computed({
      get() {
        return store.getters.getIsShowFieldOption &&
          currentFieldOption.value.isRender &&
          currentFieldOption.value.fieldAttributes.id === props.metadata.id
      },
      set(isShow) {
        store.commit('setShowFieldOption', isShow)
      }
    })

    const isButton = computed(() => {
      return props.metadata.componentPath === 'FieldButton'
    })

    const showPopoverPath = ref(false)
    const triggerMenu = ref('click')
    const optionColumnName = ref(root.$route.query.fieldColumnName)

    // focus element with tab key
    const tabIndex = ref(9999)

    const isMobile = computed(() => {
      return store.state.app.device === 'mobile'
    })

    // current option field selected
    const currentFieldOption = computed({
      get() {
        return store.getters.getFieldContextMenu
      },
      set(option) {
        store.dispatch('setOptionField', option)
      }
    })

    const valueField = computed(() => {
      const { parentUuid, containerUuid, columnName } = props.metadata
      return store.getters.getValueOfFieldOnContainer({
        parentUuid,
        containerUuid,
        columnName
      })
    })

    setTimeout(() => {
      if (isMobile.value && optionColumnName.value === props.metadata.columnName) {
        store.commit('changeShowRigthPanel', true)
        store.dispatch('setOptionField', {
          fieldAttributes: props.metadata,
          name: root.$route.query.typeAction,
          valueField: valueField.value
        })
      } else {
        showPopoverPath.value = true
      }
    }, 2000)

    // TODO: Manage with panel
    // const panelContextMenu = computed(() => {
    //   return store.state.contextMenu.isShowRightPanel
    // })

    // TODO: Manage with field
    const showPanelFieldOption = computed(() => {
      return store.state.contextMenu.isShowOptionField
    })

    const labelStyle = computed(() => {
      if (props.metadata.name.length >= 25) {
        return '35'
      } else if (props.metadata.name.length >= 20) {
        return '50'
      }
      return '100'
    })

    /**
     * TODO: Manage as Document Action component
     */
    const isDocuemntStatus = computed(() => {
      if (!props.metadata.isColumnDocumentStatus) {
        return false
      }

      // if (!isEmptyValue(store.getters.getOrders)) {
      //   reutrn false
      // }

      const { parentUuid, containerUuid, columnName } = props.metadata
      const statusValue = store.getters.getValueOfField({
        parentUuid,
        containerUuid,
        columnName
      })
      if (!isEmptyValue(statusValue)) {
        return true
      }

      return false
    })

    const optionsList = computed(() => {
      const field = props.metadata
      const menuOptions = []
      // if (field.isNumericField) {
      //   menuOptions.push(calculatorOptionItem)
      // }

      // add hide this field with isShowedFromUser
      if (!field.isCustomField &&
        (field.isParent || !field.required || !isEmptyValue(field.defaultValue))
      ) {
        menuOptions.push(hideThisField)
      }

      if (field.isTranslatedField) {
        menuOptions.push(translateOptionItem)
      }
      if (isDocuemntStatus.value) {
        menuOptions.push(documentStatusOptionItem)
      }

      if (isSupportLookup(field.displayType)) {
        menuOptions.push(refreshLookup)
        if (field.reference && !isEmptyValue(field.reference.zoomWindows)) {
          menuOptions.push(zoomInOptionItem)
        }
      }

      if (field.componentPath === 'FieldButton') {
        const optionsButton = [
          infoOptionItem
        ]
        return optionsButton.concat(menuOptions)
      }

      // destruct to avoid deleting the reference to the original variable and to avoid mutating
      const optionsList = [
        ...optionsListStandad
      ]

      /**
       * Show change history only in windows
       */
      if (!(field.isCustomField || isEmptyValue(field.parentUuid))) {
        optionsList.push(logsOptionItem)
      }

      return sortOptions(optionsList.concat(menuOptions))
    })

    const openOptionField = computed({
      get() {
        const option = optionsList.value.find(option => {
          return root.$route.query.typeAction === option.name
        })
        if (!isEmptyValue(root.$route.query) && option) {
          return true
        }
        return false
      },
      set(value) {
        if (!value) {
          showPopoverPath.value = false
          /*
          router.push({
            name: root.$route.name,
            query: {
              ...root.$route.query,
              typeAction: '',
              fieldColumnName: ''
            }
          }, () => {})
          */
        }
      }
    })

    const shortsKey = computed(() => {
      return {
        close: ['esc']
      }
    })

    function keyAction(event) {
      switch (event.srcKey) {
        case 'close':
          this.closePopover()
          break
      }
    }

    const closePopover = () => {
      isShowedFieldOption.value = false
      // store.commit('changeShowRigthPanel', false)
      // store.commit('changeShowPopoverField', true)
    }

    const handleOpen = (key, keyPath) => {
      triggerMenu.value = 'hover'
    }
    const handleClose = (key, keyPath) => {
      triggerMenu.value = 'click'
    }

    /**
     * Used by mobile menu
     */
    const handleCommand = (command) => {
      store.commit('setRecordAccess', false)

      handleOptionSelected(command.name)
    }

    /**
     * Used by desktop menu
     */
    const handleSelect = (key, keyPath) => {
      handleOptionSelected(key)

      triggerMenu.value = 'hover'
    }

    const handleOptionSelected = (optionName) => {
      const option = optionsList.value.find(option => {
        return option.name === optionName
      })
      // store.dispatch('setOptionField', {
      //   ...option,
      //   valueField: valueField.value,
      //   fieldAttributes: props.metadata
      // })
      currentFieldOption.value = {
        ...option,
        valueField: valueField.value,
        fieldAttributes: props.metadata
      }

      option.executeMethod({
        containerManager: props.containerManager,
        fieldAttributes: props.metadata,
        value: valueField.value
      })

      if (isMobile.value) {
        store.commit('changeShowRigthPanel', true)
      } else {
        store.commit('changeShowOptionField', true)
        isShowedFieldOption.value = true
      }

      store.commit('changeShowPopoverField', true)
    }

    // watch(panelContextMenu, (newValue, oldValue) => {
    //   isShowedFieldOption.value = false
    // })

    watch(openOptionField, (newValue, oldValue) => {
      if (!newValue) {
        showPopoverPath.value = false
      }
    })

    function sortOptions(listOptions) {
      return listOptions.sort((a, b) => {
        return a.index - b.index
      })
    }

    onMounted(() => {
      // disable focus with tab key on label
      setTimeout(() => {
        tabIndex.value = -1
      }, 1000)
    })

    return {
      popoverOption,
      tabIndex,
      isButton,
      // computed
      currentFieldOption,
      isMobile,
      labelStyle,
      isDocuemntStatus,
      optionsList,
      openOptionField,
      isShowedFieldOption,
      valueField,
      triggerMenu,
      shortsKey,
      showPanelFieldOption,
      // methods
      closePopover,
      keyAction,
      handleClose,
      handleCommand,
      handleOpen,
      handleSelect
    }
  }
})
</script>

<style lang="scss">
.field-options {
  max-height: 30px !important;

  &.el-menu--horizontal,
  .el-menu--horizontal {
    // transparent background color of the field label
    &.el-menu {
      background: #FFF0;
    }
    &.el-menu:hover {
      background: #FFF0;
    }

    // height of the field label
    .el-submenu .el-submenu__title {
      height: 30px;
      line-height: 30px;
    }
    .el-submenu__title {
      height: 30px;
      line-height: 30px;
      // left spacing of field name
      padding: 0px;
    }
  }

  // hidde arrow icon
  .el-submenu .el-submenu__icon-arrow  {
    visibility: hidden;
  }

  // hide bottom line in label
  .el-menu.el-menu--horizontal,
  .el-submenu__title {
    border-bottom: solid 0px transparent !important;
  }
}
</style>
