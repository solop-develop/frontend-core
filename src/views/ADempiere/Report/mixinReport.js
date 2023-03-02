/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
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

import lang from '@/lang'
import store from '@/store'

// Constants
import { DEFAULT_REPORT_TYPE } from '@/utils/ADempiere/dictionary/report'

// Utils and Helper Methods
import { containerManager } from '@/utils/ADempiere/dictionary/report'
import { isEmptyValue } from '@/utils/ADempiere'

export default (reportUuid) => {
  const storedReportDefinition = computed(() => {
    return store.getters.getStoredReport(reportUuid)
  })

  const actionsList = computed(() => {
    return store.getters.getStoredActionsMenu({
      containerUuid: reportUuid
    })
  })

  const actionsManager = ref({
    containerUuid: reportUuid,

    defaultActionName() {
      let reportType = DEFAULT_REPORT_TYPE
      const storedReportGenerated = store.getters.getReportGenerated(reportUuid)
      if (!isEmptyValue(storedReportGenerated)) {
        if (!isEmptyValue(storedReportGenerated.reportType)) {
          reportType = storedReportGenerated.reportType
        }
      }

      return lang.t('actionMenu.generateReport') + ' (' + reportType + ')'
    },

    getActionList: () => actionsList.value
  })

  const relationsManager = ref({
    // menuParentUuid: getCurrentInstance().$route.meta.parentUuid
  })

  return {
    containerManager,
    actionsManager,
    relationsManager,
    storedReportDefinition
  }
}
