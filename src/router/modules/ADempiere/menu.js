/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 * Contributor(s): Leonel Matos lMatos@eroya.com
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

import store from '@/store'

// Components
import Layout from '@/layout'

// Constants
import staticRoutes from '@/router/modules/ADempiere/staticRoutes.js'

// API Request Methods
import { requestMenu } from '@/api/ADempiere/security/index.ts'

// Utils and Helper Methods
import { convertAction } from '@/utils/ADempiere/dictionary/menu'
import { getCurrentClient, getCurrentOrganization, getCurrentRole } from '@/utils/ADempiere/auth'
import { isEmptyValue } from '@/utils/ADempiere'

/**
 * Get Menu from server
 * @author Elsio Sanchez <elsiosanches@gmail.com>
 * @author Edwin Betancourt <EdwinBetanc0urt@outlook.com>
 * @param {string} roleUuid
 * @param {string} organizationUuid
 */
export function loadMainMenu({
  role
}) {
  const language = store.getters['getCurrentLanguage']
  const clientId = getCurrentClient()
  const roleId = getCurrentRole()
  const userId = store.getters['user/getUserId']
  const organizationId = getCurrentOrganization()

  return new Promise(resolve => {
    requestMenu({
      roleId,
      language,
      clientId,
      userId
    }).then(menuResponse => {
      const { menus } = menuResponse
      const asyncRoutesMap = []
      menus.forEach(menuElement => {
        const optionMenu = getRouteFromMenuItem({
          menu: menuElement,
          clientId,
          roleId,
          organizationId
        })

        const children = []
        if (optionMenu.meta.isSummary) {
          menuElement.children.forEach(menu => {
            const childsSumaryConverted = getChildFromAction({
              menu,
              index: 0,
              clientId,
              roleId,
              organizationId
            })
            children.push(childsSumaryConverted)
          })
        } else {
          const childConverted = getChildFromAction({
            menu: menuElement,
            index: undefined,
            clientId,
            roleId,
            organizationId
          })
          childConverted.hidden = true
          children.push(childConverted)
          // optionMenu.redirect = childConverted.path
          optionMenu.meta.breadcrumb = false
        }

        optionMenu.children = children
        optionMenu.meta.childs = children

        asyncRoutesMap.push(optionMenu)
      })
      const permiseStactiRoutes = hidenStaticRoutes({
        dynamicRoutes: asyncRoutesMap,
        staticRoutes,
        permiseRole: role
      })
      const menuRoutes = permiseStactiRoutes
        .concat(asyncRoutesMap)

      resolve(menuRoutes)
    }).catch(error => {
      console.warn(`Error getting menu: ${error.message}. Code: ${error.code}.`)
      const permiseStactiRoutes = hidenStaticRoutes({
        dynamicRoutes: [],
        staticRoutes,
        permiseRole: role
      })
      const menuRoutes = permiseStactiRoutes
        .concat([])

      resolve(menuRoutes)
    })
  })
}

/**
 * Get Only Child
 * @author Elsio Sanchez <elsiosanches@gmail.com>
 * @author Edwin Betancourt <EdwinBetanc0urt@outlook.com>
 * @param {object} menu
 * @param {number} index
 * @param {number} clientId
 * @param {number} roleId
 * @param {number} organizationId
 */
function getChildFromAction({ menu, index, clientId, roleId, organizationId }) {
  const { action, action_id, action_uuid } = menu
  const { component, icon, name: type } = convertAction(action)

  const routeIdentifier = type + '/' + action_id
  const isIndex = menu.is_summary
  const option = {
    path: '/' + clientId + '/' + roleId + '/' + organizationId + '/' + menu.id + '/' + routeIdentifier,
    component,
    name: menu.id.toString(),
    hidden: index > 0,
    meta: {
      alwaysShow: true,
      description: menu.description,
      icon,
      isIndex,
      isReadOnly: menu.is_read_only,
      isSummary: menu.is_summary,
      isSalesTransaction: menu.is_sales_transaction,
      parentId: menu.parent_id,
      // parentUuid: menu.parent_uuid,
      noCache: false,
      tabUuid: '',
      title: menu.name,
      type,
      id: action_id,
      uuid: action_uuid,
      action_id: action_id,
      action_uuid: action_uuid,
      containerKey: type + '_' + action_id,
      childs: []
    },
    children: []
  }

  if (isIndex) {
    menu.children.forEach(child => {
      const menuConverted = getChildFromAction({
        menu: child,
        index: 1,
        clientId,
        roleId,
        organizationId
      })
      option.children.push(menuConverted)
      option.meta.childs.push(menuConverted)
    })
  }

  return option
}

/**
 * Convert menu item from server to Route
 * @author elsiosanchez <elsiosanches@gmail.com>
 * @author Edwin Betancourt <EdwinBetanc0urt@outlook.com>
 * @param {object} menu
 * @param {number} clientId
 * @param {number} roleId
 * @param {number} organizationId
 */
function getRouteFromMenuItem({ menu, clientId, roleId, organizationId }) {
  const { action, action_id, action_uuid } = menu
  // use component of convertAction
  const { icon, name: type } = convertAction(action)

  const isIndex = menu.is_summary
  const optionMenu = {
    path: '/' + clientId + '/' + roleId + '/' + organizationId + '/' + menu.id,
    redirect: '/' + menu.id,
    component: Layout,
    name: menu.id.toString(),
    meta: {
      description: menu.description,
      icon,
      isIndex,
      isReadOnly: menu.is_read_only,
      isSummary: menu.is_summary,
      isSalesTransaction: menu.is_sales_transaction,
      parentId: menu.parent_id,
      // parentUuid: menu.parent_uuid,
      noCache: true,
      id: action_id,
      uuid: action_uuid,
      action_id: action_id,
      action_uuid: action_uuid,
      containerKey: type + '_' + action_uuid,
      title: menu.name,
      type,
      childs: []
    },
    children: []
  }
  return optionMenu
}

/**
 * Grant visibility to static routes based on current role permissions
 * @author elsiosanchez <elsiosanches@gmail.com>
 * @param {object} staticRoutes static routes
 * @param {object} permiseRole role permissions
 * @returns {object} routes with hidden/show
 */
function hidenStaticRoutes({ dynamicRoutes, staticRoutes, permiseRole }) {
  if (!permiseRole) {
    return staticRoutes
  }
  return staticRoutes.map(route => {
    if (!isEmptyValue(route.children)) {
      const hiddenStaticChildren = hidenStaticRoutes({
        permiseRole,
        dynamicRoutes,
        staticRoutes: route.children
      })
      route.children = hiddenStaticChildren
    }
    if (route.validateToEnable) {
      const isShow = route.validateToEnable({
        role: permiseRole,
        dynamicRoutes
      })
      return {
        ...route,
        // is hidden by default, change to be visible
        hidden: !isShow
      }
    }
    return {
      ...route
    }
  })
}
