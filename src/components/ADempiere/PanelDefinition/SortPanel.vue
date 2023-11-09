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
  <div class="sort-panel-container">
    <div class="sort-panel-header">
      <el-input
        v-model="searchValue"
        :placeholder="$t('component.sequenceSort.disableWithSearch')"
        clearable
      >
        <svg-icon
          slot="append"
          icon-class="search"
        />
      </el-input>
    </div>

    <div :class="classBoard">
      <div
        class="kanban todo"
        header-text="Todo"
      >
        <div class="board-column" :style="isMobile ? 'max-width: 500px;overflow: auto;' : ''">
          <div class="board-column-header">
            {{ $t('component.sequenceSort.available') }} ({{ availableListShowed.length }})
          </div>

          <draggable
            v-model="availableListShowed"
            :group="group"
            v-bind="dragOptions"
            class="board-column-content"
            :handle="handleSequence"
            :style="draggableStyle"
          >
            <div
              v-for="(element, index) in availableListShowed"
              :key="index"
              :disabled="isDifferentClientRecord"
              :class="{ 'board-item': true, 'board-item-edit': element.isEditRow }"
            >
              <span v-if="isMobile" class="handle">
                <svg-icon icon-class="drag" />
              </span>
              <b>#{{ element[sortColumnName] }}</b>
              {{ element.DisplayColumn }}

              <i
                :disabled="isDifferentClientRecord"
                class="el-icon-circle-plus-outline sort-add-item-icon"
                @click="addAtItem({ element, oldIndex: index })"
              />
            </div>
          </draggable>
        </div>
      </div>

      <div
        class="kanban working"
        header-text="Working"
      >
        <div class="board-column" :style="isMobile ? 'width: 100%;overflow: auto;margin: 0px;padding: 0px;' : ''">
          <div class="board-column-header" :style="isMobile ? 'width: 105%;' : ''">
            {{ $t('component.sequenceSort.sequence') }} ({{ sequenceListShowed.length }})
          </div>

          <draggable
            v-model="sequenceListShowed"
            :group="group"
            v-bind="dragOptions"
            class="board-column-content"
            :style="draggableStyle"
            :handle="handleSequence"
            @change="handleChange"
          >
            <div
              v-for="(element, index) in sequenceListShowed"
              :key="index"
              :disabled="isDifferentClientRecord"
              :class="{ 'board-item': true, 'board-item-edit': element.isEditRow }"
            >
              <span v-if="isMobile" class="handle">
                <svg-icon icon-class="drag" />
              </span>
              <b>#{{ element[sortColumnName] }}</b>
              {{ element.DisplayColumn }}

              <i
                :disabled="isDifferentClientRecord"
                class="el-icon-circle-close sort-remove-item-icon"
                @click="removeAtItem({ element, oldIndex: index })"
              />
            </div>
          </draggable>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed, ref } from '@vue/composition-api'

import store from '@/store'

// Components and Mixins
import draggable from 'vuedraggable'

// Constants
import { CLIENT } from '@/utils/ADempiere/constants/systemColumns'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

/**
 * Order or sequence panel based on the functionality of the `org.compiere.grid.VSortTab`
 * @see https://github.com/adempiere/adempiere/blob/develop/client/src/org/adempiere/controller/SortTabController.java
 * @see https://github.com/adempiere/adempiere/blob/develop/client/src/org/compiere/grid/VSortTab.java
 * TODO: Add discartAtElementChange event to discard only current row
 */
