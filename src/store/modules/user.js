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

// Constants
import { ORGANIZATION, WAREHOUSE } from '@/utils/ADempiere/constants/systemColumns'
import { title } from '@/settings'

// API Request Methods
import {
  requestLogin,
  requestLogout,
  requestUserInfoFromSession,
  requestSessionInfo,
  setSessionAttribute,
  requestUserActivity
} from '@/api/user'
import {
  requestRolesList,
  requestChangeRole
} from '@/api/role.js'
import {
  getToken,
  setToken,
  removeToken,
  getCurrentRole,
  setCurrentRole,
  removeCurrentRole,
  getCurrentOrganization,
  setCurrentOrganization,
  getCurrentWarehouse,
  setCurrentWarehouse,
  removeCurrentWarehouse,
  removeCurrentOrganization,
  setCurrentClient
} from '@/utils/auth'
import {
  requestOrganizationsList,
  requestWarehousesList,
  systemInfo
} from '@/api/ADempiere/system-core'
import {
  loginAuthentication
} from '@/api/ADempiere/open-id/services.js'

// Utils and Helper Methods
import { resetRouter } from '@/router'
import { showMessage } from '@/utils/ADempiere/notification'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { camelizeObjectKeys } from '@/utils/ADempiere/transformObject.js'
import { convertObjectToKeyValue } from '@/utils/ADempiere/valueFormat.js'

const state = {
  token: getToken(),
  name: '',
  userUuid: '',
  avatar: '',
  introduction: '',
  role: {}, // info current role
  rolesList: [],
  roles: [],
  userInfo: {},
  organizationsList: [],
  organization: {},
  currentOrganizationId: 0,
  warehousesList: [],
  warehouse: {},
  isSession: false,
  sessionInfo: {},
  corporateBrandingImage: '',
  activityLogs: [],
  systemInfo: {}
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_ROLES_LIST: (state, payload) => {
    state.rolesList = payload
  },
  SET_ORGANIZATIONS_LIST: (state, payload) => {
    state.organizationsList = payload
  },
  SET_CURRENT_ORGANIZATION_ID: (state, organizationId) => {
    state.currentOrganizationId = organizationId
  },
  SET_ORGANIZATION: (state, organization) => {
    state.organization = organization
    if (organization) {
      state.corporateBrandingImage = organization.corporateBrandingImage
    }
  },
  SET_WAREHOUSES_LIST: (state, payload) => {
    state.warehousesList = payload
  },
  SET_WAREHOUSE: (state, warehouse) => {
    state.warehouse = warehouse
  },
  SET_ROLE: (state, role) => {
    state.role = role
  },
  SET_USER: (state, payload) => {
    state.userInfo = payload
  },
  SET_USER_UUID: (state, payload) => {
    state.userUuid = payload
  },
  setIsSession(state, payload) {
    state.isSession = payload
  },
  setSessionInfo(state, payload) {
    state.sessionInfo = payload
  },
  setActivityLogs(state, logs) {
    state.activityLogs = logs
  },
  setSystem(state, info) {
    state.systemInfo = info
  }
}

