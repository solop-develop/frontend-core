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

import Layout from '@/layout'

// Constants
import staticRoutes from '@/router/modules/ADempiere/staticRoutes.js'

// API Request Methods
// import { requestMenu } from '@/api/ADempiere/dictionary/menu'
import { requestMenu } from '@/api/user'

// Utils and Helper Methods
import { convertAction } from '@/utils/ADempiere/dictionaryUtils.js'
import { getCurrentClient, getCurrentOrganization, getCurrentRole } from '@/utils/ADempiere/auth'

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
  const clientId = getCurrentClient()
  const roleId = getCurrentRole()
  const organizationId = getCurrentOrganization()

  return new Promise(resolve => {
    requestMenu().then(menuResponse => {
      const asyncRoutesMap = []

      menuResponse.menus.forEach(menuElement => {
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
          const childsConverted = getChildFromAction({
            menu: menuElement,
            index: undefined,
            clientId,
            roleId,
            organizationId
          })
          children.push(childsConverted)
        }

        optionMenu.children = children
        optionMenu.meta.childs = children

        asyncRoutesMap.push(optionMenu)
      })

      const permiseStactiRoutes = hidenStactiRoutes({
        staticRoutes,
        permiseRole: role
      })
      const menuRoutes = permiseStactiRoutes
        .concat(asyncRoutesMap)

      resolve(menuRoutes)
    }).catch(error => {
      console.warn(`Error getting menu: ${error.message}. Code: ${error.code}.`)
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
  const { component, icon, name: type } = convertAction(menu.action)
  const routeIdentifier = type + '/' + menu.reference_id
  const isIndex = menu.is_summary
  const option = {
    path: '/' + clientId + '/' + roleId + '/' + organizationId + '/' + menu.id + '/' + routeIdentifier,
    component,
    name: menu.uuid,
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
      parentUuid: menu.parent_uuid,
      noCache: false,
      referenceId: menu.reference_id,
      referenceUuid: menu.reference_uuid,
      tabUuid: '',
      title: menu.name,
      type,
      id: menu.reference_id,
      uuid: menu.reference_uuid,
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
  // use component of convertAction
  const { icon, name: type } = convertAction(menu.action)
  const isIndex = menu.is_summary
  const optionMenu = {
    path: '/' + clientId + '/' + roleId + '/' + organizationId + '/' + menu.id,
    redirect: '/' + menu.id,
    component: Layout,
    name: menu.uuid,
    meta: {
      id: menu.reference_id,
      uuid: menu.reference_uuid,
      description: menu.description,
      icon,
      isIndex,
      isReadOnly: menu.is_read_only,
      isSummary: menu.is_summary,
      isSalesTransaction: menu.is_sales_transaction,
      parentId: menu.parent_id,
      parentUuid: menu.parent_uuid,
      noCache: true,
      referenceId: menu.reference_id,
      referenceUuid: menu.reference_uuid,
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
function hidenStactiRoutes({ staticRoutes, permiseRole }) {
  if (!permiseRole) {
    return staticRoutes
  }

  return staticRoutes.map(route => {
    if (route.validateToEnable) {
      const isShow = route.validateToEnable({
        role: permiseRole
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