export default defineComponent({
  name: 'SortPanel',

  components: {
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
    }
  },

  setup(props) {
    const group = ref('sequence')
    const searchValue = ref('')

    /**
     * Get the panel object with all its attributes as well as
     * the fields it contains
     */
    const panelMetadata = computed(() => {
      return props.containerManager.getPanel({
        parentUuid: props.parentUuid,
        containerUuid: props.containerUuid
      }) || {}
    })

    const includedColumnName = computed(() => {
      return panelMetadata.value.sortYesNoColumnName
    })

    const sortColumnName = computed(() => {
      return panelMetadata.value.sortOrderColumnName
    })

    const isMobile = computed(() => {
      return store.getters.device === 'mobile'
    })

    const classBoard = computed(() => {
      if (isMobile.value) return 'board-mobile'
      return 'board'
    })

    const draggableStyle = computed(() => {
      if (isMobile.value) return 'max-height: 240px; overflow: auto;min-height: 220px;margin-top: 10px'
      return 'max-height: 450px; overflow: auto;'
    })

    const handleSequence = computed(() => {
      if (isMobile.value) return '.handle'
      return ''
    })

    const recordsList = computed({
      get() {
        const list = store.getters.getTabSequenceRecordsList({
          parentUuid: props.parentUuid,
          containerUuid: props.containerUuid,
          tabUuid: panelMetadata.value.uuid,
          contextColumnNames: panelMetadata.value.contextColumnNames
        })

        return generateOrder(list)
      },
      set(newList) {
        store.commit('setTabSequence', {
          parentUuid: props.parentUuid,
          contextColumnNames: panelMetadata.value.contextColumnNames,
          tabUuid: panelMetadata.value.uuid,
          recordsList: newList
        })
      }
    })

    const oldRecordsList = computed(() => {
      return store.getters.getTabSequenceOldRecordsList({
        parentUuid: props.parentUuid,
        containerUuid: props.containerUuid,
        tabUuid: panelMetadata.value.uuid,
        contextColumnNames: panelMetadata.value.contextColumnNames
      })
    })

    const availableList = computed({
      get() {
        return recordsList.value.filter(item => {
          return !item[includedColumnName.value]
        })
      },
      set(value) {
      }
    })

    const availableListShowed = computed({
      get() {
        if (isEmptyValue(searchValue.value)) {
          return availableList.value
        }
        return availableList.value.filter(item => {
          return item.DisplayColumn.includes(searchValue.value)
        })
      },
      set(value) {
      }
    })

    const sequenceList = computed({
      get() {
        return recordsList.value.filter(item => {
          return item[includedColumnName.value]
        })
      },
      set(value) {
      }
    })

    const sequenceListShowed = computed({
      get() {
        if (isEmptyValue(searchValue.value)) {
          return sequenceList.value
        }
        return sequenceList.value.filter(item => {
          return item.DisplayColumn.toUpperCase().includes(
            searchValue.value.toUpperCase()
          )
        })
      },
      set(value) {
      }
    })

    const isDifferentClientRecord = computed(() => {
      // client id value of record
      const clientIdRecord = store.getters.getValueOfField({
        parentUuid: props.parentUuid,
        containerUuid: props.containerUuid,
        columnName: CLIENT
      })
      // evaluate client id context with record
      const sessionClientId = store.getters.getSessionContextClientId

      return clientIdRecord !== sessionClientId
    })

    const dragOptions = computed(() => {
      return {
        disabled: !isEmptyValue(searchValue.value) || isDifferentClientRecord.value
      }
    })

    function generateOrder(arrayToSort, orderBy = sortColumnName.value) {
      return arrayToSort.sort((itemA, itemB) => {
        return itemA[orderBy] - itemB[orderBy]
      })
    }

    function getOldRow(uuid) {
      const oldRow = oldRecordsList.value.find(oldSequenceItem => {
        return oldSequenceItem.UUID === uuid
      })
      return {
        ...oldRow
      }
    }

    function isChanged({ oldRow, newRow }) {
      const oldYesNo = oldRow[includedColumnName.value]
      const newYesNo = newRow[includedColumnName.value]
      // included column is changed
      if (oldYesNo !== newYesNo) {
        return true
      }

      const oldSequence = oldRow[sortColumnName.value]
      const newSequence = newRow[sortColumnName.value]
      // sequence is changed
      if (oldSequence !== newSequence) {
        return true
      }

      return false
    }

    /**
     * @param {number} newIndex: the index of the added element
     * @param {object} element: the added element
     */
    function insertItem({ element, newIndex }) {
      const includedColumn = includedColumnName.value
      const orderColumn = sortColumnName.value

      // if added to the end of the list does not require reordering
      const isRequireSort = (newIndex + 1) <= sequenceList.value.length

      const newSequence = (newIndex + 1) * 10
      element[includedColumn] = true // !element[includedColumn]
      element[orderColumn] = newSequence

      const dataSequence = recordsList.value.map(itemSequence => {
        if (itemSequence.UUID === element.UUID) {
          const oldRow = getOldRow(itemSequence.UUID)
          element.isEditRow = isChanged({
            oldRow,
            newRow: element
          })
          return element
        }
        if (newSequence <= itemSequence[orderColumn]) {
          itemSequence[orderColumn] = itemSequence[orderColumn] + 10
          const oldRow = getOldRow(itemSequence.UUID)
          itemSequence.isEditRow = isChanged({
            newRow: itemSequence,
            oldRow
          })
        }
        return itemSequence
      })

      let sortSequence = dataSequence
      if (isRequireSort) {
        sortSequence = generateOrder(dataSequence)
      }
      recordsList.value = sortSequence
    }

    /**
     * Add current element on sequence working
     * @param {object} element: the removed element
     * @param {number} oldIndex: the index of the element before remove
     */
    function addAtItem({ element, oldIndex }) {
      if (isDifferentClientRecord.value) {
        // is another customer does not change
        return
      }
      const newIndex = sequenceList.value.length
      insertItem({
        element,
        newIndex
      })
    }

    /**
     * @param {number} newIndex: the current index of the moved element
     * @param {number} oldIndex: the old index of the moved element
     * @param {object} element: the moved element
     */
    function movedItem({ element, oldIndex, newIndex }) {
      const includedColumn = includedColumnName.value
      const orderColumn = sortColumnName.value

      let indexEnabledSequence = 0
      const dataSequence = recordsList.value.map(itemSequence => {
        if (!itemSequence[includedColumn]) {
          itemSequence[orderColumn] = 0
          return itemSequence
        }

        if (newIndex > oldIndex) {
          // moved to down
          if (itemSequence.UUID === element.UUID) {
            itemSequence[orderColumn] = (newIndex + 1) * 10
            const oldRow = getOldRow(itemSequence.UUID)
            itemSequence.isEditRow = isChanged({
              newRow: itemSequence,
              oldRow
            })
            return itemSequence
          }
          if (indexEnabledSequence >= oldIndex && indexEnabledSequence < newIndex) {
            itemSequence[orderColumn] = (indexEnabledSequence + 1) * 10
            const oldRow = getOldRow(itemSequence.UUID)
            itemSequence.isEditRow = isChanged({
              newRow: itemSequence,
              oldRow
            })
          }
        } else {
          // moved to up
          if (itemSequence.UUID === element.UUID) {
            itemSequence[orderColumn] = (newIndex + 1) * 10
            const oldRow = getOldRow(itemSequence.UUID)
            itemSequence.isEditRow = isChanged({
              newRow: itemSequence,
              oldRow
            })
            return itemSequence
          }
          if (indexEnabledSequence < oldIndex && indexEnabledSequence >= newIndex) {
            itemSequence[orderColumn] += 10
            const oldRow = getOldRow(itemSequence.UUID)
            itemSequence.isEditRow = isChanged({
              newRow: itemSequence,
              oldRow
            })
          }
        }
        indexEnabledSequence++
        return itemSequence
      })

      // always reorder
      const sortSequence = generateOrder(dataSequence)
      recordsList.value = sortSequence
    }

    /**
     * @param {number} oldIndex: the index of the element before remove
     * @param {object} element: the removed element
     */
    function deleteItem({ element, oldIndex }) {
      const includedColumn = includedColumnName.value
      const orderColumn = sortColumnName.value

      const oldSequence = element[orderColumn] // (oldIndex + 1) * 10

      // if the last in the list is removed, no reordering is required
      const isRequireSort = (oldIndex + 1) < sequenceList.value.length

      const dataSequence = recordsList.value.map(itemSequence => {
        if (itemSequence.UUID === element.UUID) {
          itemSequence[includedColumn] = false // !itemSequence[includedColumn]
          itemSequence[orderColumn] = 0
          const oldRow = getOldRow(itemSequence.UUID)
          itemSequence.isEditRow = isChanged({
            newRow: itemSequence,
            oldRow
          })
          return itemSequence
        }

        if (itemSequence[orderColumn] > oldSequence && itemSequence[orderColumn] > 0) {
          itemSequence[orderColumn] = itemSequence[orderColumn] - 10

          const oldRow = getOldRow(itemSequence.UUID)
          itemSequence.isEditRow = isChanged({
            newRow: itemSequence,
            oldRow
          })
        }

        return itemSequence
      })

      let sortSequence = dataSequence
      if (isRequireSort) {
        sortSequence = generateOrder(dataSequence)
      }
      recordsList.value = sortSequence
    }

    /**
     * Remove current element
     * @param {object} element: the removed element
     * @param {number} oldIndex: the index of the element before remove
     */
    function removeAtItem({ element, oldIndex }) {
      if (isDifferentClientRecord.value) {
        // is another customer does not change
        return
      }
      deleteItem({
        element,
        oldIndex
      })
    }

    /**
     * Handle events with drag and drop
     * @link https://github.com/SortableJS/Vue.Draggable#events
     */
    function handleChange(value) {
      const actionsList = Object.keys(value)
      const action = actionsList.at() // get property
      switch (action) {
        case 'added':
          insertItem(value[action])
          break
        case 'moved':
          movedItem(value[action])
          break
        case 'removed':
          deleteItem(value[action])
          break
      }
    }

    return {
      group,
      // computeds
      dragOptions,
      isMobile,
      classBoard,
      handleSequence,
      panelMetadata,
      draggableStyle,
      includedColumnName,
      isDifferentClientRecord,
      searchValue,
      sortColumnName,
      sequenceList,
      sequenceListShowed,
      availableList,
      availableListShowed,
      // methods
      handleChange,
      addAtItem,
      removeAtItem
    }
  }
})
</script>

