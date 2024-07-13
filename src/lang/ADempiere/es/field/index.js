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

import businessPartner from './businessPartner.ts'
import product from './product.ts'
import productAttribute from './productAttribute'
import warehouseLocator from './warehouseLocator'
import locationsAddress from './locationsAddress'
import payment from './payment.ts'
import invoice from './invoice'
import order from './order.ts'

export default {
  businessPartner,
  field: 'Campo',
  info: 'Información',
  calculator: 'Calculadora',
  preference: 'Preferencia',
  logsField: 'Bitácora de Cambios',
  contextInfo: 'Información del Contexto',
  logsFieldEmpty: 'El campo no tiene cambios aún',
  coordination: 'Coordenadas',
  container: {
    defaultValue: 'Valor Predeterminado',
    help: 'Ayuda',
    description: 'Descripción'
  },
  product,
  productAttribute,
  warehouseLocator,
  locationsAddress,
  invoice,
  payment,
  order,
  to: 'Hasta'
}
