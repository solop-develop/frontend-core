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

/* Layout  */
import Layout from '@/layout'

import language from '@/lang'

// Constants
import { REPORT_VIEWER_NAME } from '@/utils/ADempiere/constants/report'
import { REQUEST_ALL_WINDOW_ID } from '@/utils/ADempiere/dictionary/form/Issues'

// Utils and Helper Methods
import { isEmptyValue, recursiveTreeSearch } from '@/utils/ADempiere/valueUtils.js'

const staticRoutes = [
  {
    path: '*',
    redirect: '/404',
    hidden: true
  },

  {
    path: '/calendar',
    component: Layout,
    hidden: false,
    children: [
      {
        path: '/calendar',
        component: () => import('@/views/ADempiere/CalendarView'),
        name: 'calendar',
        meta: {
          title: language.t('component.calendar.calendar'),
          fileName: 'AcctViewer',
          icon: 'el-icon-date',
          noCache: true,
          isIndex: true
        }
      }
    ]
  },

  {
    path: '/Views',
    component: Layout,
    redirect: 'noRedirect',
    title: language.t('route.views'),
    meta: {
      title: language.t('route.views'),
      icon: 'nested'
    },
    children: [
      {
        path: '/Issues/All',
        component: () => import('@/views/ADempiere/Form'),
        name: 'Issues All',
        hidden: false,
        validateToEnable: ({ role, dynamicRoutes }) => {
          const menuTree = dynamicRoutes
          const viewSearch = recursiveTreeSearch({
            treeData: menuTree,
            attributeValue: 'window_' + REQUEST_ALL_WINDOW_ID,
            attributeName: 'meta',
            secondAttribute: 'containerKey',
            attributeChilds: 'children'
          })
          if (isEmptyValue(viewSearch)) {
            return false
          }
          return true
        },
        meta: {
          title: language.t('form.issues.issuesAll'),
          icon: 'el-icon-s-promotion',
          fileName: 'issuesAll',
          isIndex: true,
          isAll: true,
          type: 'from'
        }
      },
      {
        path: '/documentation',
        component: () => import('@/views/documentation/index'),
        hidden: false,
        children: [
          {
            path: 'index',
            component: () => import('@/views/documentation/index'),
            name: 'Documentation',
            meta: {
              title: language.t('documentation.releaseNotes'),
              icon: 'documentation',
              isIndex: true
            }
          }
        ]
      },
      {
        path: '/guide',
        component: () => import('@/views/guide/index'),
        hidden: false,
        children: [
          {
            path: 'index',
            component: () => import('@/views/guide/index'),
            name: 'Guide',
            meta: { title: 'guide', icon: 'guide', noCache: true, isIndex: true }
          }
        ]
      },
      {
        path: '/product-info',
        component: () => import('@/views/ADempiere/Form'),
        hidden: false,
        validateToEnable: ({ role }) => {
          if (!role) {
            return false
          }
          return Boolean(role.is_allow_info_product)
        },
        children: [
          {
            path: '/ProductInfo',
            component: () => import('@/views/ADempiere/Form'),
            name: 'ProductInfo',
            meta: {
              fileName: 'ProductInfo',
              icon: 'search',
              isIndex: true,
              title: language.t('route.ProductInfo')
            }
          }
        ]
      },
      {
        path: '/product-search',
        component: () => import('@/views/ADempiere/Form'),
        hidden: false,
        validateToEnable: ({ role }) => {
          if (!role) {
            return false
          }
          return Boolean(role.is_allow_info_product)
        },
        children: [
          {
            path: '/ProductSearch',
            component: () => import('@/views/ADempiere/Form'),
            name: 'ProductSearch',
            meta: {
              fileName: 'ProductSearch',
              icon: 'search',
              isIndex: true,
              title: language.t('route.ProductSearch')
            }
          }
        ]
      },
      {
        path: '/acct-viewer',
        component: () => import('@/views/ADempiere/Form'),
        name: 'acct-viewer',
        validateToEnable: ({ role }) => {
          if (!role) {
            return false
          }
          return Boolean(role.is_allow_info_account)
        },
        meta: {
          title: language.t('route.accountingViewer'),
          fileName: 'AcctViewer',
          icon: 'balance',
          noCache: true,
          isIndex: true
        }
      },
      {
        path: 'ProcessActivity',
        component: () => import('@/views/ADempiere/ProcessActivity'),
        name: 'ProcessActivity',
        meta: {
          title: 'ProcessActivity',
          icon: 'tree-table',
          noCache: true,
          breadcrumb: false
        }
      }
    ]
  },
  {
    path: '/Charts',
    component: Layout,
    meta: {
      title: language.t('route.charts'),
      icon: 'chart',
      noCache: true,
      breadcrumb: false
    },
    redirect: '/Charts/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/ADempiere/Charts'),
        name: 'Charts',
        meta: {
          title: language.t('route.charts'),
          icon: 'chart',
          noCache: true,
          isIndex: true
        }
      }
    ]
  },

  {
    path: '/report-viewer/:reportId/:instanceUuid',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/report-viewer/:reportId/:instanceUuid?',
        component: () => import('@/views/ADempiere/ReportViewer'),
        name: REPORT_VIEWER_NAME,
        meta: {
          title: language.t('route.reportViewer'),
          type: 'report',
          reportType: ''
        }
      }
    ]
  },

  {
    path: '/report-viewer-engine/:reportId/:instance_id',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/report-viewer-engine/:reportId/:instance_id?',
        component: () => import('@/views/ADempiere/ReportViewerEngine'),
        name: 'Report Viewer Engine',
        meta: {
          title: language.t('route.reportViewer'),
          type: 'report',
          reportType: ''
        }
      }
    ]
  },

  {
    path: '/browser',
    component: Layout,
    hidden: true,
    redirect: 'browser/:browserId/:browserUuid?',
    children: [
      {
        path: ':browserId/:browserUuid?',
        component: () => import('@/views/ADempiere/Browser'),
        name: 'Smart Browser',
        meta: {
          icon: 'search',
          title: language.t('route.smartBrowser'),
          type: 'browser'
        }
      }
    ]
  },

  {
    path: '/PriceChecking',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/PriceChecking',
        component: () => import('@/views/ADempiere/Form'),
        name: 'PriceChecking',
        meta: {
          fileName: 'PriceChecking',
          icon: 'shopping',
          isIndex: true,
          title: language.t('route.PriceChecking')
        }
      }
    ]
  },

  {
    path: '/BarcodeReader',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/BarcodeReader',
        component: () => import('@/views/ADempiere/Form'),
        name: 'BarcodeReader',
        meta: {
          icon: 'search',
          title: 'BarcodeReader',
          isIndex: true
        }
      }
    ]
  },

  {
    path: '/TimeControl',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/TimeControl',
        component: () => import('@/views/ADempiere/Form'),
        name: 'TimeControl',
        meta: {
          title: 'TimeControl',
          icon: 'search',
          isIndex: true
        }
      }
    ]
  },

  {
    path: '/time-record',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/time-record',
        component: () => import('@/views/ADempiere/Form'),
        name: 'TimeRecord',
        meta: {
          title: 'TimeRecord',
          icon: 'search',
          isIndex: true
        }
      }
    ]
  },

  {
    path: '/Issues',
    component: Layout,
    hidden: false,
    children: [
      {
        path: '/Issues',
        component: () => import('@/views/ADempiere/Form'),
        name: 'Issues',
        hidden: true,
        meta: {
          title: language.t('form.issues.issues'),
          icon: 'el-icon-s-promotion',
          fileName: 'IssueManagement',
          isIndex: true,
          isAll: false,
          type: 'from'
        }
      }
    ]
  },

  {
    path: '/express-receipt',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/express-receipt',
        component: () => import('@/views/ADempiere/Form'),
        name: 'ExpressReceipt',
        meta: {
          title: language.t('form.expressReceipt.title'),
          fileName: 'ExpressReceipt',
          icon: 'el-icon-receiving',
          isIndex: true,
          type: 'from'
        }
      }
    ]
  },
  {
    path: '/express-shipment',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/express-shipment',
        component: () => import('@/views/ADempiere/Form'),
        name: 'ExpressShipment',
        meta: {
          title: language.t('form.expressShipment.title'),
          fileName: 'ExpressShipment',
          icon: 'shopping',
          isIndex: true,
          type: 'from'
        }
      }
    ]
  },
  {
    path: '/express-movement',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/express-movement',
        component: () => import('@/views/ADempiere/Form'),
        name: 'ExpressMovement',
        meta: {
          title: language.t('form.expressMovement.title'),
          fileName: 'ExpressMovement',
          icon: 'tree-table',
          isIndex: true,
          type: 'from'
        }
      }
    ]
  },

  {
    path: '/VFileImport',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/v-file-import',
        component: () => import('@/views/ADempiere/Form'),
        name: 'VFileImport',
        meta: {
          title: 'VFileImport',
          icon: 'tree-table',
          isIndex: true,
          type: 'from'
        }
      }
    ]
  },
  {
    path: '/tracking',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/tracking',
        component: () => import('@/views/ADempiere/Form'),
        name: 'Tracking',
        meta: {
          title: 'Tracking',
          icon: 'tree-table',
          isIndex: true,
          type: 'from'
        }
      }
    ]
  },
  {
    path: '/export-dictionary',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/export-dictionary',
        component: () => import('@/components/ADempiere/Process/ExportDictionaryDefinition.vue'),
        title: language.t('page.exportDictionaryDefinition.title'),
        meta: {
          icon: 'component',
          title: language.t('page.exportDictionaryDefinition.title'),
          type: 'component'
        }
      }
    ]
  }
]

export default staticRoutes
