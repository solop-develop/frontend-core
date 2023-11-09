<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
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
  <div
    v-if="isLoadedMetadata"
    id="browser-loaded"
    key="browser-loaded"
    class="view-base browser-view"
  >
    <el-card class="content-collapse card-browser" style="overflow: auto;position: absolute;height: 100%;padding-bottom: 2%!important">
      <title-and-help
        :name="browserMetadata.name"
        :help="browserMetadata.help"
      />
      <p style="text-align: end;">
        <action-menu
          :container-manager="containerManager"
          :container-uuid="browserId"
          :actions-manager="actionsManager"
        />
      </p>

      <div id="browser-query-criteria">
        <!-- Query Criteria -->
        <collapse-criteria
          :title="$t('views.searchCriteria')"
          :container-uuid="browserId"
          :container-manager="containerManager"
        >
          <panel-definition
            class="browser-query-criteria"
            :container-uuid="browserId"
            :panel-metadata="browserMetadata"
            :container-manager="containerManager"
            :is-tab-panel="true"
          />
        </collapse-criteria>
        <br>
      </div>
      <div id="browser-table">
        <!-- Result of Records in the Table -->
        <default-table
          id="mainBrowser"
          class="browser-table-result"
          :container-uuid="browserId"
          :container-manager="containerManagerTable"
          :panel-metadata="browserMetadata"
          :header="tableHeader"
          :fields-to-hidden="containerManager.getFieldsToHidden"
          :data-table="recordsList"
          :is-show-search="false"
          :is-loading-data-table="!isLoaded"
        />
      </div>
    </el-card>
    <modal-dialog
      v-if="!isEmptyValue(processUuid)"
      :container-manager="containerManagerProcess"
      :parent-uuid="browserId"
      :container-uuid="processUuid"
    />
  </div>

  <loading-view
    v-else
    key="browser-loading"
  />
</template>

<script>
import { computed, defineComponent, ref } from '@vue/composition-api'

import language from '@/lang'
import store from '@/store'

// Componets and Mixins
import ActionMenu from '@/components/ADempiere/ActionMenu/index.vue'
import CollapseCriteria from '@/components/ADempiere/CollapseCriteria/index.vue'
import DefaultTable from '@/components/ADempiere/DataTable/index.vue'
import LoadingView from '@/components/ADempiere/LoadingView/index.vue'
import mixinProcess from '@/views/ADempiere/Process/mixinProcess.js'
import ModalDialog from '@/components/ADempiere/ModalDialog/index.vue'
import PanelDefinition from '@/components/ADempiere/PanelDefinition/index.vue'
import TitleAndHelp from '@/components/ADempiere/TitleAndHelp'

// Utils and Helper Methods
import {
  containerManager,
  isReadOnlyColumn
} from '@/utils/ADempiere/dictionary/browser.js'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'

