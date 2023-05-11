/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 * Contributor(s): Elsio Sanchez elsiosanchez15@outlook.com https://github.com/elsiosanchez
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

import axios from 'axios'

export function listJobs() {
  return axios.get(`http://localhost:8080/v1/jobs`)
    .then(response => {
      const { data } = response
      return data
    })
    .catch(error => {
      return error
    })
}

export function resumen({
  id
}) {
  return axios.get(`http://localhost:8080/v1/jobs/${id}`)
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
  return axios.get(`http://localhost:8080/v1/jobs/${id}/executions`)
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
  return axios.post(`http://localhost:8080/v1/jobs/${id}`)
    .then(response => {
      const { data } = response
      return data
    })
    .catch(error => {
      return error
    })
}

export function restore() {
  return axios.post(`http://localhost:8080/v1/restore`)
    .then(response => {
      const { data } = response
      return data
    })
    .catch(error => {
      return error
    })
}
