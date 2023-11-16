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
    path: '/acct-viewer',
    component: Layout,
    hidden: false,
    validateToEnable: ({ role }) => {
      if (!role) {
        return false
      }
      return Boolean(role.isAllowInfoAccount)
    },
    children: [
      {
        path: '/acct-viewer',
        component: () => import('@/views/ADempiere/Form'),
        name: 'acct-viewer',
        meta: {
          title: 'Acctouting Viewer',
          fileName: 'AcctViewer',
          icon: 'balance',
          noCache: true,
          isIndex: true
        }
      }
    ]
  },

  {
    path: '/ProcessActivity',
    component: Layout,
    meta: {
      title: 'ProcessActivity',
      icon: 'tree-table',
      noCache: true,
      breadcrumb: false
    },
    redirect: '/ProcessActivity/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/ADempiere/ProcessActivity'),
        name: 'ProcessActivity',
        meta: {
          title: 'ProcessActivity',
          icon: 'tree-table',
          noCache: true,
          isIndex: true
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
    path: '/report-viewer',
    component: Layout,
    hidden: true,
    redirect: 'report-viewer/:reportId/:reportUuid/:instanceUuid/:fileName/:tableName?',
    children: [
      {
        path: ':reportId/:reportUuid/:instanceUuid/:fileName/:tableName?',
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
    path: '/ProductInfo',
    component: Layout,
    hidden: false,
    validateToEnable: ({ role }) => {
      if (!role) {
        return false
      }
      return Boolean(role.isAllowInfoProduct)
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
    hidden: true,
    children: [
      {
        path: '/Issues',
        component: () => import('@/views/ADempiere/Form'),
        name: 'Issues',
        meta: {
          title: 'Issues',
          icon: 'el-icon-s-promotion',
          fileName: 'IssueManagement',
          isIndex: true,
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
    path: '/ExpressShipment',
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
  }
]

export default staticRoutes