const actions = {
  // user login
  login({ commit }, {
    userName,
    password,
    roleId,
    organizationId,
    warehouseId,
    token
  }) {
    return new Promise((resolve, reject) => {
      requestLogin({
        userName,
        password,
        roleId,
        organizationId,
        warehouseId,
        token
      })
        .then(token => {
          commit('SET_TOKEN', token)
          setToken(token)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  loginOpenId({ commit }, {
    code,
    state
  }) {
    return new Promise((resolve, reject) => {
      loginAuthentication({
        code,
        state
      })
        .then(token => {
          commit('SET_TOKEN', token)
          setToken(token)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  /**
   * Get session info
   */
  getSessionInfo({ commit, dispatch }) {
    return new Promise((resolve, reject) => {
      requestSessionInfo()
        .then(async sessionInfo => {
          dispatch('system')
          commit('setIsSession', true)
          commit('setSessionInfo', {
            id: sessionInfo.id,
            uuid: sessionInfo.uuid,
            name: sessionInfo.name,
            processed: sessionInfo.processed
          })

          const { userInfo } = sessionInfo
          commit('SET_NAME', sessionInfo.name)
          commit('SET_INTRODUCTION', userInfo.description)
          commit('SET_USER_UUID', userInfo.uuid)
          commit('SET_USER', userInfo)
          const avatar = userInfo.image
          commit('SET_AVATAR', avatar)

          // TODO: Check decimals Number as String '0.123'
          // set multiple context
          dispatch('setMultiplePreference', {
            values: sessionInfo.defaultContext
          }, {
            root: true
          })

          const sessionResponse = {
            name: sessionInfo.name,
            defaultContext: sessionInfo.defaultContext
          }

          const { role } = sessionInfo
          commit('SET_ROLE', role)
          setCurrentRole(role.id)
          setCurrentClient(role.client.id)
          const currentOrganizationSession = sessionInfo.defaultContext.find(context => {
            return context.key === `#${ORGANIZATION}`
          })
          commit('SET_CURRENT_ORGANIZATION_ID', currentOrganizationSession.value)

          // wait to establish the client and organization to generate the menu
          await dispatch('getOrganizationsListFromServer', {
            roleId: role.id,
            organizationId: currentOrganizationSession.value
          })

          resolve(sessionResponse)

          commit('setSystemDefinition', {
            countryId: sessionInfo.countryId,
            costingPrecision: sessionInfo.costingPrecision,
            countryCode: sessionInfo.countryCode,
            countryName: sessionInfo.countryName,
            currencyIsoCode: sessionInfo.currencyIsoCode,
            currencyName: sessionInfo.currencyName,
            currencySymbol: sessionInfo.currencySymbol,
            displaySequence: sessionInfo.displaySequence,
            language: sessionInfo.language,
            standardPrecision: sessionInfo.standardPrecision
          }, {
            root: true
          })

          // get country definition of context session
          dispatch('getCountryDefinition', {
            id: sessionInfo.countryId
          }, {
            root: true
          })

          dispatch('getRolesListFromServer')
        })
        .catch(error => {
          console.warn(`Error ${error.code} getting context session: ${error.message}.`)
          reject(error)
        })
    })
  },

  /**
   * Get user info
   */
  getUserInfoFromSession({ commit, dispatch }) {
    return new Promise((resolve, reject) => {
      requestUserInfoFromSession().then(responseGetInfo => {
        if (isEmptyValue(responseGetInfo)) {
          reject({
            code: 0,
            message: 'Verification failed, please Login again.'
          })
        }
        // if (isEmptyValue(state.role)) {
        //   const role = responseGetInfo.rolesList.find(itemRole => {
        //     return itemRole.id === getCurrentRole()
        //   })
        //   if (!isEmptyValue(role)) {
        //     commit('SET_ROLE', role)
        //   }
        // }

        dispatch('getRolesListFromServer')

        const avatar = responseGetInfo.image
        commit('SET_AVATAR', avatar)

        resolve({
          ...responseGetInfo,
          avatar
        })
      }).catch(error => {
        console.warn(`Error ${error.code} getting user info value: ${error.message}.`)
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, rootState, dispatch }) {
    return new Promise((resolve, reject) => {
      commit('setIsSession', false)
      rootState['pointOfSales/point/index'].showPOSCollection = false
      // reset visited views and cached views
      // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
      dispatch('tagsView/delAllViews', null, { root: true })

      requestLogout().catch(error => {
        console.warn(error)
      }).finally(() => {
        // clear sesion cookies
        removeCurrentRole()
        removeCurrentOrganization()
        removeCurrentWarehouse()
        resetRouter()

        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()

        resolve()
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  getRolesListFromServer({ commit }) {
    return new Promise((resolve, reject) => {
      requestRolesList()
        .then(rolesList => {
          // roles must be a non-empty array
          if (isEmptyValue(rolesList)) {
            reject({
              code: 0,
              message: 'getInfo: roles must be a non-null array!'
            })
          }

          // set current role
          if (isEmptyValue(state.role)) {
            let role
            const roleSession = getCurrentRole()
            if (!isEmptyValue(roleSession)) {
              role = rolesList.find(itemRole => {
                return itemRole.id === roleSession
              })
            }
            if (isEmptyValue(role)) {
              role = rolesList.at(0)
            }

            if (!isEmptyValue(role)) {
              commit('SET_ROLE', role)
            }
          }

          commit('SET_ROLES_LIST', rolesList)

          resolve(rolesList)

          const rolesName = rolesList.map(rolItem => {
            return rolItem.name
          })
          commit('SET_ROLES', rolesName)
        })
    })
  },

  /**
   * Get list of organizations
   * @param {number} roleId
   * @param {number} organizationId
   * @returns
   */
  getOrganizationsListFromServer({ commit, dispatch, getters }, {
    roleId,
    organizationId
  }) {
    if (isEmptyValue(roleId)) {
      roleId = getCurrentRole()
    }
    if (isEmptyValue(organizationId)) {
      organizationId = getters.getCurrentOrgId
    }

    return requestOrganizationsList({ roleId })
      .then(response => {
        let organization = response.organizationsList.find(orgItem => {
          return orgItem.id === organizationId
        })
        if (isEmptyValue(organization)) {
          organization = response.organizationsList.at(0)
        }
        commit('SET_ORGANIZATIONS_LIST', response.organizationsList)
        const { id } = organization
        setCurrentOrganization(id)
        commit('SET_ORGANIZATION', organization)
        commit('SET_CURRENT_ORGANIZATION_ID', id)
        // commit('setPreferenceContext', {
        //   columnName: `#${ORGANIZATION}`,
        //   value: organization.id
        // }, {
        //   root: true
        // })

        dispatch('getWarehousesList', {
          organizationId: organization.id
        })
      })
      .catch(error => {
        console.warn(`Error ${error.code} getting Organizations list: ${error.message}.`)
      })
  },

  changeOrganization({ commit, dispatch, getters }, {
    organizationId,
    isCloseAllViews = true
  }) {
    // TODO: Check if there are no tagViews in the new routes to close them, and
    // if they exist, reload with the new route using name (uuid)
    dispatch('tagsView/setCustomTagView', {
      isCloseAllViews
    }, {
      root: true
    })

    return requestChangeRole({
      roleId: getCurrentRole(),
      organizationId
    })
      .then(tokenSession => {
        commit('SET_TOKEN', tokenSession)
        setToken(tokenSession)
        const organizationsList = getters.getOrganizations
        let organization = organizationsList.find(org => {
          return org.id === organizationId
        })
        if (isEmptyValue(organization) && !isEmptyValue(organizationsList)) {
          organization = organizationsList.at(0)
        }
        const { id } = organization
        setCurrentOrganization(id)

        commit('SET_ORGANIZATION', organization)
        commit('SET_CURRENT_ORGANIZATION_ID', id)
        commit('setPreferenceContext', {
          columnName: `#${ORGANIZATION}`,
          value: id
        }, {
          root: true
        })

        // Update user info and context associated with session
        // dispatch('getSessionInfo', tokenSession)

        // dispatch('getWarehousesList', { organizationId: id })

        showMessage({
          message: language.t('notifications.successChangeRole'),
          type: 'success',
          showClose: true
        })
      })
      .catch(error => {
        showMessage({
          message: error.message,
          type: 'error',
          showClose: true
        })
        console.warn(`Error change role: ${error.message}. Code: ${error.code}.`)
      })
      .finally(() => {
        dispatch('permission/sendRequestMenu', null, {
          root: true
        })
        location.href = '/'
      })
  },

  getWarehousesList({ commit, dispatch }, {
    organizationId
  }) {
    if (isEmptyValue(organizationId)) {
      organizationId = getCurrentOrganization()
    }
    if (isEmptyValue(organizationId)) {
      dispatch('changeWarehouse', {
        warehouseId: -1
      })
      commit('SET_WAREHOUSE', undefined)
      commit('setPreferenceContext', {
        columnName: `#${WAREHOUSE}`,
        value: -1
      }, {
        root: true
      })
      removeCurrentWarehouse()
      return
    }

    return requestWarehousesList({
      organizationId
    })
      .then(response => {
        commit('SET_WAREHOUSES_LIST', response.warehousesList)
        let warehouse = response.warehousesList.find(warehouseItem => {
          return warehouseItem.id === getCurrentWarehouse()
        })
        if (isEmptyValue(warehouse) && !isEmptyValue(response.warehousesList)) {
          warehouse = response.warehousesList.at(0)
        }

        let warehouseId = -1
        if (!isEmptyValue(warehouse)) {
          warehouseId = warehouse.id
        }

        if (isEmptyValue(warehouseId)) {
          removeCurrentWarehouse()
        }
        const currentWarehouseId = getCurrentWarehouse()
        if (warehouseId !== currentWarehouseId) {
          dispatch('changeWarehouse', {
            warehouseId
          })
        }

        setCurrentWarehouse(warehouseId)
        commit('SET_WAREHOUSE', warehouse)
        commit('setPreferenceContext', {
          columnName: `#${WAREHOUSE}`,
          value: warehouseId
        }, {
          root: true
        })
      })
      .catch(error => {
        console.warn(`Error ${error.code} getting Warehouses list: ${error.message}.`)
      })
  },

  changeWarehouse({ commit, state }, {
    warehouseId
  }) {
    setCurrentWarehouse(warehouseId)

    const currentWarehouse = state.warehousesList.find(warehouseItem => {
      return warehouseItem.id === warehouseId
    })
    commit('SET_WAREHOUSE', currentWarehouse)

    commit('setPreferenceContext', {
      columnName: `#${WAREHOUSE}`,
      value: currentWarehouse.id
    }, {
      root: true
    })
    setSessionAttribute({
      warehouseId: currentWarehouse.id
    })
      .then(token => {
        setToken(token)
        // location.reload()
      })
  },

  // dynamically modify permissions
  changeRole({ commit, dispatch }, {
    roleId,
    organizationId,
    warehouseId,
    isCloseAllViews = true
  }) {
    dispatch('tagsView/setCustomTagView', {
      isCloseAllViews
    }, {
      root: true
    })

    return requestChangeRole({
      roleId,
      organizationId,
      warehouseId
    })
      .then(tokenSession => {
        commit('SET_TOKEN', tokenSession)
        setToken(tokenSession)

        // commit('SET_ROLE', role)
        setCurrentRole(roleId)

        removeCurrentOrganization()
        removeCurrentWarehouse()

        // Update user info and context associated with session
        // dispatch('getSessionInfo', uuid)

        showMessage({
          message: language.t('notifications.successChangeRole'),
          type: 'success',
          showClose: true
        })
        return roleId
      })
      .catch(error => {
        showMessage({
          message: error.message,
          type: 'error',
          showClose: true
        })
        console.warn(`Error change role: ${error.message}. Code: ${error.code}.`)
      })
      .finally(() => {
        dispatch('permission/sendRequestMenu', null, {
          root: true
        })
        location.href = '/'
      })
  },

  loadingActivitylogs({ commit }, date) {
    return new Promise(resolve => {
      requestUserActivity({
        date
      })
        .then(response => {
          const { records } = response
          const activitylogs = response.records.map((logs, index) => {
            const userActivityTypeName = logs.user_activity_type_name
            let processLog, entityLog
            switch (userActivityTypeName) {
              case 'ENTITY_LOG':
                entityLog = {
                  ...camelizeObjectKeys(logs.entity_log),
                  changeLogs: logs.entity_log.change_logs
                }
                break
              case 'PROCESS_LOG':
                processLog = {
                  ...camelizeObjectKeys(logs.process_log),
                  parameters: convertObjectToKeyValue(logs.process_log.parameters)
                }
                break
            }
            return {
              ...camelizeObjectKeys(logs),
              entityLog,
              processLog,
              show: true,
              index
            }
          })
          commit('setActivityLogs', activitylogs)
          resolve(records)
        })
        .catch(error => {
          resolve([])
          commit('setActivityLogs', [])
          console.warn(`Error getting List User Activity: ${error.message}. Code: ${error.code}.`)
        })
    })
  },
  system({ commit }) {
    return new Promise(resolve => {
      systemInfo()
        .then(response => {
          if (isEmptyValue(response)) {
            resolve()
            return
          }
          const info = camelizeObjectKeys(response)
          let systemName = title
          if (!isEmptyValue(info.name)) {
            systemName = info.name
          }
          commit('setSystem', {
            ...info,
            name: systemName
          })
          // tab browser title
          window.document.title = response.name

          // tab browser favicon
          if (!isEmptyValue(info.logoUrl)) {
            let link = document.querySelector("link[rel~='icon']")
            if (!link) {
              link = document.createElement('link')
              link.rel = 'icon'
              document.head.appendChild(link)
            }
            link.href = info.logoUrl
          }

          resolve(info)
        })
        .catch(error => {
          commit('setSystem', {})
          console.warn(`Error getting System Info: ${error.message}. Code: ${error.code}.`)
          resolve({})
        })
    })
  }
}

const getters = {
  getIsSession: (state) => {
    return state.isSession
  },
  getOrganizations: (state) => {
    return state.organizationsList
  },
  getOrganization: (state) => {
    return state.organization
  },
  getCurrentOrgId: (state) => {
    return state.currentOrganizationId
  },
  getRoles: (state) => {
    return state.rolesList
  },
  // current role info
  getRole: (state) => {
    return state.role
  },
  getWarehouses: (state) => {
    return state.warehousesList
  },
  // TODO: Manage with vuex module to warehouse
  getWarehouse: (state) => {
    return state.warehouse
  },
  getUserUuid: (state) => {
    return state.userUuid
  },
  userInfo: (state) => {
    return state.userInfo
  },
  // TODO: Manage with vuex module to personal lock
  getIsPersonalLock: (state) => {
    return state.role.isPersonalLock
  },
  getActivityLogs: (state) => {
    return state.activityLogs
  },
  getSystem: (state) => {
    return state.systemInfo
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
