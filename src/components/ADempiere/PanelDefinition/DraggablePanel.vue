<!--
  ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
  Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
  Contributor(s): Elsio Sanchez Elsiosanches@gmail.com https://github.com/elsiosanchez
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
  <div id="tab-panel-content-from" class="wrapper" style="margin-right: 10px">
    <el-form
      label-position="top"
      label-width="200px"
      @submit.native.prevent="notSubmitForm"
    >
      <div class="cards-not-group">
        <div class="card">
          <filter-fields
            :parent-uuid="parentUuid"
            :container-uuid="containerUuid"
            :fields-list="fieldsList"
            :filter-manager="containerManager.changeFieldShowedFromUser"
            :showed-manager="containerManager.isDisplayedField"
            :fields-to-hidden="containerManager.getFieldsToHidden"
            :is-filter-records="isFilterRecords"
            :container-manager="containerManager"
            :new-fields-list-secuence="draggableList"
            :fields-customization="fieldsAttributesCustomization"
          />

          <el-card
            v-loading="isLoadingSaveCustomization"
            :shadow="shadowGroup"
            :body-style="{ padding: '5px' }"
            :class="isActiveCurrentTab ? 'custom-panel-field' : ''"
          >
            <div slot="header" class="clearfix" style="text-align: center;">
              <b>
                {{ $t('component.sequenceSort.modifyFieldSequence') }}
              </b>
            </div>
            <el-row style="padding-bottom: 15px;padding-top: 15px;">
              <draggable
                v-model="draggableList"
                class="board-column-content"
                style="overflow: auto;"
                @change="handleChange"
              >
                <field-definition
                  v-for="(element, key) in draggableList"
                  :key="key"
                  :key-field="key"
                  :parent-uuid="parentUuid"
                  :container-uuid="containerUuid"
                  :container-manager="containerManager"
                  :field-metadata="{
                    ...element,
                    isReadOnly: true,
                    readOnlyLogic: true,
                    isReadOnlyFromLogic: true
                  }"
                  :metadata-field="{
                    ...element,
                    isReadOnly: true,
                    readOnlyLogic: true,
                    isReadOnlyFromLogic: true
                  }"
                  :is-draggable="true"
                />
              </draggable>
            </el-row>
          </el-card>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import { defineComponent, computed, ref, watch } from '@vue/composition-api'

import store from '@/store'

// Components and Mixins
import FieldDefinition from '@/components/ADempiere/FieldDefinition/index.vue'
import FilterFields from '@/components/ADempiere/FilterFields/index.vue'
import draggable from 'vuedraggable'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { sortFields } from '@/utils/ADempiere/dictionary/panel'
import { convertBooleanToString } from '@/utils/ADempiere/formatValue/booleanFormat'

