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
  <span>
    <!-- Show Options -->
    <el-dropdown trigger="click" class="fields-display-options" @command="handleCommand">
      <span class="el-dropdown-link">
        <svg-icon icon-class="list" />
      </span>

      <el-dropdown-menu slot="dropdown" style="max-width: 300px;">
        <el-dropdown-item
          :disabled="!isHiddenFieldsList"
          command="minimalistView"
        >
          <i class="el-icon-menu" />
          {{ $t('fieldDisplayOptions.minimalistView') }}
        </el-dropdown-item>

        <el-dropdown-item
          :disabled="!isShowFieldsWithValue"
          command="showWithValue"
        >
          <svg-icon icon-class="component" />
          {{ $t('fieldDisplayOptions.showFieldsWithValue') }}
        </el-dropdown-item>

        <el-dropdown-item
          command="showDefaultField"
        >
          <svg-icon icon-class="component" />
          {{ $t('fieldDisplayOptions.showDefaultField') }}
        </el-dropdown-item>

        <el-dropdown-item
          :disabled="!isShowFields"
          command="showAll"
        >
          <i class="el-icon-s-grid" />
          {{ $t('fieldDisplayOptions.showAllFields') }}
        </el-dropdown-item>

        <el-dropdown-item v-if="!isMobile" :command="2">
          <svg-icon :icon-class="iconColumn(2)" />
          {{ $t('fieldDisplayOptions.Show2Columns') }}
        </el-dropdown-item>
        <el-dropdown-item v-if="!isMobile" :command="3">
          <svg-icon :icon-class="iconColumn(3)" />
          {{ $t('fieldDisplayOptions.Show3Columns') }}
        </el-dropdown-item>
        <el-dropdown-item v-if="!isMobile" :command="4">
          <svg-icon :icon-class="iconColumn(4)" />
          {{ $t('fieldDisplayOptions.Show4Columns') }}
        </el-dropdown-item>
        <el-dropdown-item v-if="!isMobile" :command="'secuence'">
          <i class="el-icon-sort" />
          {{ sequenceOptionLabel }}
        </el-dropdown-item>
        <el-dropdown-item v-if="!isMobile && isShowExitSequence" :command="'exitSecuence'">
          <svg-icon icon-class="logout" />
          {{ $t('component.sequenceSort.exitNewSequence') }}
        </el-dropdown-item>
        <el-dropdown-item v-if="!isMobile && isUndo" :command="'undo'">
          <svg-icon icon-class="undo" />
          {{ $t('component.sequenceSort.undoCustomization') }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <!-- Panel User Customization -->
    <el-dialog
      :title="$t('component.sequenceSort.saveNewSequence')"
      :visible.sync="isSaveNewSequence"
    >
      <el-form :inline="true" label-position="top">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item>
              <template slot="label">
                <el-radio v-model="levelType" :label="0" :border="true" @change="getAvailableUsersList(true)">
                  {{ $t('form.workflowActivity.filtersSearch.user') }}
                </el-radio>
              </template>
              <el-select
                v-model="currentUser"
                :placeholder="$t('form.workflowActivity.filtersSearch.user')"
                :disabled="levelType !== 0"
                filterable
                @visible-change="getAvailableUsersList"
              >
                <el-option
                  v-for="item in availableUsersList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                  <span style="float: left; margin-right: 15px;">{{ item.name }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">
                    {{ isEmptyValue(item.value) ? item.description : item.value }}
                  </span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item>
              <template slot="label">
                <el-radio v-model="levelType" :label="1" :border="true" @change="getAvailableRolesList(true)">
                  {{ $t('profile.role') }}
                </el-radio>
              </template>
              <el-select
                v-model="currentRole"
                :placeholder="$t('profile.role')"
                :disabled="levelType !== 1"
                filterable
                @visible-change="getAvailableRolesList"
              >
                <el-option
                  v-for="item in availableRolesList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                  <span style="float: left; margin-right: 15px;">{{ item.name }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">
                    {{ isEmptyValue(item.value) ? item.description : item.value }}
                  </span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item>
              <template slot="label">
                <el-radio v-model="levelType" :label="2" :border="true" @change="getAvailableCustomizationsList(true)">
                  {{ $t('component.sequenceSort.customizationlevel') }}
                </el-radio>
              </template>
              <el-select
                v-model="customizationLevel"
                :placeholder="$t('component.sequenceSort.customizationlevel')"
                :disabled="levelType !== 2 "
                filterable
                @visible-change="getAvailableCustomizationsList"
              >
                <el-option
                  v-for="item in availableCustomizationsLeveList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                  <span style="float: left; margin-right: 15px;">{{ item.name }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">
                    {{ isEmptyValue(item.value) ? item.description : item.value }}
                  </span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button
          class="button-base-icon"
          type="danger"
          icon="el-icon-close"
          @click="closeModalDialog(); toggleDraggablePanel()"
        />
        <el-button
          class="button-base-icon"
          type="primary"
          icon="el-icon-check"
          @click="saveCustomization"
        />
      </span>
    </el-dialog>
  </span>
</template>

<script>
import {
  defineComponent,
  onMounted,
  computed,
  nextTick,
  watch,
  ref
} from '@vue/composition-api'

import store from '@/store'
import router from '@/router'
import language from '@/lang'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { showMessage } from '@/utils/ADempiere/notification'
import { evaluateDefaultFieldShowed } from '@/utils/ADempiere/dictionary/window.js'
import { generatePanelAndFields } from '@/utils/ADempiere/dictionary/panel.js'

// API Request Methods
import {
  requestListUsers,
  requestListRoles,
  requestListCustomizationsLevel
} from '@/api/ADempiere/user-customization'

export default defineComponent({
  name: 'FieldsDisplayOption',

  props: {
    parentUuid: {
      type: String,
      default: undefined
    },
    containerUuid: {
      type: String,
      required: true
    },
    availableFields: {
      type: Array,
      required: true
    },
    availableFieldsWithValue: {
      type: Array,
      required: true
    },
    showedFields: {
      type: Array,
      required: true
    },
    filterManager: {
      type: Function,
      default: ({ filterList }) => {}
    },
    containerManager: {
      type: Object,
      required: false
    },
    newFieldsListSecuence: {
      type: Array,
      default: () => []
    },
    fieldsCustomization: {
      type: Array,
      default: () => []
    }
  },

  setup(props) {
    /**
     * Const
     */
    const parentUuid = props.parentUuid
    const containerUuid = props.containerUuid

    /**
     * Computed
     */
    const panel = computed(() => {
      return props.containerManager.getPanel({
        parentUuid,
        containerUuid
      })
    })

    const isLoadingSaveCustomization = computed({
      set(newValue) {
        props.containerManager.changePanelAttribute({
          parentUuid,
          containerUuid,
          attributeName: 'isLoadedFieldsList',
          attributeValue: !newValue
        })
      },
      get() {
        if (isEmptyValue(panel.value)) {
          return false
        }
        const { isLoadedFieldsList } = panel.value
        return !isLoadedFieldsList
      }
    })

    const isSaveNewSequence = computed({
      set(newValue) {
        store.commit('setShowNewSequence', newValue)
      },
      get() {
        return store.getters.getShowNewSequence
      }
    })

    const currentSessionRoleId = computed(() => {
      return store.getters['user/getRole'].id
    })

    const currentSessionUserId = computed(() => {
      return store.getters['user/userInfo'].id
    })

    // enabled showed optionals and mandatory fields
    const isShowFields = computed(() => {
      return props.availableFields.length > 0 &&
        props.availableFields.length > props.showedFields.length
    })

    // enabled showed optionals with value and mandatory fields
    const isShowFieldsWithValue = computed(() => {
      return props.availableFieldsWithValue.length > 0
    })

    const isUndo = computed(() => {
      const newFieldsListSecuence = props.newFieldsListSecuence.map(field => field.sequence)
      const fieldsCustomization = props.fieldsCustomization.map(field => field.sequence)
      return JSON.stringify(newFieldsListSecuence) !== JSON.stringify(fieldsCustomization)
    })

    // enabled hidden optionals fields (only mandatory))
    const isHiddenFieldsList = computed(() => {
      return props.showedFields.length > 0 &&
        props.availableFields.length > 0
    })

    const fieldsListAvailable = computed(() => {
      return props.availableFields.map(field => {
        return field.columnName
      })
    })

    const fieldsListAvailableWithValue = computed(() => {
      return props.availableFieldsWithValue.map(field => {
        return field.columnName
      })
    })

    const currentColumnSize = computed(() => {
      return store.getters.getSizeColumn({ containerUuid })
    })

    const isMobile = computed(() => {
      return store.state.app.device === 'mobile'
    })

    const isShowSequence = computed(() => {
      if (!isEmptyValue(panel.value)) {
        const { isEditSecuence } = panel.value
        return Boolean(isEditSecuence)
      }
      return false
    })

    const sequenceOptionLabel = computed(() => {
      if (isEmptyValue(panel.value)) {
        return false
      }
      const { isEditSecuence } = panel.value
      if (!isEmptyValue(isEditSecuence) && isEditSecuence) {
        return language.t('component.sequenceSort.saveNewSequence')
      }
      return language.t('component.sequenceSort.modifyFieldSequence')
    })

    const isShowExitSequence = computed(() => {
      return sequenceOptionLabel.value === language.t('component.sequenceSort.saveNewSequence')
    })

    const panelDefault = computed(() => {
      return generatePanelAndFields({
        containerUuid,
        panelMetadata: {
          ...panel.value,
          fields: panel.value.fieldsList
        },
        fieldOverwrite: {
          isShowedFromUser: false
        },
        sortField: 'seqNoGrid',
        evaluateDefaultFieldShowed
      })
    })

    /**
     * Ref
     * @param {Number} levelType
     * @param {Number} currentUser
     * @param {Number} currentRole
     * @param {Array} availableUsersList
     * @param {Array} availableRolesList
     * @param {Boolean} isSaveNewSequence
     * @param {String} customizationLevel
     * @param {Array} availableCustomizationsLeveList
     */
    const levelType = ref(0)
    const currentUser = ref(currentSessionUserId.value)
    const currentRole = ref(currentSessionRoleId.value)
    const availableUsersList = ref([])
    const availableRolesList = ref([])
    // const isSaveNewSequence = ref(false)
    const customizationLevel = ref('')
    const availableCustomizationsLeveList = ref([])

    /**
     * Methods
     * iconColumn
     * handleCommand
     * closeModalDialog
     * saveCustomization
     * toggleDraggablePanel
     * getAvailableUsersList
     * getAvailableRolesList
     * getAvailableCustomizationsList
     */

    /**
     * Icon Column
     * @param {String} column
     */
    function iconColumn(column) {
      if (column === currentColumnSize.value) {
        return 'eye-open'
      }
      return 'eye'
    }

    /**
     * Toggle Draggable Panel
     * @param {Boolean} isDragAndDrop
     */
    function toggleDraggablePanel(isDragAndDrop = false) {
      props.containerManager.changePanelAttribute({
        parentUuid,
        containerUuid,
        attributeName: 'isEditSecuence',
        attributeValue: isDragAndDrop
      })
    }

    /**
     * Close Modal Dialog
     */
    function closeModalDialog() {
      isSaveNewSequence.value = false
    }

    /**
     * Available Users List
     * @param {Boolean} isShowList
     */
    function getAvailableUsersList(isShowList) {
      if (!isShowList) {
        return
      }
      if (!isEmptyValue(availableUsersList.value)) {
        return
      }
      requestListUsers({})
        .then(response => {
          const { records } = response
          availableUsersList.value = []
          nextTick(() => {
            availableUsersList.value = records
          })
        })
        .catch(error => {
          showMessage({
            message: error.message,
            type: 'warning'
          })
        })
    }

    /**
     * Available Roles List
     * @param {Boolean} isShowList
     */
    function getAvailableRolesList(isShowList) {
      if (!isShowList) {
        return
      }
      if (!isEmptyValue(availableRolesList.value)) {
        return
      }
      requestListRoles({})
        .then(response => {
          const { records } = response
          availableRolesList.value = []
          nextTick(() => {
            availableRolesList.value = records
          })
        })
        .catch(error => {
          showMessage({
            message: error.message,
            type: 'warning'
          })
        })
    }

    /**
     * Available Customizations List
     * @param {Boolean} isShowList
     */
    function getAvailableCustomizationsList(isShowList) {
      if (!isShowList) {
        return
      }
      if (!isEmptyValue(availableCustomizationsLeveList.value)) {
        return
      }
      requestListCustomizationsLevel({})
        .then(response => {
          const { records } = response
          availableCustomizationsLeveList.value = []
          nextTick(() => {
            availableCustomizationsLeveList.value = records
          })
        })
        .catch(error => {
          showMessage({
            message: error.message,
            type: 'warning'
          })
        })
    }

    /**
     * Save Customization
     */
    function saveCustomization() {
      let levelId
      if (levelType.value === 0) {
        levelId = currentUser.value
      } else if (levelType.value === 1) {
        levelId = currentRole.value
      } else if (levelType.value === 2) {
        levelId = customizationLevel.value
      }

      isLoadingSaveCustomization.value = true
      props.containerManager.applyCustomization({
        containerUuid: props.containerUuid,
        levelType: levelType.value,
        levelId,
        // levelUuid,
        fieldAttributes: props.fieldsCustomization
      })
        .then(response => {
          props.containerManager.changePanelAttribute({
            parentUuid,
            containerUuid,
            attributeName: 'fieldsList',
            attributeValue: props.newFieldsListSecuence
          })
          showMessage({
            message: response,
            type: 'success'
          })

          toggleDraggablePanel(false)
        })
        .catch(error => {
          showMessage({
            message: error.message,
            type: 'warning'
          })
        })
        .finally(() => {
          isLoadingSaveCustomization.value = false
        })
      closeModalDialog()
    }

    /**
     * Handle Command
     * @param {String} command
     */
    const handleCommand = (command) => {
      let fieldsShowed = []
      if (command === 'secuence') {
        if (sequenceOptionLabel.value === language.t('component.sequenceSort.modifyFieldSequence')) {
          fieldsShowed = fieldsListAvailable.value
          let isEditSecuence = false
          if (isEmptyValue(panel.value)) {
            isEditSecuence = panel.value.isEditSecuence
          }
          toggleDraggablePanel(!isEditSecuence)
          return
        }
        if (sequenceOptionLabel.value === language.t('component.sequenceSort.saveNewSequence')) {
          isSaveNewSequence.value = true
          return
        }
      }
      if (command === 'exitSecuence') {
        toggleDraggablePanel(false)
        // isLoadingSaveCustomization.value = false
        return
      }
      if (command === 'undo') {
        const currentRoute = router.app.$route
        router.replace({
          path: '/redirect' + currentRoute.fullPath
        })
        return
      }
      if (typeof command === 'number') {
        store.dispatch('changeSizeField', {
          parentUuid,
          containerUuid,
          sizeField: command
        })
        return
      }
      if (command === 'showAll') {
        fieldsShowed = fieldsListAvailable.value
      }
      if (command === 'showDefaultField') {
        const { fieldsList } = panelDefault.value
        fieldsShowed = fieldsList
          .filter(field => field.isDisplayed && field.isShowedFromUser)
          .map(field => field.columnName)
      }
      if (command === 'showWithValue') {
        fieldsShowed = fieldsListAvailableWithValue.value
      }

      props.filterManager({
        containerUuid,
        fieldsShowed,
        parentUuid,
        fieldsList: props.availableFields
      })
    }

    onMounted(() => {
      if (levelType === 0) {
        getAvailableUsersList(true)
      } else if (levelType === 1) {
        getAvailableRolesList(true)
      } else if (levelType === 2) {
        getAvailableCustomizationsList(true)
      }
    })

    watch(isSaveNewSequence, (newValue) => {
      if (newValue) {
        getAvailableUsersList(true)
        getAvailableRolesList(true)
      }
    })

    return {
      // Ref
      levelType,
      currentUser,
      currentRole,
      isSaveNewSequence,
      customizationLevel,
      availableUsersList,
      availableRolesList,
      isLoadingSaveCustomization,
      availableCustomizationsLeveList,
      // Computeds
      isShowFieldsWithValue,
      currentSessionUserId,
      currentSessionRoleId,
      sequenceOptionLabel,
      isHiddenFieldsList,
      isShowExitSequence,
      currentColumnSize,
      isShowSequence,
      isShowFields,
      panelDefault,
      isMobile,
      isUndo,
      panel,
      // Methods
      iconColumn,
      handleCommand,
      closeModalDialog,
      saveCustomization,
      toggleDraggablePanel,
      getAvailableUsersList,
      getAvailableRolesList,
      getAvailableCustomizationsList
    }
  }
})
</script>

<style scoped lang="scss">
  .fields-display-options {
    padding-left: 5px;
    font-size: 16px;
  }
</style>
