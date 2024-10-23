/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 * Contributor(s): Elsio Sanchez elsiosanches@gmail.com https://github.com/elsiosanchez
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

// API Request Methods
import {
  requestListIssuesAll,
  requestListIssues,
  requestCreateIssue,
  requestUpdateIssue,
  requestDeleteIssue,
  requestListIssueComments,
  requestCreateIssueComment,
  requestUpdateIssueComment,
  requestDeleteIssueComment
} from '@/api/ADempiere/user-interface/component/issue'

// Const
import { ROWS_OF_RECORDS_BY_PAGE } from '@/utils/ADempiere/tableUtils'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { formatDate } from '@/utils/ADempiere/formatValue/dateFormat'
import { generatePageToken } from '@/utils/ADempiere/dataUtils'

const initStateIssueManagement = {
  listIssues: [],
  listIssuesAll: [],
  isLoaded: false,
  isNewIssues: false,
  currentIssues: {},
  listComments: [],
  recordCount: 0,
  nextPageToken: undefined,
  listKanbanGroup: [],
  data: {
    recordCount: 0,
    pageSize: ROWS_OF_RECORDS_BY_PAGE,
    pageNumber: 1,
    isloading: false,
    nextPageToken: undefined
  }
}

export default {
  state: initStateIssueManagement,
  mutations: {
    // new
    setListIssues(state, payload) {
      state.listIssues = payload
    },
    setListIssuesAll(state, payload) {
      state.listIssuesAll = payload
    },
    setIsLoadListIssues(state, loading) {
      state.isLoaded = loading
    },
    setNewIssues(state, newIssues) {
      state.isNewIssues = newIssues
    },
    setCurrentIssues(state, current) {
      state.currentIssues = current
    },
    setListComments(state, comments) {
      state.listComments = comments
    },
    setListKanbanGroup(state, list) {
      state.listKanbanGroup = list
    },
    setListIssuesData(state, {
      recordCount,
      pageSize,
      pageNumber,
      nextPageToken
    }) {
      state.data = {
        recordCount,
        pageSize,
        pageNumber,
        nextPageToken
      }
    }
    // setListIssuesNextPageToken(state, token) {
    //   state.nextPageToken = token
    // }
  },
  actions: {
    listRequestAll({ commit, getters }, {
      tableName,
      recordId,
      recordUuid,
      businessPartnerId,
      taskStatusValue,
      statusCategory,
      priorityValue,
      categoryId,
      projectId,
      statusId,
      groupId,
      pageSize,
      pageNumber
    }) {
      return new Promise((resolve, reject) => {
        const issuesData = getters.geIssuesData
        if (isEmptyValue(pageNumber) || pageNumber < 1) {
          const {
            pageNumber: storedPageNumber
          } = issuesData
          // refresh with same page
          pageNumber = storedPageNumber
        }
        if (isEmptyValue(pageSize)) pageSize = issuesData.pageSize
        const pageToken = generatePageToken({ pageNumber })
        commit('setIsLoadListIssues', true)
        // commit('setIsLoadListIssuesAll', true)
        return requestListIssuesAll({
          tableName,
          recordId,
          recordUuid,
          categoryId,
          businessPartnerId,
          taskStatusValue,
          statusCategory,
          priorityValue,
          projectId,
          statusId,
          groupId,
          pageSize,
          pageToken
        })
          .then(responseList => {
            const {
              records,
              record_count,
              next_page_token
            } = responseList

            if (isEmptyValue(records)) {
              commit('setListIssuesAll', [])
            }
            const list = records.map(issues => {
              let date = ''
              if (issues.date_next_action !== 0) {
                date = formatDate(
                  {
                    value: issues.date_next_action,
                    isTime: true,
                    format: 'YYYY-MM-DDTHH:MM:SS'
                  }
                )
              }
              return {
                ...issues,
                dateNextAction: date,
                isEdit: false
              }
            })
            commit('setListIssuesAll', list)
            commit('setIsLoadListIssues', false)
            commit('setListIssuesData', {
              nextPageToken: next_page_token,
              recordCount: Number(record_count),
              pageNumber,
              pageSize
            })
            // commit('setListIssuesNextPageToken', next_page_token)
            resolve(list)
          })
          .catch(error => {
            commit('setIsLoadListIssues', false)
            console.warn(`Error getting List Issues: ${error.message}. Code: ${error.code}.`)
            reject(error)
          })
      })
    },
    listRequest({ commit, getters }, {
      tableName,
      recordId,
      recordUuid,
      businessPartnerId,
      taskStatusValue,
      statusCategory,
      priorityValue,
      categoryId,
      projectId,
      statusId,
      groupId,
      pageSize,
      pageNumber
    }) {
      return new Promise((resolve, reject) => {
        const issuesData = getters.geIssuesData
        if (isEmptyValue(pageNumber) || pageNumber < 1) {
          const {
            pageNumber: storedPageNumber
          } = issuesData
          // refresh with same page
          pageNumber = storedPageNumber
        }
        const pageToken = generatePageToken({ pageNumber })
        commit('setIsLoadListIssues', true)
        return requestListIssues({
          tableName,
          recordId,
          recordUuid,
          businessPartnerId,
          taskStatusValue,
          statusCategory,
          priorityValue,
          categoryId,
          projectId,
          statusId,
          groupId,
          pageSize,
          pageToken
        })
          .then(responseList => {
            const {
              records,
              record_count,
              next_page_token
            } = responseList

            if (isEmptyValue(records)) {
              commit('setListIssues', [])
              commit('setListIssuesAll', [])
            }
            const list = records.map(issues => {
              let date = ''
              if (issues.date_next_action !== 0) {
                date = formatDate(
                  {
                    value: issues.date_next_action,
                    isTime: true,
                    format: 'YYYY-MM-DDTHH:MM:SS'
                  }
                )
              }
              return {
                ...issues,
                dateNextAction: date,
                isEdit: false
              }
            })
            commit('setListIssues', list)
            commit('setIsLoadListIssues', false)
            commit('setListIssuesData', {
              nextPageToken: next_page_token,
              recordCount: Number(record_count),
              pageNumber,
              pageSize
            })
            resolve(list)
          })
          .catch(error => {
            commit('setIsLoadListIssues', false)
            console.warn(`Error getting List Issues: ${error.message}. Code: ${error.code}.`)
            reject(error)
          })
      })
    },
    newIssues({ commit, dispatch }, {
      groupId = 0,
      subject,
      summary,
      statusId = 0,
      recordId,
      projectId = 0,
      tableName,
      categoryId = 0,
      statusUuid,
      recordUuid,
      requestTypeId,
      priorityValue,
      dateNextAction,
      requestTypeUuid,
      taskStatusValue,
      businessPartnerId = 0,
      salesRepresentativeId,
      salesRepresentativeUuid
    }) {
      return new Promise((resolve, reject) => {
        return requestCreateIssue({
          groupId,
          subject,
          summary,
          statusId,
          recordId,
          projectId,
          tableName,
          categoryId,
          statusUuid,
          recordUuid,
          requestTypeId,
          priorityValue,
          dateNextAction,
          requestTypeUuid,
          taskStatusValue,
          businessPartnerId,
          salesRepresentativeId,
          salesRepresentativeUuid
        })
          .then(response => {
            let date = ''
            if (response.date_next_action !== 0) {
              date = formatDate(
                {
                  value: response.date_next_action,
                  isTime: true,
                  format: 'YYYY-MM-DDTHH:MM:SS'
                }
              )
            }
            commit('setCurrentIssues', {
              ...response,
              dateNextAction: date,
              date_next_action: date
            })
            dispatch('listComments', response)
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    editIssues({ commit, dispatch }, {
      id,
      uuid,
      subject,
      summary,
      groupId,
      statusId,
      projectId,
      statusUuid,
      categoryId,
      parentIssueId,
      priorityValue,
      requestTypeId,
      dateNextAction,
      requestTypeUuid,
      taskStatusValue,
      businessPartnerId,
      salesRepresentativeId,
      salesRepresentativeUuid
    }) {
      return new Promise((resolve, reject) => {
        return requestUpdateIssue({
          id,
          uuid,
          subject,
          summary,
          groupId,
          statusId,
          projectId,
          statusUuid,
          categoryId,
          parentIssueId,
          priorityValue,
          requestTypeId,
          dateNextAction,
          requestTypeUuid,
          taskStatusValue,
          businessPartnerId,
          salesRepresentativeId,
          salesRepresentativeUuid
        })
          .then(response => {
            let date = ''
            if (response.date_next_action !== 0) {
              date = formatDate(
                {
                  value: response.date_next_action,
                  isTime: true,
                  format: 'YYYY-MM-DDTHH:MM:SS'
                }
              )
            }
            commit('setCurrentIssues', {
              ...response,
              dateNextAction: date
            })
            dispatch('listComments', {
              id,
              uuid
            })
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    deleteIssue({ commit, dispatch }, {
      id,
      uuid,
      recordId,
      tableName,
      recordUuid
    }) {
      return new Promise((resolve, reject) => {
        return requestDeleteIssue({
          id,
          uuid,
          tableName,
          recordId,
          recordUuid
        })
          .then(response => {
            commit('setCurrentIssues', response)
            dispatch('listRequest', {
              tableName,
              recordId,
              recordUuid
            })
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    changeCurrentIssues({ commit, dispatch }, issues) {
      commit('setCurrentIssues', issues)
      if (!isEmptyValue(issues)) {
        dispatch('listComments', issues)
      }
    },
    listComments({ commit }, {
      id,
      uuid
    }) {
      if (isEmptyValue(id)) {
        return
      }
      return new Promise((resolve, reject) => {
        return requestListIssueComments({
          issueId: id,
          issueUuid: uuid
        })
          .then(response => {
            const { records } = response
            if (isEmptyValue(records)) {
              commit('setListComments', [])
            }
            const list = records.map(comment => {
              return {
                ...comment,
                isEdit: false
              }
            })
            commit('setListComments', list)
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    newIssueComment({ dispatch }, {
      id,
      uuid,
      result,
      dateNextAction
    }) {
      return new Promise((resolve, reject) => {
        return requestCreateIssueComment({
          issueId: id,
          issueUuid: uuid,
          result,
          dateNextAction
        })
          .then(response => {
            dispatch('listComments', {
              id,
              uuid
            })
              .then(responselist => {
                resolve(response)
              })
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    updateIssueComment({ dispatch }, {
      id,
      uuid,
      result,
      issuesId,
      issuesUuid,
      dateNextAction
    }) {
      return new Promise((resolve, reject) => {
        return requestUpdateIssueComment({
          issueId: id,
          issueUuid: uuid,
          result,
          dateNextAction
        })
          .then(response => {
            dispatch('listComments', {
              id: issuesId,
              uuid: issuesUuid
            })
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    deleteIssueComment({ dispatch }, {
      id,
      uuid,
      issuesId,
      issuesUuid
    }) {
      return new Promise((resolve, reject) => {
        return requestDeleteIssueComment({
          issueId: id,
          issueUuid: uuid
        })
          .then(response => {
            dispatch('listComments', {
              id: issuesId,
              uuid: issuesUuid
            })
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    }

  },
  getters: {
    getListIssues: (state) => (isAll = false) => {
      if (isAll) {
        return state.listIssuesAll
      }
      return state.listIssues
    },
    getIsLoadListIssues: (state) => {
      return state.isLoaded
    },
    getNewIssues: (state) => {
      return state.isNewIssues
    },
    getCurrentIssues: (state) => {
      return state.currentIssues
    },
    getListComments: (state) => {
      return state.listComments
    },
    getListKanbanGroup: (state) => {
      return state.listKanbanGroup
    },
    geIssuesData: (state) => {
      return state.data
    }
  }
}