export default defineComponent({
  name: 'DraggablePanel',

  components: {
    FieldDefinition,
    FilterFields,
    draggable
  },

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
    panelMetadata: {
      type: Object,
      default: () => {}
    },
    isFilterRecords: {
      type: Boolean,
      default: false
    },
    isAdvancedQuery: {
      type: Boolean,
      default: false
    }
  },

  setup(props) {
    const draggableList = ref([])

    const isActiveCurrentTab = computed(() => {
      if (
        !isEmptyValue(props.panelMetadata.name) &&
        !isEmptyValue(store.getters.getContainerInfo) &&
        !isEmptyValue(store.getters.getContainerInfo.currentTab.name) &&
        (store.getters.getContainerInfo.currentTab.name === props.panelMetadata.name)
      ) {
        return true
      }
      return false
    })

    const isLoadingSaveCustomization = computed(() => {
      const { isLoadedFieldsList } = props.containerManager.getPanel({
        parentUuid: props.parentUuid,
        containerUuid: props.containerUuid
      })
      return !isLoadedFieldsList
    })

    const fieldsList = computed(() => {
      if (!isEmptyValue(props.panelMetadata) && !isEmptyValue(props.panelMetadata.fieldsList)) {
        return props.panelMetadata.fieldsList
      }

      if (!isEmptyValue(props.containerManager) && props.containerManager.getFieldsList) {
        const fields = props.containerManager.getFieldsList({
          parentUuid: props.parentUuid,
          containerUuid: props.containerUuid
        })
        if (!isEmptyValue(fields)) {
          return fields
        }
      }

      return []
    })

    const draggableFieldsList = computed({
      get() {
        const list = fieldsList.value.map(recordField => {
          return {
            ...recordField,
            isChangeSecuence: false
          }
        }).filter(fieldItem => {
          return props.containerManager.isDisplayedField(fieldItem)
        })
        return sortFields({
          fieldsList: list,
          orderBy: sortColumnName.value
        })
      },
      set(newFieldsList) {
        return sortFields({
          fieldsList: newFieldsList,
          orderBy: sortColumnName.value
        })
      }
    })

    const sortColumnName = computed(() => {
      return props.panelMetadata.sortOrderColumnName
    })

    const isMobile = computed(() => {
      return store.state.app.device === 'mobile'
    })

    const shadowGroup = computed(() => {
      if (isMobile.value) {
        return 'never'
      }
      return 'hover'
    })

    function handleChange(params) {
      const actionsList = Object.keys(params)
      const action = actionsList.at() // get property
      movedItem(params[action])
    }

    function movedItem({ element, oldIndex, newIndex }) {
      const orderColumn = sortColumnName.value
      element.isChangeSecuence = true

      let indexEnabledSequence = 0
      const dataSequence = draggableList.value.map(itemSequence => {
        if (newIndex > oldIndex) {
          // moved to down
          if (itemSequence.uuid === element.uuid) {
            itemSequence[orderColumn] = (newIndex + 1) * 10
            return itemSequence
          }
          if (indexEnabledSequence >= oldIndex && indexEnabledSequence < newIndex) {
            itemSequence[orderColumn] = (indexEnabledSequence + 1) * 10
          }
        } else {
          // moved to up
          if (itemSequence.uuid === element.uuid) {
            itemSequence[orderColumn] = (newIndex + 1) * 10
            return itemSequence
          }
          if (indexEnabledSequence < oldIndex && indexEnabledSequence >= newIndex) {
            itemSequence[orderColumn] += 10
          }
        }
        indexEnabledSequence++
        return itemSequence
      })

      // always reorder
      // sortSequence
      const sortedFieldsList = sortFields({
        fieldsList: dataSequence,
        orderBy: orderColumn
      })
      draggableList.value = sortedFieldsList
      draggableFieldsList.value = sortedFieldsList
    }

    const heightPanel = computed(() => {
      const main = document.getElementById('mainWindow')
      if (
        !isEmptyValue(main) &&
        !isEmptyValue(main.clientHeight)
      ) {
        return main.clientHeight + 200 + 'px'
      }
      return 500 + 'px'
    })

    const styleScrollPanelTab = computed(() => {
      if (props.panelMetadata.isParentTab) {
        const isFullScreenTabsParent = store.getters.getStoredWindow(props.panelMetadata.parentUuid).isFullScreenTabsParent
        if (isFullScreenTabsParent) {
          return {
            'max-height': '550px',
            'min-height': '150px',
            'overflow-x': 'hidden'
          }
        }
        return {
          'max-height': '650px!important;',
          'min-height': '150px',
          'overflow-x': 'hidden'
        }
      }
      return {
        'max-height': '550px',
        'min-height': '250px',
        'overflow-x': 'hidden'
      }
    })

    // draggableFieldsList.value = fieldsList.value.map(recordField => {
    //   return {
    //     ...recordField,
    //     isChangeSecuence: false
    //   }
    // })

    const fieldsAttributesCustomization = computed(() => {
      return draggableFieldsList.value.map(fieldItem => {
        return {
          id: fieldItem.id,
          uuid: fieldItem.uuid,
          columnName: fieldItem.columnName,
          sequencePanel: fieldItem[sortColumnName.value],
          isDefaultDisplayedAsPanel: convertBooleanToString(fieldItem.isShowedFromUser, true)
        }
      })
    })

    watch(draggableFieldsList, (newValue, oldValue) => {
      draggableList.value = newValue
    })
    draggableList.value = draggableFieldsList.value

    return {
      draggableFieldsList,
      draggableList,
      //
      fieldsAttributesCustomization,
      fieldsList,
      isLoadingSaveCustomization,
      sortColumnName,
      // oldFieldsList,
      shadowGroup,
      heightPanel,
      styleScrollPanelTab,
      isMobile,
      isActiveCurrentTab,
      // methods
      handleChange
    }
  }
})
</script>

<style>
.el-card {
  width: 100% !important;
}
.el-tabs--border-card > .el-tabs__content {
  padding: 15px;
  overflow: auto;
  height: 92%;
  padding-top: 5px;
  padding-right: 15px;
  padding-bottom: 0px;
  padding-left: 15px;
}
.scroll-tab-panel-conten {
  max-height: 500px;
  min-height: 150px;
  overflow-x: hidden;
}
.scroll-tab-child-panel-conten {
  max-height: 300px;
  min-height: 200px;
  overflow-x: hidden;
}
</style>
<style scoped>
.custom-panel-field {
  margin: 1px;
  cursor: pointer;
  border: 1px solid #36a3f7;
}
.custom-panel-field:hover {
  background: transparent !important;
  border: 1px solid #36a3f7;
}
</style>
<style lang="scss">
.el-col {
  .sortable-chosen {
    border: 1px solid #f73650;
  }
}
</style>