<style lang="scss" scoped>
  .board-column {
    min-width: 250px;
    min-height: 70px;
    height: auto;
    overflow: hidden;
    background: #f0f0f0;
    border-radius: 3px;

    .board-column-header {
      height: 50px;
      line-height: 50px;
      overflow: hidden;
      padding: 0 20px;
      text-align: center;
      background: #333;
      color: #fff;
      border-radius: 3px 3px 0 0;
    }

    .board-column-content {
      height: auto;
      overflow: hidden;
      border: 10px solid transparent;
      min-height: 60px;
      display: flex;
      justify-content: flex-start;
      flex-direction: column;
      align-items: center;
      padding-left: 5px;
      padding-right: 5px;

      .board-item {
        cursor: pointer;
        width: 100%;
        display: block;
        height: -webkit-fill-available;
        margin: 5px 0;
        background-color: #fff;
        text-align: left;
        line-height: 30px;
        padding: 0px 10px;
        box-sizing: border-box;
        box-shadow: 0px 1px 3px 0 rgba(0, 0, 0, 0.2);

        font-size: 1.2em;

        &.board-item-edit {
          -webkit-box-shadow: 0px 0px 6px 0px rgba(21,255,0,1);
          -moz-box-shadow: 0px 0px 6px 0px rgba(21,255,0,1);
          box-shadow: 0px 0px 6px 0px rgba(21,255,0,1);
        }
      }
    }
  }