export default defineComponent({
  name: 'BrowserView',

  components: {
    ActionMenu,
    CollapseCriteria,
    DefaultTable,
    LoadingView,
    ModalDialog,
    PanelDefinition,
    TitleAndHelp
  },

  props: {
    // implement by test view
    uuid: {
      type: String,
      default: ''
    }
  },

  setup(props, { root }) {
    const isLoadedMetadata = ref(false)
    const browserMetadata = ref({})
    const containerManagerProcess = ref({})

    let parentUuid = ''
    if (!isEmptyValue(root.$route.query) && !isEmptyValue(root.$route.query.parentUuid)) {
      parentUuid = root.$route.query.parentUuid
    }

    let browserId = ''
    // set uuid with linked menu
    if (!isEmptyValue(root.$route.meta) && !isEmptyValue(root.$route.meta.uuid)) {
      browserId = root.$route.meta.id.toString()
    }
    // set uuid from associated browser without menu
    if (!isEmptyValue(root.$route.params) && !isEmptyValue(root.$route.params.browserId)) {
      browserId = root.$route.params.browserId.toString()
    }
    // set uuid from test
    if (!isEmptyValue(props.uuid)) {
      browserId = props.uuid
    }

    const storedBrowser = computed(() => {
      return store.getters.getStoredBrowser(browserId)
    })

    const isLoaded = computed(() => {
      const browserData = store.state.browserManager.browserData[browserId]
      if (isEmptyValue(browserData)) {
        return false
      }
      return browserData.isLoaded
    })

    /**
     * Process associated
     */
    const processUuid = computed(() => {
      const browser = storedBrowser.value
      if (isEmptyValue(browser) || isEmptyValue(browser.process)) {
        return undefined
      }
      return browser.process.uuid
    })

    // TODO: Handle per individual smart browser
    // by default enable context menu and title
    store.dispatch('settings/changeSetting', {
      key: 'showContextMenu',
      value: true
    })

    const isShowContextMenu = computed(() => {
      return store.state.settings.showContextMenu
    })

    const isReadyToSearch = computed(() => {
      return isEmptyValue(
        store.getters.getBrowserFieldsEmptyMandatory({
          containerUuid: browserId
        })
      )
    })

    const openedCriteria = computed({
      get() {
        // by default criteria if closed
        const openCriteria = []
        const browser = storedBrowser.value
        if (!isEmptyValue(browser)) {
          if (browser.isShowedCriteria) {
            // open criteria
            openCriteria.push('opened-criteria')
          }
        }
        return openCriteria
      },
      set(value) {
        let showCriteria = false
        if (value.length) {
          showCriteria = true
        }

        store.commit('changeBrowserAttribute', {
          uuid: browserId,
          attributeName: 'isShowedCriteria',
          attributeValue: showCriteria
        })
      }
    })

    const tableHeader = computed(() => {
      const { fieldsList } = storedBrowser.value
      const header = fieldsList.sort((itemA, itemB) => {
        return itemA.sequence - itemB.sequence
      })
      return header
    })

    function generateBrowser(browser) {
      browserMetadata.value = browser
      isLoadedMetadata.value = true

      const { containerManager: containerManagerByProcess } = mixinProcess(processUuid)
      containerManagerProcess.value = containerManagerByProcess

      if (!isEmptyValue(root.$route.params) && !isEmptyValue(root.$route.params.browserId)) {
        // update name in tag view
        store.dispatch('tagsView/updateVisitedView', {
          ...root.$route,
          title: `${language.t('route.smartBrowser')}: ${browser.name}`
        })
      }
    }

    function getBrowserDefinition() {
      const browser = storedBrowser.value
      if (browser) {
        generateBrowser(browser)

        if (!isLoaded.value) {
          defaultSearch()
        }
        return
      }

      store.dispatch('getBrowserDefinitionFromServer', {
        id: browserId,
        parentUuid
      })
        .then(browserResponse => {
          generateBrowser(browserResponse)

          defaultSearch()
        })
    }

    function defaultSearch() {
      // if (isLoadedRecords.value) {
      //   // not research
      //   return
      // }
      if (isReadyToSearch.value) {
        // first search by default
        store.dispatch('getBrowserSearch', {
          containerUuid: browserId
        })

        // hide showed criteria
        store.commit('changeBrowserAttribute', {
          uuid: browserId,
          attributeName: 'isShowedCriteria',
          attributeValue: false
        })
        return
      }

      // set empty values into container data
      store.commit('setBrowserData', {
        containerUuid: browserId
      })
    }

    const containerManagerTable = {
      ...containerManager,

      actionPerformed({ field, value, valueTo, containerUuid }) {
        // TODO: Logic to implement in table
      },

      isReadOnlyColumn({
        field,
        row
      }) {
        // read only with metadata
        return isReadOnlyColumn(field)
      },

      seekRecord: ({
        containerUuid,
        row
      }) => {
        // TODO: Logic to implement in table
        // console.info('%c seekRecord %c method without implementation.', 'color: #fff; background-color: red;', 'color: blue;', row)
      },

      confirmRowChanges: ({
        containerUuid,
        row
      }) => {
        const { isUpdateable, tableName } = store.getters.getStoredBrowser(containerUuid)
        if (!isUpdateable || isEmptyValue(tableName)) {
          return Promise.resolve({})
        }
        return store.dispatch('updateRecordOfBrowser', {
          containerUuid,
          row
        })
      },

      isLoadedRecords: ({ containerUuid }) => {
        return store.getters.getBrowserIsLoadedRecordsList({
          containerUuid
        })
      }
    }

    const processName = computed(() => {
      const browser = storedBrowser.value
      if (!isEmptyValue(browser)) {
        const process = storedBrowser.value.process
        if (!isEmptyValue(process)) {
          return process.name
        }
      }

      return language.t('actionMenu.runProcess')
    })

    const actionsManager = computed(() => {
      return {
        containerUuid: browserId,

        defaultActionName: processName.value,

        getActionList: () => store.getters.getStoredActionsMenu({
          containerUuid: browserId
        })
      }
    })

    // get records list
    const recordsList = computed(() => {
      return store.getters.getBrowserRecordsList({
        containerUuid: browserId
      })
    })

    getBrowserDefinition()

    return {
      isLoadedMetadata,
      browserId,
      browserMetadata,
      containerManager,
      containerManagerProcess,
      containerManagerTable,
      actionsManager,
      // computed
      isLoaded,
      isShowContextMenu,
      openedCriteria,
      processUuid,
      tableHeader,
      recordsList
    }
  }
})
</script>

<style lang="scss">
// Browser View
.browser-view {
  .browser-collapse {
    margin-bottom: 10px;
  }
  .el-card__body {
    height: 100%;
  }

  /* removes the title link effect on collapse */
  .el-collapse-item__header {
    &:hover {
      background-color: #fcfcfc;
      color: #000;
    }
    &.focusing:focus:not(:hover) {
      color: #000;
    }

    /* browser criteria title */
    font-weight: bold;
    font-size: 16px;
  }
}
</style>
<style lang="scss" scoped>
// Browser View
.el-main {
  padding-bottom: 0px;
  padding-top: 0px;
}

.el-header {
  height: 50px !important;
}

.center {
  text-align: center;
}
</style>
