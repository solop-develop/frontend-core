/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 * Contributor(s): Edwin Betancourt EdwinBetanc0urt@outlook.com https://github.com/EdwinBetanc0urt
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

import { computed, ref } from '@vue/composition-api'

import store from '@/store'
import lang from '@/lang'

// Constants
import { CONTAINER_PROCESS_PREFIX } from '@/utils/ADempiere/dictionary/process.js'

// Utils and Helper Methods
import { containerManager } from '@/utils/ADempiere/dictionary/process.js'

export default ({ processId, processUuid }) => {
  const containerKey = CONTAINER_PROCESS_PREFIX + processId

  const storedProcessDefinition = computed(() => {
    return store.getters.getStoredProcess(processUuid)
  })

  const actionsList = computed(() => {
    if (!storedProcessDefinition.value) {
      return []
    }
    return store.getters.getStoredActionsMenu({
      containerUuid: processUuid
    })
  })

  const actionsManager = ref({
    containerUuid: processUuid,
    containerId: processId,
    containerKey,

    defaultActionName: lang.t('actionMenu.runProcess'),

    getActionList: () => actionsList.value
  })

  return {
    containerKey,
    containerManager,
    actionsManager,
    storedProcessDefinition
  }
}