</style>
<style lang="scss">
.sort-panel-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  align-items: flex-start;

  .sort-panel-header {
    width: 100%;
    padding-left: 20px;
    padding-right: 20px;
    padding-bottom: 10px;

    .el-input-group__append, .el-input-group__prepend {
      padding: 0px 10px !important;
    }
    i, svg {
      font-size: 20px !important;
    }
  }

  .board {
    width: 100%;
    display: flex;
    justify-content: space-around;
    flex-direction: row;
    align-items: flex-start;

    .kanban {
      width: 49%;

      &.todo {
        .board-column-header {
          background: #f9944a;
        }

        .sort-add-item-icon {
          float: right;
          font-size: 20px;
          padding-top: 5px;

          &:hover {
            color: #67c23a;
            font-weight: bold;
          }
        }
      }

      &.working {
        .board-column-header {
          background: #4A9FF9;
        }

        .sort-remove-item-icon {
          float: right;
          font-size: 20px;
          padding-top: 5px;

          &:hover {
            color: red;
            font-weight: bold;
          }
        }
      }

      .board-item[disabled=disabled],
      .sort-remove-item-icon[disabled=disabled],
      .sort-add-item-icon[disabled=disabled] {
        cursor: not-allowed;
      }
    }
  }
  .board-mobile {
    width: 100%;
    display: block;
    justify-content: space-around;
    flex-direction: row;
    align-items: flex-start;
    height: 95% !important;
    text-align: -webkit-center;

    .kanban {
      width: 85%;

      &.todo {
        .board-column-header {
          background: #f9944a;
        }

        .sort-add-item-icon {
          float: right;
          font-size: 20px;
          padding-top: 5px;

          &:hover {
            color: #67c23a;
            font-weight: bold;
          }
        }
      }

      &.working {
        .board-column-header {
          background: #4A9FF9;
        }

        .sort-remove-item-icon {
          float: right;
          font-size: 20px;
          padding-top: 5px;

          &:hover {
            color: red;
            font-weight: bold;
          }
        }
      }

      .board-item[disabled=disabled],
      .sort-remove-item-icon[disabled=disabled],
      .sort-add-item-icon[disabled=disabled] {
        cursor: not-allowed;
      }
    }
  }
}
</style>
