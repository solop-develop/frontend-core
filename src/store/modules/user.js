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

import language from '@/lang'

// Constants
import { ORGANIZATION, WAREHOUSE } from '@/utils/ADempiere/constants/systemColumns'

// API Request Methods
import {
  requestLogin,
  requestLogout,
  requestUserInfoFromSession,
  requestSessionInfo,
  setSessionAttribute
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
  removeCurrentOrganization
} from '@/utils/auth'
import {
  requestOrganizationsList,
  requestWarehousesList
} from '@/api/ADempiere/system-core'

// Utils and Helper Methods
import { resetRouter } from '@/router'
import { showMessage } from '@/utils/ADempiere/notification'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

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
  corporateBrandingImage: ''
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
  }
}

const actions = {
  // user login
  login({ commit }, {
    userName,
    password,
    roleUuid,
    organizationUuid,
    token
  }) {
    return new Promise((resolve, reject) => {
      requestLogin({
        userName,
        password,
        roleUuid,
        organizationUuid,
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

  /**
   * Get session info
   */
  getSessionInfo({ commit, dispatch }) {
    return new Promise((resolve, reject) => {
      requestSessionInfo()
        .then(async sessionInfo => {
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
          setCurrentRole(role.uuid)
          const currentOrganizationSession = sessionInfo.defaultContext.find(context => {
            if (context.key === `#${ORGANIZATION}`) {
              return context
            }
          })
          commit('SET_CURRENT_ORGANIZATION_ID', currentOrganizationSession.value)

          // wait to establish the client and organization to generate the menu
          await dispatch('getOrganizationsListFromServer', role.uuid, currentOrganizationSession.value)

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
        //     return itemRole.uuid === getCurrentRole()
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
                return itemRole.uuid === roleSession
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
   * @param {string} roleUuid
   * @returns
   */
  getOrganizationsListFromServer({ commit, dispatch, getters }, roleUuid) {
    if (isEmptyValue(roleUuid)) {
      roleUuid = getCurrentRole()
    }

    return requestOrganizationsList({ roleUuid })
      .then(response => {
        let organization = response.organizationsList.find(a => a.id === getters.getCurrentOrgId)
        if (isEmptyValue(organization)) {
          organization = response.organizationsList.at(0)
        }
        commit('SET_ORGANIZATIONS_LIST', response.organizationsList)
        const { uuid, id } = organization
        setCurrentOrganization(uuid)
        commit('SET_ORGANIZATION', organization)
        commit('SET_CURRENT_ORGANIZATION_ID', id)
        // commit('setPreferenceContext', {
        //   columnName: `#${ORGANIZATION}`,
        //   value: organization.id
        // }, {
        //   root: true
        // })

        dispatch('getWarehousesList', organization.uuid)
      })
      .catch(error => {
        console.warn(`Error ${error.code} getting Organizations list: ${error.message}.`)
      })
  },

  changeOrganization({ commit, dispatch, getters }, {
    organizationUuid,
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
      roleUuid: getCurrentRole(),
      organizationUuid
    })
      .then(tokenSession => {
        commit('SET_TOKEN', tokenSession)
        setToken(tokenSession)

        setCurrentOrganization(organizationUuid)
        const organization = getters.getOrganizations.find(org => org.uuid === organizationUuid)
        commit('SET_ORGANIZATION', organization)
        commit('SET_CURRENT_ORGANIZATION_ID', organization.id)
        commit('setPreferenceContext', {
          columnName: `#${ORGANIZATION}`,
          value: organization.id
        }, {
          root: true
        })

        // Update user info and context associated with session
        // dispatch('getSessionInfo', tokenSession)

        // dispatch('getWarehousesList', organizationUuid)

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

  getWarehousesList({ commit }, organizationUuid) {
    if (isEmptyValue(organizationUuid)) {
      organizationUuid = getCurrentOrganization()
    }

    return requestWarehousesList({
      organizationUuid
    })
      .then(response => {
        commit('SET_WAREHOUSES_LIST', response.warehousesList)
        let warehouse = response.warehousesList.find(item => item.uuid === getCurrentWarehouse())
        if (isEmptyValue(warehouse)) {
          warehouse = response.warehousesList[0]
        }
        if (isEmptyValue(warehouse)) {
          removeCurrentWarehouse()
          commit('SET_WAREHOUSE', undefined)
        } else {
          setCurrentWarehouse(warehouse.uuid)
          commit('SET_WAREHOUSE', warehouse)
          commit('setPreferenceContext', {
            columnName: `#${WAREHOUSE}`,
            value: warehouse.id
          }, {
            root: true
          })
        }
      })
      .catch(error => {
        console.warn(`Error ${error.code} getting Warehouses list: ${error.message}.`)
      })
  },

  changeWarehouse({ commit, state, dispatch }, {
    warehouseId,
    warehouseUuid
  }) {
    setCurrentWarehouse(warehouseUuid)

    const currentWarehouse = state.warehousesList.find(warehouse => warehouse.uuid === warehouseUuid)
    commit('SET_WAREHOUSE', currentWarehouse)

    commit('setPreferenceContext', {
      columnName: `#${WAREHOUSE}`,
      value: currentWarehouse.id
    }, {
      root: true
    })
    setSessionAttribute({
      warehouseId: currentWarehouse.id,
      warehouseUuid: currentWarehouse.uuid
    })
      .then(token => {
        setToken(token)
        // location.reload()
      })
  },

  // dynamically modify permissions
  changeRole({ commit, dispatch }, {
    roleUuid,
    organizationUuid,
    warehouseUuid,
    isCloseAllViews = true
  }) {
    dispatch('tagsView/setCustomTagView', {
      isCloseAllViews
    }, {
      root: true
    })

    return requestChangeRole({
      roleUuid,
      organizationUuid,
      warehouseUuid
    })
      .then(tokenSession => {
        commit('SET_TOKEN', tokenSession)
        setToken(tokenSession)

        // commit('SET_ROLE', role)
        setCurrentRole(roleUuid)

        removeCurrentOrganization()
        removeCurrentWarehouse()

        // Update user info and context associated with session
        // dispatch('getSessionInfo', uuid)

        showMessage({
          message: language.t('notifications.successChangeRole'),
          type: 'success',
          showClose: true
        })
        return roleUuid
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
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
