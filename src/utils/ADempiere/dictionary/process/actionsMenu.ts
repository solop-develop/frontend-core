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

import language from '@/lang'
import store from '@/store'

// Utils and Helpers Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'

export const runProcess = {
  name: language.t('actionMenu.runProcess'),
  enabled: ({ containerUuid, uuid, id }) => {
    const fieldsEmpty = store.getters.getProcessParametersEmptyMandatory({
      containerUuid
    })

    return isEmptyValue(fieldsEmpty)
  },
  isSvgIcon: false,
  icon: 'el-icon-setting',
  actionName: 'runProcess',
  uuid: null,
  runProcess: ({ uuid }) => {
    store.dispatch('startProcess', {
      containerUuid: uuid
    })
  }
}

export const clearParameters = {
  name: language.t('process.clearParameters.title'),
  description: language.t('process.clearParameters.description'),
  enabled: ({ containerUuid }) => {
    return true
  },
  isSvgIcon: true,
  icon: 'layers-clear',
  actionName: 'clearParameters',
  uuid: null,
  clearParameters: ({ containerUuid }) => {
    store.dispatch('setProcessDefaultValues', {
      containerUuid
    })
  }
}
