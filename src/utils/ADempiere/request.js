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

// Constants
import { BEARER_TYPE } from '@/utils/auth'

// Utils and Helper Methods
import requestAPI from '@/utils/request'
import { config } from '@/utils/ADempiere/config'
import { getToken } from '@/utils/auth'
// import { getLanguage } from '@/lang/index'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

// Default request connection for ADempiere with default url
// Request with default parameters
export function request(requestValues) {
  if (!requestValues) {
    requestValues = {}
  }
  if (!requestValues.params) {
    requestValues.params = {}
  }
  if (!requestValues.baseURL) {
    requestValues.baseURL = config.adempiere.api.url
  }
  // Timeout
  if (!isEmptyValue(config.adempiere.api.timeout) && config.adempiere.api.timeout > 0) {
    requestValues.timeout = config.adempiere.api.timeout
  }

  const token = getToken()
  let bearerToken = token
  // Json Web Token
  if (!isEmptyValue(bearerToken) && !bearerToken.startsWith(BEARER_TYPE)) {
    bearerToken = `${BEARER_TYPE} ${token}`
  }
  Object.assign(requestValues, {
    headers: {
      Authorization: bearerToken
    }
  })

  // requestValues.params.language = getLanguage() || 'en_US'

  // TODO: Add expires data on headers request
  requestValues.params.ts = (new Date()).getTime()

  return new Promise((resolve, reject) => {
    requestAPI(requestValues)
      .then(response => {
        resolve(response.result)
      })
      .catch(error => {
        reject(error)
      })
  })
}
