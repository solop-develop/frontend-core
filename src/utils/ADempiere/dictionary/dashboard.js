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

export const UNSUPPORTED_DASHBOARDS = [
  'favourites',
  'performance',
  'views'
]

/**
 * Get Chart Component to rendedr from chart type
 * @see list validation PA_Goal ChartType (id=53315)
 * @param {string} chartType Chart Type
 * @returns {VueComponent} components/ADempiere/Dashboard/charts/
 */
export function getChartComponent(chart) {
  const { chartType } = chart
  let chartComponent
  switch (chartType) {
    // Bar Chart
    case 'BC':
      chartComponent = () => import('@/components/ADempiere/Dashboard/charts/BarChart')
      break
    // Area Chart
    case 'AC':
      chartComponent = () => import('@/components/ADempiere/Dashboard/charts/AreaChart')
      break
    // Line Chart
    case 'LC':
      chartComponent = () => import('@/components/ADempiere/Dashboard/charts/LineChart')
      break
    // Pie Chart
    case 'PC':
      chartComponent = () => import('@/components/ADempiere/Dashboard/charts/PieChart')
      break
    // Ring Chart
    case 'RC':
      chartComponent = () => import('@/components/ADempiere/Dashboard/charts/PieChart')
      break
    // Raddar Chart
    case 'RA':
      chartComponent = () => import('@/components/ADempiere/Dashboard/charts/RaddarChart')
      break
    // Waterfall Chart
    case 'WC':
      chartComponent = () => import('@/components/ADempiere/Dashboard/charts/WaterfallChart')
      break
    // Basic Scatter Chart
    case 'SC':
      chartComponent = () => import('@/components/ADempiere/Dashboard/charts/Scatter')
      break
    // Gauge
    case 'GU':
      chartComponent = () => import('@/components/ADempiere/Dashboard/charts/Gauge')
      break
    default:
      chartComponent = () => import('@/components/ADempiere/Dashboard/charts/LineChart')
      break
  }

  return chartComponent
}
