/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 * Contributor(s): Elsio Sanchez elsiosanchez15@outlook.com https://github.com/elsiosanchez
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

import axios from 'axios'

// Constants
import { config } from '@/utils/ADempiere/config'
const BASE_URL = config.taskManager.api.url

export function listJobs() {
  const endPoint = config.taskManager.api.endPoints.jobs
  return axios.get(`${BASE_URL}${endPoint}`)
    .then(response => {
      const { data } = response
      return data
    })
    .catch(error => {
      return error
    })
}

export function summary({
  id
}) {
  const endPoint = config.taskManager.api.endPoints.jobs
  return axios.get(`${BASE_URL}${endPoint}/${id}`)
    .then(response => {
      const { data } = response
      return data
    })
    .catch(error => {
      return error
    })
}

export function executions({
  id
}) {
  const endPoint = config.taskManager.api.endPoints.jobs
  return axios.get(`${BASE_URL}${endPoint}/${id}/executions`)
    .then(response => {
      const { data } = response
      return data
    })
    .catch(error => {
      return error
    })
}

export function run({
  id
}) {
  const endPoint = config.taskManager.api.endPoints.runJob
  return axios.post(`${BASE_URL}${endPoint}/${id}`)
    .then(response => {
      const { data } = response
      return data
    })
    .catch(error => {
      return error
    })
}

export function restore() {
  const endPoint = config.taskManager.api.endPoints.restoreJob
  return axios.post(`${BASE_URL}${endPoint}`)
    .then(response => {
      const { data } = response
      return data
    })
    .catch(error => {
      return error
    })
}
